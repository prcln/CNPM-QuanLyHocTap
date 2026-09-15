import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  BookOpen,
  GraduationCap,
  Users,
  CheckCircle2,
  Sparkles,
  Search,
  RefreshCw,
  Code2,
  Database,
  Layers,
  ArrowUpRight,
  Sun,
  Moon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface Course {
  id: string
  code: string
  name: string
  instructor: string
  credits: number
  studentsCount: number
  status: 'active' | 'upcoming' | 'completed'
}

// Mock query function demonstrating TanStack Query
const fetchCourses = async (): Promise<Course[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600))
  return [
    {
      id: '1',
      code: 'SE104',
      name: 'Nhập môn Công nghệ Phần mềm',
      instructor: 'TS. Nguyễn Văn A',
      credits: 4,
      studentsCount: 65,
      status: 'active',
    },
    {
      id: '2',
      code: 'IT002',
      name: 'Lập trình Hướng đối tượng',
      instructor: 'ThS. Trần Thị B',
      credits: 4,
      studentsCount: 78,
      status: 'active',
    },
    {
      id: '3',
      code: 'IS201',
      name: 'Hệ Quản trị Cơ sở Dữ liệu',
      instructor: 'TS. Lê Hoàng C',
      credits: 3,
      studentsCount: 54,
      status: 'upcoming',
    },
    {
      id: '4',
      code: 'SE347',
      name: 'Công nghệ Web & Ứng dụng',
      instructor: 'ThS. Phạm Minh D',
      credits: 3,
      studentsCount: 82,
      status: 'active',
    },
  ]
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isDark, setIsDark] = useState(false)

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const next = !prev
      if (next) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return next
    })
  }

  const { data: courses, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  })

  const filteredCourses = courses?.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-lg">CNPM - QLHT</span>
                <Badge variant="secondary" className="text-xs">
                  v1.0.0
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Hệ Thống Quản Lý Học Tập
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative w-48 sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm môn học..."
                className="pl-9 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              className="h-9 w-9 rounded-lg"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 py-8 sm:px-8 space-y-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-secondary/30 p-6 sm:p-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Sẵn sàng phát triển dự án CNPM</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Quản Lý Học Tập Thông Minh & Hiện Đại
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              Dự án đã được tích hợp đầy đủ công nghệ hàng đầu: React 19, TypeScript,
              Vite, Tailwind CSS v4, shadcn/ui và TanStack Query & Table.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button onClick={() => refetch()} disabled={isFetching} className="gap-2">
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
                Làm mới dữ liệu (TanStack Query)
              </Button>
              <Button variant="outline" asChild>
                <a
                  href="https://ui.shadcn.com"
                  target="_blank"
                  rel="noreferrer"
                  className="gap-2 inline-flex items-center"
                >
                  Tài liệu shadcn/ui
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Tech Stack Pills */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Ngăn xếp công nghệ tích hợp
          </h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="py-1 px-3 gap-1.5 text-xs">
              <Layers className="h-3.5 w-3.5 text-blue-500" /> React 19 + TypeScript
            </Badge>
            <Badge variant="outline" className="py-1 px-3 gap-1.5 text-xs">
              <Code2 className="h-3.5 w-3.5 text-purple-500" /> Vite 8 + Oxlint
            </Badge>
            <Badge variant="outline" className="py-1 px-3 gap-1.5 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-cyan-500" /> Tailwind CSS v4
            </Badge>
            <Badge variant="outline" className="py-1 px-3 gap-1.5 text-xs">
              <Layers className="h-3.5 w-3.5 text-zinc-500" /> shadcn/ui (Radix UI)
            </Badge>
            <Badge variant="outline" className="py-1 px-3 gap-1.5 text-xs">
              <Database className="h-3.5 w-3.5 text-rose-500" /> TanStack Query v5 + Devtools
            </Badge>
            <Badge variant="outline" className="py-1 px-3 gap-1.5 text-xs">
              <BookOpen className="h-3.5 w-3.5 text-amber-500" /> TanStack Table v9
            </Badge>
          </div>
        </section>

        {/* Overview Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Môn học đang mở</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Học kỳ 1 - 2026</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng sinh viên</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {courses?.reduce((acc, c) => acc + c.studentsCount, 0) || 0}
              </div>
              <p className="text-xs text-muted-foreground">Đã ghi danh vào lớp</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Trạng thái hệ thống</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                100% Hoạt động
              </div>
              <p className="text-xs text-muted-foreground">TanStack Query kết nối</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tổng tín chỉ</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {courses?.reduce((acc, c) => acc + c.credits, 0) || 0} Tín chỉ
              </div>
              <p className="text-xs text-muted-foreground">Đang đào tạo</p>
            </CardContent>
          </Card>
        </section>

        {/* Course Cards / TanStack Query Showcase */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Danh Sách Học Phần</h2>
              <p className="text-sm text-muted-foreground">
                Dữ liệu được nạp và lưu cache tự động thông qua TanStack Query
              </p>
            </div>
            {isFetching && (
              <Badge variant="secondary" className="gap-1.5 w-fit">
                <RefreshCw className="h-3 w-3 animate-spin" /> Đang đồng bộ...
              </Badge>
            )}
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <Card key={n} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 w-20 bg-muted rounded"></div>
                    <div className="h-6 w-48 bg-muted rounded mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 w-32 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {filteredCourses?.map((course) => (
                <Card key={course.id} className="transition-shadow hover:shadow-md">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{course.code}</Badge>
                        <Badge
                          variant={course.status === 'active' ? 'default' : 'secondary'}
                        >
                          {course.status === 'active' ? 'Đang học' : 'Sắp mở'}
                        </Badge>
                      </div>
                      <CardTitle className="mt-2 text-lg font-semibold">
                        {course.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Giảng viên: {course.instructor}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Số tín chỉ: {course.credits}</span>
                      <span>Sĩ số: {course.studentsCount} sinh viên</span>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      Chi tiết
                    </Button>
                    <Button size="sm">Vào lớp học</Button>
                  </CardFooter>
                </Card>
              ))}
              {filteredCourses?.length === 0 && (
                <div className="col-span-full py-12 text-center text-muted-foreground border rounded-xl">
                  Không tìm thấy môn học nào khớp với từ khóa "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
