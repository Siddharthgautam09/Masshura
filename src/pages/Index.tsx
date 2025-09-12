import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutUs from '@/components/AboutUs';
import Services from '@/components/Services';
import WhyUs from '@/components/WhyUs';
import Products from '@/components/Products';
import Hardware from '@/components/Hardware';
import AreasWeServe from '@/components/AreasWeServe';
import SupplierForm from '@/components/SupplierForm';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <AboutUs />
      <Services />
      <WhyUs />
      <Products />
      <Hardware />
      <AreasWeServe />
      <SupplierForm />
      <ContactForm />
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Index;
