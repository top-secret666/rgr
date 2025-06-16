"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Users, Trophy, Edit, Trash2, User } from "lucide-react"
import Link from "next/link"

interface Team {
  id: number
  name: string
  tag: string
  logo: string
  players: Player[]
  tournaments: Tournament[]
  playersCount: number
  tournamentsCount: number
}

interface Player {
  id: number
  nickname: string
  realName: string
  role: string
  rank: string
}

interface Tournament {
  id: number
  name: string
  status: string
  startDate: string
}

export default function TeamDetailsPage() {
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: "",
    tag: "",
    logo: "",
  })
  const router = useRouter()
  const params = useParams()
  const teamId = params.id

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/auth/login")
      return
    }

    setUser(JSON.parse(userData))
    fetchTeam()
  }, [router, teamId])

  const fetchTeam = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/teams/${teamId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTeam(data)
        setEditFormData({
          name: data.name,
          tag: data.tag,
          logo: data.logo || "",
        })
      } else if (response.status === 404) {
        setError("Team not found")
      } else if (response.status === 401) {
        router.push("/auth/login")
      } else {
        setError("Failed to load team details")
      }
    } catch (error) {
      console.error("Error fetching team:", error)
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async () => {
    setEditLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/teams/${teamId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      })

      if (response.ok) {
        const updatedTeam = await response.json()
        setTeam(updatedTeam)
        setEditDialogOpen(false)
        setError("")
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to update team")
      }
    } catch (error) {
      console.error("Error updating team:", error)
      setError("Network error occurred")
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/teams/${teamId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        router.push("/dashboard/teams")
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to delete team")
      }
    } catch (error) {
      console.error("Error deleting team:", error)
      setError("Network error occurred")
    } finally {
      setDeleteLoading(false)
      setDeleteDialogOpen(false)
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

  const canEdit = user && (user.roles?.includes("ROLE_ADMIN") || user.roles?.includes("ROLE_MANAGER"))
  const canDelete = user && (user.roles?.includes("ROLE_ADMIN") || (user.roles?.includes("ROLE_MANAGER")))

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (error && !team) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <Alert variant="destructive" className="max-w-md">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
    )
  }

  if (!team) {
    return <div className="min-h-screen flex items-center justify-center">Team not found</div>
  }

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/teams">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  {team.logo ? (
                      <img
                          src={team.logo || "/placeholder.svg"}
                          alt={team.name}
                          className="w-full h-full object-cover rounded-lg"
                      />
                  ) : (
                      <Users className="h-6 w-6 text-gray-600" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{team.name}</h1>
                  <Badge variant="outline">{team.tag}</Badge>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {canEdit && (
                  <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Team</DialogTitle>
                        <DialogDescription>Make changes to the team details here.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Team Name</Label>
                          <Input
                              id="name"
                              value={editFormData.name}
                              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tag">Team Tag</Label>
                          <Input
                              id="tag"
                              value={editFormData.tag}
                              onChange={(e) => setEditFormData({ ...editFormData, tag: e.target.value })}
                              maxLength={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="logo">Logo URL</Label>
                          <Input
                              id="logo"
                              type="url"
                              value={editFormData.logo}
                              onChange={(e) => setEditFormData({ ...editFormData, logo: e.target.value })}
                              placeholder="https://example.com/logo.png"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleEdit} disabled={editLoading}>
                          {editLoading ? "Saving..." : "Save Changes"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
              )}
              {canDelete && (
                  <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Team</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete "{team.name}"? This action cannot be undone and will remove all
                          associated data.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
                          {deleteLoading ? "Deleting..." : "Delete Team"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
              )}
            </div>
          </div>
        </div>

        {error && (
            <div className="container mx-auto px-4 py-4">
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
        )}

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Team Players */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Team Roster ({team.players?.length || team.playersCount || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!team.players || team.players.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No players in this team yet</p>
                  ) : (
                      <div className="space-y-4">
                        {team.players.map((player) => (
                            <Card key={player.id} className="border-2">
                              <CardContent className="pt-6">
                                <div className="flex items-center space-x-4">
                                  <Avatar className="h-12 w-12">
                                    <AvatarFallback>
                                      <User className="h-6 w-6" />
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <h3 className="text-lg font-semibold">{player.nickname}</h3>
                                      <Badge className={getRoleColor(player.role)}>{player.role}</Badge>
                                    </div>
                                    {player.realName && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{player.realName}</p>
                                    )}
                                    {player.rank && (
                                        <Badge className={getRankColor(player.rank)} variant="outline">
                                          {player.rank}
                                        </Badge>
                                    )}
                                  </div>
                                  <Link href={`/dashboard/players/${player.id}`}>
                                    <Button variant="outline" size="sm">
                                      View Details
                                    </Button>
                                  </Link>
                                </div>
                              </CardContent>
                            </Card>
                        ))}
                      </div>
                  )}
                </CardContent>
              </Card>

            </div>

            {/* Team Statistics */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Players</span>
                    <span className="text-2xl font-bold">{team.players?.length || team.playersCount || 0}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tournaments</span>
                    <span className="text-2xl font-bold">{team.tournaments?.length || team.tournamentsCount || 0}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Active Players</span>
                    <span className="text-lg font-semibold">
                    {team.players?.filter((p) => p.role !== "SUBSTITUTE").length || 0}
                  </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Substitutes</span>
                    <span className="text-lg font-semibold">
                    {team.players?.filter((p) => p.role === "SUBSTITUTE").length || 0}
                  </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Role Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {["TOP", "JUNGLE", "MID", "ADC", "SUPPORT", "SUBSTITUTE"].map((role) => {
                    const count = team.players?.filter((p) => p.role?.toUpperCase() === role).length || 0
                    return (
                        <div key={role} className="flex justify-between items-center">
                          <Badge className={getRoleColor(role)} variant="outline">
                            {role}
                          </Badge>
                          <span className="font-semibold">{count}</span>
                        </div>
                    )
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full" disabled>
                      <User className="h-4 w-4 mr-2" />
                      Add Player
                    </Button>
                  <Button variant="outline" className="w-full" disabled>
                    <Trophy className="h-4 w-4 mr-2" />
                    Register for Tournament
                  </Button>
                  <Button variant="outline" className="w-full" disabled>
                    <Users className="h-4 w-4 mr-2" />
                    Manage Roster
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  )
}
