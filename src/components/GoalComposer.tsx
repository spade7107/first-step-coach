import { ArrowUp, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { FormEvent, useEffect, useRef } from 'react';

interface GoalComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function GoalComposer({ value, onChange, onSubmit, isLoading }: GoalComposerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 120);
    return () => window.clearTimeout(timer);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoading) {
      onSubmit();
    }
  };

  return (
    <motion.div
      key="goal-composer"
      initial={{ opacity: 0, y: 12, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.985 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="group relative rounded-[26px] bg-white/85 dark:bg-slate-900/75 backdrop-blur-xl border border-slate-200/85 dark:border-white/10 shadow-[0_18px_50px_-15px_rgba(37,99,235,0.14)] dark:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.65)] p-3 sm:p-4 transition-all duration-200 focus-within:border-blue-400/70 dark:focus-within:border-sky-400/50 focus-within:shadow-[0_20px_54px_-14px_rgba(37,99,235,0.22)] dark:focus-within:shadow-[0_24px_64px_-12px_rgba(56,189,248,0.18)]"
      >
        <label htmlFor="goalInput" className="sr-only">
          What do you want to learn?
        </label>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            ref={inputRef}
            id="goalInput"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="What do you want to learn?"
            autoComplete="off"
            disabled={isLoading}
            className="w-full flex-1 bg-transparent px-4 py-3 text-base sm:text-lg text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none disabled:opacity-60"
          />

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={isLoading ? undefined : { y: -1 }}
            whileTap={isLoading ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-[48px] px-6 rounded-[18px] bg-gradient-to-b from-blue-500 to-blue-600 dark:from-sky-400 dark:to-blue-500 hover:from-blue-600 hover:to-blue-700 dark:hover:from-sky-300 dark:hover:to-blue-400 text-white dark:text-slate-950 font-medium text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm shadow-blue-600/20 dark:shadow-sky-500/20 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-sky-400 dark:focus-visible:ring-offset-slate-900 whitespace-nowrap shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Starting</span>
              </>
            ) : (
              <>
                <span>Start</span>
                <ArrowUp className="w-4 h-4" aria-hidden="true" />
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
