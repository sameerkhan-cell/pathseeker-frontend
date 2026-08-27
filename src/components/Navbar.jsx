import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, 
  X, 
  Compass, 
  User, 
  LogOut, 
  ShieldCheck, 
  Sparkles,
  ChevronDown
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import FontSizeToggle from "./FontSizeToggle";
import NotificationBell from "./NotificationBell";
import PrimaryButton from "./ui/PrimaryButton";
import GoldOutlineButton from "./ui/GoldOutlineButton";
import BrandLogo from "./ui/BrandLogo";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = user
    ? [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Careers", path: "/careers" },
        { label: "Quiz", path: "/quiz" },
        { label: "Media", path: "/media" },
        { label: "Stories", path: "/stories" },
        { label: "Resources", path: "/resources" },
        { label: "Bookmarks", path: "/bookmarks" },
        { label: "Feedback", path: "/feedback" },
      ]
    : [
        { label: "Careers", path: "/careers" },
        { label: "Quiz", path: "/quiz" },
        { label: "Media", path: "/media" },
        { label: "Stories", path: "/stories" },
        { label: "Resources", path: "/resources" },
      ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-card/95 backdrop-blur border-b border-border-subtle shadow-sm theme-transition">
      <div className="container-app flex items-center justify-between h-20">
        {/* Brand / Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-accent-gold rounded-lg p-1"
          aria-label="PathSeeker Home"
        >
          <BrandLogo 
            className="w-8 h-8 group-hover:scale-105 transition-all duration-200" 
            rounded="rounded-lg"
          />
          <div className="flex flex-col">
            <span className="font-heading text-xl font-bold tracking-tight text-text-primary group-hover:text-accent-gold transition-colors">
              PathSeeker
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-widest text-accent-gold">
              Career Passport
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  px-3 py-2 rounded-lg text-body-sm font-medium transition-all duration-150
                  ${
                    active
                      ? "text-accent-gold bg-accent-gold/10 font-semibold"
                      : "text-text-primary/80 hover:text-accent-gold hover:bg-card"
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}

          {user && user.role === "ADMIN" && (
            <Link
              to="/admin"
              className={`
                flex items-center gap-1.5 px-3 py-2 rounded-lg text-body-sm font-semibold transition-colors
                ${
                  isActive("/admin")
                    ? "text-amber-500 bg-amber-500/10"
                    : "text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                }
              `}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* Right Controls & Auth */}
        <div className="hidden md:flex items-center gap-3">
          <FontSizeToggle />
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-border-subtle">
              <NotificationBell />

              {/* User Dropdown / Profile Pill */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-card border border-border-subtle hover:border-accent-gold/50 theme-transition text-left focus-visible:ring-2 focus-visible:ring-accent-gold"
                  aria-expanded={userDropdownOpen}
                  aria-label="User menu"
                >
                  <div className="w-7 h-7 rounded-full bg-accent-gold/20 text-accent-gold flex items-center justify-center font-bold text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="flex flex-col text-xs leading-none">
                    <span className="font-semibold text-text-primary truncate max-w-[110px]">
                      {user.name || user.email.split("@")[0]}
                    </span>
                    <span className="text-[10px] text-accent-gold font-medium mt-0.5">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border-subtle rounded-card shadow-[var(--shadow-card-hover)] py-2 z-50 animate-fade-in theme-transition">
                    <div className="px-4 py-2 border-b border-border-subtle">
                      <p className="text-body-sm font-semibold text-text-primary truncate">
                        {user.name || "User"}
                      </p>
                      <p className="text-caption text-text-muted truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-body-sm text-text-primary hover:bg-accent-gold/10 hover:text-accent-gold transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Passport Profile
                    </Link>

                    {user.role === "ADMIN" && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-body-sm text-text-primary hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-500" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-border-subtle my-1" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-body-sm text-rose-500 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-border-subtle">
              <Link to="/login">
                <GoldOutlineButton size="sm">Login</GoldOutlineButton>
              </Link>
              <Link to="/register">
                <PrimaryButton size="sm">Get Started</PrimaryButton>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Controls & Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <FontSizeToggle />
          <ThemeToggle />
          {user && <NotificationBell />}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="
              inline-flex items-center justify-center
              w-11 h-11 min-w-[44px] min-h-[44px]
              rounded-xl
              bg-card border border-border-subtle
              text-text-primary
              hover:bg-accent-gold/10 hover:text-accent-gold
              active:scale-95
              transition-colors
              cursor-pointer
            "
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border-subtle bg-card shadow-lg animate-slide-up px-4 py-6 space-y-5">
          {/* User Info on Mobile */}
          {user && (
            <div className="flex items-center gap-3 p-3 rounded-card bg-base border border-border-subtle">
              <div className="w-10 h-10 rounded-full bg-accent-gold/20 text-accent-gold flex items-center justify-center font-bold text-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-text-primary text-body-sm">
                  {user.name || user.email.split("@")[0]}
                </span>
                <span className="text-caption text-accent-gold font-medium">
                  {user.role} • {user.email}
                </span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    px-4 py-3 rounded-xl text-body-base font-medium transition-colors
                    ${
                      active
                        ? "text-accent-gold bg-accent-gold/10 font-semibold"
                        : "text-text-primary hover:bg-base hover:text-accent-gold"
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}

            {user && (
              <Link
                to="/profile"
                className={`
                  px-4 py-3 rounded-xl text-body-base font-medium transition-colors
                  ${
                    isActive("/profile")
                      ? "text-accent-gold bg-accent-gold/10 font-semibold"
                      : "text-text-primary hover:bg-base hover:text-accent-gold"
                  }
                `}
              >
                Passport Profile
              </Link>
            )}

            {user && user.role === "ADMIN" && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-body-base font-semibold text-amber-500 bg-amber-500/10"
              >
                <ShieldCheck className="w-5 h-5" />
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Auth Action Buttons on Mobile */}
          <div className="pt-3 border-t border-border-subtle">
            {user ? (
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-body-base font-semibold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login" className="w-full">
                  <GoldOutlineButton className="w-full py-3">Login</GoldOutlineButton>
                </Link>
                <Link to="/register" className="w-full">
                  <PrimaryButton className="w-full py-3">Get Started</PrimaryButton>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
