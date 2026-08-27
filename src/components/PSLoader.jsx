import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PSLoader({ onComplete }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    // Preserve scroll position if reloading mid-page
    const savedScrollY = typeof window !== "undefined" ? window.scrollY || window.pageYOffset || 0 : 0;

    // Lock scroll on both html + body to remove scrollbar during loader
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // 2.5 seconds splash display, then smooth wipe upward
    const exitTimer = setTimeout(() => {
      if (!overlayRef.current) {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        onComplete?.();
        return;
      }

      gsap.to(overlayRef.current, {
        yPercent: -100,
        duration: 0.85,
        ease: "power4.inOut",
        onComplete: () => {
          document.documentElement.style.overflow = "";
          document.body.style.overflow = "";

          // Restore exact scroll position if user was scrolled down when reloading
          if (savedScrollY > 0) {
            window.scrollTo({ top: savedScrollY, behavior: "instant" });
          }

          onComplete?.();
        },
      });
    }, 2500);

    return () => {
      clearTimeout(exitTimer);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        overflow: "hidden",
        backgroundColor: "#FAF1EC",
      }}
    >
      <img
        src="/brand/ps-logo.jpg.jpeg"
        alt="Path Seeker"
        draggable={false}
        style={{
          display: "block",
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          objectPosition: "center",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </div>
  );
}
