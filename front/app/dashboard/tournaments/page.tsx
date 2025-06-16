"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Plus } from "lucide-react"
import Link from "next/link"

interface Tournament {
  id: number
  name: string
  startDate: string
  endDate: string
  description: string
  status: string
  creator: {
    id: number
    username: string
  }
  teamsCount: number
}

interface User {
  id: number
  username: string
  email: string
  roles: string[]
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  const isAdmin = user?.roles?.includes("ROLE_ADMIN")
  const isManager = user?.roles?.includes("ROLE_MANAGER")

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/auth/login")
      return
    }

    setUser(JSON.parse(userData))
  }, [router])

  useEffect(() => {
    fetchTournaments()
  }, [searchTerm, statusFilter])

  const fetchTournaments = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/auth/login")
        return
      }

      let url = "http://localhost:8080/api/tournaments?"
      const params = new URLSearchParams()

      if (searchTerm) params.append("name", searchTerm)
      if (statusFilter !== "all") params.append("status", statusFilter)

      url += params.toString()

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Tournament data:", data.content) // Для отладки
        setTournaments(data.content || [])
      } else if (response.status === 401) {
        router.push("/auth/login")
      }
    } catch (error) {
      console.error("Error fetching tournaments:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "REGISTRATION":
        return "bg-blue-100 text-blue-800"
      case "ONGOING":
        return "bg-green-100 text-green-800"
      case "COMPLETED":
        return "bg-gray-100 text-gray-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Tournaments</h1>
            </div>
            {(isAdmin || isManager) && (
                <Link href="/dashboard/create-tournament">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Tournament
                  </Button>
                </Link>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                  placeholder="Search tournaments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="REGISTRATION">Registration</SelectItem>
                <SelectItem value="ONGOING">Ongoing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6">
            {tournaments.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">No tournaments found.</p>
                  </CardContent>
                </Card>
            ) : (
                tournaments.map((tournament) => (
                    <Card key={tournament.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{tournament.name}</CardTitle>
                            <CardDescription>
                              Created by {tournament.creator?.username || "Unknown"}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(tournament.status)}>{tournament.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p>
                            <strong>Start Date:</strong> {new Date(tournament.startDate).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>End Date:</strong> {new Date(tournament.endDate).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Teams:</strong> {tournament.teamsCount || 0}
                          </p>
                          {tournament.description && (
                              <p>
                                <strong>Description:</strong> {tournament.description}
                              </p>
                          )}
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <Link href={`/dashboard/tournaments/${tournament.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                ))
            )}
          </div>
        </div>
      </div>
  )
}
