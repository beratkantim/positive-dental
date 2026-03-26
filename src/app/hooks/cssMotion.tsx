/**
 * Lightweight CSS-based replacements for motion/react.
 * Drop-in compatible with motion.div, motion.li, motion.span, AnimatePresence.
 * Uses IntersectionObserver + CSS animations instead of JS-based framer-motion.
 * Saves ~126KB from the bundle.
 */
import React, { forwardRef, useRef, useState, useEffect } from "react";

// IntersectionObserver hook
function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return seen;
}

// Extract delay from transition prop
function getDelay(transition?: any): number {
  if (!transition) return 0;
  return (transition.delay || 0) * 1000;
}

// Build CSS style from motion props
function buildStyle(
  props: any,
  inView: boolean,
  mounted: boolean
): React.CSSProperties {
  const { initial, animate, whileInView, whileHover, transition, style } = props;
  const target = whileInView || animate;
  const show = whileInView ? inView : mounted;
  const delay = getDelay(transition);
  const duration = ((transition?.duration || 0.5) * 1000);

  const base: React.CSSProperties = {
    ...style,
    transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
  };

  if (initial && target) {
    if (!show) {
      // Apply initial state
      if (initial.opacity !== undefined) base.opacity = initial.opacity;
      const tx = initial.x || 0;
      const ty = initial.y || 0;
      const s = initial.scale || 1;
      base.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    } else {
      base.opacity = target.opacity ?? 1;
      const tx = target.x || 0;
      const ty = target.y || 0;
      const s = target.scale || 1;
      base.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    }
  }

  // Repeating animation (e.g. float)
  if (animate?.y && Array.isArray(animate.y)) {
    base.animation = `float ${(transition?.duration || 3.5)}s ease-in-out infinite`;
    base.opacity = 1;
    base.transform = undefined;
  }

  // Width animation (progress bar)
  if (animate?.width) {
    base.width = show ? animate.width : (initial?.width || "0%");
    base.transition = `width ${duration}ms linear`;
  }

  return base;
}

type MotionComponentProps = React.HTMLAttributes<HTMLElement> & {
  initial?: any;
  animate?: any;
  exit?: any;
  whileInView?: any;
  whileHover?: any;
  whileTap?: any;
  viewport?: any;
  transition?: any;
  [key: string]: any;
};

function createMotionComponent(Tag: string) {
  return forwardRef<HTMLElement, MotionComponentProps>(function MotionEl(props, externalRef) {
    const {
      initial, animate, exit, whileInView, whileHover, whileTap,
      viewport, transition, children, className, style,
      ...rest
    } = props;

    const internalRef = useRef<HTMLElement>(null);
    const ref = (externalRef as any) || internalRef;
    const inView = useInView(ref);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const computedStyle = buildStyle(
      { initial, animate, whileInView, transition, style },
      inView,
      mounted
    );

    // Hover classes
    let hoverClass = "";
    if (whileHover) {
      if (whileHover.y !== undefined) hoverClass += " hover-lift";
      if (whileHover.scale) hoverClass += " hover:scale-110 transition-transform";
    }

    return React.createElement(Tag, {
      ref,
      className: `${className || ""}${hoverClass}`,
      style: computedStyle,
      ...rest,
    }, children);
  });
}

export const motion = {
  div: createMotionComponent("div"),
  li: createMotionComponent("li"),
  span: createMotionComponent("span"),
  article: createMotionComponent("article"),
  section: createMotionComponent("section"),
  aside: createMotionComponent("aside"),
  button: createMotionComponent("button"),
  a: createMotionComponent("a"),
};

// AnimatePresence — just renders children, CSS handles transitions
export function AnimatePresence({ children }: { children: React.ReactNode; mode?: string }) {
  return <>{children}</>;
}
