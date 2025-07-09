"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, MessageCircle, Settings } from "lucide-react"

export default function DemoDashboard() {
  const demoUser = {
    userId: "U1234567890abcdef",
    displayName: "Demo User",
    pictureUrl: "/placeholder.svg?height=64&width=64",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">LINE App</h1>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src={demoUser.pictureUrl || "/placeholder.svg"} alt={demoUser.displayName} />
                <AvatarFallback>{demoUser.displayName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Notice */}
        <div className="mb-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-blue-700 text-sm">
                🎯 <strong>Demo Dashboard</strong> - This shows what you'll see after successful LINE login. Download
                and run locally to test the actual authentication flow.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-white">
                  <AvatarImage src={demoUser.pictureUrl || "/placeholder.svg"} alt={demoUser.displayName} />
                  <AvatarFallback className="bg-white text-green-600 text-xl font-semibold">
                    {demoUser.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">Welcome back, {demoUser.displayName}!</h2>
                  <p className="text-green-100">You're successfully logged in with LINE</p>
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
              <CardDescription>Your LINE account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium text-gray-600">User ID:</span>
                <span className="text-gray-900 font-mono text-sm">{demoUser.userId}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium text-gray-600">Display Name:</span>
                <span className="text-gray-900">{demoUser.displayName}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-600">Login Status:</span>
                <span className="text-green-600 font-medium">✓ Active (Demo)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
