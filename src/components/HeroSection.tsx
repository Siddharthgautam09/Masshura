"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Code, Cpu, Globe, CheckCircle, Users, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Boxes } from '@/components/ui/background-boxes';
import { cn } from "@/lib/utils";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  
  // Refs for scroll-triggered animations
  const slideshowRef = useRef(null);
  const h2Ref = useRef(null);
  const slideshowInView = useInView(slideshowRef, { once: true, amount: 0.3 });
  const h2InView = useInView(h2Ref, { once: true, amount: 0.3 });
  
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
      <section id="home" className="relative h-screen bg-slate-900 overflow-hidden">
        {/* BackgroundBoxes Grid - Layer 1 */}
        <div className="absolute inset-0 w-full h-full bg-slate-900">
          <div className="absolute inset-0 w-full h-full bg-slate-900 z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
          <Boxes />
        </div>

        {/* Main Content - Layer 3 */}
        <div className="container mx-auto px-6 lg:px-8 text-center z-30 relative h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, staggerChildren: 0.3 }}
            className="max-w-6xl mx-auto"
          >

            {/* Main Heading */}
            <motion.h1
              className={cn("text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8 leading-tight relative z-30 text-white")}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Desktop heading */}
              <span className="hidden lg:block">
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  Simple. Smart. Affordable
                </span>
                <br />
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  IT Consultancy
                </span>
                <br />
                <span className="text-gray-300 text-4xl lg:text-5xl">
                  for Growing Businesses in Dubai, UAE & the GCC
                </span>
              </span>
              
              {/* Tablet heading */}
              <span className="hidden md:block lg:hidden">
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  Simple. Smart. Affordable
                </span>
                <br />
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  IT Consultancy
                </span>
              </span>
              
              {/* Mobile heading */}
              <span className="block md:hidden text-3xl">
                <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Smart. Affordable
                </span>
                <br />
                <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  IT Consultancy
                </span>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed relative z-30"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Transforming businesses through innovative software solutions, 
              cutting-edge hardware, and expert IT consultancy services.
            </motion.p>

            {/* CTA Buttons - Updated with new color scheme */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center relative z-30"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {/* Primary CTA Button - Light Blue (#6AAEFF) */}
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Button
                  onClick={scrollToContact}
                  className="relative bg-[#6AAEFF] hover:bg-[#5A9EEF] text-white px-10 py-4 text-lg rounded-full shadow-2xl shadow-[#6AAEFF]/25 transition-all duration-300 border-0"
                >
                  <span className="relative z-10 flex items-center font-semibold">
                    Get Started Today
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </span>
                  {/* Gradient accent overlay on hover */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#6AAEFF] to-[#6ECCAF] opacity-0 group-hover:opacity-10 transition-opacity"></div>
                </Button>
              </motion.div>

              {/* Secondary CTA Button - Light Blue outline */}
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={scrollToServices}
                  className="border-2 border-[#6AAEFF]/50 bg-transparent text-[#6AAEFF] hover:bg-[#6AAEFF]/10 hover:border-[#6AAEFF] px-10 py-4 text-lg rounded-full transition-all duration-300 font-medium"
                >
                  Explore Services
                </Button>
              </motion.div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Scroll-triggered Content Section - Now with identical background */}
      <section className="relative bg-slate-900 py-20 overflow-hidden">
        {/* BackgroundBoxes Grid - Identical to landing page */}
        <div className="absolute inset-0 w-full h-full bg-slate-900">
          <div className="absolute inset-0 w-full h-full bg-slate-900 z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
          <Boxes />
        </div>

        <div className="container mx-auto px-6 lg:px-8 text-center relative z-30">
          
          {/* Image Slideshow - Appears on scroll */}
          <motion.div
            ref={slideshowRef}
            className="relative max-w-4xl mx-auto mb-16 z-10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ 
              opacity: slideshowInView ? 1 : 0, 
              y: slideshowInView ? 0 : 50 
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl shadow-[#6AAEFF]/10 bg-slate-800">
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
                        alt=""
                        className="w-full h-full object-cover"
                        loading={index === 0 ? "eager" : "lazy"}
                        onError={() => handleImageError(index)}
                        width="800"
                        height="600"
                        style={{ aspectRatio: '4/3' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/20" />
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

            {/* Slide indicators - Updated with new accent color */}
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

          {/* H2 Subtitle - Appears on scroll */}
          <motion.h2
            ref={h2Ref}
            className="text-xl md:text-2xl lg:text-3xl text-gray-200 max-w-5xl mx-auto leading-relaxed relative z-10 font-medium"
            initial={{ opacity: 0, y: 50 }}
            animate={{ 
              opacity: h2InView ? 1 : 0, 
              y: h2InView ? 0 : 50 
            }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent">
              Empowering Small to Mid-scale Businesses with Custom Software Solutions, 
              Smart Technology Consulting & Digital Support — Done Right, Done Fast.
            </span>
          </motion.h2>

        </div>
      </section>
    </>
  );
};

export default HeroSection;
