'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function OwnerProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect to appropriate page if not owner
  useEffect(() => {
    if (!loading && user && user.role !== 'owner') {
      router.push('/profile/' + user.role)
    }
  }, [user, loading, router])

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-6">Owner Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Properties</h2>
            <p className="text-gray-600 mb-4">View and manage your property listings.</p>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => router.push('/properties')}
            >
              View Properties
            </button>
          </div>
          
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Return Analysis</h2>
            <p className="text-gray-600 mb-4">Calculate potential returns on your investments.</p>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => router.push('/return-analysis')}
            >
              Analyze Returns
            </button>
          </div>
          
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Tenants</h2>
            <p className="text-gray-600 mb-4">Manage tenant information and lease agreements.</p>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => router.push('/tenants')}
            >
              View Tenants
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Your Account</h2>
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-medium mb-2">Profile Information</h3>
            <p className="mb-2"><span className="font-medium">Name:</span> {user.name}</p>
            <p className="mb-2"><span className="font-medium">Email:</span> {user.email}</p>
            <p className="mb-4"><span className="font-medium">Role:</span> {user.role}</p>
            
            <button 
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              onClick={() => {
                if (confirm('Are you sure you want to log out?')) {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
