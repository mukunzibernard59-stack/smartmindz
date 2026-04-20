import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import FloatingInstallButton from "@/components/FloatingInstallButton";
import UpdateNotification from "@/components/UpdateNotification";
import OfflineBanner from "@/components/OfflineBanner";
import { useOfflineMode } from "@/hooks/useOfflineMode";

import AppRatingBanner from "@/components/AppRatingBanner";
import Index from "./pages/Index";
import Learn from "./pages/Learn";
import Quiz from "./pages/Quiz";
import DevMode from "./pages/DevMode";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
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
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
          <Route path="/dev" element={<ProtectedRoute><DevMode /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
          <Route path="/design-letters" element={<ProtectedRoute><DesignLetters /></ProtectedRoute>} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
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
