export type ThemeMode = 'light' | 'dark';

export type CoachHistoryAction = 'start' | 'didIt' | 'next' | 'stuck' | 'shrink';

export interface HistoryEntry {
  action: CoachHistoryAction;
  step: string;
}

export interface CoachState {
  goal: string;
  currentStep: string;
  stepNumber: number;
  history: HistoryEntry[];
}

export interface TrailItem {
  id: string;
  stepNumber: number;
  text: string;
  outcome: 'completed' | 'refined';
}
