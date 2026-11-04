import React from 'react'
import { ArrowRight, Sun, Moon, Sparkles, BookOpen, LogIn, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/context/AuthContext'

interface NavbarProps {
  onEnterPortal: () => void
  isDark: boolean
  toggleDarkMode: () => void
  activeView: 'landing' | 'portal' | 'login'
  onNavigateHome: () => void
  onNavigateLogin: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  onEnterPortal,
  isDark,
  toggleDarkMode,
  activeView,
  onNavigateHome,
  onNavigateLogin,
}) => {
  const { user, isAuthenticated, logout } = useAuth()

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'AD':
        return { label: 'Quản trị', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800' }
      case 'GV':
        return { label: 'Giảng viên', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800' }
      case 'SV':
      default:
        return { label: 'Sinh viên', color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-300 dark:border-sky-800' }
    }
  }

  const roleInfo = getRoleBadge(user?.role)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 transition-colors shadow-2xs">
      <div className="container mx-auto flex h-20 sm:h-22 max-w-7xl items-center justify-between px-4 sm:px-8">
        {/* Brand Logo */}
        <div
          onClick={onNavigateHome}
          className="flex items-center gap-4 cursor-pointer group"
        >
          <img
            src="/logo-icon.png"
            alt="Logo CNPM QLHT"
            className="h-14 sm:h-16 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform duration-200 drop-shadow-sm"
          />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2.5">
              <span className="font-black tracking-tight text-xl sm:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 dark:from-sky-400 dark:to-cyan-300">
                CNPM • QLHT
              </span>
              <Badge variant="outline" className="text-[11px] uppercase font-bold tracking-wider text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800 bg-sky-50/80 dark:bg-sky-950/50 px-2 py-0.5">
                Weamis Edition
              </Badge>
            </div>
            <p className="text-xs sm:text-[13px] text-muted-foreground hidden sm:block font-medium">
              Cổng Quản Lý Học Tập Sinh Viên Thông Minh
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          {activeView === 'landing' ? (
            <>
              <a href="#features" className="hover:text-foreground transition-colors">
                Tính năng
              </a>
              <a href="#quyche" className="hover:text-foreground transition-colors">
                Quy chế tín chỉ
              </a>
              <a href="#faq" className="hover:text-foreground transition-colors">
                Hỏi đáp (FAQ)
              </a>
            </>
          ) : (
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
            >
              <BookOpen className="h-4 w-4" />
              <span>Về Trang Giới Thiệu</span>
            </button>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme switcher */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="h-10 w-10 rounded-full border border-border/60 hover:bg-accent cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
          </Button>

          {/* Authentication & Portal Actions */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              {/* User Chip */}
              <div
                onClick={onEnterPortal}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/70 bg-card/60 hover:bg-accent/60 cursor-pointer transition-colors"
                title="Vào Cổng Học Tập"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 via-blue-600 to-cyan-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                  {user.fullName ? user.fullName.split(' ').slice(-1)[0][0] : <User className="h-3.5 w-3.5" />}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground leading-tight truncate max-w-[120px]">
                    {user.fullName}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-none">
                    {user.studentId || user.lecturerId || user.username}
                  </p>
                </div>
                <Badge variant="outline" className={`text-[9px] px-1.5 py-0 font-bold ml-1 ${roleInfo.color}`}>
                  {roleInfo.label}
                </Badge>
              </div>

              {activeView !== 'portal' ? (
                <Button
                  onClick={onEnterPortal}
                  className="rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-700 hover:from-sky-700 hover:to-blue-700 text-white font-semibold shadow-md shadow-sky-500/25 px-4 h-10 text-xs sm:text-sm cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <span>Vào Cổng Học Tập</span>
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
              ) : (
                <Badge variant="secondary" className="hidden lg:flex px-3 py-1 font-bold items-center gap-1.5 text-xs bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                  <Sparkles className="h-3.5 w-3.5 text-sky-500" />
                  <span>Cổng Đang Mở</span>
                </Badge>
              )}

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  logout()
                  onNavigateLogin()
                }}
                className="h-10 w-10 rounded-xl border border-border/60 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 cursor-pointer"
                title="Đăng xuất khỏi hệ thống"
                aria-label="Đăng xuất"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Login Button */}
              {activeView !== 'login' && (
                <Button
                  variant="outline"
                  onClick={onNavigateLogin}
                  className="rounded-xl border-border/80 hover:bg-accent font-semibold h-10 px-3.5 sm:px-4 text-xs sm:text-sm cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <LogIn className="h-4 w-4 text-primary" />
                    <span>Đăng Nhập</span>
                  </span>
                </Button>
              )}

              {/* Enter Portal CTA */}
              {activeView === 'landing' && (
                <Button
                  onClick={onEnterPortal}
                  className="relative overflow-hidden rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-700 hover:from-sky-700 hover:to-blue-700 text-white font-semibold shadow-md shadow-sky-500/25 px-4 sm:px-5 h-10 text-xs sm:text-sm group transition-all duration-200 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span>Cổng Sinh Viên</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
