import React, { Suspense, lazy } from "react";
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
import OfflineGate from "@/components/OfflineGate";

const Index = lazy(() => import("./pages/Index"));
const Learn = lazy(() => import("./pages/Learn"));
const Quiz = lazy(() => import("./pages/Quiz"));
const DevMode = lazy(() => import("./pages/DevMode"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AIWriter = lazy(() => import("./pages/AIWriter"));
const AIDetector = lazy(() => import("./pages/AIDetector"));
const GenerateImage = lazy(() => import("./pages/GenerateImage"));
const BuildAppPrompt = lazy(() => import("./pages/BuildAppPrompt"));
const Translate = lazy(() => import("./pages/Translate"));
const YouTubeTutor = lazy(() => import("./pages/YouTubeTutor"));
const HomeworkHelper = lazy(() => import("./pages/HomeworkHelper"));
const Library = lazy(() => import("./pages/Library"));
const AdminLibrary = lazy(() => import("./pages/AdminLibrary"));

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
              <Suspense fallback={(
                <div className="min-h-screen flex items-center justify-center text-sm text-slate-600">
                  Loading application...
                </div>
              )}>
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
                  <Route path="/library" element={<OfflineGate toolName="TVET Library"><Library /></OfflineGate>} />
                  <Route path="/admin/library" element={<OfflineGate toolName="Admin"><AdminLibrary /></OfflineGate>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
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
