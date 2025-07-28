import HeroSection from '@/components/HeroSection';
import AboutUs from '@/components/AboutUs';
import Services from '@/components/Services';
import WhyUs from '@/components/WhyUs';
import Products from '@/components/Products';
import WhatweOffer from '@/components/WhatweOffer';
import AreasWeServe from '@/components/AreaWeServe';
import BecomeSupplier from '@/components/BecomeSupplier';
import SupplierRegistration from './SupplierResgistration';

const Home = () => {
  return (
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
  );
};

export default Home;