"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, Bookmark, TrendingUp, BookmarkCheck } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/star-rating"
import { useBookmarks } from "@/hooks/use-bookmarks"
import type { User } from "@/hooks/use-search"

interface UserCardProps {
  user: User
}

export function UserCard({ user, addBookmark, removeBookmark, isBookmarked }) {
  const [isPromoted, setIsPromoted] = useState(false)
  const bookmarked = isBookmarked(user.id)

  const handleBookmark = () => {
    if (bookmarked) {
      removeBookmark(user.id)
    } else {
      addBookmark(user)
    }
  }

  const handlePromote = () => {
    setIsPromoted(true)
    setTimeout(() => setIsPromoted(false), 2000)
  }

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
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground">Age: {user.age}</p>
          </div>
          <Badge className={getDepartmentColor(user.department)}>{user.department}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Performance Rating</span>
            <StarRating rating={user.rating} showNumber />
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/user/${user.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Link>
          </Button>

          <Button variant="outline" size="sm" onClick={handleBookmark} className="flex-1">
            {bookmarked ? <BookmarkCheck className="h-4 w-4 mr-1" /> : <Bookmark className="h-4 w-4 mr-1" />}
            {bookmarked ? "Saved" : "Bookmark"}
          </Button>

          <Button
            variant={isPromoted ? "default" : "outline"}
            size="sm"
            onClick={handlePromote}
            className="flex-1"
            disabled={isPromoted}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            {isPromoted ? "Promoted!" : "Promote"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
