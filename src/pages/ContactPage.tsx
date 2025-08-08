

import ContactForm from '@/components/ContactForm';

import { motion } from 'framer-motion';
import { Wrench, Monitor, Package, Globe, MapPin, Phone, Mail, ArrowRight, MessageCircle, Calendar, CheckCircle, Send, User, Building, Clock, Shield } from 'lucide-react';

const ContactPage = () => {
  const services = [
    {
      icon: Wrench,
      title: "IT Hardware Supply",
      description: "Laptops, routers, POS, servers, peripherals, and more",
      highlight: "Complete Infrastructure"
    },
    {
      icon: Monitor,
      title: "Software & ERP Consulting", 
      description: "Custom or ready-to-use tools for real estate, FM, clinics, education, etc.",
      highlight: "Tailored Solutions"
    },
    {
      icon: Package,
      title: "AMC & IT Support",
      description: "For both software and hardware infrastructure",
      highlight: "24/7 Support"
    },
    {
      icon: Globe,
      title: "Digital Transformation",
      description: "E-commerce, SaaS, API integration",
      highlight: "Future-Ready"
    }
  ];

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      primary: "Maashura Digital Clarity & IT Consultancy",
      secondary: "Off 43-44, Al Tawar Center, Al Qusais, Dubai, UAE"
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
      primary: "hello@maashura.com",
      secondary: "info@maashura.com"
    }
  ];

  return (
    <section className="relative bg-slate-900 min-h-screen overflow-hidden">
      {/* SEO Meta Tags */}
      <title>Start Your IT Transformation | Contact Maashura Experts</title>
      <meta name="description" content="Connect with Maashura for scalable IT hardware supply, consulting, AMC, and software development in Dubai, UAE, Saudi Arabia & the GCC. Reliable support for growing businesses." />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#6AAEFF]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl animate-pulse delay-1000" />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#6AAEFF]/10 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <motion.div
            className="text-center space-y-8"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            viewport={{ once: true }}
          >
            {/* Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-[#6AAEFF]/15 rounded-full border border-[#6AAEFF]/30">
              <MessageCircle className="w-5 h-5 text-[#6AAEFF] mr-3" />
              <span className="text-[#6AAEFF] font-semibold">UAE's Most Practical IT Experts</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#f8fafc] leading-tight">
              Let's <span className="text-[#6AAEFF]">Power Up</span> Your IT – Software, Hardware, AMC, and Expert Advice
            </h1>

            {/* Subheading */}
            <h2 className="text-2xl md:text-3xl text-slate-300 leading-relaxed max-w-4xl mx-auto">
              Whether it's software, consulting, or IT hardware – we're ready to guide you through it all. Let's get started.
            </h2>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {[
                { value: "500+", label: "Projects Delivered" },
                { value: "24/7", label: "Support Available" },
                { value: "5", label: "GCC Countries" },
                { value: "< 4hrs", label: "Response Time" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 text-center border border-slate-700/50 hover:border-[#6AAEFF]/30 transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl font-bold text-[#6AAEFF] mb-1">{stat.value}</div>
                  <div className="text-slate-300 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Why Contact Maashura Section */}
        <div className="max-w-7xl mx-auto mb-20">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#f8fafc] mb-6">
              Why Contact <span className="text-[#6AAEFF]">Maashura</span>?
            </h2>
            <p className="text-slate-300 text-xl max-w-3xl mx-auto">
              We're your single point of contact for comprehensive IT solutions across the GCC
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 hover:border-[#6AAEFF]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#6AAEFF]/10 h-full relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#6AAEFF]/5 rounded-full blur-2xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-4 bg-[#6AAEFF] rounded-2xl">
                        <service.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="bg-[#6AAEFF]/20 backdrop-blur-sm rounded-full px-4 py-2">
                        <span className="text-[#6AAEFF] text-xs font-bold">{service.highlight}</span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#6AAEFF] transition-colors">
                      🔧 {service.title}
                    </h3>
                    
                    <p className="text-slate-300 leading-relaxed">
                      {service.description}
                    </p>

                    <motion.div
                      className="mt-6 h-1 bg-[#6AAEFF] rounded-full"
                      initial={{ width: "0%" }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1.0, delay: index * 0.2 + 0.5 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* GCC Coverage */}
          <motion.div
            className="bg-gradient-to-r from-slate-800/60 via-slate-700/40 to-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center space-x-4 mb-4">
              <MapPin className="w-6 h-6 text-[#6AAEFF]" />
              <h3 className="text-2xl font-bold text-white">📍 Serving UAE, Saudi Arabia, Oman, Qatar, and the GCC</h3>
            </div>
            <p className="text-slate-300 text-lg">
              Regional expertise with local presence across the Gulf Cooperation Council countries
            </p>
          </motion.div>
        </div>

        {/* CONTACT FORM SECTION */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            
            {/* Contact Form Container - 3 columns */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <ContactForm />
            </motion.div>

            {/* Contact Information - 2 columns - SHIFTED DOWN */}
            <motion.div
              className="lg:col-span-2 space-y-8 lg:mt-16"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {/* Contact Cards */}
              {contactInfo.map((contact, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-slate-800/80 to-slate-700/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-[#6AAEFF]/30 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-[#6AAEFF] rounded-xl flex-shrink-0">
                      <contact.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-2">{contact.title}</h4>
                      <p className="text-slate-300 font-semibold mb-1">{contact.primary}</p>
                      <p className="text-slate-400 text-sm">{contact.secondary}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Quick Response Promise */}
              <motion.div
                className="bg-gradient-to-br from-[#6AAEFF]/10 to-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-[#6AAEFF]/30"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="text-center">
                  <Clock className="w-12 h-12 text-[#6AAEFF] mx-auto mb-4" />
                  <h4 className="text-white font-bold text-lg mb-2">Quick Response Promise</h4>
                  <p className="text-slate-300 text-sm mb-4">
                    We respond to all inquiries within 4 hours during business days
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-slate-400 text-xs">
                    <Shield className="w-4 h-4 text-[#6AAEFF]" />
                    <span>Your data is secure with us</span>
                  </div>
                </div>
              </motion.div>

              {/* Additional Trust Elements - NEW */}
              <motion.div
                className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                viewport={{ once: true }}
              >
                <div className="text-center">
                  <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-4" />
                  <h4 className="text-white font-bold mb-3">Why Choose Maashura?</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center space-x-2 text-slate-300">
                      <div className="w-2 h-2 bg-[#6AAEFF] rounded-full"></div>
                      <span>15+ Years IT Experience</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-slate-300">
                      <div className="w-2 h-2 bg-[#6AAEFF] rounded-full"></div> 
                      <span>GCC-Wide Service Network</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-slate-300">
                      <div className="w-2 h-2 bg-[#6AAEFF] rounded-full"></div>
                      <span>Complete IT Solutions</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Image Placeholders */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-700/50">
              <Wrench className="w-12 h-12 text-[#6AAEFF] mx-auto mb-3" />
              <p className="text-slate-300 text-sm mb-2">IT Hardware Supply</p>
              <p className="text-xs text-slate-400">Alt: Reliable IT Hardware Supply in Dubai and GCC – Maashura</p>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-700/50">
              <Monitor className="w-12 h-12 text-[#6AAEFF] mx-auto mb-3" />
              <p className="text-slate-300 text-sm mb-2">Software & ERP Consulting</p>
              <p className="text-xs text-slate-400">Alt: Custom Software and ERP Consulting in UAE by Maashura</p>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-700/50">
              <Shield className="w-12 h-12 text-[#6AAEFF] mx-auto mb-3" />
              <p className="text-slate-300 text-sm mb-2">IT AMC & Support</p>
              <p className="text-xs text-slate-400">Alt: Expert IT AMC and Digital Support Services in the GCC</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
