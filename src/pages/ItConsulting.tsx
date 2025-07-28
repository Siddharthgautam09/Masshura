import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, ArrowRight, MessageCircle, Calendar, CheckCircle, Rocket, Building, Globe } from 'lucide-react';
import { Link } from "react-router-dom";

const ItConsulting = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      primary: "Maashura Engineers & Software Consultants",
      secondary: "Al Qusais, Dubai, UAE"
    },
    {
      icon: Phone,
      title: "Phone / WhatsApp",
      primary: "+971 0505408757",
      secondary: "Available 24/7 for urgent support"
    },
    {
      icon: Mail,
      title: "Email Us",
      primary: "support@joonms.com",
      secondary: "info@joonms.com"
    }
  ];

  const services = [
    { name: "Custom Software Development", icon: "💻" },
    { name: "IT AMC Services", icon: "🔧" },
    { name: "ERP Solutions", icon: "📊" },
    { name: "Digital Transformation", icon: "🚀" }
  ];

  return (
    <section className="relative bg-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#6AAEFF]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/3 rounded-full blur-3xl animate-pulse delay-1000" />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#6AAEFF]/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        
        {/* Header Section - Centered */}
        <div className="max-w-5xl mx-auto text-center mb-20">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Service Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-[#6AAEFF]/15 rounded-full border border-[#6AAEFF]/30">
              <MessageCircle className="w-5 h-5 text-[#6AAEFF] mr-3" />
              <span className="text-[#6AAEFF] font-semibold">Ready to Get Started?</span>
            </div>

            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#f8fafc] leading-tight">
              Get in Touch with <span className="text-[#6AAEFF]">Maashura</span> – IT Consultants You Can Trust
            </h2>

            {/* Main Content */}
            <div className="bg-gradient-to-br from-slate-800/60 via-slate-700/40 to-slate-800/60 backdrop-blur-sm rounded-3xl p-10 border border-slate-700/50">
              <p className="text-xl text-slate-300 leading-relaxed mb-6 max-w-4xl mx-auto">
                Ready to transform your business with smart software solutions, affordable IT AMC, or expert digital guidance?
              </p>
              
              <p className="text-lg text-slate-400 leading-relaxed max-w-4xl mx-auto mb-8">
                <strong className="text-[#6AAEFF]">Maashura</strong> provides fast, flexible, and result-driven IT consultancy services for businesses in Dubai, Abu Dhabi, Saudi Arabia, Oman, and across the GCC. Whether you're looking for custom software, AMC support, or want to explore our in-house ERP tools — we're here to help.
              </p>

              {/* Services Quick Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    className="bg-slate-800/60 rounded-xl p-4 text-center border border-slate-700/50 hover:border-[#6AAEFF]/30 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl mb-2">{service.icon}</div>
                    <p className="text-white text-sm font-medium">{service.name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contact Information - Uniform Color Scheme */}
        <div className="max-w-6xl mx-auto mb-20">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {contactInfo.map((contact, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 30, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 hover:border-[#6AAEFF]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#6AAEFF]/10 h-full relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-[#6AAEFF]/5 rounded-full blur-2xl" />
                  
                  <div className="relative z-10">
                    {/* Icon and Title */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="p-4 bg-[#6AAEFF] rounded-2xl shadow-lg">
                        <contact.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-[#6AAEFF] transition-colors">
                        📍 {contact.title}
                      </h3>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-3">
                      <p className="text-white font-semibold text-lg">
                        {contact.primary}
                      </p>
                      <p className="text-slate-300">
                        {contact.secondary}
                      </p>
                    </div>

                    {/* Animated Progress Bar */}
                    <motion.div
                      className="mt-6 h-1 bg-[#6AAEFF] rounded-full"
                      initial={{ width: "0%" }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1.0, delay: index * 0.2 + 0.8 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Coverage Area Visual */}
        <div className="max-w-5xl mx-auto mb-20">
          <motion.div
            className="bg-gradient-to-r from-slate-800/80 via-slate-700/60 to-slate-800/80 backdrop-blur-sm rounded-3xl p-12 border border-slate-700/50"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <Globe className="w-16 h-16 text-[#6AAEFF] mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-4">
                Serving Businesses Across <span className="text-[#6AAEFF]">GCC</span>
              </h3>
              <p className="text-slate-300 text-lg">
                From Dubai to Riyadh, from Muscat to Doha - we're your trusted IT partners
              </p>
            </div>

            {/* GCC Countries Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                { country: "UAE", flag: "🇦🇪", city: "Dubai, Abu Dhabi" },
                { country: "Saudi Arabia", flag: "🇸🇦", city: "Riyadh, Jeddah" },
                { country: "Oman", flag: "🇴🇲", city: "Muscat" },
                { country: "Qatar", flag: "🇶🇦", city: "Doha" },
                { country: "Bahrain", flag: "🇧🇭", city: "Manama" }
              ].map((location, index) => (
                <motion.div
                  key={index}
                  className="bg-slate-800/60 rounded-xl p-4 text-center border border-slate-700/50 hover:border-[#6AAEFF]/30 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, y: -5 }}
                >
                  <div className="text-3xl mb-2">{location.flag}</div>
                  <h4 className="text-white font-bold text-sm mb-1">{location.country}</h4>
                  <p className="text-slate-400 text-xs">{location.city}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Call to Action - Dynamic Design */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Background with Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#6AAEFF]/20 via-purple-500/10 to-[#6AAEFF]/20 rounded-3xl blur-sm" />
            
            <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-700/80 backdrop-blur-xl rounded-3xl p-12 border border-[#6AAEFF]/30 text-center">
              {/* Animated Rocket Icon */}
              <motion.div
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#6AAEFF] to-blue-600 rounded-full mb-8 shadow-2xl"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                <Rocket className="w-10 h-10 text-white" />
              </motion.div>

              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to <span className="text-[#6AAEFF]">Launch</span> Your Digital Transformation?
              </h3>
              
              <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                Don't let outdated systems hold your business back. Start your digital roadmap today with Maashura's expert guidance.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <motion.button
                    className="group inline-flex items-center space-x-3 px-10 py-5 bg-[#6AAEFF] text-white rounded-xl font-bold text-lg hover:bg-white hover:text-[#6AAEFF] transition-all duration-300 shadow-xl hover:shadow-[#6AAEFF]/30 border border-transparent hover:border-[#6AAEFF]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Rocket className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    <span>Launch Your Digital Roadmap</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                
                <motion.button
                  className="px-8 py-5 bg-slate-700/60 text-white hover:bg-[#6AAEFF] hover:text-white rounded-xl font-semibold text-lg transition-all duration-300 border border-slate-600/30 hover:border-[#6AAEFF]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Calendar className="w-5 h-5 inline mr-2" />
                  Schedule Free Consultation
                </motion.button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center space-x-8 mt-8 pt-8 border-t border-slate-700/50">
                <div className="flex items-center space-x-2 text-slate-400">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Free Initial Consultation</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm">24/7 Support Available</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-400">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm">GCC-Wide Coverage</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Image Placeholders */}
        <div className="max-w-6xl mx-auto mt-16">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-700/50">
              <Building className="w-12 h-12 text-[#6AAEFF] mx-auto mb-3" />
              <p className="text-slate-300 text-sm mb-2">Business Solutions</p>
              <p className="text-xs text-slate-400">Alt: Streamline business with Maashura IT consultants in UAE and GCC</p>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-700/50">
              <Globe className="w-12 h-12 text-[#6AAEFF] mx-auto mb-3" />
              <p className="text-slate-300 text-sm mb-2">ERP Solutions</p>
              <p className="text-xs text-slate-400">Alt: Affordable ERP and custom software upgrades for Dubai & beyond</p>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-700/50">
              <Rocket className="w-12 h-12 text-[#6AAEFF] mx-auto mb-3" />
              <p className="text-slate-300 text-sm mb-2">Digital Transformation</p>
              <p className="text-xs text-slate-400">Alt: Business-ready IT solutions by Maashura – start today</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ItConsulting;
