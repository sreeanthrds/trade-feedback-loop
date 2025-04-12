
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/contexts/auth";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Layouts
import WebsiteLayout from "./layouts/WebsiteLayout";
import AppLayout from "./layouts/AppLayout";

// Website Pages
import Index from "./pages/Index";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import AuthCallback from "./pages/AuthCallback";

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
      meta: {
        onError: (error: Error) => {
          console.error('Query error:', error);
        }
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
              {/* Direct auth routes */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Website Routes - no longer protected */}
              <Route path="/" element={<WebsiteLayout><Index /></WebsiteLayout>} />
              <Route path="/features" element={<WebsiteLayout><Features /></WebsiteLayout>} />
              <Route path="/pricing" element={<WebsiteLayout><Pricing /></WebsiteLayout>} />
              <Route path="/blog" element={<WebsiteLayout><Blog /></WebsiteLayout>} />
              
              {/* Protected App Routes */}
              <Route path="/app" element={<ProtectedRoute><AppLayout><StrategiesLanding /></AppLayout></ProtectedRoute>} />
              <Route path="/app/strategy-builder" element={<ProtectedRoute><AppLayout><StrategyBuilder /></AppLayout></ProtectedRoute>} />
              <Route path="/app/backtesting" element={<ProtectedRoute><AppLayout><Backtesting /></AppLayout></ProtectedRoute>} />
              <Route path="/app/backtesting/:id" element={<ProtectedRoute><AppLayout><Backtesting /></AppLayout></ProtectedRoute>} />
              <Route path="/app/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
              <Route path="/app/account" element={<ProtectedRoute><AppLayout><Account /></AppLayout></ProtectedRoute>} />
              
              {/* Legacy routes - redirect to app routes */}
              <Route path="/strategy-builder" element={<Navigate to="/app/strategy-builder" replace />} />
              <Route path="/backtesting" element={<Navigate to="/app/backtesting" replace />} />
              <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
              
              {/* Documentation route - accessible without auth */}
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
