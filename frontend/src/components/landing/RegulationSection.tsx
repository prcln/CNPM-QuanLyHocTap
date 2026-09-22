import React from 'react'
import { Award, BookOpen, CheckCircle, Scale, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const RegulationSection: React.FC = () => {
  const gradeScales = [
    { grade10: '8.5 - 10.0', letter: 'A', gpa: '4.0', status: 'Giỏi / Xuất Sắc', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' },
    { grade10: '8.0 - 8.4', letter: 'B+', gpa: '3.5', status: 'Khá Giỏi', color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10' },
    { grade10: '7.0 - 7.9', letter: 'B', gpa: '3.0', status: 'Khá', color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10' },
    { grade10: '6.5 - 6.9', letter: 'C+', gpa: '2.5', status: 'Trung Bình Khá', color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10' },
    { grade10: '5.5 - 6.4', letter: 'C', gpa: '2.0', status: 'Trung Bình', color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10' },
    { grade10: '5.0 - 5.4', letter: 'D+', gpa: '1.5', status: 'Trung Bình Yếu', color: 'text-orange-600 dark:text-orange-400 bg-orange-500/10' },
    { grade10: '4.0 - 4.9', letter: 'D', gpa: '1.0', status: 'Đạt Tối Thiểu', color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10' },
    { grade10: '< 4.0', letter: 'F', gpa: '0.0', status: 'Không Đạt (Học Lại)', color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10' },
  ]

  const rankRules = [
    { rank: 'Xuất sắc', gpaRange: '3.60 - 4.00', condition: 'Không có môn bị điểm F hoặc D', icon: Award, color: 'text-amber-500' },
    { rank: 'Giỏi', gpaRange: '3.20 - 3.59', condition: 'Đủ điều kiện xét học bổng khuyến khích', icon: ShieldCheck, color: 'text-blue-500' },
    { rank: 'Khá', gpaRange: '2.50 - 3.19', condition: 'Đạt chuẩn tốt nghiệp thông thường', icon: CheckCircle, color: 'text-emerald-500' },
    { rank: 'Trung bình', gpaRange: '2.00 - 2.49', condition: 'Mức đạt chuẩn tối thiểu của học phần', icon: Scale, color: 'text-slate-500' },
  ]

  return (
    <section id="quyche" className="py-16 md:py-24 border-b">
      <div className="container mx-auto max-w-7xl px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <Badge variant="outline" className="px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">
            Cẩm Nang Sinh Viên
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Bảng Tra Cứu Quy Chế Tín Chỉ & Thang Điểm
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Hệ thống tự động áp dụng chính xác các thang điểm và phân loại này vào toàn bộ phân hệ Bảng Điểm & GPA của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Grade Table */}
          <div className="lg:col-span-7 rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
            <div className="p-4 sm:p-5 border-b bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold text-sm text-foreground">Thang Điểm 10 Sang Điểm Chữ & Thang 4</h3>
              </div>
              <span className="text-xs text-muted-foreground">Theo chuẩn Bộ GD&ĐT</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-muted/15 text-xs font-semibold text-muted-foreground">
                    <th className="py-3 px-4">Thang 10</th>
                    <th className="py-3 px-4">Điểm Chữ</th>
                    <th className="py-3 px-4">Thang 4 (GPA)</th>
                    <th className="py-3 px-4">Đánh Giá</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {gradeScales.map((item, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 px-4 font-medium text-foreground">{item.grade10}</td>
                      <td className="py-2.5 px-4 font-bold text-foreground">
                        <span className="px-2 py-0.5 rounded-md bg-accent text-xs">{item.letter}</span>
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-primary">{item.gpa}</td>
                      <td className="py-2.5 px-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${item.color}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Rank Rules Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
              <h4 className="font-semibold text-sm text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                <Award className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Tiêu Chuẩn Xếp Hạng Học Lực Học Kỳ</span>
              </h4>
              <p className="text-xs text-indigo-700/80 dark:text-indigo-300/80 mt-1">
                Điểm GPA dùng để xét khen thưởng, học bổng và điều kiện tốt nghiệp.
              </p>
            </div>

            <div className="grid gap-3">
              {rankRules.map((rule, idx) => {
                const Icon = rule.icon
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-border/80 bg-card hover:border-primary/40 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-muted ${rule.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-sm text-foreground">{rule.rank}</h5>
                          <Badge variant="outline" className="text-[10px] font-medium">
                            GPA: {rule.gpaRange}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{rule.condition}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
