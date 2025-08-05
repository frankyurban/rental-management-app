// components/NavBar.tsx
'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function NavBar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Filter navigation links based on user role
  const getNavLinks = () => {
    const baseLinks = [
      { href: "/", label: "Home" },
      { href: "/profile", label: "Profile" },
    ]

    // Show different links based on user role
    if (user) {
      if (user.role === 'owner') {
        return [
          ...baseLinks,
          { href: "/properties", label: "Properties" },
          { href: "/return-analysis", label: "Return Analysis" },
        ]
      } else if (user.role === 'admin') {
        return [
          ...baseLinks,
          { href: "/properties", label: "Properties" },
        ]
      } else if (user.role === 'staff') {
        return [
          ...baseLinks,
          { href: "/properties", label: "Properties" },
        ]
      } else if (user.role === 'tenant') {
        return [
          ...baseLinks,
        ]
      }
    }
    
    return baseLinks
  }

  const navLinks = getNavLinks()

  return (
    <nav className="bg-white shadow sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex gap-4 items-center justify-between">
        <div className="flex items-center">
          <span className="font-extrabold text-xl text-blue-700 tracking-tight mr-4">🏡 RentManager</span>
          <div className="flex gap-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium px-3 py-1 rounded transition 
                  ${pathname === link.href 
                    ? 'bg-blue-600 text-white' 
                    : 'text-blue-700 hover:bg-blue-50'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">Hello, {user.name}</span>
              <button
                onClick={logout}
                className="text-sm font-medium text-blue-700 hover:text-blue-900"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="text-sm font-medium text-blue-700 hover:text-blue-900">
                Login
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/register" className="text-sm font-medium text-blue-700 hover:text-blue-900">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
