import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "../context/AuthContext";
import BrandLogo from "./ui/BrandLogo";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 120;

// ── Pre-build image array outside component so it's created once ──
const images = [];
for (let i = 1; i <= TOTAL_FRAMES; i++) {
  const img = new Image();
  img.src = `/passport-frames/ezgif-frame-${String(i).padStart(3, "0")}.png`;
  images.push(img);
}

export default function PassportScrollSequence() {
  const sectionRef   = useRef(null);
  const canvasRef    = useRef(null);
  const frameObj     = useRef({ frame: 0 });
  const [loaded, setLoaded]   = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // ── Detect mobile ──
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Preload all frames ──
  useEffect(() => {
    let count = 0;
    images.forEach((img) => {
      if (img.complete && img.naturalWidth) {
        count++;
        setLoaded((p) => p + 1);
      } else {
        const onLoad = () => {
          count++;
          setLoaded((p) => p + 1);
        };
        img.addEventListener("load",  onLoad, { once: true });
        img.addEventListener("error", onLoad, { once: true });
      }
    });
  }, []);

  // ── Draw helper ──
  const drawFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = images[Math.round(index)];
    if (!img || !img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    canvas.width  = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };

  // ── GSAP scroll sequence (desktop only) ──
  useEffect(() => {
    if (isMobile) return;
    if (loaded < TOTAL_FRAMES) return;

    const section = sectionRef.current;
    const canvas  = canvasRef.current;
    if (!section || !canvas) return;

    // Draw first frame immediately
    drawFrame(0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start:   "top top",
          end:     "+=2500",
          scrub:   0.6,
          pin:     true,
          anticipatePin: 1,
        },
      });

      // Frame sequence
      tl.to(frameObj.current, {
        frame: TOTAL_FRAMES - 1,
        snap:  "frame",
        ease:  "none",
        onUpdate() {
          drawFrame(frameObj.current.frame);
        },
      }, 0);

      // Depth scale (clean scale without artificial double drop-shadow)
      tl.fromTo(canvas,
        { scale: 1 },
        { scale: 1.06, ease: "none" },
        0
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile, loaded]);

  // ── Resize: redraw current frame ──
  useEffect(() => {
    const onResize = () => drawFrame(Math.round(frameObj.current.frame));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const allLoaded = loaded >= TOTAL_FRAMES;

  // ════════════════════════════════════════════════
  //  MOBILE — static middle frame, fade-in, no pin
  // ════════════════════════════════════════════════
  if (isMobile) {
    return (
      <section
        id="hero-sequence"
        className="relative w-full flex flex-col items-center justify-between"
        style={{ minHeight: "100svh", background: "#EAE4DB" }}
      >
        {/* Minimal mobile nav */}
        <MobileHeroNav />

        <div className="flex-1 flex items-center justify-center w-full px-6 py-6">
          {allLoaded ? (
            <img
              src="/passport-frames/ezgif-frame-010.png"
              alt="PathSeeker Career Passport"
              className="w-full max-w-xs sm:max-w-sm object-contain animate-fade-in"
              style={{ borderRadius: 12 }}
            />
          ) : (
            <LoadingSpinner count={loaded} />
          )}
        </div>

        {/* Begin Journey CTA (mobile) */}
        <div className="pb-8 z-20">
          <HeroCTA />
        </div>
      </section>
    );
  }

  // ════════════════════════════════════════════════
  //  DESKTOP — pinned full-viewport scroll sequence
  // ════════════════════════════════════════════════
  return (
    <section
      id="hero-sequence"
      ref={sectionRef}
      className="relative w-full flex flex-col items-center justify-center overflow-hidden"
      style={{ height: "100vh", background: "#EAE4DB" }}
    >
      {/* ── Minimal overlay nav ── */}
      <DesktopHeroNav />

      {/* ── Canvas container: balanced comfortable size, centered ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden" style={{ top: 20, bottom: 50 }}>
        {/* Loading overlay */}
        {!allLoaded && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center"
            style={{ background: "#EAE4DB" }}
          >
            <LoadingSpinner count={loaded} />
          </div>
        )}

        <canvas
          ref={canvasRef}
          style={{
            width: "74vw",
            maxWidth: 1080,
            height: "72vh",
            maxHeight: 720,
            objectFit: "contain",
            display: "block",
            willChange: "transform",
            transformOrigin: "center center",
            mixBlendMode: "multiply",
            WebkitMaskImage: "radial-gradient(ellipse 65% 65% at 50% 50%, black 50%, transparent 95%)",
            maskImage: "radial-gradient(ellipse 65% 65% at 50% 50%, black 50%, transparent 95%)",
          }}
          aria-label="PathSeeker Career Passport rotating 3D view"
        />
      </div>

      {/* ── Begin Journey CTA — bottom center with clear z-index ── */}
      <div className="absolute bottom-7 left-0 right-0 flex justify-center z-30 pointer-events-auto">
        <HeroCTA />
      </div>

      {/* ── Scroll hint ── */}
      <div
        className="absolute bottom-8 right-10 flex flex-col items-center gap-1.5 opacity-50 z-30 pointer-events-none"
        aria-hidden="true"
      >
        <span
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#14151A",
          }}
        >
          SCROLL
        </span>
        <div
          style={{
            width: 1.5,
            height: 28,
            background:
              "linear-gradient(to bottom, #C9A24B, transparent)",
          }}
        />
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function DesktopHeroNav() {
  const { user } = useAuth();
  return (
    <nav
      className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-10"
      style={{ height: 68 }}
    >
      {/* Wordmark + Logo */}
      <Link
        to="/"
        className="flex items-center gap-2.5 group"
        style={{ textDecoration: "none" }}
      >
        <BrandLogo 
          className="w-7 h-7 group-hover:scale-105 transition-transform" 
          rounded="rounded-md"
        />
        <span
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "1.55rem",
            letterSpacing: "0.04em",
            color: "#14151A",
          }}
        >
          PathSeeker
        </span>
      </Link>

      {/* Nav Actions */}
      <div className="flex items-center gap-3">
        {!user ? (
          <>
            <Link to="/login">
              <button
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: "1rem",
                  letterSpacing: "0.03em",
                  color: "#14151A",
                  background: "transparent",
                  border: "1.5px solid transparent",
                  borderRadius: 6,
                  padding: "8px 18px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#C9A24B";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#14151A";
                }}
              >
                Sign In
              </button>
            </Link>
            <Link to="/careers">
              <button
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: "1rem",
                  letterSpacing: "0.03em",
                  color: "#EAE4DB",
                  background: "#14151A",
                  border: "1.5px solid #14151A",
                  borderRadius: 6,
                  padding: "8px 24px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#C9A24B";
                  e.currentTarget.style.borderColor = "#C9A24B";
                  e.currentTarget.style.color = "#14151A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#14151A";
                  e.currentTarget.style.borderColor = "#14151A";
                  e.currentTarget.style.color = "#EAE4DB";
                }}
              >
                Explore Careers
              </button>
            </Link>
          </>
        ) : (
          <Link to="/dashboard">
            <button
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: "1rem",
                letterSpacing: "0.03em",
                color: "#EAE4DB",
                background: "#14151A",
                border: "1.5px solid #14151A",
                borderRadius: 6,
                padding: "8px 24px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#C9A24B";
                e.currentTarget.style.borderColor = "#C9A24B";
                e.currentTarget.style.color = "#14151A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#14151A";
                e.currentTarget.style.borderColor = "#14151A";
                e.currentTarget.style.color = "#EAE4DB";
              }}
            >
              Dashboard
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}

