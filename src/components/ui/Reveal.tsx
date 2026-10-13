"use client";

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  as?: "div" | "li" | "ul" | "ol";
  className?: string;
  /**
   * How the element itself enters. "none" leaves it in place so only its parts animate
   * (split headings, `.stagger` children, `.draw-x` lines, `.pop` badges).
   */
  variant?: "up" | "fade" | "scale" | "clip" | "none";
  /** Stagger in ms, applied as a transition delay. */
  delay?: number;
  style?: React.CSSProperties;
};

/**
 * Animates content when it scrolls into view. Server HTML is fully visible, and only
 * elements still below the fold get hidden on mount, so nothing flashes and no-JS works.
 */
export function Reveal({ children, as: Tag = "div", className = "", variant = "up", delay = 0, style }: Props) {
  const ref = useRef<HTMLDivElement & HTMLLIElement & HTMLUListElement & HTMLOListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    el.dataset.reveal = "hidden";
    const show = () => {
      el.dataset.reveal = "shown";
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && show(), {
      threshold: variant === "clip" ? 0 : 0.12,
      rootMargin: "0px 0px -80px 0px",
    });
    // A fully clipped element has no visible area, so the observer would never fire for it;
    // watch its (unclipped) parent instead.
    observer.observe(variant === "clip" ? (el.parentElement ?? el) : el);
    // If the page jumps past it (anchor link, restored scroll), don't leave it hidden.
    const onScroll = () => el.getBoundingClientRect().bottom < 0 && show();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [variant]);

  return (
    <Tag
      ref={ref}
      data-variant={variant}
      className={`reveal ${className}`}
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
    >
      {children}
    </Tag>
  );
}
