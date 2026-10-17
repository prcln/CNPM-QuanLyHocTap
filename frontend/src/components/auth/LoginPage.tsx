import React, { useState, useEffect } from 'react'
import {
  User,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  School,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  Server,
  Zap,
  HelpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { apiClient } from '@/api/client'
import { DEMO_ACCOUNTS, type DemoAccount } from '@/api/authApi'

interface LoginPageProps {
  onSuccess: () => void
  onBackToLanding: () => void
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onBackToLanding }) => {
  const { login, isLoading, error, clearError } = useAuth()

  const [username, setUsername] = useState('sv_20210001')
  const [password, setPassword] = useState('123456')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [activeRoleTab, setActiveRoleTab] = useState<'SV' | 'GV' | 'AD'>('SV')
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null)
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [loginSuccessNotice, setLoginSuccessNotice] = useState(false)

  // Check backend status on mount
  useEffect(() => {
    let isMounted = true
    apiClient.checkBackendHealth().then((isAvailable) => {
      if (isMounted) setBackendOnline(isAvailable)
    })
    return () => {
      isMounted = false
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    if (!username.trim() || !password) return

    try {
      await login({ username: username.trim(), password }, rememberMe)
      setLoginSuccessNotice(true)
      setTimeout(() => {
        onSuccess()
      }, 600)
    } catch {
      // Error handled by AuthContext
    }
  }

  const handleSelectDemo = (account: DemoAccount) => {
    clearError()
    setUsername(account.username)
    setPassword(account.password)
    setActiveRoleTab(account.role)
  }

  const handleTabChange = (role: 'SV' | 'GV' | 'AD') => {
    setActiveRoleTab(role)
    const matched = DEMO_ACCOUNTS.find((a) => a.role === role)
    if (matched) {
      setUsername(matched.username)
      setPassword(matched.password)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-background">
      {/* Background ambient decorative glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-sky-500/5 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-lg z-10 space-y-4">
        {/* Top return navigation link */}
        <div className="flex items-center justify-between px-1">
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Quay lại Trang Giới Thiệu</span>
          </button>

          {/* Backend Status indicator badge */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">Trạng thái API:</span>
            <Badge
              variant="outline"
              className={`text-[10px] px-2 py-0.5 font-bold flex items-center gap-1.5 ${
                backendOnline
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <Server className="h-3 w-3" />
              <span>{backendOnline ? 'REST API (Port 3000)' : 'Mock Database Layer'}</span>
            </Badge>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border border-border/80 shadow-2xl backdrop-blur-xl bg-card/90 rounded-2xl overflow-hidden transition-all duration-300">
          <CardHeader className="space-y-3 pb-4 pt-6 sm:pt-8 text-center border-b border-border/40 bg-gradient-to-b from-primary/5 to-transparent">
            {/* Logo and system title */}
            <div className="mx-auto flex items-center justify-center gap-2.5">
              <img
                src="/logo-icon.png"
                alt="Logo CNPM QLHT"
                className="h-12 w-auto object-contain drop-shadow-sm"
              />
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 dark:from-sky-400 dark:to-cyan-300">
                    CNPM • QLHT
                  </span>
                  <Badge variant="outline" className="text-[10px] font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800">
                    Weamis
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground font-medium">Hệ Thống Quản Lý Học Tập Thông Minh</p>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <CardTitle className="text-xl sm:text-2xl font-black text-foreground">
                Đăng Nhập Hệ Thống
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Chọn vai trò và sử dụng tài khoản cán bộ, giảng viên hoặc sinh viên
              </CardDescription>
            </div>

            {/* Role Selection Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-muted/60 rounded-xl border border-border/60">
              <button
                type="button"
                onClick={() => handleTabChange('SV')}
                className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeRoleTab === 'SV'
                    ? 'bg-card text-foreground shadow-sm shadow-black/5 font-bold border border-border/80'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/40'
                }`}
              >
                <GraduationCap className={`h-3.5 w-3.5 ${activeRoleTab === 'SV' ? 'text-sky-600 dark:text-sky-400' : ''}`} />
                <span>Sinh viên</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('GV')}
                className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeRoleTab === 'GV'
                    ? 'bg-card text-foreground shadow-sm shadow-black/5 font-bold border border-border/80'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/40'
                }`}
              >
                <School className={`h-3.5 w-3.5 ${activeRoleTab === 'GV' ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                <span>Giảng viên</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('AD')}
                className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeRoleTab === 'AD'
                    ? 'bg-card text-foreground shadow-sm shadow-black/5 font-bold border border-border/80'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/40'
                }`}
              >
                <ShieldAlert className={`h-3.5 w-3.5 ${activeRoleTab === 'AD' ? 'text-amber-600 dark:text-amber-400' : ''}`} />
                <span>Quản trị</span>
              </button>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-5">
            {/* Error Banner */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs animate-in fade-in duration-200">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium leading-relaxed">{error}</div>
              </div>
            )}

            {/* Success Banner */}
            {loginSuccessNotice && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span className="font-semibold">Đăng nhập thành công! Đang chuyển hướng vào cổng...</span>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Tên đăng nhập / Mã định danh</span>
                  <span className="text-[11px] text-muted-foreground font-normal">
                    {activeRoleTab === 'SV' ? 'MSSV' : activeRoleTab === 'GV' ? 'Mã GV' : 'Username'}
                  </span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      clearError()
                    }}
                    placeholder={
                      activeRoleTab === 'SV'
                        ? 'sv_20210001'
                        : activeRoleTab === 'GV'
                        ? 'gv_huong'
                        : 'admin'
                    }
                    className="h-10 pl-9 pr-3 text-sm rounded-xl bg-muted/30 focus-visible:ring-primary/40 focus-visible:border-primary font-medium"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">Mật khẩu</label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] font-medium text-primary hover:underline cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      clearError()
                    }}
                    placeholder="Nhập mật khẩu..."
                    className="h-10 pl-9 pr-10 text-sm rounded-xl bg-muted/30 focus-visible:ring-primary/40 focus-visible:border-primary font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me checkbox */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary h-3.5 w-3.5 accent-sky-600"
                  />
                  <span className="text-xs text-muted-foreground font-medium">Ghi nhớ đăng nhập</span>
                </label>
              </div>

              {/* Submit CTA Button */}
              <Button
                type="submit"
                disabled={isLoading || loginSuccessNotice}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-700 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-sky-600/25 transition-all duration-200 cursor-pointer disabled:opacity-70 group"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang kiểm tra xác thực...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>Đăng Nhập Vào Hệ Thống</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>

            {/* Quick Demo Accounts Selection */}
            <div className="pt-2 border-t border-border/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Tài khoản mẫu dùng thử (1-Click Fill)</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DEMO_ACCOUNTS.map((acc) => {
                  const isSelected = username === acc.username && activeRoleTab === acc.role
                  return (
                    <button
                      key={acc.username}
                      type="button"
                      onClick={() => handleSelectDemo(acc)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'border-sky-500/80 bg-sky-50/70 dark:bg-sky-950/50 shadow-sm'
                          : 'border-border/70 hover:border-border hover:bg-muted/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[11px] text-foreground">{acc.roleLabel}</span>
                        <Badge variant="outline" className={`text-[9px] px-1 py-0 ${acc.badgeColor}`}>
                          {acc.role}
                        </Badge>
                      </div>
                      <p className="font-mono text-[11px] font-semibold text-primary truncate">{acc.username}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{acc.password}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          </CardContent>

          <CardFooter className="py-3 px-6 bg-muted/30 border-t border-border/40 flex items-center justify-center text-center">
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-sky-500 shrink-0" />
              <span>Hệ thống bảo vệ bằng JWT Refresh Token Rotation & Phân quyền RBAC</span>
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-card border border-border max-w-sm w-full p-6 rounded-2xl shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">Hỗ Trợ Khôi Phục Mật Khẩu</h3>
                <p className="text-xs text-muted-foreground">Phòng Đào Tạo & Quản Lý Sinh Viên</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Theo quy định bảo mật của Trường, để cấp lại mật khẩu tài khoản học tập, vui lòng liên hệ trực tiếp:
            </p>
            <div className="text-xs space-y-1.5 p-3 rounded-xl bg-muted/60 border border-border/60">
              <p>📍 <strong>Địa điểm:</strong> Bàn 1 - Phòng Đào Tạo (Tòa nhà C1)</p>
              <p>📧 <strong>Email hỗ trợ:</strong> daotao@hust.edu.vn</p>
              <p>🔑 <strong>Tài khoản dùng thử:</strong> Xem danh sách tài khoản mẫu có sẵn trên trang đăng nhập.</p>
            </div>
            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setShowForgotModal(false)}
                className="rounded-xl px-5 h-9 text-xs font-semibold"
              >
                Đã hiểu
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
