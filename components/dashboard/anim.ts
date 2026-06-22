export const EASE = [0.16, 1, 0.3, 1] as const;

type AnimType = "fadeUp" | "fadeIn" | "slideLeft" | "slideRight" | "scale";

export function makeAnim(reduced: boolean | null) {
  return function anim(delay: number, type: AnimType = "fadeUp") {
    if (reduced) {
      return { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } };
    }
    if (type === "fadeIn") {
      return { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.7, ease: EASE, delay } };
    }
    if (type === "slideLeft") {
      return { initial: { opacity: 0, x: -48 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.85, ease: EASE, delay } };
    }
    if (type === "slideRight") {
      return { initial: { opacity: 0, x: 80 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.9, ease: EASE, delay } };
    }
    if (type === "scale") {
      return { initial: { opacity: 0, scale: 0.94 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 1.1, ease: EASE, delay } };
    }
    return { initial: { opacity: 0, y: 32 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay } };
  };
}
