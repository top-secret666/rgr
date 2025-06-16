import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Calendar, Shield } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">League of Legends Tournament Admin</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Professional tournament management system for League of Legends esports events
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
              <CardTitle>Tournaments</CardTitle>
              <CardDescription>Manage and organize tournaments</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-500 mx-auto mb-2" />
              <CardTitle>Teams</CardTitle>
              <CardDescription>Register and manage teams</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <CardTitle>Schedule</CardTitle>
              <CardDescription>Plan tournament schedules</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-500 mx-auto mb-2" />
              <CardTitle>Admin Panel</CardTitle>
              <CardDescription>Full administrative control</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center space-x-4">
          <Link href="/auth/login">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Login
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button size="lg" variant="outline">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
