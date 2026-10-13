"use client";

import { useEffect, useRef } from "react";

type Props = {
  to: number;
  duration?: number;
  /** Thousands separators, e.g. 7,000. */
  grouped?: boolean;
};

/**
 * Renders the final number on the server, then counts up from 0 the first time it scrolls
 * into view (immediately if it is already on screen).
 */
export function CountUp({ to, duration = 1800, grouped = false }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const format = (n: number) => (grouped ? n.toLocaleString("en-US") : String(n));
    let frame = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - (1 - progress) ** 4;
        el.textContent = format(Math.round(eased * to));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    el.textContent = format(0);
    const stop = () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        stop();
        run();
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    // Scrolled past without ever being on screen: show the real number, not 0.
    const onScroll = () => {
      if (el.getBoundingClientRect().bottom >= 0) return;
      stop();
      el.textContent = format(to);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      stop();
      cancelAnimationFrame(frame);
      el.textContent = format(to);
    };
  }, [to, duration, grouped]);

  return <span ref={ref}>{grouped ? to.toLocaleString("en-US") : to}</span>;
}
