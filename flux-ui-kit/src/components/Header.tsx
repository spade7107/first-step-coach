import { Moon, Sun, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { ThemeMode } from '../types/coach';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const isDark = theme === 'dark';

  return (
    <header className="relative z-20 w-full max-w-6xl mx-auto px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-6">
      <div className="flex items-center gap-3 min-w-0">
        <div
          aria-hidden="true"
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-400 dark:from-sky-400 dark:via-blue-500 dark:to-indigo-500 flex items-center justify-center shadow-sm shadow-blue-500/20 shrink-0"
        >
          <Zap className="w-4 h-4 text-white fill-white/20" strokeWidth={2.25} />
        </div>
        <span className="font-display text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap truncate">
          First-Step Coach
        </span>
      </div>

      <motion.button
        type="button"
        onClick={onToggleTheme}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-pressed={isDark}
        className="min-h-[44px] min-w-[44px] px-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white/75 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-800/85 border border-slate-200/80 dark:border-white/10 backdrop-blur-md shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-sky-400 shrink-0 whitespace-nowrap"
      >
        {isDark ? (
          <>
            <Sun className="w-4 h-4 text-amber-300" aria-hidden="true" />
            <span className="hidden sm:inline">Light</span>
          </>
        ) : (
          <>
            <Moon className="w-4 h-4 text-indigo-600" aria-hidden="true" />
            <span className="hidden sm:inline">Dark</span>
          </>
        )}
      </motion.button>
    </header>
  );
}
