"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Team {
    id: number
    name: string
    tag: string
}

export default function CreatePlayerPage() {
    const [formData, setFormData] = useState({
        nickname: "",
        realName: "",
        role: "",
        rank: "",
        teamId: "",
    })
    const [teams, setTeams] = useState<Team[]>([])
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

            const playerData = {
                nickname: formData.nickname,
                realName: formData.realName || null,
                role: formData.role,
                rank: formData.rank || null,
                team: formData.teamId ? { id: Number.parseInt(formData.teamId) } : null,
            }

            const response = await fetch("http://localhost:8080/api/players", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(playerData),
            })

            if (response.ok) {
                setSuccess("Player created successfully!")
                setTimeout(() => {
                    router.push("/dashboard/players")
                }, 2000)
            } else {
                const data = await response.json()
                if (data.errors) {
                    const errorMessages = Object.values(data.errors).join(", ")
                    setError(errorMessages)
                } else {
                    setError(data.error || data.message || "Failed to create player")
                }
            }
        } catch (err) {
            setError("Network error. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow">
                <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
                    <Link href="/dashboard/players">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Create Player</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>New Player</CardTitle>
                        <CardDescription>Add a new League of Legends player</CardDescription>
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
                                <Label htmlFor="nickname">Nickname *</Label>
                                <Input
                                    id="nickname"
                                    name="nickname"
                                    type="text"
                                    value={formData.nickname}
                                    onChange={handleChange}
                                    placeholder="Enter player nickname"
                                    required
                                />
                                <p className="text-sm text-gray-500">In-game name or summoner name</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="realName">Real Name</Label>
                                <Input
                                    id="realName"
                                    name="realName"
                                    type="text"
                                    value={formData.realName}
                                    onChange={handleChange}
                                    placeholder="Enter real name (optional)"
                                />
                                <p className="text-sm text-gray-500">Player's real name (optional)</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Role *</Label>
                                <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select player role" />
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
                                <Select value={formData.rank} onValueChange={(value) => handleSelectChange("rank", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select player rank (optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
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
                                {teamsLoading ? (
                                    <div className="text-sm text-gray-500">Loading teams...</div>
                                ) : (
                                    <Select value={formData.teamId} onValueChange={(value) => handleSelectChange("teamId", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select team (optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">No Team</SelectItem>
                                            {teams.map((team) => (
                                                <SelectItem key={team.id} value={team.id.toString()}>
                                                    {team.name} ({team.tag})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                <p className="text-sm text-gray-500">Assign player to a team (optional)</p>
                            </div>

                            <div className="flex space-x-4">
                                <Button type="submit" disabled={loading} className="flex-1">
                                    {loading ? "Creating..." : "Create Player"}
                                </Button>
                                <Link href="/dashboard/players">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
