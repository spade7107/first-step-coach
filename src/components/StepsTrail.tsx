import { Check, ChevronDown, Minimize2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { TrailItem } from '../types/coach';
import { triggerHaptic } from '../utils/haptics';

interface StepsTrailProps {
  items: TrailItem[];
}

export function StepsTrail({ items }: StepsTrailProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (items.length === 0) {
    return null;
  }

  const completedCount = items.filter((item) => item.outcome === 'completed').length;

  const handleToggle = () => {
    triggerHaptic('tap');
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="w-full mt-4">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls="completed-steps-trail"
        className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl flex items-center justify-between gap-3 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-900/50 hover:bg-white/85 dark:hover:bg-slate-900/75 border border-slate-200/75 dark:border-white/8 backdrop-blur-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-sky-400"
      >
        <span className="flex items-center gap-2">
          <span>Completed steps</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
            ·
          </span>
          <span className="font-mono-tabular text-slate-500 dark:text-slate-400">
            {completedCount} completed{items.length > completedCount ? `, ${items.length - completedCount} refined` : ''}
          </span>
        </span>

        <ChevronDown
          className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="completed-steps-trail"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2 rounded-2xl bg-white/75 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/75 dark:border-white/8 divide-y divide-slate-200/65 dark:divide-white/6 overflow-hidden"
          >
            <ol className="list-none m-0 p-0">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="px-4 py-3.5 flex items-start gap-3 text-sm leading-relaxed"
                >
                  <span
                    className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      item.outcome === 'completed'
                        ? 'bg-blue-500/12 dark:bg-sky-400/15 text-blue-600 dark:text-sky-400'
                        : 'bg-slate-500/12 dark:bg-slate-400/15 text-slate-600 dark:text-slate-400'
                    }`}
                    aria-hidden="true"
                  >
                    {item.outcome === 'completed' ? (
                      <Check className="w-3 h-3" strokeWidth={2.5} />
                    ) : (
                      <Minimize2 className="w-3 h-3" strokeWidth={2.2} />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-0.5">
                      <span className="font-mono-tabular">Step {item.stepNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.outcome === 'completed' ? 'Completed' : 'Refined'}</span>
                    </div>
                    <p
                      className={`text-slate-800 dark:text-slate-200 ${
                        item.outcome === 'refined' ? 'opacity-75' : ''
                      }`}
                    >
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
