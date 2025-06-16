"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Users, Search, Edit, Trash2, Shield, UserPlus } from "lucide-react"
import Link from "next/link"

interface User {
    id: number
    username: string
    email: string
    roles: string[]
    createdAt: string
    lastLogin?: string
    isActive: boolean
}

export default function UsersManagementPage() {
    const [users, setUsers] = useState<User[]>([])
    const [filteredUsers, setFilteredUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [editLoading, setEditLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [createLoading, setCreateLoading] = useState(false)
    const [currentUser, setCurrentUser] = useState<any>(null)

    const [editFormData, setEditFormData] = useState({
        username: "",
        email: "",
        roles: [] as string[],
        isActive: true,
    })

    const [createFormData, setCreateFormData] = useState({
        username: "",
        email: "",
        password: "",
        roles: ["ROLE_USER"] as string[],
    })

    const router = useRouter()

    const availableRoles = [
        { value: "ROLE_USER", label: "User", color: "bg-gray-100 text-gray-800" },
        { value: "ROLE_MANAGER", label: "Manager", color: "bg-blue-100 text-blue-800" },
        { value: "ROLE_ADMIN", label: "Admin", color: "bg-red-100 text-red-800" },
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
        filterUsers()
    }, [users, searchTerm, roleFilter])

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

    const filterUsers = () => {
        let filtered = users

        if (searchTerm) {
            filtered = filtered.filter(
                (user) =>
                    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }

        if (roleFilter !== "all") {
            filtered = filtered.filter((user) => user.roles.includes(roleFilter))
        }

        setFilteredUsers(filtered)
    }

    const handleEditUser = (user: User) => {
        setSelectedUser(user)
        setEditFormData({
            username: user.username,
            email: user.email,
            roles: user.roles,
            isActive: user.isActive,
        })
        setEditDialogOpen(true)
    }

    const handleDeleteUser = (user: User) => {
        setSelectedUser(user)
        setDeleteDialogOpen(true)
    }

    const submitEdit = async () => {
        if (!selectedUser) return

        setEditLoading(true)
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://localhost:8080/api/admin/users/${selectedUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editFormData),
            })

            if (response.ok) {
                await fetchUsers()
                setEditDialogOpen(false)
                setError("")
            } else {
                const errorData = await response.json()
                setError(errorData.message || "Failed to update user")
            }
        } catch (error) {
            console.error("Error updating user:", error)
            setError("Network error occurred")
        } finally {
            setEditLoading(false)
        }
    }

    const submitDelete = async () => {
        if (!selectedUser) return

        setDeleteLoading(true)
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://localhost:8080/api/admin/users/${selectedUser.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                await fetchUsers()
                setDeleteDialogOpen(false)
                setError("")
            } else {
                const errorData = await response.json()
                setError(errorData.message || "Failed to delete user")
            }
        } catch (error) {
            console.error("Error deleting user:", error)
            setError("Network error occurred")
        } finally {
            setDeleteLoading(false)
        }
    }

    const submitCreate = async () => {
        setCreateLoading(true)
        try {
            const token = localStorage.getItem("token")
            const response = await fetch("http://localhost:8080/api/admin/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(createFormData),
            })

            if (response.ok) {
                await fetchUsers()
                setCreateDialogOpen(false)
                setCreateFormData({
                    username: "",
                    email: "",
                    password: "",
                    roles: ["ROLE_USER"],
                })
                setError("")
            } else {
                const errorData = await response.json()
                setError(errorData.message || "Failed to create user")
            }
        } catch (error) {
            console.error("Error creating user:", error)
            setError("Network error occurred")
        } finally {
            setCreateLoading(false)
        }
    }

    const getRoleColor = (role: string) => {
        const roleConfig = availableRoles.find((r) => r.value === role)
        return roleConfig?.color || "bg-gray-100 text-gray-800"
    }

    const getRoleLabel = (role: string) => {
        const roleConfig = availableRoles.find((r) => r.value === role)
        return roleConfig?.label || role.replace("ROLE_", "")
    }

    const toggleRole = (role: string, isEdit = false) => {
        if (isEdit) {
            setEditFormData((prev) => ({
                ...prev,
                roles: prev.roles.includes(role) ? prev.roles.filter((r) => r !== role) : [...prev.roles, role],
            }))
        } else {
            setCreateFormData((prev) => ({
                ...prev,
                roles: prev.roles.includes(role) ? prev.roles.filter((r) => r !== role) : [...prev.roles, role],
            }))
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
                        <Link href="/dashboard/admin">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">User Management</h1>
                        <Badge variant="destructive">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin Only
                        </Badge>
                    </div>
                    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Create User
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create New User</DialogTitle>
                                <DialogDescription>Add a new user to the system.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="create-username">Username</Label>
                                    <Input
                                        id="create-username"
                                        value={createFormData.username}
                                        onChange={(e) => setCreateFormData({ ...createFormData, username: e.target.value })}
                                        placeholder="Enter username"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="create-email">Email</Label>
                                    <Input
                                        id="create-email"
                                        type="email"
                                        value={createFormData.email}
                                        onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                                        placeholder="Enter email"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="create-password">Password</Label>
                                    <Input
                                        id="create-password"
                                        type="password"
                                        value={createFormData.password}
                                        onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                                        placeholder="Enter password"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Roles</Label>
                                    <div className="space-y-2">
                                        {availableRoles.map((role) => (
                                            <div key={role.value} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`create-role-${role.value}`}
                                                    checked={createFormData.roles.includes(role.value)}
                                                    onChange={() => toggleRole(role.value, false)}
                                                />
                                                <Label htmlFor={`create-role-${role.value}`}>{role.label}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={submitCreate} disabled={createLoading}>
                                    {createLoading ? "Creating..." : "Create User"}
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
                {/* Filters */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Users className="h-5 w-5 mr-2" />
                            Users ({filteredUsers.length})
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
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
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

                {/* Users Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Roles</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{user.username}</div>
                                                    {user.id === currentUser?.id && (
                                                        <Badge variant="outline" className="text-xs">
                                                            You
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.map((role) => (
                                                        <Badge key={role} className={getRoleColor(role)} variant="secondary">
                                                            {getRoleLabel(role)}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={user.isActive ? "default" : "secondary"}>
                                                    {user.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    {user.id !== currentUser?.id && (
                                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Edit User Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Make changes to user account and permissions.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-username">Username</Label>
                            <Input
                                id="edit-username"
                                value={editFormData.username}
                                onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={editFormData.email}
                                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Roles</Label>
                            <div className="space-y-2">
                                {availableRoles.map((role) => (
                                    <div key={role.value} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={`edit-role-${role.value}`}
                                            checked={editFormData.roles.includes(role.value)}
                                            onChange={() => toggleRole(role.value, true)}
                                        />
                                        <Label htmlFor={`edit-role-${role.value}`}>{role.label}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="edit-active"
                                    checked={editFormData.isActive}
                                    onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                                />
                                <Label htmlFor="edit-active">Account Active</Label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={submitEdit} disabled={editLoading}>
                            {editLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete User Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{selectedUser?.username}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={submitDelete} disabled={deleteLoading}>
                            {deleteLoading ? "Deleting..." : "Delete User"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
