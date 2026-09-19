import React from 'react'
import {
  BookOpen,
  CheckSquare,
  Award,
  Calendar,
  ArrowRight,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface FeaturesSectionProps {
  onSelectFeature: (tabId: 'courses' | 'assignments' | 'grades' | 'schedule') => void
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onSelectFeature }) => {
  const features = [
    {
      id: 'courses' as const,
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Quản Lý Học Phần',
      title: 'Học Phần & Chương Trình Đào Tạo',
      description:
        'Theo dõi danh sách môn học theo từng kỳ, số tín chỉ, giảng viên phụ trách, phòng học và trạng thái hoàn thành học phần.',
      highlights: ['Lọc theo học kỳ linh hoạt', 'Kiểm soát khối lượng tín chỉ', 'Thông tin giảng viên & phòng học'],
    },
    {
      id: 'assignments' as const,
      icon: CheckSquare,
      color: 'from-amber-500 to-orange-600',
      badge: 'Chống Trễ Hạn',
      title: 'Bài Tập & Nhắc Nhở Deadline',
      description:
        'Hệ thống theo dõi bài tập theo môn, phân cấp độ ưu tiên, đếm ngược thời hạn nộp bài thông minh và đánh dấu hoàn thành nhanh.',
      highlights: ['Đếm ngược thời gian thực', 'Phân cấp độ ưu tiên (Cao/TB/Thấp)', 'Phân loại theo môn học'],
    },
    {
      id: 'grades' as const,
      icon: Award,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Quy Chế Tín Chỉ',
      title: 'Bảng Điểm, GPA & CPA Chuẩn Xác',
      description:
        'Tự động tính điểm tổng kết môn học từ chuyên cần, giữa kỳ và cuối kỳ. Quy đổi chính xác sang thang điểm chữ và hệ 4 theo quy chế bộ GD&ĐT.',
      highlights: ['Tự động tính điểm hệ 4 & 10', 'Quy đổi điểm chữ A, B, C, D, F', 'Xếp loại học lực & học bổng'],
    },
    {
      id: 'schedule' as const,
      icon: Calendar,
      color: 'from-purple-500 to-pink-600',
      badge: 'Lịch Học Trực Quan',
      title: 'Thời Khóa Biểu Tuần Thông Minh',
      description:
        'Lưới hiển thị lịch học trực quan theo ngày và ca học trong tuần, phân màu theo môn học giúp không bao giờ bị trùng lịch hay quên giờ lên lớp.',
      highlights: ['Xem theo ngày & ca học', 'Nhận diện phòng học & giảng đường', 'Phân biệt môn học bằng màu sắc'],
    },
  ]

  return (
    <section id="features" className="py-16 md:py-24 border-b bg-muted/15">
      <div className="container mx-auto max-w-7xl px-4 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <Badge variant="outline" className="px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">
            Hệ Thống Phân Hệ
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Bốn Trụ Cột Quản Lý Học Tập Đắc Lực
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Được thiết kế tinh gọn theo thói quen học tập của sinh viên đại học, đáp ứng đầy đủ nghiệp vụ từ đăng ký tín chỉ đến theo dõi bảng điểm tốt nghiệp.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feat) => {
            const Icon = feat.icon
            return (
              <Card
                key={feat.id}
                className="group relative overflow-hidden border border-border/70 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 cursor-pointer"
                onClick={() => onSelectFeature(feat.id)}
              >
                <div className="p-6 sm:p-8 space-y-5">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-md`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="text-xs font-medium">
                      {feat.badge}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  {/* Highlights list */}
                  <div className="pt-2 border-t border-border/50 space-y-2">
                    {feat.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center text-xs font-semibold text-primary group-hover:underline gap-1">
                    <span>Mở phân hệ trong Cổng Sinh Viên</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
