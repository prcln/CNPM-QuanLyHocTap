import { useState, useMemo } from 'react'
import {
  Flame,
  Award,
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  X,
  PlusCircle,
  BookmarkCheck,
} from 'lucide-react'
import { Card } from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  useActivities,
  useDrlSummary,
  useToggleActivityRegistration,
} from '@/hooks/useActivities'
import type { ActivityCategory, ExtracurricularActivity } from '@/types/student'

export function ExtracurricularView() {
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'all' | 'registered'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCriteriaDetail, setShowCriteriaDetail] = useState(false)
  const [activeModalActivity, setActiveModalActivity] = useState<ExtracurricularActivity | null>(null)

  const { data: activities = [], isLoading } = useActivities()
  const { data: drlSummary } = useDrlSummary()
  const toggleRegistrationMutation = useToggleActivityRegistration()

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      // Category filter
      if (selectedCategory === 'registered' && !act.registered) return false
      if (
        selectedCategory !== 'all' &&
        selectedCategory !== 'registered' &&
        act.category !== selectedCategory
      ) {
        return false
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchTitle = act.title.toLowerCase().includes(q)
        const matchOrganizer = act.organizer.toLowerCase().includes(q)
        const matchLocation = act.location.toLowerCase().includes(q)
        const matchTag = act.tags?.some((t) => t.toLowerCase().includes(q))
        return matchTitle || matchOrganizer || matchLocation || matchTag
      }

      return true
    })
  }, [activities, selectedCategory, searchQuery])

  const registeredCount = activities.filter((a) => a.registered).length

  // Category labels and badges
  const categoryConfig: Record<
    ActivityCategory,
    { label: string; color: string; badgeClass: string }
  > = {
    academic: {
      label: 'Học thuật & AI',
      color: 'from-blue-600 to-indigo-600',
      badgeClass: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900',
    },
    volunteer: {
      label: 'Tình nguyện & Hiến máu',
      color: 'from-rose-500 to-pink-600',
      badgeClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900',
    },
    career: {
      label: 'Ngày hội việc làm',
      color: 'from-purple-600 to-violet-600',
      badgeClass: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900',
    },
    sports_arts: {
      label: 'Thể thao & Văn nghệ',
      color: 'from-amber-500 to-orange-600',
      badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900',
    },
    community: {
      label: 'Đoàn - Hội & Cộng đồng',
      color: 'from-emerald-500 to-teal-600',
      badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
    },
  }

  return (
    <div className="space-y-6">
      {/* 1. DRL SCORE OVERVIEW & TARGET CARD */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-red-600/10 via-amber-600/10 to-indigo-600/10 p-6 sm:p-8 backdrop-blur-sm shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left score overview */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-600 text-white uppercase tracking-wider shadow-xs">
                Điểm Rèn Luyện (ĐRL) • Học kỳ II
              </span>
              <span className="text-xs text-muted-foreground">• Chuẩn CTSV ĐHBK Hà Nội</span>
            </div>

            <div className="flex items-baseline gap-3 pt-1">
              <h2 className="text-3xl sm:text-4xl font-black text-foreground">
                {drlSummary?.totalDrl ?? 88}
                <span className="text-base sm:text-lg font-normal text-muted-foreground ml-1">/ 100 Điểm</span>
              </h2>
              <Badge className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-0.5">
                Xếp Loại: {drlSummary?.rank ?? 'Tốt'}
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Bạn chỉ cần tích lũy thêm{' '}
              <span className="font-bold text-red-600 dark:text-red-400">
                {(drlSummary?.nextRankTarget ?? 90) - (drlSummary?.totalDrl ?? 88)} điểm
              </span>{' '}
              nữa để đạt mốc xếp loại <span className="font-bold text-foreground">Xuất Sắc (≥ 90 điểm)</span> và đủ điều kiện xét cấp Học bổng Khuyến khích học tập!
            </p>
          </div>

          {/* Right quick stats */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCriteriaDetail((prev) => !prev)}
              className="h-10 rounded-xl text-xs font-semibold gap-1.5 border-border/80 hover:bg-accent"
            >
              <Award className="h-4 w-4 text-amber-500" />
              <span>{showCriteriaDetail ? 'Ẩn 5 tiêu chí' : 'Xem 5 tiêu chí ĐRL'}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  showCriteriaDetail ? 'rotate-180' : ''
                }`}
              />
            </Button>

            <div className="p-3 rounded-xl bg-card border border-border/70 text-right min-w-[140px] shrink-0">
              <p className="text-[11px] text-muted-foreground font-medium">Hoạt động đã lưu</p>
              <p className="text-lg font-extrabold text-foreground flex items-center justify-end gap-1.5">
                <BookmarkCheck className="h-4 w-4 text-emerald-500" />
                <span>{registeredCount} sự kiện</span>
              </p>
            </div>
          </div>
        </div>

        {/* Expandable Breakdown of 5 Criteria */}
        {showCriteriaDetail && (
          <div className="pt-4 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {drlSummary?.criteriaBreakdown.map((item) => {
              const pct = Math.round((item.currentScore / item.maxScore) * 100)
              return (
                <div
                  key={item.criterionId}
                  className="p-3 rounded-xl bg-card/80 border border-border/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground">Tiêu chí {item.criterionId}</span>
                    <span className="font-semibold text-primary">
                      {item.currentScore}/{item.maxScore}đ
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 h-8 leading-tight">
                    {item.name}
                  </p>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div
                      className="bg-gradient-to-r from-red-600 to-amber-500 h-1.5 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 2. SEARCH & CATEGORY FILTER TABS */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full h-8 text-xs font-semibold px-3.5 ${
              selectedCategory === 'all'
                ? 'bg-red-700 hover:bg-red-800 text-white shadow-xs'
                : 'text-muted-foreground'
            }`}
          >
            Tất cả ({activities.length})
          </Button>

          <Button
            variant={selectedCategory === 'registered' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('registered')}
            className={`rounded-full h-8 text-xs font-semibold px-3.5 gap-1.5 ${
              selectedCategory === 'registered'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                : 'text-muted-foreground'
            }`}
          >
            <BookmarkCheck className="h-3.5 w-3.5" />
            <span>Đã đăng ký ({registeredCount})</span>
          </Button>

          {(Object.keys(categoryConfig) as ActivityCategory[]).map((catKey) => {
            const isAct = selectedCategory === catKey
            return (
              <Button
                key={catKey}
                variant={isAct ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(catKey)}
                className={`rounded-full h-8 text-xs font-semibold px-3.5 whitespace-nowrap ${
                  isAct
                    ? 'bg-red-700 hover:bg-red-800 text-white shadow-xs'
                    : 'text-muted-foreground'
                }`}
              >
                {categoryConfig[catKey].label}
              </Button>
            )
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên sự kiện, địa điểm, CLB..."
            className="pl-9 h-9 rounded-xl text-xs bg-card"
          />
        </div>
      </div>

      {/* 3. ACTIVITIES LIST GRID */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 rounded-2xl border bg-muted/30 animate-pulse" />
          ))}
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border bg-card/60 space-y-3">
          <Flame className="h-10 w-10 text-muted-foreground/40 mx-auto" />
          <h3 className="font-bold text-base text-foreground">Không tìm thấy hoạt động nào</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Không có sự kiện ngoại khóa nào khớp với tiêu chí tìm kiếm hoặc bộ lọc hiện tại.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategory('all')
              setSearchQuery('')
            }}
            className="rounded-xl text-xs mt-2"
          >
            Xóa bộ lọc
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredActivities.map((act) => {
            const catInfo = categoryConfig[act.category]
            const isReg = act.registered
            const isPast = new Date(act.date).getTime() < new Date(2026, 8, 19).getTime()

            return (
              <Card
                key={act.id}
                className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card hover:border-red-700/50 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                {/* Top header & DRL Points Badge */}
                <div className="p-5 space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className={`text-[11px] font-semibold ${catInfo.badgeClass}`}>
                      {catInfo.label}
                    </Badge>

                    {/* DRL Points chip */}
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600/10 text-red-700 dark:text-red-400 font-extrabold text-xs border border-red-600/20 shadow-2xs">
                      <Sparkles className="h-3 w-3" />
                      <span>+{act.drlPoints} ĐRL</span>
                    </div>
                  </div>

                  {/* Title & Organizer */}
                  <div>
                    <h3
                      onClick={() => setActiveModalActivity(act)}
                      className="font-bold text-base text-foreground line-clamp-2 hover:text-red-700 cursor-pointer transition-colors"
                      title={act.title}
                    >
                      {act.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      Tổ chức: <span className="font-medium text-foreground/80">{act.organizer}</span>
                    </p>
                  </div>

                  {/* Date, Time & Location */}
                  <div className="space-y-1.5 text-xs text-muted-foreground pt-1 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-red-600 shrink-0" />
                      <span className="font-medium text-foreground">
                        {new Date(act.date).toLocaleDateString('vi-VN', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                      <span>{act.time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                      <span className="truncate">{act.location}</span>
                    </div>
                  </div>

                  {/* Criterion note */}
                  <p className="text-[11px] text-muted-foreground/80 italic line-clamp-1 bg-muted/40 p-1.5 rounded-lg">
                    {act.drlCriterion}
                  </p>
                </div>

                {/* Bottom Registration & Action Area */}
                <div className="p-4 border-t border-border/60 bg-muted/15 space-y-2.5">
                  {act.maxParticipants && (
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>Đã đăng ký:</span>
                      </div>
                      <span className="font-semibold text-foreground">
                        {act.registeredCount} / {act.maxParticipants}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      variant={isReg ? 'secondary' : 'default'}
                      size="sm"
                      onClick={() => toggleRegistrationMutation.mutate(act.id)}
                      disabled={toggleRegistrationMutation.isPending || isPast}
                      className={`flex-1 rounded-xl text-xs font-semibold h-9 transition-colors ${
                        isReg
                          ? 'border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600'
                          : 'bg-red-700 hover:bg-red-800 text-white shadow-xs'
                      }`}
                    >
                      {isReg ? (
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Đã lưu vào lịch (Hủy)</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span>Đăng ký tham gia</span>
                        </span>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveModalActivity(act)}
                      className="rounded-xl text-xs h-9 px-3"
                    >
                      Chi tiết
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* 4. MODAL CHI TIẾT SỰ KIỆN NGOẠI KHÓA */}
      {activeModalActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-border/80 bg-card p-6 shadow-2xl space-y-5">
            <button
              onClick={() => setActiveModalActivity(null)}
              className="absolute right-4 top-4 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header info */}
            <div className="space-y-2 pr-6">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-xs font-semibold ${categoryConfig[activeModalActivity.category].badgeClass}`}>
                  {categoryConfig[activeModalActivity.category].label}
                </Badge>
                <Badge className="bg-red-600 text-white text-xs font-bold">
                  +{activeModalActivity.drlPoints} ĐRL
                </Badge>
              </div>

              <h3 className="text-xl font-bold text-foreground">
                {activeModalActivity.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                Đơn vị tổ chức: <span className="font-semibold text-foreground">{activeModalActivity.organizer}</span>
              </p>
            </div>

            {/* Content specifics */}
            <div className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Thời gian:</span>
                <span className="font-bold text-foreground">
                  {new Date(activeModalActivity.date).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric',
                  })}
                  {' • '}{activeModalActivity.time}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Địa điểm:</span>
                <span className="font-bold text-foreground">{activeModalActivity.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Mục tiêu ĐRL:</span>
                <span className="font-medium text-red-600 dark:text-red-400">{activeModalActivity.drlCriterion}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold text-foreground">Mô tả chương trình:</h4>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {activeModalActivity.description}
              </p>
            </div>

            {/* Tags */}
            {activeModalActivity.tags && activeModalActivity.tags.length > 0 && (
              <div className="flex items-center gap-1.5">
                {activeModalActivity.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-[10px]">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Footer action */}
            <div className="pt-2 border-t border-border/60 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveModalActivity(null)}
                className="rounded-xl text-xs"
              >
                Đóng
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  toggleRegistrationMutation.mutate(activeModalActivity.id)
                  setActiveModalActivity((prev) => (prev ? { ...prev, registered: !prev.registered } : null))
                }}
                className={`rounded-xl text-xs font-semibold ${
                  activeModalActivity.registered
                    ? 'bg-muted text-foreground hover:bg-rose-100 dark:hover:bg-rose-950/60 hover:text-rose-600'
                    : 'bg-red-700 hover:bg-red-800 text-white'
                }`}
              >
                {activeModalActivity.registered ? 'Hủy đăng ký' : 'Xác nhận Đăng ký (+ĐRL)'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
