"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Trophy, X } from "lucide-react"
import Link from "next/link"

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

export default function CreateTournamentPage() {
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    status: "REGISTRATION",
  })
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeams, setSelectedTeams] = useState<number[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [teamsLoading, setTeamsLoading] = useState(true)
  const router = useRouter()
  
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }
    fetchTeams()
  }, [router])

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
    } finally {
      setTeamsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/auth/login")
        return
      }

      // Создаем турнир с выбранными командами
      const tournamentData = {
        ...formData,
        teams: selectedTeams.map((teamId) => ({ id: teamId })),
      }

      const response = await fetch("http://localhost:8080/api/tournaments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tournamentData),
      })

      if (response.ok) {
        setSuccess("Tournament created successfully!")
        setTimeout(() => {
          router.push("/dashboard/tournaments")
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.message || "Failed to create tournament")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleStatusChange = (value: string) => {
    setFormData({
      ...formData,
      status: value,
    })
  }

  const handleTeamToggle = (teamId: number) => {
    setSelectedTeams((prev) => (prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]))
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

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow">
          <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
            <Link href="/dashboard/tournaments">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Create Tournament</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>New Tournament</CardTitle>
                  <CardDescription>Create a new League of Legends tournament</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert>
                          <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="name">Tournament Name</Label>
                      <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter tournament name"
                          required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                            id="startDate"
                            name="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                            id="endDate"
                            name="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={handleStatusChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tournament status" />
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
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Enter tournament description (optional)"
                          rows={4}
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button type="submit" disabled={loading} className="flex-1">
                        {loading ? "Creating..." : "Create Tournament"}
                      </Button>
                      <Link href="/dashboard/tournaments">
                        <Button type="button" variant="outline">
                          Cancel
                        </Button>
                      </Link>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Add Teams ({selectedTeams.length})
                  </CardTitle>
                  <CardDescription>Select teams to participate in this tournament</CardDescription>
                </CardHeader>
                <CardContent>
                  {teamsLoading ? (
                      <div className="text-center py-4">Loading teams...</div>
                  ) : teams.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">No teams available</div>
                  ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {teams.map((team) => (
                            <div key={team.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                              <Checkbox
                                  id={`team-${team.id}`}
                                  checked={selectedTeams.includes(team.id)}
                                  onCheckedChange={() => handleTeamToggle(team.id)}
                                  className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium">{team.name}</span>
                                  <Badge variant="outline">{team.tag}</Badge>
                                </div>
                                <div className="text-sm text-gray-500 mb-2">{team.players?.length || 0} players</div>
                                {team.players && team.players.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {team.players.slice(0, 5).map((player) => (
                                          <Badge key={player.id} className={getRoleColor(player.role)} variant="secondary">
                                            {player.nickname}
                                          </Badge>
                                      ))}
                                      {team.players.length > 5 && (
                                          <Badge variant="secondary">+{team.players.length - 5} more</Badge>
                                      )}
                                    </div>
                                )}
                              </div>
                            </div>
                        ))}
                      </div>
                  )}

                  {selectedTeams.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-2">Selected Teams:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedTeams.map((teamId) => {
                            const team = teams.find((t) => t.id === teamId)
                            return team ? (
                                <Badge key={teamId} variant="secondary" className="flex items-center gap-1">
                                  {team.tag}
                                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleTeamToggle(teamId)} />
                                </Badge>
                            ) : null
                          })}
                        </div>
                      </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  )
}
