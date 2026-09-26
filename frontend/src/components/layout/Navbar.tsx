import { ArrowRight, Sun, Moon, Sparkles, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface NavbarProps {
  onEnterPortal: () => void
  isDark: boolean
  toggleDarkMode: () => void
  activeView: 'landing' | 'portal'
  onNavigateHome: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  onEnterPortal,
  isDark,
  toggleDarkMode,
  activeView,
  onNavigateHome,
}) => {
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
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>Về Trang Giới Thiệu</span>
            </button>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
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

          {/* Enter / Back to Portal CTA */}
          {activeView === 'landing' ? (
            <Button
              onClick={onEnterPortal}
              className="relative overflow-hidden rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-700 hover:from-sky-700 hover:to-blue-700 text-white font-semibold shadow-md shadow-sky-500/25 px-5 h-10 text-sm group transition-all duration-200 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span>Cổng Sinh Viên</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Button>
          ) : (
            <Badge variant="secondary" className="px-3.5 py-1.5 font-bold flex items-center gap-1.5 text-xs bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
              <Sparkles className="h-4 w-4 text-sky-500" />
              <span>Cổng Sinh Viên Đang Mở</span>
            </Badge>
          )}
        </div>
      </div>
    </header>
  )
}
