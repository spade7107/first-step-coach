import { AlertCircle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md pointer-events-none"
      role="status"
      aria-live="assertive"
    >
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-rose-600 dark:bg-rose-500 text-white shadow-lg shadow-rose-600/25 border border-rose-500/40"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium leading-snug">{message}</span>
            </div>

            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss notification"
              className="min-h-[36px] min-w-[36px] rounded-xl flex items-center justify-center hover:bg-white/15 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
