import { Link } from "react-router-dom";
import { Compass, Sparkles, Heart, Shield, BookOpen, ExternalLink } from "lucide-react";
import BrandLogo from "./ui/BrandLogo";

export default function Footer() {
  return (
    <footer className="w-full bg-card border-t border-border-subtle mt-auto theme-transition">
      {/* Top Footer Section */}
      <div className="container-app py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column (2 cols wide on large) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <BrandLogo 
                className="w-8 h-8 group-hover:scale-105 transition-all duration-200" 
                rounded="rounded-lg"
              />
              <div className="flex flex-col">
                <span className="font-heading text-xl font-bold tracking-tight text-text-primary">
                  PathSeeker
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-widest text-accent-gold">
                  Career Passport Platform
                </span>
              </div>
            </Link>

            <p className="text-body-sm text-text-muted max-w-sm leading-relaxed">
              Empowering students and professionals to discover their calling, map tailored learning journeys, and build verified Career Passports for lifelong success.
            </p>

            <div className="flex items-center gap-3 pt-2 text-text-muted text-body-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-gold/10 text-accent-gold text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" /> Next-Gen Career Discovery
              </span>
            </div>
          </div>

          {/* Explore Sitemap */}
          <div className="space-y-3">
            <h4 className="text-body-sm font-bold uppercase tracking-wider text-text-primary font-heading">
              Explore
            </h4>
            <ul className="space-y-2 text-body-sm">
              <li>
                <Link to="/careers" className="text-text-muted hover:text-accent-gold transition-colors">
                  Career Bank
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="text-text-muted hover:text-accent-gold transition-colors">
                  Aptitude Assessment
                </Link>
              </li>
              <li>
                <Link to="/media" className="text-text-muted hover:text-accent-gold transition-colors">
                  Multimedia Center
                </Link>
              </li>
              <li>
                <Link to="/stories" className="text-text-muted hover:text-accent-gold transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-text-muted hover:text-accent-gold transition-colors">
                  Resource Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Tools Sitemap */}
          <div className="space-y-3">
            <h4 className="text-body-sm font-bold uppercase tracking-wider text-text-primary font-heading">
              Account & Tools
            </h4>
            <ul className="space-y-2 text-body-sm">
              <li>
                <Link to="/dashboard" className="text-text-muted hover:text-accent-gold transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-text-muted hover:text-accent-gold transition-colors">
                  Passport Profile
                </Link>
              </li>
              <li>
                <Link to="/bookmarks" className="text-text-muted hover:text-accent-gold transition-colors">
                  Saved Bookmarks
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-text-muted hover:text-accent-gold transition-colors">
                  Feedback & Support
                </Link>
              </li>
              <li>
                <Link to="/notifications" className="text-text-muted hover:text-accent-gold transition-colors">
                  Notifications
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Design */}
          <div className="space-y-3">
            <h4 className="text-body-sm font-bold uppercase tracking-wider text-text-primary font-heading">
              Platform
            </h4>
            <ul className="space-y-2 text-body-sm">
              <li>
                <Link to="/design-preview" className="text-text-muted hover:text-accent-gold transition-colors">
                  Design System Preview
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-text-muted hover:text-accent-gold transition-colors">
                  Admin Portal
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-text-muted hover:text-accent-gold transition-colors">
                  User Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-text-muted hover:text-accent-gold transition-colors">
                  Register Account
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border-subtle bg-card/60">
        <div className="container-app py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-caption text-text-muted">
          <p>© 2026 PathSeeker — Career Passport Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1 text-text-muted">
              Built for Student Excellence
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
