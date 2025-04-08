
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/contexts/AuthContext";

// Layouts
import WebsiteLayout from "./layouts/WebsiteLayout";
import AppLayout from "./layouts/AppLayout";

// Website Pages
import Index from "./pages/Index";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";

// App Pages
import StrategiesLanding from "./pages/StrategiesLanding";
import StrategyBuilder from "./pages/StrategyBuilder";
import Backtesting from "./pages/Backtesting";
import Dashboard from "./pages/Dashboard";

// Authentication Pages
import Account from "./pages/Account";

// Documentation Page
import Documentation from './pages/Documentation';

// Create query client with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('Query error:', error);
      }
    }
  }
});

// Animation and page transitions observer
const AppObserver = () => {
  useEffect(() => {
    return () => {};
  }, []);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <AppObserver />
            <Routes>
              {/* Website Routes */}
              <Route path="/" element={<WebsiteLayout><Index /></WebsiteLayout>} />
              <Route path="/features" element={<WebsiteLayout><Features /></WebsiteLayout>} />
              <Route path="/pricing" element={<WebsiteLayout><Pricing /></WebsiteLayout>} />
              <Route path="/blog" element={<WebsiteLayout><Blog /></WebsiteLayout>} />
              
              {/* App Routes */}
              <Route path="/app" element={<AppLayout><StrategiesLanding /></AppLayout>} />
              <Route path="/app/strategy-builder" element={<AppLayout><StrategyBuilder /></AppLayout>} />
              <Route path="/app/backtesting" element={<AppLayout><Backtesting /></AppLayout>} />
              <Route path="/app/backtesting/:id" element={<AppLayout><Backtesting /></AppLayout>} />
              <Route path="/app/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
              <Route path="/app/account" element={<AppLayout><Account /></AppLayout>} />
              
              {/* Legacy routes - redirect to app routes */}
              <Route path="/strategy-builder" element={<Navigate to="/app/strategy-builder" replace />} />
              <Route path="/backtesting" element={<Navigate to="/app/backtesting" replace />} />
              <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
              
              {/* Documentation route */}
              <Route path="/documentation" element={<Documentation />} />
              
              {/* Catch-all */}
              <Route path="*" element={<WebsiteLayout><NotFound /></WebsiteLayout>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
