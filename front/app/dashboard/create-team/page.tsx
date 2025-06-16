"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateTeamPage() {
    const [formData, setFormData] = useState({
        name: "",
        tag: "",
        logo: "",
    })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push("/auth/login")
        }
    }, [router])

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

            const response = await fetch("http://localhost:8080/api/teams", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                setSuccess("Team created successfully!")
                setTimeout(() => {
                    router.push("/dashboard/teams")
                }, 2000)
            } else {
                const data = await response.json()
                if (data.errors) {
                    // Handle validation errors
                    const errorMessages = Object.values(data.errors).join(", ")
                    setError(errorMessages)
                } else {
                    setError(data.error || data.message || "Failed to create team")
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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow">
                <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
                    <Link href="/dashboard/teams">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Create Team</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>New Team</CardTitle>
                        <CardDescription>Register a new League of Legends team</CardDescription>
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
                                <Label htmlFor="name">Team Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter team name"
                                    required
                                />
                                <p className="text-sm text-gray-500">The full name of the team</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tag">Team Tag</Label>
                                <Input
                                    id="tag"
                                    name="tag"
                                    type="text"
                                    value={formData.tag}
                                    onChange={handleChange}
                                    placeholder="Enter team tag (2-5 characters)"
                                    maxLength={5}
                                    required
                                />
                                <p className="text-sm text-gray-500">Short abbreviation for the team (e.g., TSM, C9)</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="logo">Logo URL</Label>
                                <Input
                                    id="logo"
                                    name="logo"
                                    type="url"
                                    value={formData.logo}
                                    onChange={handleChange}
                                    placeholder="https://example.com/logo.png"
                                />
                                <p className="text-sm text-gray-500">Optional: URL to the team's logo image</p>
                            </div>

                            <div className="flex space-x-4">
                                <Button type="submit" disabled={loading} className="flex-1">
                                    {loading ? "Creating..." : "Create Team"}
                                </Button>
                                <Link href="/dashboard/teams">
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
