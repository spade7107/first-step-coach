import { Check, Loader2, Minimize2 } from 'lucide-react';
import { motion } from 'motion/react';

interface StepCardProps {
  goal: string;
  stepNumber: number;
  currentStep: string;
  isLoading: boolean;
  pendingAction: 'start' | 'didIt' | 'stuck' | null;
  onStuck: () => void;
  onDidIt: () => void;
}

export function StepCard({
  goal,
  stepNumber,
  currentStep,
  isLoading,
  pendingAction,
  onStuck,
  onDidIt,
}: StepCardProps) {
  return (
    <motion.section
      key="step-card"
      aria-label="Current action"
      initial={{ opacity: 0, y: 14, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.985 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="w-full rounded-[28px] bg-white/88 dark:bg-slate-900/75 backdrop-blur-xl border border-slate-200/85 dark:border-white/10 shadow-[0_20px_56px_-16px_rgba(37,99,235,0.13)] dark:shadow-[0_24px_64px_-16px_rgba(0,0,0,0.65)] p-6 sm:p-9"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-5 border-b border-slate-200/70 dark:border-white/8">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium tracking-wide text-blue-600 dark:text-sky-400">
          <span>Current Action</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
            ·
          </span>
          <span className="font-mono-tabular text-slate-600 dark:text-slate-300">
            Step {stepNumber}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate max-w-[240px] sm:max-w-[320px]">
          {goal}
        </p>
      </div>

      <div className="py-7 sm:py-9" aria-live="polite" aria-atomic="true">
        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-xl sm:text-2xl font-medium leading-relaxed text-slate-900 dark:text-slate-50 text-balance"
        >
          {currentStep}
        </motion.p>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3">
        <motion.button
          type="button"
          onClick={onStuck}
          disabled={isLoading}
          whileTap={isLoading ? undefined : { scale: 0.97 }}
          transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 min-h-[48px] px-5 rounded-2xl bg-slate-100/90 dark:bg-white/[0.05] hover:bg-slate-200/80 dark:hover:bg-white/[0.09] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-white/10 font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-sky-400 whitespace-nowrap"
        >
          {isLoading && pendingAction === 'stuck' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>Shrinking</span>
            </>
          ) : (
            <>
              <Minimize2 className="w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
              <span>I&apos;m stuck</span>
            </>
          )}
        </motion.button>

        <motion.button
          type="button"
          onClick={onDidIt}
          disabled={isLoading}
          whileHover={isLoading ? undefined : { y: -1 }}
          whileTap={isLoading ? undefined : { scale: 0.97 }}
          transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 min-h-[48px] px-5 rounded-2xl bg-gradient-to-b from-blue-500 to-blue-600 dark:from-sky-400 dark:to-blue-500 hover:from-blue-600 hover:to-blue-700 dark:hover:from-sky-300 dark:hover:to-blue-400 text-white dark:text-slate-950 font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 dark:shadow-sky-500/20 transition-colors cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-sky-400 dark:focus-visible:ring-offset-slate-900 whitespace-nowrap"
        >
          {isLoading && pendingAction === 'didIt' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>Loading next</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" strokeWidth={2.25} aria-hidden="true" />
              <span>Did it</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.section>
  );
}
