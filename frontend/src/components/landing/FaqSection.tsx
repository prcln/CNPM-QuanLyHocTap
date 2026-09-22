import React, { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  const faqs = [
    {
      question: 'Điểm tổng kết môn học và điểm GPA được tính như thế nào?',
      answer:
        'Điểm tổng kết môn học được tính theo trọng số cấu thành: Điểm chuyên cần (10-20%) + Điểm giữa kỳ / thực hành (20-30%) + Điểm thi kết thúc học phần (50-60%). Điểm học phần sau đó được quy đổi sang thang điểm chữ (A, B, C, D, F) và thang điểm 4. Điểm GPA học kỳ là trung bình có trọng số theo số tín chỉ của tất cả các môn đăng ký trong kỳ đó.',
      badge: 'Quy Chế Tín Chỉ',
    },
    {
      question: 'Bảng quy đổi giữa Thang điểm 10, Điểm chữ và Thang 4 như thế nào?',
      answer:
        'Theo quy chế đào tạo tín chỉ hiện hành:\n• 8.5 - 10.0: Điểm A (Điểm 4.0) - Giỏi / Xuất sắc\n• 8.0 - 8.4: Điểm B+ (Điểm 3.5) - Khá giỏi\n• 7.0 - 7.9: Điểm B (Điểm 3.0) - Khá\n• 6.5 - 6.9: Điểm C+ (Điểm 2.5) - Trung bình khá\n• 5.5 - 6.4: Điểm C (Điểm 2.0) - Trung bình\n• 5.0 - 5.4: Điểm D+ (Điểm 1.5) - Trung bình yếu\n• 4.0 - 4.9: Điểm D (Điểm 1.0) - Đạt tối thiểu\n• Dưới 4.0: Điểm F (Điểm 0.0) - Không đạt (Phải học lại)',
      badge: 'Thang Điểm',
    },
    {
      question: 'Tiêu chuẩn xếp loại học lực học kỳ và điều kiện xét học bổng là gì?',
      answer:
        'Xếp loại học lực căn cứ theo GPA:\n• Xuất sắc: GPA từ 3.60 đến 4.00 (không có môn nào dưới điểm C)\n• Giỏi: GPA từ 3.20 đến 3.59\n• Khá: GPA từ 2.50 đến 3.19\n• Trung bình: GPA từ 2.00 đến 2.49\nĐể được xét cấp học bổng khuyến khích học tập, sinh viên cần tích lũy tối thiểu 14-15 tín chỉ trong kỳ, điểm rèn luyện từ Khá trở lên và điểm GPA từ Giỏi (>= 3.20) trở lên.',
      badge: 'Học Bổng',
    },
    {
      question: 'Khi nào sinh viên bị cảnh báo học tập hoặc buộc thôi học?',
      answer:
        'Sinh viên bị cảnh báo học tập nếu điểm trung bình chung học kỳ đạt dưới 1.00 (đối với học kỳ đầu) hoặc dưới 1.20 (đối với các học kỳ tiếp theo); hoặc điểm trung bình chung tích lũy CPA dưới 1.60. Sinh viên bị cảnh báo học vụ liên tiếp quá số lần quy định của nhà trường sẽ bị buộc thôi học.',
      badge: 'Cảnh Báo Học Vụ',
    },
    {
      question: 'Dữ liệu học tập trên hệ thống được lưu trữ và bảo mật ra sao?',
      answer:
        'Hệ thống hỗ trợ cơ chế kép (Hybrid API): Khi có kết nối máy chủ Backend, dữ liệu được đồng bộ hóa trực tiếp thông qua chuẩn REST API / OpenAPI 3.0. Khi ở chế độ ngoại tuyến (Mock Mode), toàn bộ dữ liệu môn học, bài tập và bảng điểm được bảo lưu tự động trong LocalStorage của trình duyệt, đảm bảo không bao giờ mất thông tin.',
      badge: 'Kỹ Thuật',
    },
  ]

  return (
    <section id="faq" className="py-16 md:py-24 border-b">
      <div className="container mx-auto max-w-5xl px-4 sm:px-8">
        <div className="text-center space-y-4 mb-14">
          <Badge variant="outline" className="px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">
            Hỏi Đáp & Quy Chế Đào Tạo
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Giải Đáp Thắc Mắc Thường Gặp
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto leading-relaxed">
            Tổng hợp các quy định cốt lõi về quy chế đào tạo theo học chế tín chỉ giúp bạn chủ động định hướng mục tiêu học tập.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm transition-colors overflow-hidden"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-indigo-500 shrink-0" />
                    <span className="text-base sm:text-lg">{faq.question}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="text-[11px] hidden sm:inline-flex">
                      {faq.badge}
                    </Badge>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/40 whitespace-pre-line">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
