"use client"

import { useState, useMemo } from "react"

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number
  department: string
  rating: number
  phone: string
  address: {
    address: string
    city: string
    state: string
    postalCode: string
  }
}

export function useSearch(users: User[]) {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDepartment = departmentFilter === "all" || user.department === departmentFilter

      const matchesRating =
        ratingFilter === "all" ||
        (ratingFilter === "high" && user.rating >= 4) ||
        (ratingFilter === "medium" && user.rating >= 3 && user.rating < 4) ||
        (ratingFilter === "low" && user.rating < 3)

      return matchesSearch && matchesDepartment && matchesRating
    })
  }, [users, searchTerm, departmentFilter, ratingFilter])

  return {
    searchTerm,
    setSearchTerm,
    departmentFilter,
    setDepartmentFilter,
    ratingFilter,
    setRatingFilter,
    filteredUsers,
  }
}
