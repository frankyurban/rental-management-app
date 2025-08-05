'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

interface Property {
  id: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  rent: number;
}

interface Tenant {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
}

interface Lease {
  id: number;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  tenantId: number;
  propertyId: number;
}

export default function AdminProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [leases, setLeases] = useState<Lease[]>([])
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalTenants: 0,
    totalLeases: 0,
    monthlyIncome: 0
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user && user.role !== 'admin') {
      router.push(`/profile/${user.role}`)
    } else if (user) {
      fetchData()
    }
  }, [user, loading, router])

  const fetchData = async () => {
    try {
      // Fetch properties
      const propertiesRes = await fetch('/api/properties', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (propertiesRes.ok) {
        const propertiesData: Property[] = await propertiesRes.json()
        setProperties(propertiesData)
        
        // Calculate stats
        const totalProperties = propertiesData.length
        const monthlyIncome = propertiesData.reduce((sum: number, property: Property) => sum + (property.rent || 0), 0)
        
        // Fetch tenants
        const tenantsRes = await fetch('/api/tenants', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        let tenantsData: Tenant[] = []
        if (tenantsRes.ok) {
          tenantsData = await tenantsRes.json()
          setTenants(tenantsData)
        }
        
        // Fetch leases
        const leasesRes = await fetch('/api/leases', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        let leasesData: Lease[] = []
        if (leasesRes.ok) {
          leasesData = await leasesRes.json()
          setLeases(leasesData)
        }
        
        setStats({
          totalProperties,
          totalTenants: tenantsData.length,
          totalLeases: leasesData.length,
          monthlyIncome
        })
      }
    } catch (err) {
      setError('Failed to fetch data')
      console.error(err)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name || user?.email}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Properties</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalProperties}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Total Tenants</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalTenants}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Active Leases</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalLeases}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900">Monthly Income</h3>
            <p className="text-3xl font-bold text-yellow-600">${stats.monthlyIncome.toLocaleString()}</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Properties</h2>
            </div>
            <div className="p-6">
              {properties.slice(0, 5).map((property) => (
                <div key={property.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <h3 className="font-medium text-gray-900">{property.address}</h3>
                    <p className="text-sm text-gray-500">{property.city}, {property.state}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${property.rent?.toLocaleString()}/mo</p>
                  </div>
                </div>
              ))}
              {properties.length === 0 && (
                <p className="text-gray-500 text-center py-4">No properties found</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Tenants</h2>
            </div>
            <div className="p-6">
              {tenants.slice(0, 5).map((tenant) => (
                <div key={tenant.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <h3 className="font-medium text-gray-900">{tenant.name}</h3>
                    <p className="text-sm text-gray-500">{tenant.email || 'No email'}</p>
                  </div>
                </div>
              ))}
              {tenants.length === 0 && (
                <p className="text-gray-500 text-center py-4">No tenants found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
