export type HapticPattern = 'tap' | 'success' | 'soft' | 'error';

const PATTERNS: Record<HapticPattern, number | number[]> = {
  tap: 10,
  soft: 14,
  success: [12, 32, 18],
  error: [20, 40, 20],
};

/**
 * Triggers subtle tactile vibration on supported devices (mobile browsers / Android Chrome)
 * while silently no-oping on platforms without navigator.vibrate.
 */
export function triggerHaptic(pattern: HapticPattern = 'tap'): void {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return;
  }

  try {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (typeof navigator.vibrate === 'function') {
      navigator.vibrate(PATTERNS[pattern]);
    }
  } catch {
    // Ignore unsupported vibration calls in restricted browser contexts
  }
}
