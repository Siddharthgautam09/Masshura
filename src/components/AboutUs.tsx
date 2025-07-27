import { motion } from 'framer-motion';
import { Boxes } from '@/components/ui/background-boxes';

const AboutUs = () => {
  return (
    <section id="about" className="relative py-12 md:py-20 bg-slate-900 overflow-hidden">
      {/* BackgroundBoxes Grid - Same as hero section */}
      <div className="absolute inset-0 w-full h-full bg-slate-900">
        <div className="absolute inset-0 w-full h-full bg-slate-900 z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
        <Boxes />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Content - Enhanced Animations */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="order-2 lg:order-1"
          >
            {/* Animated Heading */}
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-[#f8fafc] leading-tight px-50"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              About Us
            </motion.h2>
            
            {/* Animated First Paragraph */}
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-[#f8fafc] mb-4 md:mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Looking for affordable and reliable IT consultancy in Dubai or anywhere in the UAE? 
              Whether you need custom software, streamlined ERP systems, or expert tech advice, 
              Maashura delivers simple, scalable, and cost-effective solutions tailored to your business.
            </motion.p>
            
            {/* Animated Second Paragraph */}
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-[#f8fafc] mb-4 md:mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Our team of skilled professionals specializes in guiding companies across the GCC with 
              best-in-class IT consulting, digital strategy, and personalized development support. 
              From small start-ups to established enterprises, we help you compete like a pro — 
              without the enterprise price tag.
            </motion.p>
          </motion.div>

          {/* Right Content - Enhanced Image with Animations */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative order-1 lg:order-2"
          >
            {/* Main Image Container - Reduced Size */}
            <motion.div 
              className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[400px] xl:h-[450px] rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl shadow-[#6AAEFF]/10 mx-auto max-w-lg lg:max-w-none"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="IT professionals working together in modern office"
                className="w-full h-full object-cover"
                loading="lazy"
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ once: true }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-slate-900/20" />
              
              {/* Animated Overlay Content */}
              <motion.div 
                className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-3 sm:left-4 md:left-6 right-3 sm:right-4 md:right-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
              >
                {/* Optional: Add overlay content back if needed */}
              </motion.div>
            </motion.div>

            {/* Floating Animation Elements - Responsive Sizing */}
            <motion.div
              className="absolute -top-2 sm:-top-3 md:-top-4 -right-2 sm:-right-3 md:-right-4 w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 bg-gradient-to-r from-[#6AAEFF]/20 to-[#6ECCAF]/20 rounded-full blur-xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-3 sm:-bottom-4 md:-bottom-6 -left-3 sm:-left-4 md:-left-6 w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 bg-gradient-to-r from-[#6ECCAF]/20 to-[#6AAEFF]/20 rounded-full blur-xl"
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.4, 0.7, 0.4]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
