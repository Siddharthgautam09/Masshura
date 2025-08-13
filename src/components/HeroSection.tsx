"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  const navigate = useNavigate();
  
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      // Use setTimeout to prevent blocking
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    }
  };

  const navigateToContact = () => {
    navigate('/contact');
  };

  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      // Use setTimeout to prevent blocking
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    }
  };

  // Image slideshow data
  const heroImages = [
    {
      src: "https://media.istockphoto.com/id/1947499362/photo/happy-group-of-business-people-discussing-strategy-during-team-meeting-at-the-office-desk.jpg?s=612x612&w=0&k=20&c=UXPrlQx09d8EP4_kTdAa-vC2LxD_ppY1tiG7eTPGVbE=",
      alt: "Placeholder image 1"
    },
    {
      src: "https://media.istockphoto.com/id/1480239160/photo/an-analyst-uses-a-computer-and-dashboard-for-data-business-analysis-and-data-management.jpg?s=612x612&w=0&k=20&c=Zng3q0-BD8rEl0r6ZYZY0fbt2AWO9q_gC8lSrwCIgdk=", 
      alt: "Placeholder image 2"
    },
    {
      src: "https://www.shutterstock.com/image-photo/mature-woman-working-young-man-600nw-1993834745.jpg",
      alt: "Placeholder image 3"
    }
  ];

  // Handle image load errors
  const handleImageError = (index) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [index]: true
    }));
  };

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <>
      {/* Landing Page Section */}
      <section id="home" className="relative h-screen bg-slate-900 overflow-hidden pt-16 md:pt-20 lg:pt-24">
        {/* BackgroundBoxes Grid - Layer 1 */}
        <div className="absolute inset-0 w-full h-full bg-slate-900">
          <div className="absolute inset-0 w-full h-full bg-slate-900 z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
          {/* <Boxes /> */}
        </div>

        {/* Main Content - Layer 3 */}
        <div className="container mx-auto px-4 md:px-6 lg:px-8 z-30 relative h-full flex items-center justify-center">
          <div className="w-full max-w-7xl mx-auto">
            
            {/* Desktop & Tablet Layout - Side by side */}
            <div className="hidden md:grid md:grid-cols-2 md:gap-8 lg:gap-12 xl:gap-16 items-center h-full">
              
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, staggerChildren: 0.3 }}
                className="text-left"
              >
                {/* Main Heading */}
                <motion.h1
                  className={cn("text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight relative z-30 text-white")}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                    Simple. Smart. Affordable
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                    IT Consultancy
                  </span>
                  <br />
                  <span className="text-gray-300 text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                    for Growing Businesses in Dubai, UAE & the GCC
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  className="text-base md:text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed relative z-30"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Transforming businesses through innovative software solutions, 
                  cutting-edge hardware, and expert IT consultancy services.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 lg:gap-6 relative z-30"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  {/* Primary CTA Button */}
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -2 }} 
                    whileTap={{ scale: 0.95 }}
                    className="group"
                  >
                    <Button
                      onClick={navigateToContact}
                      className="relative bg-[#6AAEFF] hover:bg-[#5A9EEF] text-white px-8 py-3 lg:px-10 lg:py-4 text-base lg:text-lg rounded-full shadow-2xl shadow-[#6AAEFF]/25 transition-all duration-300 border-0"
                    >
                      <span className="relative z-10 flex items-center font-semibold">
                        Get Started Today
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                      </span>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#6AAEFF] to-[#6ECCAF] opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    </Button>
                  </motion.div>

                  {/* Secondary CTA Button */}
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -2 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      onClick={scrollToServices}
                      className="border-2 border-[#6AAEFF]/50 bg-transparent text-[#6AAEFF] hover:bg-[#6AAEFF]/10 hover:border-[#6AAEFF] px-8 py-3 lg:px-10 lg:py-4 text-base lg:text-lg rounded-full transition-all duration-300 font-medium"
                    >
                      Explore Services
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Right Slideshow - Hidden on mobile */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative z-30"
              >
                <div className="relative w-full h-80 lg:h-96 xl:h-[450px] rounded-2xl overflow-hidden shadow-2xl shadow-[#6AAEFF]/20 bg-slate-800">
                  {heroImages.map((image, index) => (
                    <motion.div
                      key={index}
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: index === currentSlide ? 1 : 0,
                        scale: index === currentSlide ? 1 : 1.1
                      }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    >
                      {!imageLoadErrors[index] ? (
                        <>
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                            loading={index === 0 ? "eager" : "lazy"}
                            onError={() => handleImageError(index)}
                            width="800"
                            height="600"
                            style={{ aspectRatio: '4/3' }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-slate-900/20" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                          <div className="text-center p-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-[#6AAEFF]/20 rounded-full flex items-center justify-center">
                              <Code className="w-8 h-8 text-[#6AAEFF]" />
                            </div>
                            <p className="text-gray-300 text-sm max-w-xs">
                              {image.alt}
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Slide indicators */}
                <div className="flex justify-center mt-6 space-x-3">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={cn(
                        "w-3 h-3 rounded-full transition-all duration-300",
                        index === currentSlide 
                          ? "bg-[#6AAEFF] scale-125" 
                          : "bg-gray-500 hover:bg-gray-400"
                      )}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Mobile Layout - Stacked with optimized spacing */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, staggerChildren: 0.2 }}
              className="block md:hidden text-center px-4 py-12"
            >
              {/* Mobile Heading - Three lines with better spacing */}
              <motion.h1
                className="text-3xl sm:text-4xl font-bold mb-8 leading-tight relative z-30 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent text-4xl sm:text-5xl font-extrabold">
                    Simple.
                  </div>
                  <div className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent text-4xl sm:text-5xl font-extrabold">
                    Smart.
                  </div>
                  <div className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent text-4xl sm:text-5xl font-extrabold">
                    Affordable
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent text-xl sm:text-2xl font-bold">
                    IT Consultancy
                  </div>
                  <div className="text-gray-300 text-base sm:text-lg font-medium leading-relaxed">
                    for Growing Businesses in
                  </div>
                  <div className="text-gray-300 text-base sm:text-lg font-medium leading-relaxed">
                    Dubai, UAE & the GCC
                  </div>
                </div>
              </motion.h1>

              {/* Mobile Subtitle - Enhanced and expanded */}
              <motion.p
                className="text-base sm:text-lg text-gray-300 mb-10 leading-relaxed relative z-30 max-w-lg mx-auto font-medium px-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="text-gray-200 font-semibold">Transforming businesses</span> through 
                <span className="text-blue-200"> innovative software solutions</span>, 
                <span className="text-blue-200"> cutting-edge hardware</span>, and 
                <span className="text-blue-200"> expert IT consultancy services</span>.
              </motion.p>

              {/* Mobile CTA Buttons - Increased gaps */}
              <motion.div
                className="flex flex-col gap-5 items-center relative z-30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <motion.div 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  className="group w-full max-w-xs"
                >
                  <Button
                    onClick={navigateToContact}
                    className="relative bg-[#6AAEFF] hover:bg-[#5A9EEF] text-white px-8 py-3 text-base rounded-full shadow-xl shadow-[#6AAEFF]/25 transition-all duration-300 border-0 w-full"
                  >
                    <span className="relative z-10 flex items-center justify-center font-semibold">
                      Get Started Today
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                    </span>
                  </Button>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  className="w-full max-w-xs"
                >
                  <Button
                    variant="outline"
                    onClick={scrollToServices}
                    className="border-2 border-[#6AAEFF]/50 bg-transparent text-[#6AAEFF] hover:bg-[#6AAEFF]/10 hover:border-[#6AAEFF] px-8 py-3 text-base rounded-full transition-all duration-300 font-medium w-full"
                  >
                    Explore Services
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scroll-triggered Subtitle Section */}
      <section className="relative bg-slate-900 py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl text-gray-200 max-w-6xl mx-auto leading-relaxed font-medium">
              <span className="bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent">
                Empowering Small to Mid-scale Businesses with Custom Software Solutions, 
                Smart Technology Consulting & Digital Support — Done Right, Done Fast.
              </span>
            </h2>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
