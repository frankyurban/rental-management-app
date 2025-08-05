'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import AddPropertyModal from '@/components/AddPropertyModal'
import { usePropertyStore } from '@/store/propertyStore'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function PropertiesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Zustand store
  const properties = usePropertyStore((state) => state.properties)
  const setProperties = usePropertyStore((state) => state.setProperties)

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [view, setView] = useState<'cards' | 'table'>('cards')
  const [sort, setSort] = useState('rent-asc')

  // Refetch logic as a reusable function
  const fetchProperties = async () => {
    if (!user) return;
    
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/properties', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!res.ok) throw new Error('Failed to fetch properties')
      const data = await res.json()
      if (Array.isArray(data)) {
        setProperties(data)
      } else {
        setError('API did not return a property list.')
      }
    } catch {
      setError('Error fetching properties.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && properties.length === 0) {
      fetchProperties()
    } else if (user) {
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [properties.length, setProperties, user])

  // Add property via API, then refetch
  async function handleAddProperty(formData: any) {
    if (!user) return;
    
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add property');
      }
      await fetchProperties()
      setShowModal(false)
    } catch (error: any) {
      setError(`Error adding property: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Sorting logic
  const sortedProperties = useMemo(() => {
    let sorted = [...properties]
    if (sort === 'rent-asc') {
      sorted.sort((a, b) => a.rent - b.rent)
    } else if (sort === 'rent-desc') {
      sorted.sort((a, b) => b.rent - a.rent)
    } else if (sort === 'address-asc') {
      sorted.sort((a, b) => a.address.localeCompare(b.address))
    } else if (sort === 'address-desc') {
      sorted.sort((a, b) => b.address.localeCompare(a.address))
    }
    return sorted
  }, [properties, sort])

  const totalRent = sortedProperties.reduce(
    (sum, p) => sum + (typeof p.rent === "number" ? p.rent : 0),
    0
  )

  if (authLoading || !user) {
    return <div className="p-6">Loading...</div>
  }

  // If user is not an owner, show a message
  if (user && user.role !== 'owner') {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-y-4">
          <Link href="/" className="inline-block mb-4 text-sm text-blue-600 hover:underline">
            ← Back to Homepage
          </Link>
          <h1 className="text-3xl font-bold text-center flex-1">Your Properties</h1>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Access Restricted</h2>
          <p className="text-yellow-700">
            Only property owners can view and manage properties. 
            Your role is <span className="font-medium">{user.role}</span>.
          </p>
        </div>
      </div>
    )
  }

  if (loading) return <div className="p-6">Loading properties...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <AddPropertyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdded={async () => {
          // Refresh properties list after successful addition
          await fetchProperties();
        }}
      />

      <div className="flex justify-between items-center mb-8 flex-wrap gap-y-4">
        <Link href="/" className="inline-block mb-4 text-sm text-blue-600 hover:underline">
          ← Back to Homepage
        </Link>
        <h1 className="text-3xl font-bold text-center flex-1">Your Properties</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          + Add New Property
        </button>
      </div>

      {/* Sorting controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4 gap-4">
        <div className="w-full sm:w-auto text-lg font-semibold text-gray-800 text-left">
          Total Rent Collected:&nbsp;
          <span className="text-blue-700">
            ${totalRent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700" htmlFor="sort-by">
            Sort by:
          </label>
          <select
            id="sort-by"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input input-bordered px-2 py-1 text-sm"
          >
            <option value="rent-asc">Rent (Low to High)</option>
            <option value="rent-desc">Rent (High to Low)</option>
            <option value="address-asc">Address (A-Z)</option>
            <option value="address-desc">Address (Z-A)</option>
          </select>
          <div className="flex items-center gap-0 ml-2">
            <button
              onClick={() => setView('cards')}
              className={`px-3 py-1 rounded-l border border-blue-600 font-medium transition-colors
                ${view === 'cards' ? 'bg-blue-600 text-white' : 'bg-white text-blue-700 hover:bg-blue-50'}
                focus:outline-none`}
              aria-pressed={view === 'cards'}
              style={{ borderRight: 0 }}
            >
              Cards
            </button>
            <button
              onClick={() => setView('table')}
              className={`px-3 py-1 rounded-r border border-blue-600 font-medium transition-colors
                ${view === 'table' ? 'bg-blue-600 text-white' : 'bg-white text-blue-700 hover:bg-blue-50'}
                focus:outline-none`}
              aria-pressed={view === 'table'}
              style={{ borderLeft: 0 }}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {view === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProperties.map((p) => (
            <Link
              key={p.id}
              href={`/properties/${p.id}`}
              className="group bg-white shadow-md rounded-lg overflow-hidden relative cursor-pointer transition transform hover:scale-[1.025] hover:shadow-xl focus:ring-2 focus:ring-blue-400 outline-none"
              tabIndex={0}
            >
              <img
                src={`https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${encodeURIComponent(
                  `${p.address}, ${p.city}, ${p.state} ${p.zip}`
                )}&key=AIzaSyA3pQr4ZRMYyBSP2YdAbdvQJ9oOwZgoUBY`}
                alt={`Street view of ${p.address}`}
                className="w-full h-48 object-cover rounded-t group-hover:opacity-95"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{p.address}</h2>
                <p className="text-sm text-gray-600">
                  {p.city}, {p.state} {p.zip}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  Rent: ${p.rent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700">Address</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700">City</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700">State</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700">ZIP</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700">Rent</th>
              </tr>
            </thead>
            <tbody>
              {sortedProperties.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-blue-50 cursor-pointer transition"
                  onClick={() => window.location.href = `/properties/${p.id}`}
                  tabIndex={0}
                  title="View property details"
                >
                  <td className="py-3 px-4">{p.address}</td>
                  <td className="py-3 px-4">{p.city}</td>
                  <td className="py-3 px-4">{p.state}</td>
                  <td className="py-3 px-4">{p.zip}</td>
                  <td className="py-3 px-4">
                    ${p.rent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
