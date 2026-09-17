type GioiTinhType = "Nam" | "Nu";
type LoaiLopHocType = "LT" | "BT" | "LT+BT" | "TN" | "DA";
type HocKyPhuType = "A" | "B" | "AB";
type HinhThucGiangDayType = "Offline" | "BLearning";


export interface ITaiKhoan {
    matk: number;
    username: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ISinhVien {
    masv: number;
    matk: number;
    hoten: string;
    gioi_tinh?: GioiTinhType;
    email?: string;
    chuong_trinh?: string;
    truong?: string;
    lop?: string;
    khoa?: number;
    trang_thai?: string;
}

export interface IGiangVien {
    magv: number;
    matk: number;
    hoten: string;
    gioi_tinh?: boolean;
    email?: string;
    truong?: string;
}

export interface IHocPhan {
    mahp: string;
    ten: string;
    truong?: string;
    bat_buoc?: boolean;
    tin_chi_dao_tao?: number;
    tin_chi_hoc_phi?: number;
    phan_bo?: string;
    noidung?: string;
}

export interface ILopHoc {
    malh: number;
    mahp: string;
    malop: string;
    hoc_ky: string;
    hoc_ky_phu?: HocKyPhuType;
    malh_lt?: number;
    loai?: LoaiLopHocType;
    trongso_qt?: number;
    hinhthuc_giangday?: HinhThucGiangDayType;
}

export interface IGvLh {
    magv: number;
    malh: number;
}

export interface ITietHoc {
    tiet_hoc_so: number;
    start_time: string;
    end_time: string;
}

export interface ILichHoc {
    malichhoc: number;
    malh: number;
    ngay_trong_tuan: number;
    tiet_bat_dau: number;
    tiet_ket_thuc: number;
    dia_diem: string;
    phong_hoc?: string;
}

export interface ITuanHoc {
    math: number;
    malichhoc: number;
    tuan_so?: number;
}

export interface IDiem {
    madiem: number;
    masv: number;
    malh: number;
    diem_qt?: number;
    diem_ck?: number;
    diem_hp_chu?: string;
    diem_hp_so?: number;
}

export interface IBaiTap {
    mabt: number;
    malh: number;
    loai?: string;
    noi_dung?: string;
    deadline?: Date;
}

export interface INhom {
    manhom: number;
    mabt: number;
    de_tai?: string;
}

export interface INhomSv {
    manhom: number;
    masv: number;
}
