"use client"

import { useEffect, useState } from "react"
import { UserCard } from "@/components/user-card"
import { SearchFilters } from "@/components/search-filters"
import { useSearch, type User } from "@/hooks/use-search"
import { Skeleton } from "@/components/ui/skeleton"
import { useBookmarks } from "@/hooks/use-bookmarks"

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
    rating: (apiUser.firstName.length)%5+1,
    address: {
      address: apiUser.address.address,
      city: apiUser.address.city,
      state: apiUser.address.state,
      postalCode: apiUser.address.postalCode,
    },
  }
}

export default function Dashboard() {
  const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const {
    searchTerm,
    setSearchTerm,
    departmentFilter,
    setDepartmentFilter,
    ratingFilter,
    setRatingFilter,
    filteredUsers,
  } = useSearch(users)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("https://dummyjson.com/users?limit=20")
        const data = await response.json()
        const processedUsers = data.users.map(generateMockData)
        setUsers(processedUsers)
      } catch (error) {
        console.error("Failed to fetch users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Employee Dashboard</h1>
          <p className="text-muted-foreground">Manage and track employee performance</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-full sm:w-48" />
          <Skeleton className="h-10 w-full sm:w-48" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>
        <p className="text-muted-foreground">
          Manage and track employee performance
        </p>
      </div>

      <SearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
        departments={departments}
      />

      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No employees found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} addBookmark={addBookmark} removeBookmark={removeBookmark} isBookmarked={isBookmarked} />
          ))}
        </div>
      )}
    </div>
  )
}
