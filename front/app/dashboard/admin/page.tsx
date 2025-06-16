"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Users, Trophy, Calendar, Shield, Trash2, Edit, Eye } from "lucide-react"
import Link from "next/link"

interface User {
    id: number
    username: string
    email: string
    roles: string[]
}

interface Stats {
    totalUsers: number
    totalTournaments: number
    totalTeams: number
    totalPlayers: number
    activeTournaments: number
    completedTournaments: number
}

export default function AdminPanelPage() {
    const [user, setUser] = useState<User | null>(null)
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        const userData = localStorage.getItem("user")

        if (!token || !userData) {
            router.push("/auth/login")
            return
        }

        const parsedUser = JSON.parse(userData)
        if (!parsedUser.roles.includes("ROLE_ADMIN")) {
            router.push("/dashboard")
            return
        }

        setUser(parsedUser)
        fetchStats()
    }, [router])

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token")

            // Fetch statistics from multiple endpoints
            const [tournamentsRes, teamsRes, playersRes] = await Promise.all([
                fetch("http://localhost:8080/api/tournaments", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch("http://localhost:8080/api/teams", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch("http://localhost:8080/api/players", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ])

            if (tournamentsRes.ok && teamsRes.ok && playersRes.ok) {
                const [tournaments, teams, players] = await Promise.all([
                    tournamentsRes.json(),
                    teamsRes.json(),
                    playersRes.json(),
                ])

                const tournamentData = tournaments.content || []
                const activeTournaments = tournamentData.filter(
                    (t: any) => t.status === "ONGOING" || t.status === "REGISTRATION",
                ).length
                const completedTournaments = tournamentData.filter((t: any) => t.status === "COMPLETED").length

                setStats({
                    totalUsers: 0, // We don't have a users endpoint accessible
                    totalTournaments: tournamentData.length,
                    totalTeams: teams.content?.length || 0,
                    totalPlayers: players.content?.length || 0,
                    activeTournaments,
                    completedTournaments,
                })
            }
        } catch (error) {
            console.error("Error fetching stats:", error)
            setError("Failed to load statistics")
        } finally {
            setLoading(false)
        }
    }

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow">
                <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
                    <Link href="/dashboard">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                    <Badge variant="destructive">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin Only
                    </Badge>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Statistics Overview */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tournaments</CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalTournaments || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats?.activeTournaments || 0} active, {stats?.completedTournaments || 0} completed
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalTeams || 0}</div>
                            <p className="text-xs text-muted-foreground">Registered teams</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalPlayers || 0}</div>
                            <p className="text-xs text-muted-foreground">Registered players</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">System Status</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">Online</div>
                            <p className="text-xs text-muted-foreground">All systems operational</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Admin Actions */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Users className="h-5 w-5 mr-2" />
                                User Management
                            </CardTitle>
                            <CardDescription>Manage user accounts and permissions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Link href="/dashboard/admin/users">
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Eye className="h-4 w-4 mr-2" />
                                        View All Users
                                    </Button>
                                </Link>
                                <Link href="/dashboard/admin/roles">
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Manage Roles
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Trophy className="h-5 w-5 mr-2" />
                                Tournament Control
                            </CardTitle>
                            <CardDescription>Advanced tournament management</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Link href="/dashboard/tournaments">
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Eye className="h-4 w-4 mr-2" />
                                        View All Tournaments
                                    </Button>
                                </Link>
                                <Button variant="outline" size="sm" className="w-full" disabled>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Bulk Actions
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Shield className="h-5 w-5 mr-2" />
                                System Settings
                            </CardTitle>
                            <CardDescription>Configure system parameters</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Button variant="outline" size="sm" className="w-full" disabled>
                                    <Edit className="h-4 w-4 mr-2" />
                                    System Config
                                </Button>
                                <Button variant="outline" size="sm" className="w-full" disabled>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Audit Logs
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Feature coming soon</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest system events and changes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">System started successfully</p>
                                    <p className="text-xs text-gray-500">Admin panel initialized</p>
                                </div>
                                <div className="text-xs text-gray-500">Just now</div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Database connection established</p>
                                    <p className="text-xs text-gray-500">All services operational</p>
                                </div>
                                <div className="text-xs text-gray-500">2 minutes ago</div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Admin user logged in</p>
                                    <p className="text-xs text-gray-500">User: {user.username}</p>
                                </div>
                                <div className="text-xs text-gray-500">5 minutes ago</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
