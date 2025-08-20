import HeroSection from '@/components/HeroSection';
import SEO from '@/components/Seo';
import AboutUs from '@/components/AboutUs';
import Services from '@/components/Services';
import WhyUs from '@/components/WhyUs';
import Products from '@/components/Products';
import WhatweOffer from '@/components/WhatweOffer';
import AreasWeServe from '@/components/AreaWeServe';
import BecomeSupplier from '@/components/BecomeSupplier';
import SupplierRegistration from './SupplierResgistration';

const homeSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Maashura",
  "url": "https://www.Maashura.com/"
};

const Home = () => {
  return (
    <>
      <SEO
        title="Maashura - Ready ERP Dubai | Software for Real Estate UAE"
        description="Leading IT consultancy in Dubai offering ready ERP solutions, software for real estate UAE, and affordable IT hardware supply."
        keywords="ready ERP in Dubai, software for real estate UAE, plug-and-play MEP apps"
        canonical="https://www.Maashura.com/"
        schemaMarkup={homeSchema}
      />
      <div>
        <HeroSection />
        <AboutUs />
        <Services />
        <WhyUs />
        <Products/>
        <WhatweOffer />
        <AreasWeServe/>
        <BecomeSupplier/>
      </div>
    </>
  );
};

export default Home;