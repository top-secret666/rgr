"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { ArrowLeft, Shield, Users, Search, Edit } from "lucide-react"
import Link from "next/link"

interface User {
    id: number
    username: string
    email: string
    roles: string[]
}

interface RoleStats {
    role: string
    count: number
    users: User[]
}

export default function RoleManagementPage() {
    const [users, setUsers] = useState<User[]>([])
    const [roleStats, setRoleStats] = useState<RoleStats[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedRole, setSelectedRole] = useState("all")
    const [bulkEditDialogOpen, setBulkEditDialogOpen] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState<number[]>([])
    const [bulkRoleAction, setBulkRoleAction] = useState<"add" | "remove">("add")
    const [bulkRole, setBulkRole] = useState("")
    const [bulkLoading, setBulkLoading] = useState(false)
    const [currentUser, setCurrentUser] = useState<any>(null)

    const router = useRouter()

    const availableRoles = [
        {
            value: "ROLE_USER",
            label: "User",
            color: "bg-gray-100 text-gray-800",
            description: "Basic user access to view tournaments and teams",
        },
        {
            value: "ROLE_MANAGER",
            label: "Manager",
            color: "bg-blue-100 text-blue-800",
            description: "Can create and manage tournaments, teams, and players",
        },
        {
            value: "ROLE_ADMIN",
            label: "Admin",
            color: "bg-red-100 text-red-800",
            description: "Full system access including user management",
        },
    ]

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

        setCurrentUser(parsedUser)
        fetchUsers()
    }, [router])

    useEffect(() => {
        calculateRoleStats()
    }, [users])

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch("http://localhost:8080/api/admin/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                setUsers(data.content || data || [])
            } else if (response.status === 401) {
                router.push("/auth/login")
            } else {
                setError("Failed to load users")
            }
        } catch (error) {
            console.error("Error fetching users:", error)
            setError("Network error occurred")
        } finally {
            setLoading(false)
        }
    }

    const calculateRoleStats = () => {
        const stats: RoleStats[] = availableRoles.map((role) => ({
            role: role.value,
            count: users.filter((user) => user.roles.includes(role.value)).length,
            users: users.filter((user) => user.roles.includes(role.value)),
        }))
        setRoleStats(stats)
    }

    const getFilteredUsers = () => {
        let filtered = users

        if (searchTerm) {
            filtered = filtered.filter(
                (user) =>
                    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }

        if (selectedRole !== "all") {
            filtered = filtered.filter((user) => user.roles.includes(selectedRole))
        }

        return filtered
    }

    const handleBulkRoleUpdate = async () => {
        if (selectedUsers.length === 0 || !bulkRole) return

        setBulkLoading(true)
        try {
            const token = localStorage.getItem("token")
            const response = await fetch("http://localhost:8080/api/admin/users/bulk-role-update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userIds: selectedUsers,
                    role: bulkRole,
                    action: bulkRoleAction,
                }),
            })

            if (response.ok) {
                await fetchUsers()
                setBulkEditDialogOpen(false)
                setSelectedUsers([])
                setError("")
            } else {
                const errorData = await response.json()
                setError(errorData.message || "Failed to update user roles")
            }
        } catch (error) {
            console.error("Error updating roles:", error)
            setError("Network error occurred")
        } finally {
            setBulkLoading(false)
        }
    }

    const toggleUserSelection = (userId: number) => {
        setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
    }

    const getRoleColor = (role: string) => {
        const roleConfig = availableRoles.find((r) => r.value === role)
        return roleConfig?.color || "bg-gray-100 text-gray-800"
    }

    const getRoleLabel = (role: string) => {
        const roleConfig = availableRoles.find((r) => r.value === role)
        return roleConfig?.label || role.replace("ROLE_", "")
    }

    const getRoleDescription = (role: string) => {
        const roleConfig = availableRoles.find((r) => r.value === role)
        return roleConfig?.description || ""
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    const filteredUsers = getFilteredUsers()

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard/admin">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Role Management</h1>
                        <Badge variant="destructive">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin Only
                        </Badge>
                    </div>
                    <Dialog open={bulkEditDialogOpen} onOpenChange={setBulkEditDialogOpen}>
                        <DialogTrigger asChild>
                            <Button disabled={selectedUsers.length === 0}>
                                <Edit className="h-4 w-4 mr-2" />
                                Bulk Edit ({selectedUsers.length})
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Bulk Role Update</DialogTitle>
                                <DialogDescription>Update roles for {selectedUsers.length} selected user(s).</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label>Action</Label>
                                    <Select value={bulkRoleAction} onValueChange={(value: "add" | "remove") => setBulkRoleAction(value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="add">Add Role</SelectItem>
                                            <SelectItem value="remove">Remove Role</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Select value={bulkRole} onValueChange={setBulkRole}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableRoles.map((role) => (
                                                <SelectItem key={role.value} value={role.value}>
                                                    {role.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setBulkEditDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleBulkRoleUpdate} disabled={bulkLoading || !bulkRole}>
                                    {bulkLoading ? "Updating..." : `${bulkRoleAction === "add" ? "Add" : "Remove"} Role`}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
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
                {/* Role Statistics */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {roleStats.map((stat) => (
                        <Card key={stat.role}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                      {getRoleLabel(stat.role)}
                  </span>
                                    <Badge className={getRoleColor(stat.role)} variant="secondary">
                                        {stat.count}
                                    </Badge>
                                </CardTitle>
                                <CardDescription>{getRoleDescription(stat.role)}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="text-2xl font-bold">{stat.count} users</div>
                                    <div className="text-sm text-gray-500">
                                        {((stat.count / users.length) * 100).toFixed(1)}% of all users
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Users className="h-5 w-5 mr-2" />
                            User Role Assignment
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    {availableRoles.map((role) => (
                                        <SelectItem key={role.value} value={role.value}>
                                            {role.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Users List */}
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {filteredUsers.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">No users found</div>
                            ) : (
                                filteredUsers.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => toggleUserSelection(user.id)}
                                                disabled={user.id === currentUser?.id}
                                            />
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-medium">{user.username}</span>
                                                    {user.id === currentUser?.id && (
                                                        <Badge variant="outline" className="text-xs">
                                                            You
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.map((role) => (
                                                    <Badge key={role} className={getRoleColor(role)} variant="secondary">
                                                        {getRoleLabel(role)}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <Link href={`/dashboard/admin/users`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
