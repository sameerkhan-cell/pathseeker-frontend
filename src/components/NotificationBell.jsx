import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { notificationsApi } from "../api/notificationsApi";
import { useAuth } from "../context/AuthContext";

export default function NotificationBell() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  const refresh = useCallback(() => {
    if (!user) return;
    notificationsApi
      .unreadCount()
      .then((res) => {
        setCount(res.data?.count || 0);
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!user) {
      setCount(0);
      return;
    }
    refresh();
    const t = setInterval(refresh, 15000);
    return () => clearInterval(t);
  }, [user, refresh]);

  return (
    <Link
      to="/notifications"
      title="Unread notifications"
      aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ""}`}
      className="
        relative inline-flex items-center justify-center
        w-11 h-11 min-w-[44px] min-h-[44px]
        rounded-full
        bg-card border border-border-subtle
        text-text-primary
        hover:bg-accent-gold hover:text-navy-900
        active:scale-95
        theme-transition
        cursor-pointer
      "
    >
      <Bell className="w-5 h-5" strokeWidth={2} />
      {count > 0 && (
        <span
          className="
            absolute -top-1 -right-1
            flex items-center justify-center
            min-w-[20px] h-5 px-1.5
            text-[11px] font-bold text-navy-900
            bg-accent-gold rounded-full
            shadow-sm border-2 border-card
            animate-fade-in
          "
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
