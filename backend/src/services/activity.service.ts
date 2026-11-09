export interface ExtracurricularActivityData {
  id: string;
  title: string;
  organizer: string;
  category: "academic" | "volunteer" | "career" | "sports_arts" | "community";
  drlPoints: number;
  drlCriterion: string;
  date: string;
  time: string;
  location: string;
  registered?: boolean;
  attended?: boolean;
  maxParticipants?: number;
  registeredCount: number;
  description: string;
  imageUrl?: string;
  tags?: string[];
}

export interface DrlCriteriaScoreData {
  criterionId: number;
  name: string;
  maxScore: number;
  currentScore: number;
}

export interface DrlSummaryData {
  totalDrl: number;
  rank: "Xuất sắc" | "Tốt" | "Khá" | "Trung bình" | "Yếu" | "Kém";
  nextRankTarget: number;
  criteriaBreakdown: DrlCriteriaScoreData[];
}

const DEFAULT_ACTIVITIES: ExtracurricularActivityData[] = [
  {
    id: "act-1",
    title: "Ngày hội Việc làm & Thực tập Công nghệ HUST Job Fair 2026",
    organizer: "Ban Công tác Sinh viên & Đoàn Thanh niên HUST",
    category: "career",
    drlPoints: 10,
    drlCriterion: "Tiêu chí 3: Hoạt động phong trào & Hướng nghiệp",
    date: "2026-09-25",
    time: "08:00 - 16:30",
    location: "Hội trường C2 & Sảnh C1",
    attended: false,
    maxParticipants: 1500,
    registeredCount: 1120,
    description: "Cơ hội kết nối trực tiếp với hơn 60 doanh nghiệp công nghệ hàng đầu (Viettel, FPT, Samsung, VNG), phỏng vấn tuyển dụng tại chỗ và săn học bổng doanh nghiệp.",
    tags: ["Job Fair", "Thực tập", "Doanh nghiệp"],
  },
  {
    id: "act-2",
    title: "Hiến máu tình nguyện 'Giọt Hồng Bách Khoa' - Đợt 2",
    organizer: "Đội Thanh niên Tình nguyện Bách Khoa",
    category: "volunteer",
    drlPoints: 8,
    drlCriterion: "Tiêu chí 4: Hoạt động tình nguyện & Cộng đồng",
    date: "2026-09-22",
    time: "07:30 - 11:30",
    location: "Nhà thi đấu Bách Khoa",
    attended: false,
    maxParticipants: 500,
    registeredCount: 385,
    description: "Chương trình hiến máu nhân đạo thường niên của tuổi trẻ Bách Khoa với thông điệp Một giọt máu cho đi - Một cuộc đời ở lại.",
    tags: ["Tình nguyện", "Cộng đồng", "Hiến máu"],
  },
  {
    id: "act-3",
    title: "Hackathon Sinh viên Bách Khoa BK-AI Hack 2026",
    organizer: "CLB Trí tuệ Nhân tạo & Trường CNTT&TT",
    category: "academic",
    drlPoints: 15,
    drlCriterion: "Tiêu chí 1 & 3: Nghiên cứu khoa học & Sáng tạo",
    date: "2026-10-04",
    time: "08:00 - 20:00",
    location: "Tòa nhà Thư viện Tạ Quang Bửu",
    attended: false,
    maxParticipants: 200,
    registeredCount: 178,
    description: "Cuộc thi lập trình 24h giải quyết bài toán thực tế ứng dụng Large Language Models và thị giác máy tính, tổng giải thưởng 50 triệu đồng.",
    tags: ["Hackathon", "AI", "Lập trình"],
  },
  {
    id: "act-4",
    title: "Giải bóng đá Nam Sinh viên Bách Khoa Cup 2026",
    organizer: "Hội Sinh viên ĐH Bách Khoa Hà Nội",
    category: "sports_arts",
    drlPoints: 5,
    drlCriterion: "Tiêu chí 3: Rèn luyện thể lực & Văn thể",
    date: "2026-09-26",
    time: "14:00 - 17:00",
    location: "Sân vận động Bách Khoa (SVD2)",
    attended: false,
    maxParticipants: 300,
    registeredCount: 280,
    description: "Vòng bảng giải bóng đá truyền thống giữa các liên chi khoa. Cổ vũ và tham gia thi đấu được cộng điểm rèn luyện chính thức.",
    tags: ["Thể thao", "Bóng đá", "BK Cup"],
  },
  {
    id: "act-5",
    title: "Talkshow: Bí quyết chinh phục Học bổng Doanh nghiệp & Du học",
    organizer: "Trung tâm Hỗ trợ Sinh viên & Cựu Sinh viên HUST",
    category: "career",
    drlPoints: 5,
    drlCriterion: "Tiêu chí 1: Nâng cao năng lực học tập",
    date: "2026-09-28",
    time: "18:30 - 21:00",
    location: "Hội trường D9-401 & Trực tuyến MS Teams",
    attended: false,
    maxParticipants: 400,
    registeredCount: 245,
    description: "Gặp gỡ các diễn giả là cựu sinh viên Bách Khoa đang làm việc tại Silicon Valley và Châu Âu, chia sẻ lộ trình chuẩn bị hồ sơ du học và xin học bổng.",
    tags: ["Học bổng", "Talkshow", "Kỹ năng"],
  },
  {
    id: "act-6",
    title: "Chiến dịch Sinh viên Bách Khoa vì Môi Trường Xanh 2026",
    organizer: "Đoàn Thanh niên ĐHBK Hà Nội",
    category: "community",
    drlPoints: 7,
    drlCriterion: "Tiêu chí 4: Xây dựng văn minh giảng đường",
    date: "2026-10-10",
    time: "07:00 - 10:30",
    location: "Khuôn viên Quảng trường C1 & Ký túc xá Bách Khoa",
    attended: false,
    maxParticipants: 600,
    registeredCount: 420,
    description: "Hoạt động dọn dẹp vệ sinh khuôn viên, phân loại rác thải nhựa tại nguồn và đổi rác lấy cây xanh trang trí góc học tập.",
    tags: ["Môi trường", "Đoàn Hội", "Xanh"],
  },
];

