import { motion } from 'framer-motion';
import { Monitor, Printer, Wifi, HardDrive, Laptop, Cable, Server, Smartphone, ArrowRight, CheckCircle } from 'lucide-react';

const ITHardwareSupply = () => {
  const hardwareCategories = [
    {
      icon: Monitor,
      title: "Desktop Computers & Monitors",
      description: "High-performance desktops and displays for offices, clinics, and educational institutions."
    },
    {
      icon: Laptop,
      title: "Laptops & Mobile Devices", 
      description: "Portable computing solutions for modern businesses and remote work environments."
    },
    {
      icon: Printer,
      title: "Printers & Scanners",
      description: "Reliable printing and scanning equipment for document management and operations."
    },
    {
      icon: Wifi,
      title: "Networking Equipment",
      description: "Routers, switches, and wireless solutions to keep your business connected."
    },
    {
      icon: Server,
      title: "Servers & Storage",
      description: "Scalable server solutions and data storage systems for growing businesses."
    },
    {
      icon: Cable,
      title: "IT Accessories & Cables",
      description: "Essential accessories, cables, and peripheral devices to complete your setup."
    }
  ];

  const industries = [
    { name: "Healthcare & Clinics", icon: "🏥", count: "50+ Projects" },
    { name: "Educational Institutions", icon: "🎓", count: "30+ Schools" },
    { name: "Trading Companies", icon: "🏢", count: "100+ Businesses" },
    { name: "SMEs & Startups", icon: "🚀", count: "200+ Companies" }
  ];

  return (
    <section className="relative bg-slate-900 min-h-screen overflow-hidden">
      {/* Meta tags for SEO */}
      <meta name="title" content="Affordable IT Hardware Supply in UAE for Clinics, Schools, Retail & SMEs – Maashura" />
      <meta name="description" content="Discover reliable IT hardware supply in UAE with Maashura. We serve clinics, schools, trading companies, and SMEs with affordable networking devices, computers, printers, and IT accessories." />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        {/* Header Section with Different Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center px-4 py-2 bg-[#6AAEFF]/10 rounded-full border border-[#6AAEFF]/20">
              <span className="text-[#6AAEFF] font-semibold text-sm">IT Hardware Solutions</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#f8fafc] leading-tight">
              <span className="text-[#6AAEFF]">IT Hardware Supply</span><br />
              in UAE – What We Offer
            </h1>
            
            <p className="text-lg text-slate-300 leading-relaxed">
              At <strong className="text-[#6AAEFF]">Maashura</strong>, we understand that your IT infrastructure forms the backbone of your daily operations — whether you're running a clinic, managing a school, operating a trading company, or scaling an SME in Dubai or across the UAE.
            </p>
            
            <p className="text-slate-300 leading-relaxed">
              That's why we provide simple, affordable, and ready-to-deploy IT hardware tailored to your business size and operations. From small offices to large-scale institutions, we supply the right tools to keep your business running smoothly.
            </p>

            <motion.button
              className="group inline-flex items-center space-x-3 bg-[#6AAEFF] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-[#6AAEFF] transition-all duration-300 shadow-xl hover:shadow-[#6AAEFF]/30 border border-transparent hover:border-[#6AAEFF]"
              onClick={() => window.open('/it-hardware-supply-uae', '_blank')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Explore Our Hardware Solutions</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Right Side - Visual Element - Updated with Blue Icons */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
              <div className="grid grid-cols-2 gap-4">
                {[Monitor, Laptop, Server, Wifi].map((Icon, index) => (
                  <motion.div
                    key={index}
                    className="bg-slate-700/60 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-600/30"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Icon className="w-8 h-8 text-[#6AAEFF] mx-auto" />
                  </motion.div>
                ))}
              </div>
              
              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-[#6AAEFF] text-white p-3 rounded-full shadow-lg border border-white/20"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CheckCircle className="w-6 h-6" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Hardware Categories - Updated with Blue Icons */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#f8fafc] mb-4">
              Complete Hardware <span className="text-[#6AAEFF]">Solutions</span>
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              From individual components to complete system setups, we've got everything your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hardwareCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
              >
                <div className="relative bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 hover:shadow-2xl hover:shadow-[#6AAEFF]/20 transition-all duration-300 border border-slate-700/50 hover:border-[#6AAEFF]/30 overflow-hidden">
                  {/* Blue top border */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#6AAEFF]" />
                  
                  {/* Updated icon with solid blue background */}
                  <div className="inline-flex p-3 rounded-xl bg-[#6AAEFF] mb-4 border border-white/20">
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#6AAEFF] transition-colors">
                    {category.title}
                  </h3>
                  
                  <p className="text-slate-300 leading-relaxed">
                    {category.description}
                  </p>
                  
                  <motion.div
                    className="mt-4 inline-flex items-center text-[#6AAEFF] font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-sm">Learn More</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </motion.div>

                  {/* Animated bottom border - solid blue */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-[#6AAEFF] rounded-full"
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Industries Section - Updated for Dark Theme */}
        <motion.div
          className="bg-gradient-to-br from-[#6AAEFF]/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-[#6AAEFF]/30"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted Across <span className="text-[#6AAEFF]">UAE Industries</span>
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              From Dubai to Abu Dhabi, we deliver quality IT solutions across all Emirates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm rounded-xl p-6 text-center border border-[#6AAEFF]/20 hover:border-[#6AAEFF]/50 transition-all duration-300"
              >
                <div className="text-4xl mb-3 filter drop-shadow-lg">{industry.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-white">{industry.name}</h3>
                <p className="text-[#A0A0A0] text-sm">{industry.count}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA - Updated for Dark Theme */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Upgrade Your IT Infrastructure?
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Get a free consultation and quote for your hardware requirements. We'll help you choose the right solutions for your business.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-6 py-3 bg-[#6AAEFF] text-white rounded-xl font-semibold hover:bg-white hover:text-[#6AAEFF] transition-all duration-300 shadow-xl hover:shadow-[#6AAEFF]/30 border border-transparent hover:border-[#6AAEFF]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open('/it-hardware-supply-uae', '_blank')}
              >
                Get Free Quote
              </motion.button>
              <motion.button
                className="px-6 py-3 bg-slate-700/60 text-white hover:bg-[#6AAEFF] hover:text-white rounded-xl font-semibold transition-all duration-300 border border-slate-600/30 hover:border-[#6AAEFF]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Catalog
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ITHardwareSupply;
