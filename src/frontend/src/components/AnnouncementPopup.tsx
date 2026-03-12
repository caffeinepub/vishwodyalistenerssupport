import { Button } from "@/components/ui/button";
import { Bell, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  active: boolean;
}

const LS_KEY = "vishwodya_announcements";
const SS_KEY = "dismissed_popups";

export function getAnnouncements(): Announcement[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveAnnouncements(list: Announcement[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

function getDismissed(): string[] {
  return (sessionStorage.getItem(SS_KEY) ?? "").split(",").filter(Boolean);
}

function dismiss(id: string) {
  const existing = getDismissed();
  if (!existing.includes(id)) {
    sessionStorage.setItem(SS_KEY, [...existing, id].join(","));
  }
}

export default function AnnouncementPopup() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    const list = getAnnouncements();
    const dismissed = getDismissed();
    const active = list.find((a) => a.active && !dismissed.includes(a.id));
    if (active) setAnnouncement(active);
  }, []);

  const handleClose = () => {
    if (announcement) dismiss(announcement.id);
    setAnnouncement(null);
  };

  return (
    <AnimatePresence>
      {announcement && (
        <motion.div
          key="announcement-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
          data-ocid="announcement.dialog"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="relative w-full max-w-md bg-background rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary/80 to-secondary" />

            <div className="p-8">
              {/* Icon + close */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Bell size={20} className="text-primary" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                    Announcement
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Close announcement"
                  data-ocid="announcement.close_button"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <h2 className="font-display text-xl font-bold mb-3 leading-snug">
                {announcement.title}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {announcement.message}
              </p>

              {/* Date + CTA */}
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {new Date(announcement.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <Button
                  onClick={handleClose}
                  className="rounded-xl px-6 bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90"
                >
                  Got it!
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