function MobileHeroNav() {
  const { user } = useAuth();
  return (
    <nav className="w-full flex items-center justify-between px-6 pt-6 pb-2 z-30">
      <Link
        to="/"
        className="flex items-center gap-2"
        style={{ textDecoration: "none" }}
      >
        <BrandLogo 
          className="w-6 h-6" 
          rounded="rounded-md"
        />
        <span
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "1.35rem",
            letterSpacing: "0.04em",
            color: "#14151A",
          }}
        >
          PathSeeker
        </span>
      </Link>
      <div className="flex items-center gap-2">
        {!user ? (
          <>
            <Link to="/login">
              <button
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: "0.9rem",
                  color: "#14151A",
                  background: "transparent",
                  border: "none",
                  padding: "6px 10px",
                  cursor: "pointer",
                }}
              >
                Sign In
              </button>
            </Link>
            <Link to="/careers">
              <button
                style={{
                  fontFamily: "'DM Serif Display', Georgia, serif",
                  fontSize: "0.9rem",
                  letterSpacing: "0.03em",
                  color: "#EAE4DB",
                  background: "#14151A",
                  border: "1.5px solid #14151A",
                  borderRadius: 6,
                  padding: "6px 14px",
                  cursor: "pointer",
                }}
              >
                Explore
              </button>
            </Link>
          </>
        ) : (
          <Link to="/dashboard">
            <button
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: "0.95rem",
                letterSpacing: "0.03em",
                color: "#EAE4DB",
                background: "#14151A",
                border: "1.5px solid #14151A",
                borderRadius: 6,
                padding: "6px 18px",
                cursor: "pointer",
              }}
            >
              Dashboard
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}

function HeroCTA() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Label — dark navy, crisp & clear */}
      <span
        style={{
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontSize: "0.95rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#14151A",
          opacity: 0.85,
        }}
      >
        Career Passport · 2026
      </span>

      {/* Button — solid dark fill with DM Serif Display typography leading to Career Bank */}
      <Link to="/careers">
        <button
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "1.2rem",
            lineHeight: "1.2",
            letterSpacing: "0.03em",
            color: "#FFFFFF",
            background: "#14151A",
            border: "1.5px solid #14151A",
            borderRadius: 6,
            padding: "10px 36px",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(20, 21, 26, 0.18)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#C9A24B";
            e.currentTarget.style.borderColor = "#C9A24B";
            e.currentTarget.style.color = "#14151A";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(201, 162, 75, 0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#14151A";
            e.currentTarget.style.borderColor = "#14151A";
            e.currentTarget.style.color = "#FFFFFF";
            e.currentTarget.style.boxShadow = "0 4px 14px rgba(20, 21, 26, 0.18)";
          }}
        >
          Begin Journey
        </button>
      </Link>
    </div>
  );
}

function LoadingSpinner({ count }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        style={{
          width: 32,
          height: 32,
          border: "2px solid #C9A24B",
          borderTopColor: "transparent",
          borderRadius: "50%",
          animation: "spin 0.9s linear infinite",
        }}
      />
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          color: "#14151A",
          opacity: 0.7,
        }}
      >
        Loading frames... {count}/{TOTAL_FRAMES}
      </span>
    </div>
  );
}