class ActivityService {
  private activities: ExtracurricularActivityData[] = [...DEFAULT_ACTIVITIES];
  // Lưu danh sách masv đã đăng ký theo activityId: Map<activityId, Set<masv>>
  private registrations: Map<string, Set<number>> = new Map([
    ["act-1", new Set([20210001])],
    ["act-3", new Set([20210001])],
    ["act-4", new Set([20210001])],
  ]);

  async getActivities(
    masv: number = 20210001,
    category?: string,
    registeredOnly?: boolean,
  ): Promise<ExtracurricularActivityData[]> {
    let result = this.activities.map((act) => {
      const regSet = this.registrations.get(act.id);
      const isRegistered = regSet ? regSet.has(masv) : false;
      return {
        ...act,
        registered: isRegistered,
      };
    });

    if (category && category !== "all") {
      result = result.filter((a) => a.category === category);
    }

    if (registeredOnly) {
      result = result.filter((a) => a.registered);
    }

    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async toggleRegister(masv: number, activityId: string): Promise<ExtracurricularActivityData> {
    const act = this.activities.find((a) => a.id === activityId);
    if (!act) {
      const err: any = new Error("Không tìm thấy hoạt động ngoại khóa");
      err.statusCode = 404;
      throw err;
    }

    if (!this.registrations.has(activityId)) {
      this.registrations.set(activityId, new Set());
    }

    const regSet = this.registrations.get(activityId)!;
    const isCurrentlyRegistered = regSet.has(masv);

    if (isCurrentlyRegistered) {
      regSet.delete(masv);
      act.registeredCount = Math.max(0, act.registeredCount - 1);
    } else {
      regSet.add(masv);
      act.registeredCount += 1;
    }

    return {
      ...act,
      registered: !isCurrentlyRegistered,
    };
  }

  async getDrlSummary(masv: number = 20210001): Promise<DrlSummaryData> {
    // Tính điểm DRL tích lũy từ các hoạt động
    let bonusDrl = 0;
    this.activities.forEach((act) => {
      const regSet = this.registrations.get(act.id);
      if (regSet && regSet.has(masv)) {
        bonusDrl += Math.round(act.drlPoints * 0.7); // Điểm khi đăng ký tham gia
      }
    });

    const baseScore = 65;
    const totalDrl = Math.min(100, Math.max(0, baseScore + bonusDrl));
    const rank: DrlSummaryData["rank"] =
      totalDrl >= 90 ? "Xuất sắc" : totalDrl >= 80 ? "Tốt" : totalDrl >= 65 ? "Khá" : "Trung bình";
    const nextRankTarget = totalDrl >= 90 ? 100 : 90;

    const criteriaBreakdown: DrlCriteriaScoreData[] = [
      { criterionId: 1, name: "Ý thức học tập & nghiên cứu khoa học", maxScore: 20, currentScore: Math.min(20, 15 + Math.floor(bonusDrl * 0.3)) },
      { criterionId: 2, name: "Ý thức chấp hành nội quy, quy chế nhà trường", maxScore: 25, currentScore: 25 },
      { criterionId: 3, name: "Tham gia hoạt động chính trị - xã hội, văn hóa, thể thao", maxScore: 20, currentScore: Math.min(20, 12 + Math.floor(bonusDrl * 0.4)) },
      { criterionId: 4, name: "Phẩm chất công dân và quan hệ cộng đồng", maxScore: 25, currentScore: Math.min(25, 18 + Math.floor(bonusDrl * 0.3)) },
      { criterionId: 5, name: "Ý thức và kết quả tham gia công tác Đoàn - Hội", maxScore: 10, currentScore: 8 },
    ];

    return {
      totalDrl,
      rank,
      nextRankTarget,
      criteriaBreakdown,
    };
  }
}

export const activityService = new ActivityService();

