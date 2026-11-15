import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildCoachMessages, requestCoachStep } from '../services/coachApi';
import { CoachState, TrailItem } from '../types/coach';
import { triggerHaptic } from '../utils/haptics';

const STATE_STORAGE_KEY = 'firstStepCoachState';

const INITIAL_STATE: CoachState = {
  goal: '',
  currentStep: '',
  stepNumber: 1,
  history: [],
};

function loadInitialState(): CoachState {
  if (typeof window === 'undefined') return INITIAL_STATE;
  try {
    const raw = localStorage.getItem(STATE_STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return {
        goal: typeof parsed.goal === 'string' ? parsed.goal : '',
        currentStep: typeof parsed.currentStep === 'string' ? parsed.currentStep : '',
        stepNumber: typeof parsed.stepNumber === 'number' && parsed.stepNumber >= 1 ? parsed.stepNumber : 1,
        history: Array.isArray(parsed.history) ? parsed.history : [],
      };
    }
  } catch {
    // Fallback cleanly if saved state is malformed
  }
  return INITIAL_STATE;
}

export function useCoach() {
  const [state, setState] = useState<CoachState>(loadInitialState);
  const [goalDraft, setGoalDraft] = useState<string>(() => loadInitialState().goal);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<'start' | 'didIt' | 'stuck' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const persistState = useCallback((next: CoachState) => {
    setState(next);
    try {
      localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 3200);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToastMessage(null);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const startGoal = useCallback(async () => {
    const trimmed = goalDraft.trim();
    if (!trimmed) {
      triggerHaptic('error');
      showToast('Please enter a goal first.');
      return;
    }

    triggerHaptic('tap');
    const nextState: CoachState = {
      goal: trimmed,
      currentStep: '',
      stepNumber: 1,
      history: [],
    };
    persistState(nextState);

    setIsLoading(true);
    setPendingAction('start');
    try {
      const messages = buildCoachMessages(
        trimmed,
        [],
        `My learning goal is: "${trimmed}". Please give me the very first tiny action to start.`,
      );
      const step = await requestCoachStep(messages);
      persistState({
        ...nextState,
        currentStep: step,
        history: [{ action: 'start', step }],
      });
      triggerHaptic('success');
    } catch (error) {
      console.error(error);
      triggerHaptic('error');
      showToast('Failed to get a step. Check backend/API key.');
    } finally {
      setIsLoading(false);
      setPendingAction(null);
    }
  }, [goalDraft, persistState, showToast]);

  const handleDidIt = useCallback(async () => {
    if (!state.goal || !state.currentStep || isLoading) return;

    triggerHaptic('success');
    const updatedHistory = [...state.history, { action: 'didIt' as const, step: state.currentStep }];
    const incrementedState: CoachState = {
      ...state,
      stepNumber: state.stepNumber + 1,
      history: updatedHistory,
    };
    persistState(incrementedState);

    setIsLoading(true);
    setPendingAction('didIt');
    try {
      const messages = buildCoachMessages(
        state.goal,
        updatedHistory,
        'Did it. What is the next tiny step?',
      );
      const step = await requestCoachStep(messages);
      persistState({
        ...incrementedState,
        currentStep: step,
        history: [...updatedHistory, { action: 'next', step }],
      });
    } catch (error) {
      console.error(error);
      triggerHaptic('error');
      showToast('Failed to get next step. Try again.');
    } finally {
      setIsLoading(false);
      setPendingAction(null);
    }
  }, [isLoading, persistState, showToast, state]);

  const handleStuck = useCallback(async () => {
    if (!state.goal || !state.currentStep || isLoading) return;

    triggerHaptic('soft');
    const updatedHistory = [...state.history, { action: 'stuck' as const, step: state.currentStep }];
    const stuckState: CoachState = {
      ...state,
      history: updatedHistory,
    };
    persistState(stuckState);

    setIsLoading(true);
    setPendingAction('stuck');
    try {
      const messages = buildCoachMessages(
        state.goal,
        updatedHistory,
        `I'm stuck on this step: "${state.currentStep}". Please shrink it into an even smaller micro-step.`,
      );
      const step = await requestCoachStep(messages);
      persistState({
        ...stuckState,
        currentStep: step,
        history: [...updatedHistory, { action: 'shrink', step }],
      });
    } catch (error) {
      console.error(error);
      triggerHaptic('error');
      showToast('Failed to shrink step. Try again.');
    } finally {
      setIsLoading(false);
      setPendingAction(null);
    }
  }, [isLoading, persistState, showToast, state]);

  const handleReset = useCallback(() => {
    triggerHaptic('tap');
    persistState(INITIAL_STATE);
    setGoalDraft('');
    dismissToast();
  }, [dismissToast, persistState]);

  const trailItems = useMemo<TrailItem[]>(() => {
    const items: TrailItem[] = [];
    let currentIndex = 1;

    state.history.forEach((entry, idx) => {
      if (entry.action === 'didIt') {
        items.push({
          id: `${idx}-${currentIndex}-done`,
          stepNumber: currentIndex,
          text: entry.step,
          outcome: 'completed',
        });
        currentIndex += 1;
      } else if (entry.action === 'stuck') {
        items.push({
          id: `${idx}-${currentIndex}-stuck`,
          stepNumber: currentIndex,
          text: entry.step,
          outcome: 'refined',
        });
      }
    });

    return items;
  }, [state.history]);

  const isActiveStep = Boolean(state.goal && state.currentStep);

  return {
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
  };
}
