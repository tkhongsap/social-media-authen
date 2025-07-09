"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, MessageCircle, Settings, Shield } from "lucide-react"
import { UserProfile, OAuthSession } from "@/lib/oauth/types"
import { getProvider } from "@/lib/oauth/providers-client"

interface DashboardProps {
  user: UserProfile
  session: OAuthSession
}

export default function Dashboard({ user, session }: DashboardProps) {
  const provider = getProvider(session.provider)
  const providerColor = provider?.color || '#6366f1'
  
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: providerColor }}>
                <Shield className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Social Auth Demo</h1>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.displayName} />
                <AvatarFallback>{user.displayName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="text-white" style={{ background: `linear-gradient(to right, ${providerColor}, ${providerColor}dd)` }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-white">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.displayName} />
                  <AvatarFallback className="bg-white text-xl font-semibold" style={{ color: providerColor }}>
                    {user.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">Welcome back, {user.displayName}!</h2>
                  <p className="text-white/90">You&apos;re successfully logged in with {provider?.displayName}</p>
                  {user.email && (
                    <p className="text-white/70 text-sm mt-1">{user.email}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                Profile
              </CardTitle>
              <CardDescription>View and manage your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                View Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-500" />
                Messages
              </CardTitle>
              <CardDescription>Connect with friends and family</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                Open Messages
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-500" />
                Settings
              </CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                Open Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* User Info Card */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your {provider?.displayName} account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium text-gray-600">User ID:</span>
                <span className="text-gray-900 font-mono text-sm">{user.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium text-gray-600">Display Name:</span>
                <span className="text-gray-900">{user.displayName}</span>
              </div>
              {user.name && user.name !== user.displayName && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium text-gray-600">Full Name:</span>
                  <span className="text-gray-900">{user.name}</span>
                </div>
              )}
              {user.email && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="text-gray-900">{user.email}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium text-gray-600">Provider:</span>
                <span className="text-gray-900 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: providerColor }}></span>
                  {provider?.displayName}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-600">Login Status:</span>
                <span className="text-green-600 font-medium">✓ Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
