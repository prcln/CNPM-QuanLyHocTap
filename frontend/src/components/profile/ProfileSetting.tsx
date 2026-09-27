import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Camera } from "lucide-react";
import { mockDb, type StudentProfile } from "@/api/mockDb";

export default function ProfileSetting() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [formData, setFormData] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // Load dữ liệu từ mockDb ngay khi component được render lần đầu
  useEffect(() => {
    const currentProfile = mockDb.profile.get();
    setProfile(currentProfile);
    setFormData(currentProfile);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setFormData((prev) => (prev ? { ...prev, avatarUrl: localUrl } : null));
    }
  };

  const handleCancel = () => {
    if (profile) setFormData(profile);
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // LƯU VÀO MOCKDB 
      const updated = mockDb.profile.update(formData);
      
      setProfile(updated);
      setFormData(updated);
      setIsEditing(false);
      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      alert("Cập nhật thất bại, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (!profile || !formData) return null;

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
              <div className="relative group">
                <img
                  src={isEditing ? formData.avatarUrl : profile.avatarUrl}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full border-2 border-primary object-cover shadow-md"
                />
                
                {isEditing && (
                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-medium">
                    <Camera className="h-5 w-5 mb-0.5" />
                    <span>Đổi ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>

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