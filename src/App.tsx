import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import FloatingInstallButton from "@/components/FloatingInstallButton";
import ThemeToggle from "@/components/ThemeToggle";
import { ThemeProvider } from "@/contexts/ThemeContext";
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
import AIWriter from "./pages/AIWriter";
import AIDetector from "./pages/AIDetector";
import GenerateImage from "./pages/GenerateImage";
import BuildAppPrompt from "./pages/BuildAppPrompt";
import Translate from "./pages/Translate";
import YouTubeTutor from "./pages/YouTubeTutor";
import HomeworkHelper from "./pages/HomeworkHelper";
import OfflineGate from "@/components/OfflineGate";

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
                {/* Offline-friendly routes (no internet required) */}
                <Route path="/" element={<Index />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/ai-writer" element={<AIWriter />} />
                <Route path="/build-app-prompt" element={<BuildAppPrompt />} />
                {/* Internet-required routes (gated when offline) */}
                <Route path="/learn" element={<OfflineGate toolName="Learn"><Learn /></OfflineGate>} />
                <Route path="/quiz" element={<OfflineGate toolName="Quiz"><Learn /></OfflineGate>} />
                <Route path="/chat" element={<OfflineGate toolName="Chat"><Learn /></OfflineGate>} />
                <Route path="/dev" element={<OfflineGate toolName="Dev Mode"><DevMode /></OfflineGate>} />
                <Route path="/ai-detector" element={<OfflineGate toolName="AI Detector"><AIDetector /></OfflineGate>} />
                <Route path="/generate-image" element={<OfflineGate toolName="Design Studio"><GenerateImage /></OfflineGate>} />
                <Route path="/translate" element={<OfflineGate toolName="Translate"><Translate /></OfflineGate>} />
                <Route path="/youtube-tutor" element={<OfflineGate toolName="Learning Hub"><YouTubeTutor /></OfflineGate>} />
                <Route path="/ai-homework-helper" element={<OfflineGate toolName="Homework Helper"><HomeworkHelper /></OfflineGate>} />
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
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
          <TooltipProvider>
            <AppContent />
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
