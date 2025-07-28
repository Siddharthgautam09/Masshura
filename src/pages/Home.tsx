import HeroSection from '@/components/HeroSection';
import AboutUs from '@/components/AboutUs';
import Services from '@/components/Services';
import WhyUs from '@/components/WhyUs';
import Products from '@/components/Products';
import WhatweOffer from '@/components/WhatweOffer';

const Home = () => {
  return (
    <div>
      <HeroSection />
      <AboutUs />
      <Services />
      <WhyUs />
      <Products/>
      <WhatweOffer />
    </div>
  );
};

export default Home;