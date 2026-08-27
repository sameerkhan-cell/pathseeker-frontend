import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * useCardGridEntrance — Smooth GSAP entrance animation for grids of cards.
 * Automatically respects prefers-reduced-motion.
 * Fires once per grid mount on scroll entry (start: "top 85%").
 */
export default function useCardGridEntrance(selector = ".animate-card-item", dependencies = []) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const cards = containerRef.current.querySelectorAll(selector);
    if (!cards || cards.length === 0) return;

    if (prefersReducedMotion) {
      gsap.set(cards, { opacity: 1, y: 0 });
      return;
    }

    // Set initial state
    gsap.set(cards, { opacity: 0, y: 24 });

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.07,
          ease: "power2.out",
          overwrite: "auto",
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [selector, ...dependencies]);

  return containerRef;
}
