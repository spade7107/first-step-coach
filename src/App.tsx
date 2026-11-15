import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { GoalComposer } from './components/GoalComposer';
import { Header } from './components/Header';
import { StepCard } from './components/StepCard';
import { StepsTrail } from './components/StepsTrail';
import { Toast } from './components/Toast';
import { useCoach } from './hooks/useCoach';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    state,
    goalDraft,
    setGoalDraft,
    isLoading,
    pendingAction,
    isActiveStep,
    trailItems,
    toastMessage,
    dismissToast,
    startGoal,
    handleDidIt,
    handleStuck,
    handleReset,
  } = useCoach();

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen flex flex-col bg-[#f8faff] dark:bg-[#060b18] text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-300">
        {/* Blended pastel sky gradient & architectural grid backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 sky-gradient-light dark:sky-gradient-dark transition-opacity duration-500"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 pastel-grid-pattern"
        />

        <Header theme={theme} onToggleTheme={toggleTheme} />

        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-16">
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
            <motion.div
              layout="position"
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-8 sm:mb-10"
            >
              <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white text-balance mb-3">
                First-Step Coach
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                No roadmaps. Just one tiny action.
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {isActiveStep ? (
                <StepCard
                  key="active-step-card"
                  goal={state.goal}
                  stepNumber={state.stepNumber}
                  currentStep={state.currentStep}
                  isLoading={isLoading}
                  pendingAction={pendingAction}
                  onStuck={handleStuck}
                  onDidIt={handleDidIt}
                />
              ) : (
                <GoalComposer
                  key="goal-composer-card"
                  value={goalDraft}
                  onChange={setGoalDraft}
                  onSubmit={startGoal}
                  isLoading={isLoading}
                />
              )}
            </AnimatePresence>

            {isActiveStep && <StepsTrail items={trailItems} />}

            <footer className="mt-8 sm:mt-10 flex justify-center">
              <button
                type="button"
                onClick={handleReset}
                className="min-h-[44px] px-4 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 underline underline-offset-4 decoration-slate-300 dark:decoration-slate-600 hover:decoration-slate-500 dark:hover:decoration-slate-300 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-sky-400 rounded-xl"
              >
                Start over
              </button>
            </footer>
          </div>
        </main>

        <Toast message={toastMessage} onDismiss={dismissToast} />
      </div>
    </MotionConfig>
  );
}
