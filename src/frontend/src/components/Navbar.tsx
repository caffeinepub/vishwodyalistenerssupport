import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "Home", page: "home" },
    { label: "Submit Ticket", page: "submit" },
    { label: "Track Ticket", page: "track" },
    { label: "Help Center", page: "help" },
    { label: "Admin", page: "admin" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex items-center gap-3 group"
          data-ocid="nav.home_link"
        >
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-soft">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              role="img"
              aria-label="VishwodyaListenersSupport logo"
            >
              <title>VishwodyaListenersSupport logo</title>
              <path
                d="M10 4C8.5 2 6 2 4.5 3.5C3 5 3 7.5 4.5 9L10 14.5L15.5 9C17 7.5 17 5 15.5 3.5C14 2 11.5 2 10 4Z"
                fill="white"
                opacity="0.3"
              />
              <path
                d="M10 17C10 17 3 11.5 3 7C3 4.2 5.2 2 8 2C9 2 9.9 2.3 10.6 2.8"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M10 17C10 17 17 11.5 17 7C17 4.2 14.8 2 12 2C11 2 10.1 2.3 9.4 2.8"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="10" cy="15" r="1.5" fill="white" opacity="0.7" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <span className="font-display font-700 text-primary text-sm leading-tight block">
              Vishwodya
            </span>
            <span className="text-muted-foreground text-xs leading-tight">
              Listeners Support
            </span>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <button
              type="button"
              key={link.page}
              onClick={() => onNavigate(link.page)}
              data-ocid={`nav.${link.page}_link`}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                currentPage === link.page
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted hover:text-primary"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 space-y-1">
          {links.map((link) => (
            <button
              type="button"
              key={link.page}
              onClick={() => {
                onNavigate(link.page);
                setMobileOpen(false);
              }}
              data-ocid={`nav.mobile.${link.page}_link`}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                currentPage === link.page
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
