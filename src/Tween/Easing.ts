/**
 * All those formulas are taken from https://easings.net/
 * Easing Functions Cheat Sheet
 */

export function easeOut(progress: number): number {
  return 1 - (1 - progress) ** 2;
}

export function easeOutCubic(progress: number): number {
  return 1 - Math.pow(1 - progress, 3);
}

export function easeInOutBack(progress: number): number {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;

  return progress < 0.5
    ? (Math.pow(2 * progress, 2) * ((c2 + 1) * 2 * progress - c2)) / 2
    : (Math.pow(2 * progress - 2, 2) * ((c2 + 1) * (progress * 2 - 2) + c2) +
        2) /
        2;
}

export function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export function easeInExpo(x: number): number {
  return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}
