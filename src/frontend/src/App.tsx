import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AdminPage from "./pages/AdminPage";
import HelpPage from "./pages/HelpPage";
import HomePage from "./pages/HomePage";
import SubmitPage from "./pages/SubmitPage";
import TrackPage from "./pages/TrackPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

type Page = "home" | "submit" | "track" | "help" | "admin";

function AppContent() {
  const [page, setPage] = useState<Page>("home");

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage onNavigate={(p) => setPage(p as Page)} />;
      case "submit":
        return <SubmitPage />;
      case "track":
        return <TrackPage />;
      case "help":
        return <HelpPage />;
      case "admin":
        return <AdminPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar currentPage={page} onNavigate={(p) => setPage(p as Page)} />
      <div className="flex-1">{renderPage()}</div>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
