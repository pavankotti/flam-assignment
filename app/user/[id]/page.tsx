"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/star-rating"
import { Skeleton } from "@/components/ui/skeleton"
import type { User } from "@/hooks/use-search"

const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations"]

function generateMockData(apiUser: any): User {
  return {
    id: apiUser.id,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    email: apiUser.email,
    age: apiUser.age,
    phone: apiUser.phone,
    department: departments[apiUser.firstName.length % 6],
    rating: apiUser.firstName.length % 5 + 1,
    address: {
      address: apiUser.address.address,
      city: apiUser.address.city,
      state: apiUser.address.state,
      postalCode: apiUser.address.postalCode,
    },
  }
}

function generateMockBio(name: string): string {
  const bios = [
    `${name} is a dedicated professional with over 5 years of experience in their field. Known for innovative thinking and collaborative approach to problem-solving.`,
    `${name} brings exceptional leadership skills and technical expertise to the team. Passionate about mentoring junior colleagues and driving organizational growth.`,
    `${name} is a results-driven individual with a proven track record of exceeding targets. Excellent communication skills and strong attention to detail.`,
    `${name} combines analytical thinking with creative solutions. Committed to continuous learning and professional development.`,
  ]
  return bios[Math.floor(Math.random() * bios.length)]
}

function generatePerformanceHistory(user: User) {
  const quarters = ["Q1 2024", "Q4 2023", "Q3 2023", "Q2 2023", "Q1 2023"]
  return quarters.map((quarter, idx) => ({
    period: quarter,
    rating: (user.firstName.length + idx) % 5 + 1, // Consistent, but varies per quarter
    feedback: [
      "Excellent project delivery",
      "Strong team collaboration",
      "Innovative problem solving",
      "Consistent performance",
      "Leadership potential",
    ][idx % 5],
  }))
}

function generateProjects() {
  const projects = [
    { name: "Customer Portal Redesign", status: "Completed", role: "Lead Developer" },
    { name: "Mobile App Integration", status: "In Progress", role: "Senior Developer" },
    { name: "Database Optimization", status: "Completed", role: "Technical Lead" },
    { name: "API Documentation", status: "Planning", role: "Contributor" },
  ]
  return projects.slice(0, Math.floor(Math.random() * 3) + 2)
}

function generateFeedback() {
  const feedback = [
    {
      from: "Manager",
      date: "2024-01-15",
      comment: "Consistently delivers high-quality work and shows great initiative.",
    },
    { from: "Peer", date: "2024-01-10", comment: "Excellent team player, always willing to help others." },
    { from: "Client", date: "2024-01-05", comment: "Professional and responsive, exceeded our expectations." },
  ]
  return feedback.slice(0, Math.floor(Math.random() * 2) + 1)
}

export default function UserDetails() {
  const params = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`https://dummyjson.com/users/${params.id}`)
        const apiUser = await response.json()
        const processedUser = generateMockData(apiUser)
        setUser(processedUser)
      } catch (error) {
        console.error("Failed to fetch user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [params.id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-1" />
          <Skeleton className="h-96 lg:col-span-2" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">User not found.</p>
        <Button asChild className="mt-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    )
  }

  const performanceHistory = generatePerformanceHistory(user)
  const projects = generateProjects()
  const feedback = generateFeedback()
  const bio = generateMockBio(`${user.firstName} ${user.lastName}`)

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    if (rating >= 3) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Employee Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {user.firstName} {user.lastName}
              </span>
              <Badge className={getRatingColor(user.rating)}>{user.rating}/5</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {user.address.address}, {user.address.city}, {user.address.state}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Age: {user.age}</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Performance Rating</h4>
              <StarRating rating={user.rating} size="lg" showNumber />
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Department</h4>
              <Badge variant="secondary">{user.department}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Content */}
        <Card className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              <TabsContent value="overview" className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Bio</h3>
                  <p className="text-sm text-muted-foreground">{bio}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Performance History</h3>
                  <div className="space-y-3">
                    {performanceHistory.map((record, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{record.period}</p>
                          <p className="text-sm text-muted-foreground">{record.feedback}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <StarRating rating={record.rating} size="sm" />
                          <Badge className={getRatingColor(record.rating)}>{record.rating}/5</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                <div>
                  <h3 className="font-medium mb-3">Project Involvement</h3>
                  <div className="space-y-3">
                    {projects.map((project, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{project.name}</h4>
                          <Badge
                            variant={
                              project.status === "Completed"
                                ? "default"
                                : project.status === "In Progress"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Role: {project.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="feedback" className="space-y-4">
                <div>
                  <h3 className="font-medium mb-3">Recent Feedback</h3>
                  <div className="space-y-3">
                    {feedback.map((item, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">From: {item.from}</span>
                          <span className="text-sm text-muted-foreground">{item.date}</span>
                        </div>
                        <p className="text-sm">{item.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
