import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductsPage from "./pages/ProductsPage";
import HardwarePage from "./pages/HardwarePage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import SupplierRegistration from "./pages/SupplierResgistration";
import ItConsulting from "./pages/ItConsulting";
import Services from "./components/Services";
import WhyUs from "./components/WhyUs";
import AreasWeServe from "./components/AreaWeServe";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
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
        <Footer />
        <ScrollToTopButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
