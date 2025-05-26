"use client"

import { useState, useEffect } from "react"

export interface BookmarkedUser {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number
  department: string
  rating: number
  bookmarkedAt: string
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedUser[]>([])
  const [initialized, setInitialized] = useState(false)

  // Load bookmarks from localStorage on mount (client only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("hr-bookmarks")
        if (saved) {
          setBookmarks(JSON.parse(saved))
        }
      } catch (e) {
        console.error("Failed to load bookmarks from localStorage", e)
      }
      setInitialized(true)
    }
  }, [])

  // Save bookmarks to localStorage whenever bookmarks state changes
  useEffect(() => {
    if (initialized && typeof window !== "undefined") {
      try {
        localStorage.setItem("hr-bookmarks", JSON.stringify(bookmarks))
      } catch (e) {
        console.error("Failed to save bookmarks to localStorage", e)
      }
    }
  }, [bookmarks, initialized])

  const addBookmark = (user: Omit<BookmarkedUser, "bookmarkedAt">) => {
    setBookmarks(prevBookmarks => {
      if (prevBookmarks.some(b => b.id === user.id)) return prevBookmarks
      return [...prevBookmarks, { ...user, bookmarkedAt: new Date().toISOString() }]
    })
  }

  const removeBookmark = (userId: number) => {
    setBookmarks(prevBookmarks => prevBookmarks.filter(b => b.id !== userId))
  }

  const isBookmarked = (userId: number) => bookmarks.some(b => b.id === userId)

  return { bookmarks, addBookmark, removeBookmark, isBookmarked }
}
