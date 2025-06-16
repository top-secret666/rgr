"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Search, Plus, User } from "lucide-react"
import Link from "next/link"

interface Player {
  id: number
  nickname: string
  realName: string
  role: string
  rank: string
  team: {
    id: number
    name: string
    tag: string
  } | null
}

interface User {
  id: number
  username: string
  email: string
  roles: string[]
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
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
    fetchPlayers()
  }, [router])

  useEffect(() => {
    fetchPlayers()
  }, [searchTerm, roleFilter])

  const fetchPlayers = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/auth/login")
        return
      }

      let url = "http://localhost:8080/api/players?"
      const params = new URLSearchParams()

      if (searchTerm) params.append("nickname", searchTerm)
      if (roleFilter !== "all") params.append("role", roleFilter)

      url += params.toString()

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPlayers(data.content || [])
      } else if (response.status === 401) {
        router.push("/auth/login")
      }
    } catch (error) {
      console.error("Error fetching players:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
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
      case "SUBSTITUTE":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRankColor = (rank: string) => {
    if (rank?.toLowerCase().includes("challenger")) return "bg-gold-100 text-gold-800"
    if (rank?.toLowerCase().includes("grandmaster")) return "bg-red-100 text-red-800"
    if (rank?.toLowerCase().includes("master")) return "bg-purple-100 text-purple-800"
    if (rank?.toLowerCase().includes("diamond")) return "bg-blue-100 text-blue-800"
    return "bg-gray-100 text-gray-800"
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
              <h1 className="text-2xl font-bold">Players</h1>
            </div>
            {(isAdmin || isManager) && (
                <Link href="/dashboard/create-player">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Player
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
                  placeholder="Search players..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="TOP">Top</SelectItem>
                <SelectItem value="JUNGLE">Jungle</SelectItem>
                <SelectItem value="MID">Mid</SelectItem>
                <SelectItem value="ADC">ADC</SelectItem>
                <SelectItem value="SUPPORT">Support</SelectItem>
                <SelectItem value="SUBSTITUTE">Substitute</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">No players found.</p>
                  </CardContent>
                </Card>
            ) : (
                players.map((player) => (
                    <Card key={player.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{player.nickname}</CardTitle>
                            <CardDescription>{player.realName || "No real name provided"}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Role:</span>
                            <Badge className={getRoleColor(player.role)}>{player.role}</Badge>
                          </div>

                          {player.rank && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Rank:</span>
                                <Badge className={getRankColor(player.rank)} variant="outline">
                                  {player.rank}
                                </Badge>
                              </div>
                          )}

                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Team:</span>
                            {player.team ? (
                                <Badge variant="outline">{player.team.tag}</Badge>
                            ) : (
                                <span className="text-sm text-gray-500">No team</span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4">
                          <Link href={`/dashboard/players/${player.id}`}>
                            <Button variant="outline" size="sm" className="w-full">
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
