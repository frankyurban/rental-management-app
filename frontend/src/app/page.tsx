'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/properties')
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="p-8 max-w-4xl mx-auto">Loading...</div>
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Rental Manager</h1>
        <p className="text-lg text-gray-700 mb-6">
          Track your rental properties, tenants, and leases — all in one place.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/properties"
            className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700"
          >
            View Properties
          </Link>
          <Link
            href="/add-property"
            className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50"
          >
            Add New Property
          </Link>
        </div>
      </section>

      {/* Features Overview */}
      <section className="grid sm:grid-cols-2 gap-6 text-left text-gray-800">
        <div className="p-4 border rounded shadow-sm">
          <h2 className="font-semibold text-xl mb-2">🏠 Property Listings</h2>
          <p>Organize all your units in one easy-to-use dashboard.</p>
        </div>
        <div className="p-4 border rounded shadow-sm">
          <h2 className="font-semibold text-xl mb-2">👨‍💼 Tenant Management</h2>
          <p>Keep track of who lives where and when their leases end.</p>
        </div>
        <div className="p-4 border rounded shadow-sm">
          <h2 className="font-semibold text-xl mb-2">💰 Rent Tracking</h2>
          <p>Log payments and view history at a glance.</p>
        </div>
        <div className="p-4 border rounded shadow-sm">
          <h2 className="font-semibold text-xl mb-2">📅 Lease Reminders</h2>
          <p>Never miss a lease renewal or expiration date.</p>
        </div>
      </section>
    </main>
  )
}
