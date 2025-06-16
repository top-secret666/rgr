"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Calendar, Users, Trophy, Edit, Trash2 } from "lucide-react"
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
  teams: Team[]
}

interface Team {
  id: number
  name: string
  tag: string
  logo: string
  players: Player[]
}

interface Player {
  id: number
  nickname: string
  role: string
}

export default function TournamentDetailsPage() {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    status: "",
  })
  const router = useRouter()
  const params = useParams()
  const tournamentId = params.id

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/auth/login")
      return
    }

    setUser(JSON.parse(userData))
    fetchTournament()
  }, [router, tournamentId])

  const fetchTournament = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/tournaments/${tournamentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTournament(data)
        setEditFormData({
          name: data.name,
          startDate: data.startDate.split("T")[0],
          endDate: data.endDate.split("T")[0],
          description: data.description || "",
          status: data.status,
        })
      } else if (response.status === 404) {
        setError("Tournament not found")
      } else if (response.status === 401) {
        router.push("/auth/login")
      } else {
        setError("Failed to load tournament details")
      }
    } catch (error) {
      console.error("Error fetching tournament:", error)
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async () => {
    setEditLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/tournaments/${tournamentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      })

      if (response.ok) {
        const updatedTournament = await response.json()
        setTournament(updatedTournament)
        setEditDialogOpen(false)
        setError("")
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to update tournament")
      }
    } catch (error) {
      console.error("Error updating tournament:", error)
      setError("Network error occurred")
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/tournaments/${tournamentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        router.push("/dashboard/tournaments")
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to delete tournament")
      }
    } catch (error) {
      console.error("Error deleting tournament:", error)
      setError("Network error occurred")
    } finally {
      setDeleteLoading(false)
      setDeleteDialogOpen(false)
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

  const canEdit =
      user &&
      (user.roles?.includes("ROLE_ADMIN") || (user.roles?.includes("ROLE_MANAGER")))
  const canDelete = user && (user.roles?.includes("ROLE_ADMIN") || (user.roles?.includes("ROLE_MANAGER")))

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (error && !tournament) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <Alert variant="destructive" className="max-w-md">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
    )
  }

  if (!tournament) {
    return <div className="min-h-screen flex items-center justify-center">Tournament not found</div>
  }

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/tournaments">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">{tournament.name}</h1>
              <Badge className={getStatusColor(tournament.status)}>{tournament.status}</Badge>
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
                        <DialogTitle>Edit Tournament</DialogTitle>
                        <DialogDescription>Make changes to the tournament details here.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Tournament Name</Label>
                          <Input
                              id="name"
                              value={editFormData.name}
                              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={editFormData.startDate}
                                onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={editFormData.endDate}
                                onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select
                              value={editFormData.status}
                              onValueChange={(value) => setEditFormData({ ...editFormData, status: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="REGISTRATION">Registration</SelectItem>
                              <SelectItem value="ONGOING">Ongoing</SelectItem>
                              <SelectItem value="COMPLETED">Completed</SelectItem>
                              <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                              id="description"
                              value={editFormData.description}
                              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                              rows={3}
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
                        <DialogTitle>Delete Tournament</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete "{tournament.name}"? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
                          {deleteLoading ? "Deleting..." : "Delete Tournament"}
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
            {/* Tournament Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Tournament Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</p>
                      <p className="text-lg">{new Date(tournament.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">End Date</p>
                      <p className="text-lg">{new Date(tournament.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Created by</p>
                    <p className="text-lg">{tournament.creator?.username || "Unknown"}</p>
                  </div>

                  {tournament.description && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</p>
                        <p className="text-gray-600 dark:text-gray-400">{tournament.description}</p>
                      </div>
                  )}
                </CardContent>
              </Card>

              {/* Participating Teams */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Participating Teams ({tournament.teams?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!tournament.teams || tournament.teams.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No teams registered yet</p>
                  ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        {tournament.teams.map((team) => (
                            <Card key={team.id} className="border-2">
                              <CardHeader className="pb-3">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                    {team.logo ? (
                                        <img
                                            src={team.logo || "/placeholder.svg"}
                                            alt={team.name}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <Users className="h-5 w-5 text-gray-600" />
                                    )}
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
                                <div className="space-y-2">
                                  <p className="text-sm font-medium">Players ({team.players?.length || 0})</p>
                                  <div className="space-y-1">
                                    {team.players?.slice(0, 5).map((player) => (
                                        <div key={player.id} className="flex justify-between items-center text-sm">
                                          <span>{player.nickname}</span>
                                          <Badge className={getRoleColor(player.role)} variant="secondary">
                                            {player.role}
                                          </Badge>
                                        </div>
                                    ))}
                                    {team.players && team.players.length > 5 && (
                                        <p className="text-xs text-gray-500">+{team.players.length - 5} more players</p>
                                    )}
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <Link href={`/dashboard/teams/${team.id}`}>
                                    <Button variant="outline" size="sm" className="w-full">
                                      View Team Details
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

            {/* Tournament Statistics */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Teams</span>
                    <span className="text-2xl font-bold">{tournament.teams?.length || 0}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Players</span>
                    <span className="text-2xl font-bold">
                    {tournament.teams?.reduce((total, team) => total + (team.players?.length || 0), 0) || 0}
                  </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Duration</span>
                    <span className="text-lg font-semibold">
                    {Math.ceil(
                        (new Date(tournament.endDate).getTime() - new Date(tournament.startDate).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                      days
                  </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full" disabled>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Matches
                  </Button>
                  <Button variant="outline" className="w-full" disabled>
                    <Trophy className="h-4 w-4 mr-2" />
                    Generate Bracket
                  </Button>
                  <Button variant="outline" className="w-full" disabled>
                    <Users className="h-4 w-4 mr-2" />
                    Manage Teams
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  )
}
