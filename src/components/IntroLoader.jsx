import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const SESSION_KEY = "ps_intro_seen";

/**
 * IntroLoader — Signature entrance animation with gold monogram "PS",
 * progress counter simulation, and GSAP curtain wipe exit.
 *
 * Requirements:
 * - Plays ONCE per session (sessionStorage).
 * - Bypassed immediately if prefers-reduced-motion is active.
 * - bg-void (#14151A) + gold-primary (#D5BA84) monogram branding.
 */
export default function IntroLoader({ onComplete }) {
  const containerRef = useRef(null);
  const monogramRef = useRef(null);
  const progressRef = useRef(null);
  const progressBarRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const hasSeenIntro =
      typeof window !== "undefined" &&
      sessionStorage.getItem(SESSION_KEY) === "true";

    if (hasSeenIntro || prefersReducedMotion) {
      sessionStorage.setItem(SESSION_KEY, "true");
      onComplete?.();
      return;
    }

    setShouldRender(true);
  }, [onComplete]);

  useEffect(() => {
    if (!shouldRender) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        monogramRef.current,
        { scale: 0.7, opacity: 0, rotation: -10 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)" }
      );
    }, containerRef);

    let currentVal = 0;
    const interval = setInterval(() => {
      currentVal += Math.floor(Math.random() * 12) + 8;
      if (currentVal >= 100) {
        currentVal = 100;
        clearInterval(interval);
        setProgress(100);

        sessionStorage.setItem(SESSION_KEY, "true");

        setTimeout(() => {
          if (containerRef.current) {
            gsap.to(containerRef.current, {
              yPercent: -100,
              opacity: 0.95,
              duration: 0.75,
              ease: "power3.inOut",
              onComplete: () => {
                setShouldRender(false);
                onComplete?.();
              },
            });
          } else {
            setShouldRender(false);
            onComplete?.();
          }
        }, 200);
      } else {
        setProgress(currentVal);
      }
    }, 60);

    return () => {
      clearInterval(interval);
      ctx.revert();
    };
  }, [shouldRender, onComplete]);

  if (!shouldRender) return null;

  return (
    <div
      ref={containerRef}
      role="status"
      aria-label="Loading PathSeeker Career Passport"
      className="
        fixed inset-0 z-50
        flex flex-col items-center justify-center
        bg-[#14151A] text-[#F9F3EF]
        overflow-hidden select-none
      "
    >
      {/* Background Decorative Radial Glow */}
      <div 
        className="absolute w-96 h-96 rounded-full bg-[#D5BA84]/10 blur-3xl pointer-events-none"
        aria-hidden="true" 
      />

      <div className="relative flex flex-col items-center space-y-6 z-10">
        {/* Monogram Badge */}
        <div
          ref={monogramRef}
          className="
            relative flex items-center justify-center
            w-24 h-24 sm:w-28 sm:h-28
            rounded-3xl
            bg-gradient-to-br from-[#1B2132] to-[#14151A]
            border-2 border-[#D5BA84]
            shadow-[0_0_35px_rgba(243,221,165,0.35)]
          "
        >
          <div className="absolute inset-1.5 rounded-2xl border border-[#D5BA84]/30" />

          <span className="font-display font-bold text-4xl sm:text-5xl text-[#D5BA84] tracking-wider drop-shadow-sm">
            PS
          </span>
        </div>

        {/* Brand Title */}
        <div className="text-center space-y-1">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
            PathSeeker
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-[#D5BA84] font-semibold font-sans">
            Career Passport Platform
          </p>
        </div>

        {/* Progress Bar & Counter */}
        <div className="w-48 sm:w-56 space-y-2 pt-2">
          <div className="h-1.5 w-full bg-[#1B2132] rounded-full overflow-hidden border border-[#66718C]/20">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-[#D5BA84] to-[#F3DDA5] transition-all duration-75 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div
            ref={progressRef}
            className="flex justify-between text-[11px] font-mono text-[#717B94]"
          >
            <span>INITIALIZING PASSPORT</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
