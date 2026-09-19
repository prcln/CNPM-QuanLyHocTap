import React from 'react'
import { GraduationCap, Heart, Sparkles, BookOpen, Layers, Code2 } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t bg-muted/20 text-muted-foreground transition-colors">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Col 1: Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-bold text-base text-foreground tracking-tight">
                CNPM • Quản Lý Học Tập
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-muted-foreground/90">
              Nền tảng hỗ trợ sinh viên lập kế hoạch học tập, quản lý tiến độ tín chỉ, hạn chót bài tập và theo dõi điểm số GPA/CPA chuẩn quy chế đào tạo đại học.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground/75">
              <span>Được xây dựng với</span>
              <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 inline" />
              <span>cho cộng đồng sinh viên công nghệ</span>
            </div>
          </div>

          {/* Col 2: Hệ thống */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Phân Hệ Học Tập
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                  Học phần & Môn học
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-emerald-500" />
                  Deadline & Bài tập
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  Bảng điểm & GPA
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-pointer">
                  Thời khóa biểu tuần
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quy chế & Hướng dẫn */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Tài Liệu Quy Chế
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#quyche" className="hover:text-foreground transition-colors">
                  Quy định thang điểm 4 & 10
                </a>
              </li>
              <li>
                <a href="#quyche" className="hover:text-foreground transition-colors">
                  Điều kiện xét học bổng
                </a>
              </li>
              <li>
                <a href="#quyche" className="hover:text-foreground transition-colors">
                  Cảnh báo học tập & Tín chỉ
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-foreground transition-colors">
                  Câu hỏi thường gặp (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Công nghệ */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Kỹ Thuật & API
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                <span>Node.js Express Backend</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                <span>OpenAPI / Swagger 3.0</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-indigo-500" />
                <span>React 19 & Tailwind v4</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500" />
                <span>TanStack Query v5</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/75">
          <p>© 2026 Dự Án CNPM - Nhóm Quản Lý Học Tập Sinh Viên. Mọi quyền được bảo lưu.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Code2 className="h-3.5 w-3.5 text-primary" />
              <span>GitHub Repository</span>
            </span>
            <span>•</span>
            <span>Phiên bản v2.5 (Weamis Edition)</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
