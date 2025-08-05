'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import PropertyImageFallback from "@/components/PropertyImageFallback"
import { usePropertyStore, Property } from '@/store/propertyStore'
import { useAuth } from '@/context/AuthContext'
import { Tabs } from '@/components/Tabs'
import PropertyReturnAnalysis from '@/components/PropertyReturnAnalysis'

// Currency formatting utility
function formatCurrency(amount: number | string): string {
  if (amount === "" || amount === undefined || amount === null) return ""
  const num = typeof amount === "string" ? Number(amount.toString().replace(/[^0-9.]/g, '')) : amount
  if (isNaN(num)) return ""
  return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function PropertyPage() {
  const { user } = useAuth()
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params.id
  const propertyId = Number(id)
  const { properties, updateProperty, removeProperty } = usePropertyStore()
  const [property, setProperty] = useState<Property | null>(null)
  const [form, setForm] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [rentInput, setRentInput] = useState<string>("")
  const [homeValueInput, setHomeValueInput] = useState<string>("")
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => {
    if (!user) return;
    
    const found = properties.find((p) => p.id === propertyId)
    if (found) {
      setProperty(found)
      setForm(found)
      setRentInput(formatCurrency(found.rent))
    } else {
      const token = localStorage.getItem('token');
      fetch(`/api/properties/${id}`, { 
        cache: "no-store",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setProperty(data)
          setForm(data)
          setRentInput(formatCurrency(data.rent))
          setHomeValueInput(formatCurrency(data.homeValue))
        })
    }
  }, [id, properties, propertyId, user])

  if (!property || !form) return <div className="p-6 max-w-2xl mx-auto">Loading...</div>

  const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${encodeURIComponent(
    `${property.address}, ${property.city}, ${property.state} ${property.zip}`
  )}&key=AIzaSyA3pQr4ZRMYyBSP2YdAbdvQJ9oOwZgoUBY`;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name === "rent") {
      setRentInput(value)
      setForm((prev: any) => ({
        ...prev,
        [name]: value.replace(/[^0-9.]/g, '')
      }))
    } else if (name === "homeValue") {
      setHomeValueInput(value)
      setForm((prev: any) => ({
        ...prev,
        [name]: value.replace(/[^0-9.]/g, '')
      }))
    } else if (name === "useZestimate") {
      setForm((prev: any) => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setForm((prev: any) => ({
        ...prev,
        [name]: value
      }))
    }
  }

  function handleRentBlur() {
    setRentInput(formatCurrency(form.rent))
  }

  function handleHomeValueBlur() {
    setHomeValueInput(formatCurrency(form.homeValue))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    // Convert rent and numbers
    const toSave = {
      ...form,
      rent: Number(form.rent),
      sqft: form.sqft ? Number(form.sqft) : undefined,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
      fullBaths: form.fullBaths ? Number(form.fullBaths) : undefined,
      threeQuarterBaths: form.threeQuarterBaths ? Number(form.threeQuarterBaths) : undefined,
      halfBaths: form.halfBaths ? Number(form.halfBaths) : undefined,
      quarterBaths: form.quarterBaths ? Number(form.quarterBaths) : undefined,
      yearBuilt: form.yearBuilt ? Number(form.yearBuilt) : undefined,
      features: form.features || "",
      homeValue: form.homeValue ? Number(form.homeValue) : undefined,
      useZestimate: form.useZestimate !== undefined ? Boolean(form.useZestimate) : undefined
    }

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/properties/${id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(toSave),
    })
    if (res.ok) {
      setMessage("✅ Changes saved!")
      setEditing(false)
      setProperty(toSave)
      updateProperty(toSave)
      setRentInput(formatCurrency(form.rent))
      setHomeValueInput(formatCurrency(form.homeValue))
    } else {
      setMessage("❌ Error saving changes")
    }
    setSaving(false)
  }

  function handleCancel() {
    setForm(property)
    setEditing(false)
    setMessage("")
    setRentInput(formatCurrency(property?.rent ?? ""))
    setHomeValueInput(formatCurrency(property?.homeValue ?? ""))
  }

  async function handleDelete() {
    setSaving(true)
    setMessage("")
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/properties/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    if (res.ok) {
      removeProperty(propertyId)
      setMessage("✅ Property deleted!")
      setTimeout(() => {
        router.push("/properties")
        // @ts-ignore
        if (router.refresh) router.refresh()
      }, 600)
    } else {
      setMessage("❌ Error deleting property")
    }
    setSaving(false)
    setShowDeleteModal(false)
  }

  // Define tabs
  const tabs = [
    {
      id: 'details',
      label: 'Details',
      content: (
        <form
          onSubmit={handleSave}
          className={`
            space-y-5 bg-white shadow rounded p-4 mt-2
            ${editing ? 'border-2 border-blue-500 shadow-lg ring-2 ring-blue-100' : 'border border-gray-100'}
          `}
        >
          <div className="mb-6">
            <PropertyImageFallback property={property} streetViewUrl={streetViewUrl} />
          </div>
          
          {/* BASIC INFO */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Basic Info</h2>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              name="address"
              className={`input input-bordered w-full ${editing ? "bg-blue-50 border-blue-400" : "bg-gray-50"}`}
              value={form.address || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>

          {/* HOME FACTS SECTION */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Home Facts</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium">Sq Ft</label>
                <input
                  type="number"
                  name="sqft"
                  className="input input-bordered w-full"
                  value={form.sqft || ""}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div>
                <label className="block text-xs font-medium">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  className="input input-bordered w-full"
                  value={form.bedrooms || ""}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div>
                <label className="block text-xs font-medium">Full Baths</label>
                <input
                  type="number"
                  name="fullBaths"
                  className="input input-bordered w-full"
                  value={form.fullBaths || ""}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div>
                <label className="block text-xs font-medium">3/4 Baths</label>
                <input
                  type="number"
                  name="threeQuarterBaths"
                  className="input input-bordered w-full"
                  value={form.threeQuarterBaths || ""}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div>
                <label className="block text-xs font-medium">Half Baths</label>
                <input
                  type="number"
                  name="halfBaths"
                  className="input input-bordered w-full"
                  value={form.halfBaths || ""}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div>
                <label className="block text-xs font-medium">Quarter Baths</label>
                <input
                  type="number"
                  name="quarterBaths"
                  className="input input-bordered w-full"
                  value={form.quarterBaths || ""}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div>
                <label className="block text-xs font-medium">Year Built</label>
                <input
                  type="number"
                  name="yearBuilt"
                  className="input input-bordered w-full"
                  value={form.yearBuilt || ""}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
              <div>
                <label className="block text-xs font-medium">Property Type</label>
                <input
                  type="text"
                  name="propertyType"
                  className="input input-bordered w-full"
                  value={form.propertyType || ""}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>
            </div>
          </div>

          {/* HOME VALUE SECTION */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Home Value</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Home Value</label>
                <input
                  type="text"
                  name="homeValue"
                  className={`input input-bordered w-full ${editing ? "bg-blue-50 border-blue-400" : "bg-gray-50"}`}
                  value={editing ? homeValueInput : formatCurrency(form.homeValue)}
                  onChange={handleChange}
                  onBlur={handleHomeValueBlur}
                  disabled={!editing}
                  inputMode="decimal"
                  autoComplete="off"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="useZestimate"
                    className="checkbox mr-2"
                    checked={form.useZestimate || false}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                  <span className="text-sm">Use Zestimate for home value</span>
                </label>
              </div>
            </div>
          </div>

          {/* RENT FIELD */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Financials</h2>
            <label className="block text-sm font-medium mb-1">Monthly Rent</label>
            <input
              type="text"
              name="rent"
              className={`input input-bordered w-full ${editing ? "bg-blue-50 border-blue-400" : "bg-gray-50"}`}
              value={editing ? rentInput : formatCurrency(form.rent)}
              onChange={handleChange}
              onBlur={handleRentBlur}
              disabled={!editing}
              inputMode="decimal"
              autoComplete="off"
            />
          </div>

          {/* FEATURES */}
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-700">Features</h2>
            <label className="block text-xs font-medium">Features (comma separated)</label>
            <input
              type="text"
              name="features"
              className="input input-bordered w-full"
              value={form.features || ""}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Pool, Garage, Basement"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-4 items-center">
            {!editing && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setEditing(true)}
                disabled={saving}
              >
                Edit
              </button>
            )}
            {editing && (
              <>
                <button type="submit" className="btn btn-success" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={saving}>
                  Cancel
                </button>
              </>
            )}
            {/* Move Delete far right */}
            <div className="flex-1"></div>
            <button
              type="button"
              className="btn btn-error"
              onClick={() => setShowDeleteModal(true)}
              disabled={saving}
            >
              Delete
            </button>
          </div>
          {message && (
            <div className={`mt-3 text-sm font-medium ${message.startsWith("✅") ? "text-green-700" : "text-red-600"}`}>
              {message}
            </div>
          )}
        </form>
      )
    },
    {
      id: 'return-analysis',
      label: 'Return Analysis',
      content: <PropertyReturnAnalysis propertyId={propertyId} />
    }
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Navigation and Actions */}
      <div className="flex items-center justify-between mb-4">
        <Link href="/properties" className="text-blue-600 hover:underline flex items-center gap-2 font-semibold text-base">
          <span aria-hidden>←</span> Back to your properties
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-1">{property.address}</h1>
      <p className="text-gray-600 mb-2">{property.city}, {property.state} {property.zip}</p>

      {/* Tab Navigation */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="mt-4">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>

      {/* Modal for Delete Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg animate-slide-up relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl"
              onClick={() => setShowDeleteModal(false)}
              aria-label="Close"
              disabled={saving}
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-2">Delete Property?</h3>
            <p className="mb-4 text-gray-700">
              Are you sure you want to delete this property? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                className="btn btn-error flex-1"
                onClick={handleDelete}
                disabled={saving}
              >
                {saving ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                className="btn btn-secondary flex-1"
                onClick={() => setShowDeleteModal(false)}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
