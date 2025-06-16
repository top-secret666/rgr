"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Users, Calendar, Settings, LogOut } from "lucide-react"
import Link from "next/link"

interface User {
  id: number
  username: string
  email: string
  roles: string[]
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/auth/login")
      return
    }

    setUser(JSON.parse(userData))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const isAdmin = user.roles.includes("ROLE_ADMIN")
  const isManager = user.roles.includes("ROLE_MANAGER")

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Tournament Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">Welcome, {user.username}</span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/dashboard/tournaments">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
                  <CardTitle>Tournaments</CardTitle>
                  <CardDescription>View and manage tournaments</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/dashboard/teams">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <Users className="h-8 w-8 text-blue-500 mb-2" />
                  <CardTitle>Teams</CardTitle>
                  <CardDescription>Manage teams and players</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/dashboard/players">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <Calendar className="h-8 w-8 text-green-500 mb-2" />
                  <CardTitle>Players</CardTitle>
                  <CardDescription>View and manage players</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {(isAdmin || isManager) && (
                <Link href="/dashboard/create-tournament">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <Trophy className="h-8 w-8 text-purple-500 mb-2" />
                      <CardTitle>Create Tournament</CardTitle>
                      <CardDescription>Create a new tournament</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
            )}

            {isAdmin && (
                <Link href="/dashboard/admin">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <Settings className="h-8 w-8 text-red-500 mb-2" />
                      <CardTitle>Admin Panel</CardTitle>
                      <CardDescription>Administrative functions</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
            )}

            {(isAdmin || isManager) && (
                <Link href="/dashboard/create-team">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <Users className="h-8 w-8 text-cyan-500 mb-2" />
                      <CardTitle>Create Team</CardTitle>
                      <CardDescription>Register a new team</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
            )}

            {(isAdmin || isManager) && (
            <Link href="/dashboard/create-player">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <Calendar className="h-8 w-8 text-orange-500 mb-2" />
                  <CardTitle>Create Player</CardTitle>
                  <CardDescription>Add a new player</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            )}
            
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <strong>Username:</strong> {user.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Roles:</strong> {user.roles.join(", ")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}