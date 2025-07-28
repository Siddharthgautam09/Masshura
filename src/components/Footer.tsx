import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Building, Users, Settings, Globe, ArrowRight, Shield, Star, Award, CheckCircle, FileText } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const itServices = [
    { name: 'IT Consultancy Services', href: '/it-consulting', icon: Settings },
    { name: 'IT Hardware Supply in UAE', href: '/hardware-supply', icon: Building },
    { name: 'IT AMC Services', href: '/amc-services', icon: Shield },
    { name: 'Start Your IT Transformation – Contact Us', href: '/contact', icon: ArrowRight }
  ];

  const whyMaashura = [
    { name: 'Why Choose Maashura as Your IT Consultant', href: '/why-choose-us' },
    { name: 'Industries We Serve', href: '/industries' },
    { name: 'Areas We Serve – Across the GCC', href: '/coverage-areas' },
    { name: 'Already Using a System? Still Worth Talking', href: '/existing-systems' }
  ];

  const quickAccess = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services Overview', href: '/services' },
    { name: 'Contact Us', href: '/contact' }
  ];

  const partnerLinks = [
    { name: 'Become a Supplier or Partner', href: '/become-supplier' },
    { name: 'Vendor / Supplier Registration', href: '/supplier-registration' }
  ];

  const resources = [
    { name: 'Meta Titles & Descriptions', href: '/seo-meta-guide', icon: FileText },
    { name: 'Alt Text Recommendations', href: '/alt-text-guide', icon: FileText },
    { name: 'Keyword & Linking Strategy', href: '/seo-strategy', icon: FileText }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:bg-sky-500' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-700' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' }
  ];

  const gccCountries = [
    { name: 'UAE', flag: '🇦🇪' },
    { name: 'Saudi', flag: '🇸🇦' },
    { name: 'Qatar', flag: '🇶🇦' },
    { name: 'Oman', flag: '🇴🇲' },
    { name: 'Bahrain', flag: '🇧🇭' },
    { name: 'Kuwait', flag: '🇰🇼' }
  ];

  return (
    <>
      {/* Clean Separation Line */}
      <motion.div 
        className="w-full h-px bg-gradient-to-r from-transparent via-[#6AAEFF]/60 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      />
      
      <footer className="relative bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden">
        {/* Cleaner Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 w-96 h-96 bg-[#6AAEFF]/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1.1, 1, 1.1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          
          {/* Clean Hero Section */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center px-6 py-3 bg-[#6AAEFF]/15 rounded-full border border-[#6AAEFF]/30 mb-6">
              <Building className="w-5 h-5 text-[#6AAEFF] mr-3" />
              <span className="text-[#6AAEFF] font-bold">Maashura IT Consultancy</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Transforming <span className="text-[#6AAEFF]">Businesses</span> Across the GCC
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8">
              Expert IT solutions, innovative software development, and reliable hardware supply
            </p>
            
            {/* Clean Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {[
                { icon: Award, text: '15+ Years Experience' },
                { icon: Users, text: '500+ Happy Clients' },
                { icon: Globe, text: 'GCC-Wide Coverage' },
                { icon: Star, text: '24/7 Expert Support' }
              ].map((badge, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-2 bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-700/50"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <badge.icon className="w-4 h-4 text-[#6AAEFF]" />
                  <span className="text-slate-300 text-sm font-medium">{badge.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Uniform GCC Coverage Container */}
            <motion.div
              className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 max-w-4xl mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center space-x-4 mb-6">
                <Globe className="w-8 h-8 text-[#6AAEFF]" />
                <h3 className="text-2xl font-bold text-white">Serving Across GCC</h3>
              </div>
              
              {/* Uniform Country Grid */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {gccCountries.map((country, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center p-4 bg-slate-800/60 rounded-xl border border-slate-700/50 hover:border-[#6AAEFF]/50 hover:bg-[#6AAEFF]/10 transition-all duration-300 cursor-pointer h-24 justify-center"
                    whileHover={{ scale: 1.05, y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-2xl mb-2">{country.flag}</span>
                    <span className="text-white text-sm font-medium text-center">{country.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Clean Services Section */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-white mb-4">
                Our <span className="text-[#6AAEFF]">IT Services</span>
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {itServices.map((service, index) => (
                <motion.a
                  key={index}
                  href={service.href}
                  className="group block"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 group-hover:border-[#6AAEFF]/50 transition-all duration-300 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-[#6AAEFF] rounded-lg group-hover:scale-110 transition-transform duration-300">
                        <service.icon className="w-5 h-5 text-white" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#6AAEFF] group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    <h4 className="text-white font-semibold text-sm group-hover:text-[#6AAEFF] transition-colors">
                      {service.name}
                    </h4>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Section - 4 Columns (Without Get In Touch) */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Why Maashura */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h4 className="text-lg font-bold text-white mb-6 flex items-center">
                  <Building className="w-4 h-4 text-[#6AAEFF] mr-2" />
                  Why Maashura?
                </h4>
                <ul className="space-y-3">
                  {whyMaashura.map((item, index) => (
                    <li key={index}>
                      <motion.a
                        href={item.href}
                        className="text-slate-300 hover:text-[#6AAEFF] transition-colors text-sm leading-relaxed block"
                        whileHover={{ x: 5 }}
                      >
                        {item.name}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Quick Access */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="text-lg font-bold text-white mb-6 flex items-center">
                  <Globe className="w-4 h-4 text-[#6AAEFF] mr-2" />
                  Quick Access
                </h4>
                <ul className="space-y-3">
                  {quickAccess.map((link, index) => (
                    <li key={index}>
                      <motion.a
                        href={link.href}
                        className="text-slate-300 hover:text-[#6AAEFF] transition-colors text-sm leading-relaxed block"
                        whileHover={{ x: 5 }}
                      >
                        {link.name}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Resources */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h4 className="text-lg font-bold text-white mb-6 flex items-center">
                  <FileText className="w-4 h-4 text-[#6AAEFF] mr-2" />
                  Resources
                </h4>
                <ul className="space-y-3">
                  {resources.map((resource, index) => (
                    <li key={index}>
                      <motion.a
                        href={resource.href}
                        className="flex items-center text-slate-300 hover:text-[#6AAEFF] transition-colors text-sm leading-relaxed group"
                        whileHover={{ x: 5 }}
                      >
                        <resource.icon className="w-3 h-3 mr-2 group-hover:text-[#6AAEFF] transition-colors" />
                        {resource.name}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Partner Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h4 className="text-lg font-bold text-white mb-6 flex items-center">
                  <Users className="w-4 h-4 text-[#6AAEFF] mr-2" />
                  Partner With Us
                </h4>
                <ul className="space-y-3">
                  {partnerLinks.map((link, index) => (
                    <li key={index}>
                      <motion.a
                        href={link.href}
                        className="text-slate-300 hover:text-[#6AAEFF] transition-colors text-sm leading-relaxed block"
                        whileHover={{ x: 5 }}
                      >
                        {link.name}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>

          {/* Get In Touch - Narrower Width with Rounded Corners */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-br from-[#6AAEFF]/15 to-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-[#6AAEFF]/30">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  
                  {/* Left Side - Contact Info */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    {/* Header with Icon */}
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-[#6AAEFF] rounded-lg mr-4">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-2xl font-bold text-white">Get In Touch</h4>
                    </div>
                    
                    {/* Contact Details */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-[#6AAEFF] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-white font-medium">Dubai, UAE</p>
                          <p className="text-slate-300 text-sm">GCC Coverage</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-[#6AAEFF] flex-shrink-0" />
                        <a href="tel:+971505408757" className="text-slate-300 hover:text-white transition-colors">
                          +971 0505408757
                        </a>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-[#6AAEFF] flex-shrink-0" />
                        <a href="mailto:support@joonms.com" className="text-slate-300 hover:text-white transition-colors">
                          support@joonms.com
                        </a>
                      </div>
                    </div>
                  </motion.div>

                  {/* Right Side - CTA & Social */}
                  <motion.div
                    className="text-center lg:text-right"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <p className="text-slate-300 mb-6">
                      Ready to transform your business? Let's discuss your IT needs and create solutions that drive growth.
                    </p>

                    {/* CTA Button */}
                    <motion.a
                      href="/contact"
                      className="inline-block bg-[#6AAEFF] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-[#6AAEFF] transition-all duration-300 mb-6"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Free Consultation
                    </motion.a>

                    {/* Social Links */}
                    <div className="flex justify-center lg:justify-end space-x-3">
                      {socialLinks.map((social, index) => (
                        <motion.a
                          key={index}
                          href={social.href}
                          className={`p-3 bg-slate-800/50 rounded-lg ${social.color} text-white transition-all duration-300`}
                          whileHover={{ scale: 1.1 }}
                        >
                          <social.icon size={16} />
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Clean Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="border-t border-slate-700/50 pt-8">
              <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6">
                <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                  <div className="text-center lg:text-left">
                    <p className="text-slate-300 text-lg mb-1">
                      © {currentYear} <strong className="text-[#6AAEFF]">Maashura IT Consultancy</strong>
                    </p>
                    <p className="text-slate-400 text-sm">
                      Expert-Led IT Support & Infrastructure | All rights reserved
                    </p>
                  </div>
                  
                  <div className="flex space-x-6 text-sm">
                    {[
                      { name: 'Privacy Policy', href: '/privacy-policy' },
                      { name: 'Terms of Service', href: '/terms-of-service' },
                      { name: 'Sitemap', href: '/sitemap' }
                    ].map((link, index) => (
                      <motion.a
                        key={index}
                        href={link.href}
                        className="text-slate-400 hover:text-[#6AAEFF] transition-colors"
                        whileHover={{ y: -2 }}
                      >
                        {link.name}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
