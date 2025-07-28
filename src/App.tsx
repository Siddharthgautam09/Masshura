import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const HardwarePage = lazy(() => import("./pages/HardwarePage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SupplierRegistration = lazy(() => import("./pages/SupplierResgistration"));
const ItConsulting = lazy(() => import("./pages/ItConsulting"));
const Services = lazy(() => import("./components/Services"));
const WhyUs = lazy(() => import("./components/WhyUs"));
const AreasWeServe = lazy(() => import("./components/AreaWeServe"));

const queryClient = new QueryClient();

// Loading component for lazy-loaded routes
const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div className="animate-pulse text-center">
      <div className="w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-4 loading-skeleton"></div>
      <div className="text-gray-300">Loading page...</div>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/hardware" element={<HardwarePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/SupplierRegistration" element={<SupplierRegistration />} />
            <Route path="/ItConsulting" element={<ItConsulting />} />
            <Route path="/Services" element={<Services />} />
            <Route path="/WhyUs" element={<WhyUs />} />
            <Route path="/AreaWeServe" element={<AreasWeServe />} />
          </Routes>
        </Suspense>
        <Footer />
        <ScrollToTopButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
