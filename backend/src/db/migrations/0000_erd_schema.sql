-- CNPM - QLHT: ERD Schema Migration
-- Strictly adheres to docs/erd_pseudo_code.dbml & Guardrail 3

CREATE TABLE IF NOT EXISTS tai_khoan (
  matk SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role CHAR(2) NOT NULL DEFAULT 'SV',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,
  deleted_by INTEGER
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id SERIAL PRIMARY KEY,
  matk INTEGER NOT NULL REFERENCES tai_khoan(matk) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  user_agent VARCHAR(255),
  ip_address VARCHAR(45)
);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_matk ON refresh_tokens(matk);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);

CREATE TABLE IF NOT EXISTS sinh_vien (
  masv INTEGER PRIMARY KEY,
  matk INTEGER NOT NULL UNIQUE REFERENCES tai_khoan(matk) ON DELETE CASCADE,
  hoten VARCHAR(255) NOT NULL,
  gioi_tinh VARCHAR(15) DEFAULT 'Nam',
  email VARCHAR(255),
  chuong_trinh VARCHAR(255) DEFAULT 'Chuẩn',
  truong VARCHAR(255) DEFAULT 'Trường CNTT & TT',
  lop VARCHAR(255) DEFAULT 'Việt Nhật 01',
  khoa INTEGER DEFAULT 66,
  trang_thai VARCHAR(255) DEFAULT 'Học',
  cpa DECIMAL(4, 2) DEFAULT 0.00,
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS giang_vien (
  magv INTEGER PRIMARY KEY,
  matk INTEGER NOT NULL UNIQUE REFERENCES tai_khoan(matk) ON DELETE CASCADE,
  hoten VARCHAR(255) NOT NULL,
  gioi_tinh VARCHAR(15) DEFAULT 'Nữ',
  email VARCHAR(255),
  truong VARCHAR(255) DEFAULT 'Bộ môn Công nghệ Phần mềm',
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hoc_phan (
  mahp CHAR(10) PRIMARY KEY,
  ten VARCHAR(255) NOT NULL,
  truong VARCHAR(255),
  bat_buoc BOOLEAN DEFAULT FALSE,
  tin_chi_dao_tao INTEGER DEFAULT 3,
  tin_chi_hoc_phi INTEGER DEFAULT 3,
  phan_bo CHAR(15),
  noidung TEXT,
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lop_hoc (
  malh SERIAL PRIMARY KEY,
  mahp CHAR(10) NOT NULL REFERENCES hoc_phan(mahp),
  malop CHAR(6) NOT NULL,
  hoc_ky CHAR(5) NOT NULL DEFAULT '20261',
  hoc_ky_phu CHAR(2) DEFAULT 'AB',
  malh_lt INTEGER,
  loai CHAR(10) DEFAULT 'LT+BT',
  trongso_qt DECIMAL(3, 2) NOT NULL DEFAULT 0.40,
  hinhthuc_giangday CHAR(15) DEFAULT 'Offline',
  deleted_at TIMESTAMP,
  CONSTRAINT uq_lop_hoc_malop_hoc_ky UNIQUE (malop, hoc_ky)
);

CREATE TABLE IF NOT EXISTS sv_lh (
  masv INTEGER NOT NULL REFERENCES sinh_vien(masv) ON DELETE CASCADE,
  malh INTEGER NOT NULL REFERENCES lop_hoc(malh) ON DELETE CASCADE,
  PRIMARY KEY (masv, malh)
);

CREATE TABLE IF NOT EXISTS gv_lh (
  magv INTEGER NOT NULL REFERENCES giang_vien(magv) ON DELETE CASCADE,
  malh INTEGER NOT NULL REFERENCES lop_hoc(malh) ON DELETE CASCADE,
  PRIMARY KEY (magv, malh)
);

CREATE TABLE IF NOT EXISTS teacher_assistant (
  masv INTEGER NOT NULL REFERENCES sinh_vien(masv) ON DELETE CASCADE,
  malh INTEGER NOT NULL REFERENCES lop_hoc(malh) ON DELETE CASCADE,
  PRIMARY KEY (masv, malh)
);

CREATE TABLE IF NOT EXISTS dang_ky_lop (
  madk SERIAL PRIMARY KEY,
  masv INTEGER NOT NULL REFERENCES sinh_vien(masv) ON DELETE CASCADE,
  malh INTEGER NOT NULL REFERENCES lop_hoc(malh) ON DELETE CASCADE,
  ngay_dang_ky TIMESTAMP DEFAULT NOW(),
  trang_thai VARCHAR(50) DEFAULT 'DangHoc',
  CONSTRAINT uq_dang_ky_lop_masv_malh UNIQUE (masv, malh)
);

CREATE TABLE IF NOT EXISTS tiet_hoc (
  tiet_hoc_so INTEGER PRIMARY KEY,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);

CREATE TABLE IF NOT EXISTS lich_hoc (
  malichhoc SERIAL PRIMARY KEY,
  malh INTEGER NOT NULL REFERENCES lop_hoc(malh) ON DELETE CASCADE,
  ngay_trong_tuan INTEGER NOT NULL,
  tiet_bat_dau INTEGER NOT NULL REFERENCES tiet_hoc(tiet_hoc_so),
  tiet_ket_thuc INTEGER NOT NULL REFERENCES tiet_hoc(tiet_hoc_so),
  dia_diem VARCHAR(20) NOT NULL,
  phong_hoc VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS tuan_hoc (
  math SERIAL PRIMARY KEY,
  malichhoc INTEGER NOT NULL REFERENCES lich_hoc(malichhoc) ON DELETE CASCADE,
  tuan_so INTEGER NOT NULL,
  CONSTRAINT uq_tuan_hoc_malichhoc_tuan UNIQUE (malichhoc, tuan_so)
);

CREATE TABLE IF NOT EXISTS diem (
  madiem SERIAL PRIMARY KEY,
  masv INTEGER NOT NULL REFERENCES sinh_vien(masv) ON DELETE CASCADE,
  malh INTEGER NOT NULL REFERENCES lop_hoc(malh) ON DELETE CASCADE,
  diem_qt DECIMAL(4, 2),
  diem_ck DECIMAL(4, 2),
  CONSTRAINT uq_diem_masv_malh UNIQUE (masv, malh)
);

CREATE TABLE IF NOT EXISTS bai_tap (
  mabt SERIAL PRIMARY KEY,
  malh INTEGER NOT NULL REFERENCES lop_hoc(malh) ON DELETE CASCADE,
  loai VARCHAR(255) DEFAULT 'Bài tập lớn',
  noi_dung TEXT,
  deadline TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nhom (
  manhom SERIAL PRIMARY KEY,
  mabt INTEGER NOT NULL REFERENCES bai_tap(mabt) ON DELETE CASCADE,
  de_tai TEXT,
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nhom_sv (
  manhom INTEGER NOT NULL REFERENCES nhom(manhom) ON DELETE CASCADE,
  masv INTEGER NOT NULL REFERENCES sinh_vien(masv) ON DELETE CASCADE,
  PRIMARY KEY (manhom, masv)
);

