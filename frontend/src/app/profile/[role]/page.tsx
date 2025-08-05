'use client'

import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function RoleProfilePage({ params }: { params: { role: string } }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user && user.role !== params.role) {
      router.push(`/profile/${user.role}`)
    }
  }, [user, loading, params.role, router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Please log in to view this page.</div>
  }

  // This page acts as a redirector - the actual profile pages are in their respective role folders
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p>If you are not redirected automatically, <a href={`/profile/${params.role}`} className="text-blue-600 hover:underline">click here</a>.</p>
      </div>
    </div>
  )
}
