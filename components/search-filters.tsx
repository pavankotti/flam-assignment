"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  departmentFilter: string
  setDepartmentFilter: (department: string) => void
  ratingFilter: string
  setRatingFilter: (rating: string) => void
  departments: string[]
}

export function SearchFilters({
  searchTerm,
  setSearchTerm,
  departmentFilter,
  setDepartmentFilter,
  ratingFilter,
  setRatingFilter,
  departments,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          {departments.map((dept) => (
            <SelectItem key={dept} value={dept}>
              {dept}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={ratingFilter} onValueChange={setRatingFilter}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ratings</SelectItem>
          <SelectItem value="high">High (4-5 stars)</SelectItem>
          <SelectItem value="medium">Medium (3-4 stars)</SelectItem>
          <SelectItem value="low">Low (1-3 stars)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
