"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Skeleton } from "@/components/ui/skeleton"
import { useBookmarks } from "@/hooks/use-bookmarks"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Line,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts"

const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations"]

interface DepartmentData {
  department: string
  averageRating: number
  employeeCount: number
  bookmarkCount: number
  performanceGrowth: number
  satisfactionScore: number
}

interface BookmarkTrend {
  month: string
  bookmarks: number
  newBookmarks: number
  totalEmployees: number
  engagementRate: number
}

interface PerformanceMetrics {
  totalEmployees: number
  averageRating: number
  totalBookmarks: number
  topPerformingDept: string
  growthRate: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

const getMonthName = (date: Date) => {
  return date.toLocaleString('default', { month: 'short' })
}

export default function Analytics() {
  const { bookmarks } = useBookmarks()
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([])
  const [bookmarkTrends, setBookmarkTrends] = useState<BookmarkTrend[]>([])
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const generateDepartmentData = () => {
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Design'];
    
    return departments.map(dept => ({
      department: dept,
      avgRating: bookmarks.length 
        ? Number((bookmarks
            .filter(u => u.department === dept)
            .reduce((sum, user) => sum + (user.rating || 0), 0) 
          / (bookmarks.filter(u => u.department === dept).length || 1)
        ).toFixed(1))
        : 0
    }));
  };
  
  // In chart configuration:
  <BarChart 
    data={generateDepartmentData()}
    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis 
      dataKey="department"
      interval={0}
      angle={-45}
      textAnchor="end"
      height={75}
    />
    <YAxis domain={[0, 5]} />
    <Tooltip />
    <Bar dataKey="avgRating" fill="#8884d8" />
  </BarChart>

  useEffect(() => {
    // Process department data
    const deptData = departments.map((dept) => {
      const deptBookmarks = bookmarks.filter(b => b.department === dept)
      return {
        department: dept,
        averageRating: deptBookmarks.length > 0 
          ? +(deptBookmarks.reduce((sum, b) => sum + b.rating, 0) / deptBookmarks.length).toFixed(1)
          : 0,
        employeeCount: deptBookmarks.length,
        bookmarkCount: deptBookmarks.length,
        performanceGrowth: deptBookmarks.length > 0
          ? +(deptBookmarks[deptBookmarks.length - 1].rating - deptBookmarks[0].rating).toFixed(1)
          : 0,
        satisfactionScore: deptBookmarks.length > 0
          ? Math.floor(deptBookmarks.reduce((sum, b) => sum + b.rating, 0) / deptBookmarks.length * 20)
          : 0
      }
    })

    // Process bookmark trends
    const now = new Date()
    const monthlyData = Array.from({ length: 6 }).map((_, i) => {
      const month = new Date(now)
      month.setMonth(now.getMonth() - i)
      return {
        month: getMonthName(month),
        bookmarks: bookmarks.filter(b => 
          b.bookmarkedAt && new Date(b.bookmarkedAt).getMonth() === month.getMonth()
        ).length
      }
    }).reverse()

    const trendData = monthlyData.map((month, index) => ({
      month: month.month,
      bookmarks: month.bookmarks,
      newBookmarks: index > 0 ? month.bookmarks - monthlyData[index - 1].bookmarks : month.bookmarks,
      totalEmployees: bookmarks.length,
      engagementRate: +(month.bookmarks / bookmarks.length * 100).toFixed(1)
    }))

    // Calculate metrics
    const calculatedMetrics = {
      totalEmployees: bookmarks.length,
      averageRating: +(bookmarks.reduce((sum, b) => sum + b.rating, 0) / bookmarks.length).toFixed(1),
      totalBookmarks: bookmarks.length,
      topPerformingDept: deptData.reduce((top, dept) => 
        dept.bookmarkCount > top.bookmarkCount ? dept : top
      ).department,
      growthRate: trendData.length > 1 
        ? +(trendData[trendData.length - 1].engagementRate - trendData[trendData.length - 2].engagementRate).toFixed(1)
        : 0
    }

    setDepartmentData(deptData)
    setBookmarkTrends(trendData)
    setMetrics(calculatedMetrics)
  }, [bookmarks])

  if (!bookmarks.length) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">No bookmarks available to analyze</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Real-time insights from {bookmarks.length} bookmarks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.averageRating}</div>
            <p className="text-xs text-muted-foreground">Overall performance score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.topPerformingDept}</div>
            <p className="text-xs text-muted-foreground">Most bookmarked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.growthRate}%</div>
            <p className="text-xs text-muted-foreground">Since last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Department Average Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <BarChart data={generateDepartmentData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgRating" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookmark Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={bookmarkTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="bookmarks" fill="#8884d8" stroke="#8884d8" />
                <Bar dataKey="newBookmarks" fill="#413ea0" />
                <Line type="monotone" dataKey="engagementRate" stroke="#ff7300" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
