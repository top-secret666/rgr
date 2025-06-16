"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Plus, Users } from "lucide-react"
import Link from "next/link"

interface TeamDTO {
  id: number
  name: string
  tag: string
  logo: string
  players: PlayerDTO[]
  playersCount: number
  tournamentsCount: number
}

interface PlayerDTO {
  id: number
  nickname: string
  role: string
}

interface PageResponse {
  content: TeamDTO[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

interface User {
  id: number
  username: string
  email: string
  roles: string[]
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<TeamDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)
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
    const timeoutId = setTimeout(() => {
      fetchTeams()
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const fetchTeams = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/auth/login")
        return
      }

      let url = "http://localhost:8080/api/teams"
      const params = new URLSearchParams()

      if (searchTerm.trim()) {
        params.append("name", searchTerm.trim())
      }

      if (params.toString()) {
        url += "?" + params.toString()
      }

      console.log("Fetching teams from:", url) // Debug log

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })

      if (response.ok) {
        const data: PageResponse = await response.json()
        console.log("Teams data received:", data) // Debug log
        setTeams(data.content || [])
      } else if (response.status === 401) {
        localStorage.removeItem("token")
        router.push("/auth/login")
      } else {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        setError(`Failed to fetch teams: ${response.status}`)
      }
    } catch (error) {
      console.error("Error fetching teams:", error)
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case "TOP":
        return "bg-red-100 text-red-800"
      case "JUNGLE":
        return "bg-green-100 text-green-800"
      case "MID":
        return "bg-blue-100 text-blue-800"
      case "ADC":
        return "bg-yellow-100 text-yellow-800"
      case "SUPPORT":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatRole = (role: string) => {
    if (!role) return "Unknown"
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
  }

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4">Loading teams...</p>
          </div>
        </div>
    )
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchTeams}>Try Again</Button>
          </div>
        </div>
    )
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
              <h1 className="text-2xl font-bold">Teams</h1>
            </div>
            {(isAdmin || isManager) && (
                <Link href="/dashboard/create-team">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Team
                  </Button>
                </Link>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                  placeholder="Search teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">
                      {searchTerm ? "No teams found matching your search." : "No teams found."}
                    </p>
                  </CardContent>
                </Card>
            ) : (
                teams.map((team) => (
                    <Card key={team.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            {team.logo ? (
                                <img
                                    src={team.logo}
                                    alt={team.name}
                                    className="w-full h-full object-cover rounded-lg"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                    }}
                                />
                            ) : (
                                <Users className="h-6 w-6 text-gray-600" />
                            )}
                            <Users className="h-6 w-6 text-gray-600 hidden" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{team.name}</CardTitle>
                            <CardDescription>
                              <Badge variant="outline">{team.tag}</Badge>
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Players:</span>
                            <span className="font-medium">{team.playersCount || 0}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tournaments:</span>
                            <span className="font-medium">{team.tournamentsCount || 0}</span>
                          </div>

                          {team.players && team.players.length > 0 && (
                              <div>
                                <p className="text-sm text-gray-600 mb-2">Players:</p>
                                <div className="flex flex-wrap gap-1">
                                  {team.players.slice(0, 3).map((player) => (
                                      <Badge
                                          key={player.id}
                                          variant="secondary"
                                          className={`text-xs ${getRoleColor(player.role)}`}
                                      >
                                        {player.nickname} ({formatRole(player.role)})
                                      </Badge>
                                  ))}
                                  {team.players.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{team.players.length - 3} more
                                      </Badge>
                                  )}
                                </div>
                              </div>
                          )}

                          <div className="pt-2">
                            <Link href={`/dashboard/teams/${team.id}`}>
                              <Button variant="outline" size="sm" className="w-full">
                                View Details
                              </Button>
                            </Link>
                          </div>
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
