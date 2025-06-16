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
import { ArrowLeft, User, Users, Trophy, Edit, Trash2 } from "lucide-react"
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
interface Team {
  id: number
  name: string
  tag: string
}

export default function PlayerDetailsPage() {
  const [player, setPlayer] = useState<Player | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [editFormData, setEditFormData] = useState({
    nickname: "",
    realName: "",
    role: "",
    rank: "",
    teamId: "",
  })
  const router = useRouter()
  const params = useParams()
  const playerId = params.id

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/auth/login")
      return
    }

    setUser(JSON.parse(userData))
    fetchPlayer()
    fetchTeams()
  }, [router, playerId])

  const fetchPlayer = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/players/${playerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPlayer(data)
        setEditFormData({
          nickname: data.nickname,
          realName: data.realName || "",
          role: data.role,
          rank: data.rank || "",
          teamId: data.team?.id?.toString() || "",
        })
      } else if (response.status === 404) {
        setError("Player not found")
      } else if (response.status === 401) {
        router.push("/auth/login")
      } else {
        setError("Failed to load player details")
      }
    } catch (error) {
      console.error("Error fetching player:", error)
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8080/api/teams", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTeams(data.content || [])
      }
    } catch (error) {
      console.error("Error fetching teams:", error)
    }
  }

  const handleEdit = async () => {
    setEditLoading(true)
    try {
      const token = localStorage.getItem("token")

      const playerData = {
        nickname: editFormData.nickname,
        realName: editFormData.realName || null,
        role: editFormData.role,
        rank: editFormData.rank || null,
        team: editFormData.teamId ? { id: Number.parseInt(editFormData.teamId) } : null,
      }

      const response = await fetch(`http://localhost:8080/api/players/${playerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(playerData),
      })

      if (response.ok) {
        const updatedPlayer = await response.json()
        setPlayer(updatedPlayer)
        setEditDialogOpen(false)
        setError("")
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to update player")
      }
    } catch (error) {
      console.error("Error updating player:", error)
      setError("Network error occurred")
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:8080/api/players/${playerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        router.push("/dashboard/players")
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to delete player")
      }
    } catch (error) {
      console.error("Error deleting player:", error)
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
  const canDelete = user && user.roles?.includes("ROLE_ADMIN")

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (error && !player) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <Alert variant="destructive" className="max-w-md">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
    )
  }

  if (!player) {
    return <div className="min-h-screen flex items-center justify-center">Player not found</div>
  }

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/players">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{player.nickname}</h1>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRoleColor(player.role)}>{player.role}</Badge>
                    {player.rank && (
                        <Badge className={getRankColor(player.rank)} variant="outline">
                          {player.rank}
                        </Badge>
                    )}
                  </div>
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
                        <DialogTitle>Edit Player</DialogTitle>
                        <DialogDescription>Make changes to the player details here.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="nickname">Nickname</Label>
                          <Input
                              id="nickname"
                              value={editFormData.nickname}
                              onChange={(e) => setEditFormData({ ...editFormData, nickname: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="realName">Real Name</Label>
                          <Input
                              id="realName"
                              value={editFormData.realName}
                              onChange={(e) => setEditFormData({ ...editFormData, realName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select
                              value={editFormData.role}
                              onValueChange={(value) => setEditFormData({ ...editFormData, role: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Top">Top</SelectItem>
                              <SelectItem value="Jungle">Jungle</SelectItem>
                              <SelectItem value="Mid">Mid</SelectItem>
                              <SelectItem value="Adc">Adc</SelectItem>
                              <SelectItem value="Support">Support</SelectItem>
                              <SelectItem value="Substitute">Substitute</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rank">Rank</Label>
                          <Select
                              value={editFormData.rank}
                              onValueChange={(value) => setEditFormData({ ...editFormData, rank: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select rank" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="No Rank">No Rank</SelectItem>
                              <SelectItem value="Challenger">Challenger</SelectItem>
                              <SelectItem value="Grandmaster">Grandmaster</SelectItem>
                              <SelectItem value="Master">Master</SelectItem>
                              <SelectItem value="Diamond">Diamond</SelectItem>
                              <SelectItem value="Emerald">Emerald</SelectItem>
                              <SelectItem value="Platinum">Platinum</SelectItem>
                              <SelectItem value="Gold">Gold</SelectItem>
                              <SelectItem value="Silver">Silver</SelectItem>
                              <SelectItem value="Bronze">Bronze</SelectItem>
                              <SelectItem value="Iron">Iron</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="team">Team</Label>
                          <Select
                              value={editFormData.teamId}
                              onValueChange={(value) => setEditFormData({ ...editFormData, teamId: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select team" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="No Team">No Team</SelectItem>
                              {teams.map((team) => (
                                  <SelectItem key={team.id} value={team.id.toString()}>
                                    {team.name} ({team.tag})
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                        <DialogTitle>Delete Player</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete "{player.nickname}"? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
                          {deleteLoading ? "Deleting..." : "Delete Player"}
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
            {/* Player Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Player Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Nickname</p>
                      <p className="text-lg font-semibold">{player.nickname}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Real Name</p>
                      <p className="text-lg">{player.realName || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Role</p>
                      <Badge className={getRoleColor(player.role)} variant="secondary">
                        {player.role}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Rank</p>
                      {player.rank ? (
                          <Badge className={getRankColor(player.rank)} variant="outline">
                            {player.rank}
                          </Badge>
                      ) : (
                          <span className="text-gray-500">Not specified</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Team</p>
                    {player.team ? (
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{player.team.tag}</Badge>
                          <span className="text-lg">{player.team.name}</span>
                          <Link href={`/dashboard/teams/${player.team.id}`}>
                            <Button variant="outline" size="sm">
                              View Team
                            </Button>
                          </Link>
                        </div>
                    ) : (
                        <span className="text-gray-500">Free agent</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Player Statistics */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Player Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Current Team</span>
                    <span className="text-lg font-semibold">{player.team ? player.team.tag : "None"}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Position</span>
                    <Badge className={getRoleColor(player.role)} variant="outline">
                      {player.role}
                    </Badge>
                  </div>

                  {player.rank && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Current Rank</span>
                        <Badge className={getRankColor(player.rank)} variant="outline">
                          {player.rank}
                        </Badge>
                      </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Career Summary</CardTitle>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full" disabled>
                    <Users className="h-4 w-4 mr-2" />
                    Transfer to Team
                  </Button>
                  <Button variant="outline" className="w-full" disabled>
                    <Trophy className="h-4 w-4 mr-2" />
                    View Match History
                  </Button>
                  <Button variant="outline" className="w-full" disabled>
                    <User className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  )
}
