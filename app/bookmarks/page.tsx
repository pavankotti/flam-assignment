"use client"

import { useState } from "react"
import { Trash2, Eye, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/star-rating"
import { useBookmarks } from "@/hooks/use-bookmarks"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function Bookmarks() {
  const { bookmarks, removeBookmark } = useBookmarks()
  const [sortBy, setSortBy] = useState<"name" | "date" | "rating">("date")

  const sortedBookmarks = [...bookmarks].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
      case "date":
        return new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime()
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const getDepartmentColor = (department: string) => {
    const colors = {
      Engineering: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Marketing: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Sales: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      HR: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      Finance: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      Operations: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    }
    return colors[department as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Bookmarked Employees</h1>
          <p className="text-muted-foreground">
            {bookmarks.length} employee{bookmarks.length !== 1 ? "s" : ""} bookmarked
          </p>
        </div>

        <div className="flex space-x-2">
          <Button variant={sortBy === "date" ? "default" : "outline"} size="sm" onClick={() => setSortBy("date")}>
            <Calendar className="h-4 w-4 mr-1" />
            Date
          </Button>
          <Button variant={sortBy === "name" ? "default" : "outline"} size="sm" onClick={() => setSortBy("name")}>
            Name
          </Button>
          <Button variant={sortBy === "rating" ? "default" : "outline"} size="sm" onClick={() => setSortBy("rating")}>
            Rating
          </Button>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">No bookmarked employees yet.</p>
            <Button asChild>
              <Link href="/">Browse Employees</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {bookmark.firstName} {bookmark.lastName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{bookmark.email}</p>
                    <p className="text-sm text-muted-foreground">Age: {bookmark.age}</p>
                  </div>
                  <Badge className={getDepartmentColor(bookmark.department)}>{bookmark.department}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Performance Rating</span>
                  <StarRating rating={bookmark.rating} showNumber />
                </div>

                <div className="text-xs text-muted-foreground">
                  Bookmarked: {new Date(bookmark.bookmarkedAt).toLocaleDateString()}
                </div>

                <div className="flex space-x-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/user/${bookmark.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Bookmark</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove {bookmark.firstName} {bookmark.lastName} from your bookmarks?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => removeBookmark(bookmark.id)}>Remove</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
