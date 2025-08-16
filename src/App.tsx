import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import PaymentRequired from "./pages/PaymentRequired";

// Development helpers
if (process.env.NODE_ENV === 'development') {
  import('./utils/devHelpers');
}

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"));
const AboutUsPage = lazy(() => import("./pages/AboutUsPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const HardwarePage = lazy(() => import("./pages/HardwarePage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SupplierRegistration = lazy(
  () => import("./pages/SupplierResgistration")
);
const SupplierRegistrationPage = lazy(
  () => import("./pages/SupplierRegistrationPage")
);
const ItConsulting = lazy(() => import("./pages/ItConsulting"));
const Services = lazy(() => import("./components/Services"));
const WhyUs = lazy(() => import("./components/WhyUs"));
const AreasWeServe = lazy(() => import("./components/AreaWeServe"));
const ItHardware = lazy(() => import("./pages/ItHardware"));

// --- ADDED: Lazy load admin components ---
const LoginPage = lazy(() => import("./pages/admin/LoginPage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ProtectedRoute = lazy(
  () => import("./components/auth/ProtectedRoute.tsx")
);
const AdminSettingsPage = lazy(() => import("./pages/admin/AdminSettingsPage"));
const SupplierDetailPage = lazy(
  () => import("./pages/admin/SupplierDetailPage")
);
const SubscriptionSettings = lazy(
  () => import("./pages/admin/SubscriptionSettings")
);
const PaymentDashboard = lazy(
  () => import("./pages/admin/PaymentDashboard")
);
// supplier -----------------------
const SetPasswordPage = lazy(() => import("./pages/supplier/SetPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/supplier/ResetPasswordPage"));
const SupplierLoginPage = lazy(
  () => import("./pages/supplier/SupplierLoginPage")
);
const SupplierDashboard = lazy(
  () => import("./pages/supplier/SupplierDashboard")
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on mobile if network is slow
        if (typeof navigator !== "undefined" && "connection" in navigator) {
          const connection = (navigator as any).connection;
          if (connection && connection.effectiveType === "slow-2g") {
            return false;
          }
        }
        return failureCount < 2;
      },
    },
  },
});

// Loading component for lazy-loaded routes
const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div className="animate-pulse text-center">
      <div className="w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-4 loading-skeleton"></div>
      <div className="text-gray-300">Loading page...</div>
    </div>
  </div>
);

const App = () => {
  // Mobile optimization: Disable animations on slow devices
  useEffect(() => {
    if (typeof navigator !== "undefined" && "connection" in navigator) {
      const connection = (navigator as any).connection;
      if (
        connection &&
        (connection.effectiveType === "slow-2g" ||
          connection.effectiveType === "2g")
      ) {
        document.documentElement.style.setProperty(
          "--animation-duration",
          "0ms"
        );
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Navbar />
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              {/* Your existing public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/hardware" element={<HardwarePage />} />
              <Route path="/contact" element={<ContactPage />} />
              // Add this route
              <Route path="/payment-required" element={<PaymentRequired />} />
              <Route path="*" element={<NotFound />} />
              <Route
                path="/supplier-registration"
                element={<SupplierRegistrationPage />}
              />
              <Route
                path="/SupplierRegistration"
                element={<SupplierRegistration />}
              />
              <Route path="/ItConsulting" element={<ItConsulting />} />
              <Route path="/Services" element={<Services />} />
              <Route path="/WhyUs" element={<WhyUs />} />
              <Route path="/AreaWeServe" element={<AreasWeServe />} />
              <Route path="/ItHardware" element={<ItHardware />} />
              <Route path="/set-password" element={<SetPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/supplier-login" element={<SupplierLoginPage />} />
              <Route
                path="/supplier-dashboard"
                element={<SupplierDashboard />}
              />
              {/* --- ADDED: Admin and Login Routes --- */}
              {/* This is the public route for the admin login page */}
              <Route path="/login" element={<LoginPage />} />
              {/* This is the protected route for the admin dashboard */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings" // The new route
                element={
                  <ProtectedRoute>
                    <AdminSettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/supplier/:id" // The ':id' part is dynamic
                element={
                  <ProtectedRoute>
                    <SupplierDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/subscription-settings"
                element={
                  <ProtectedRoute>
                    <SubscriptionSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/payments"
                element={
                  <ProtectedRoute>
                    <PaymentDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
          <Footer />
          <ScrollToTopButton />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
