import React from 'react'
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Award,
  Sparkles,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface HeroSectionProps {
  onEnterPortal: () => void
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onEnterPortal }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b">
      {/* Background Glows & Patterns */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-500/15 via-indigo-500/15 to-purple-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/70 dark:bg-indigo-950/40 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              <span>Nền Tảng Quản Trị Học Tập Thế Hệ Mới 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Nắm Bắt Tiến Độ Học Tập,{' '}
              <span className="gradient-heading">
                Chinh Phục Điểm Số Tối Đa
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Giải pháp toàn diện giúp sinh viên chủ động theo dõi học phần, đếm ngược hạn chót bài tập, dự phóng điểm GPA chuẩn quy chế tín chỉ và đồng bộ thời khóa biểu trực quan.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                size="lg"
                onClick={onEnterPortal}
                className="w-full sm:w-auto h-12 px-8 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/25 group transition-all"
              >
                <span>Bắt Đầu Với Cổng Sinh Viên</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <a href="#features" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-12 px-6 rounded-xl border-border/80 hover:bg-accent font-medium"
                >
                  Khám Phá Các Phân Hệ
                </Button>
              </a>
            </div>

            {/* Trust / Stats Chips */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-border/60 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground">Chuẩn quy chế tín chỉ</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">Thang 4 & 10</p>
                <p className="text-xs text-muted-foreground">Quy đổi điểm tự động</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">Zero Miss</p>
                <p className="text-xs text-muted-foreground">Cảnh báo deadline thông minh</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-2xl border border-border/80 bg-card/80 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-indigo-500/10">
              {/* Header card */}
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    SV
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">Sinh Viên Khóa 2023 - 2027</h3>
                    <p className="text-xs text-muted-foreground">Khoa Công Nghệ Phần Mềm</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[11px] font-semibold">
                  Học kỳ II - 2026
                </Badge>
              </div>

              {/* Bento snapshot items */}
              <div className="space-y-3.5 py-4">
                {/* GPA snapshot */}
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">GPA Tạm Tính</p>
                      <p className="font-bold text-base text-foreground">3.82 / 4.00</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-[10px] text-indigo-600 dark:text-indigo-400 border-indigo-300">
                      Xuất Sắc
                    </Badge>
                    <p className="text-[11px] text-muted-foreground mt-0.5">8.92 Hệ 10</p>
                  </div>
                </div>

                {/* Upcoming class snapshot */}
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Lớp Học Hôm Nay</p>
                      <p className="font-semibold text-sm text-foreground">Kiến Trúc & Thiết Kế Phần Mềm</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-foreground">Ca 2 (09:15)</span>
                    <p className="text-[11px] text-muted-foreground">Phòng B1-302</p>
                  </div>
                </div>

                {/* Urgent Deadline snapshot */}
                <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Hạn Nộp Bài Tập</p>
                      <p className="font-semibold text-sm text-foreground">Báo cáo Milestone 2</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-amber-400 text-amber-600 dark:text-amber-300 text-[11px]">
                    Còn 2 ngày
                  </Badge>
                </div>
              </div>

              {/* Bottom quick button in card */}
              <Button
                onClick={onEnterPortal}
                variant="secondary"
                size="sm"
                className="w-full mt-1 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
              >
                <span>Mở Toàn Bộ Trang Quản Trị</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Decorative Floating Pill */}
            <div className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background/95 border border-border shadow-lg backdrop-blur-md">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-medium text-foreground">Đã nộp 12/14 bài tập tuần này</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
