import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import FloatingInstallButton from "@/components/FloatingInstallButton";
import UpdateNotification from "@/components/UpdateNotification";
import OfflineBanner from "@/components/OfflineBanner";
import { useOfflineMode } from "@/hooks/useOfflineMode";

import AppRatingBanner from "@/components/AppRatingBanner";
import Index from "./pages/Index";
import Learn from "./pages/Learn";
import Quiz from "./pages/Quiz";
import DevMode from "./pages/DevMode";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import DesignLetters from "./pages/DesignLetters";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isOnline } = useOfflineMode();

  return (
    <>
      <OfflineBanner isOnline={isOnline} />
      <Toaster />
      <Sonner />
      <FloatingInstallButton />
      <UpdateNotification />
      <AppRatingBanner />
      <BrowserRouter>
        <SidebarProvider defaultOpen={true}>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/quiz" element={<Learn />} />
                <Route path="/dev" element={<DevMode />} />
                <Route path="/chat" element={<Learn />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/design-letters" element={<DesignLetters />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
