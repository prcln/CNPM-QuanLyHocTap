import { GraduationCap, ArrowRight, Sun, Moon, Sparkles, BookOpen } from 'lucide-react'
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 transition-colors">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        {/* Brand Logo */}
        <div
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-cyan-700 text-white shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform duration-200">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-700 dark:from-sky-400 dark:to-blue-300">
                CNPM • QLHT
              </span>
              <Badge variant="outline" className="text-[10px] uppercase font-semibold tracking-wider text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800 bg-sky-50/70 dark:bg-sky-950/40">
                Weamis Edition
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block font-medium">
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
            className="h-9 w-9 rounded-full border border-border/60 hover:bg-accent"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
          </Button>

          {/* Enter / Back to Portal CTA */}
          {activeView === 'landing' ? (
            <Button
              onClick={onEnterPortal}
              className="relative overflow-hidden rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-700 hover:from-sky-700 hover:to-blue-700 text-white font-medium shadow-md shadow-sky-500/25 px-5 h-9 group transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                <span>Cổng Sinh Viên</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Button>
          ) : (
            <Badge variant="secondary" className="px-3 py-1 font-semibold flex items-center gap-1.5 text-xs bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
              <Sparkles className="h-3.5 w-3.5 text-sky-500" />
              <span>Cổng Sinh Viên Đang Mở</span>
            </Badge>
          )}
        </div>
      </div>
    </header>
  )
}
