import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

export interface ISinhVien {
  id: string;
  fullName: string;
  studentId: string;
  cohort: string;
  major: string;
  email: string;
  phone: string;
  cpa: number;
  avatarUrl: string;
}

const initialProfileData: ISinhVien = {
  id: "1",
  fullName: "Vũ Duy Nhật Hào",
  studentId: "20245678",
  cohort: "K69",
  major: "Computer Science",
  email: "hao.vd245678@sis.hust.edu.vn",
  phone: "0912345678",
  cpa: 3.6,
  avatarUrl: "https://www.google.com/imgres?q=l%C3%A1%20phong&imgurl=https%3A%2F%2Fwineandfood.vn%2Fimage%2Fcatalog%2Fanh-bai-viet%2Fcac-loai-thuc-pham-khac%2Fsiro-cay-la-phong%2Fchiec-la-phong.jpg&imgrefurl=https%3A%2F%2Fwineandfood.vn%2Fnhung-su-that-ve-cay-la-phong-khong-phai-ai-cung-biet.html&docid=BupWzr2fi3FnyM&tbnid=ABZ01fBpB1WC_M&vet=12ahUKEwjv5ub53o6XAxU_WOsIHeyDFHMQnPAOegQIPxAA..i&w=837&h=906&hcb=2&ved=2ahUKEwjv5ub53o6XAxU_WOsIHeyDFHMQnPAOegQIPxAA",
};

export default function ProfileSetting() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ISinhVien>(initialProfileData);
  const [formData, setFormData] = useState<ISinhVien>(initialProfileData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProfile(formData);
      setIsEditing(false);
      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      alert("Cập nhật thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="shadow-lg border-muted">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b">
          <div>
            <CardTitle className="text-2xl font-bold">Thông tin tài khoản & Sinh viên</CardTitle>
            <CardDescription className="mt-1">
              Quản lý thông tin cá nhân, học tập và cài đặt tài khoản cá nhân của bạn.
            </CardDescription>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Chỉnh sửa thông tin
            </Button>
          )}
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b">
              <img
                src={profile.avatarUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full border-2 border-primary object-cover shadow-md"
              />
              <div className="text-center sm:text-left space-y-1">
                <h3 className="text-xl font-semibold">{profile.fullName}</h3>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-2">
                  <Badge variant="secondary">MSSV: {profile.studentId}</Badge>
                  <Badge variant="outline">{profile.cohort}</Badge>
                  <Badge className="bg-emerald-600 text-white">CPA: {profile.cpa}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Họ và tên</label>
                {isEditing ? (
                  <Input name="fullName" value={formData.fullName} onChange={handleChange} required />
                ) : (
                  <p className="text-sm py-2 px-3 bg-secondary/30 rounded-md border border-transparent">
                    {profile.fullName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Mã số sinh viên (MSSV)</label>
                <p className="text-sm py-2 px-3 bg-secondary/30 rounded-md border border-transparent text-muted-foreground">
                  {profile.studentId} (Không thể thay đổi)
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Khóa học</label>
                {isEditing ? (
                  <Input name="cohort" value={formData.cohort} onChange={handleChange} />
                ) : (
                  <p className="text-sm py-2 px-3 bg-secondary/30 rounded-md border border-transparent">
                    {profile.cohort}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Chuyên ngành</label>
                {isEditing ? (
                  <Input name="major" value={formData.major} onChange={handleChange} />
                ) : (
                  <p className="text-sm py-2 px-3 bg-secondary/30 rounded-md border border-transparent">
                    {profile.major}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Email trường</label>
                {isEditing ? (
                  <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
                ) : (
                  <p className="text-sm py-2 px-3 bg-secondary/30 rounded-md border border-transparent">
                    {profile.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Số điện thoại</label>
                {isEditing ? (
                  <Input name="phone" value={formData.phone} onChange={handleChange} />
                ) : (
                  <p className="text-sm py-2 px-3 bg-secondary/30 rounded-md border border-transparent">
                    {profile.phone}
                  </p>
                )}
              </div>
            </div>
          </CardContent>

          {isEditing && (
            <CardFooter className="flex justify-end gap-3 border-t bg-secondary/10 py-4 px-6">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
                Hủy (Cancel)
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Đang lưu..." : "Lưu thay đổi (Submit)"}
              </Button>
            </CardFooter>
          )}
        </form>
      </Card>
    </div>
  );
}