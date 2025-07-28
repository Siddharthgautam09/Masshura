import { motion } from 'framer-motion';
import { Shield, Monitor, Wrench, Clock, CheckCircle, Phone, Users, Star, TrendingUp, AlertTriangle, Settings, Zap } from 'lucide-react';

const ItConsulting = () => {
  const amcBenefits = [
    {
      icon: Shield,
      title: "Preventive Maintenance",
      description: "Regular system updates, cybersecurity patches, and proactive monitoring to prevent issues before they occur",
      highlight: "99.9% Uptime"
    },
    {
      icon: Clock,
      title: "24/7 Support Coverage",
      description: "Round-the-clock technical support with guaranteed response times for critical business operations",
      highlight: "4-Hour Response"
    },
    {
      icon: Wrench,
      title: "Hardware & Software Care",
      description: "Comprehensive maintenance for all IT equipment, software licenses, and system optimizations",
      highlight: "Complete Coverage"
    },
    {
      icon: Zap,
      title: "On-Site Support",
      description: "Expert technicians available for immediate on-site assistance and hardware replacements when needed",
      highlight: "Same-Day Service"
    }
  ];

  const targetIndustries = [
    { name: "Clinics & Healthcare", icon: "🏥", description: "Patient data security & system reliability" },
    { name: "Trading Companies", icon: "📈", description: "Inventory & financial system maintenance" },
    { name: "Retail Businesses", icon: "🛍️", description: "POS systems & customer database support" },
    { name: "Schools & Education", icon: "🎓", description: "Learning management & administrative systems" },
    { name: "Facilities Management", icon: "🏢", description: "Property management & tenant systems" },
    { name: "Growing Businesses", icon: "🚀", description: "Scalable IT infrastructure support" }
  ];

  const serviceFeatures = [
    "Regular system updates and security patches",
    "Proactive monitoring and issue prevention", 
    "Hardware diagnostics and replacements",
    "Software troubleshooting and optimization",
    "Data backup and recovery services",
    "Network security and firewall management",
    "Remote and on-site technical support",
    "IT asset management and documentation"
  ];

  return (
    <section className="relative bg-slate-900 min-h-screen overflow-hidden">
      {/* SEO Meta Tags */}
      <title>Affordable IT AMC Services in UAE & GCC | Software & Hardware Support – Maashura</title>
      <meta name="description" content="Get reliable IT AMC (Annual Maintenance Contracts) for software and hardware in Dubai, UAE, and the GCC. Ideal for clinics, schools, retailers, and growing businesses." />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        
        {/* Hero Section - Asymmetric Layout */}
        <div className="max-w-7xl mx-auto mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            {/* Left Content - 2 columns */}
            <motion.div
              className="lg:col-span-2 space-y-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-[#6AAEFF]/10 rounded-full border border-[#6AAEFF]/20">
                <span className="text-[#6AAEFF] font-semibold text-sm">IT Support & Maintenance</span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#f8fafc] leading-tight">
                IT AMC Services – <span className="text-[#6AAEFF]">Reliable Maintenance</span> for Software & Hardware
              </h2>

              <p className="text-xl text-slate-300 leading-relaxed">
                Keep your business running without interruption. <strong className="text-[#6AAEFF]">Maashura</strong> offers affordable IT AMC services for both hardware and software systems across UAE, Dubai, and GCC. From regular system updates and cybersecurity patches to on-site support and hardware replacements, we ensure your IT stays fast, secure, and headache-free.
              </p>

              <div className="bg-gradient-to-r from-slate-800/60 via-slate-700/40 to-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-slate-300 mb-2">
                      ✅ <strong className="text-white">Ideal for</strong> clinics, trading companies, retailers, schools, and facilities management firms.
                    </p>
                    <p className="text-slate-300">
                      📞 <strong className="text-[#6AAEFF]">Avoid downtime</strong> — let us handle the tech, so you can handle the business.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Stats Panel - 1 column */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-[#6AAEFF]/20 to-slate-800/80 backdrop-blur-sm rounded-3xl p-8 border border-[#6AAEFF]/30 sticky top-8">
                <div className="text-center mb-6">
                  <Settings className="w-16 h-16 text-[#6AAEFF] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">AMC Coverage</h3>
                  <p className="text-slate-300 text-sm">Complete IT Support</p>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "System Uptime", value: "99.9%", icon: TrendingUp },
                    { label: "Response Time", value: "< 4hrs", icon: Clock },
                    { label: "Client Satisfaction", value: "98%", icon: Star },
                    { label: "Coverage Areas", value: "UAE+GCC", icon: Shield }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl border border-slate-700/50"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="flex items-center space-x-3">
                        <stat.icon className="w-5 h-5 text-[#6AAEFF]" />
                        <span className="text-slate-300 text-sm">{stat.label}</span>
                      </div>
                      <span className="text-white font-bold">{stat.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* AMC Benefits - Diamond Grid Layout */}
        <div className="max-w-7xl mx-auto mb-20">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-[#f8fafc] mb-4">
              Why Choose Our <span className="text-[#6AAEFF]">AMC Services</span>?
            </h3>
            <p className="text-slate-300 text-lg max-w-3xl mx-auto">
              Comprehensive IT maintenance that keeps your business operations smooth and secure
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {amcBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-[#6AAEFF]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#6AAEFF]/10 h-full relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#6AAEFF]/5 rounded-full blur-2xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-4 bg-[#6AAEFF] rounded-xl">
                        <benefit.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="bg-[#6AAEFF]/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <span className="text-[#6AAEFF] text-xs font-bold">{benefit.highlight}</span>
                      </div>
                    </div>

                    <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-[#6AAEFF] transition-colors">
                      {benefit.title}
                    </h4>
                    
                    <p className="text-slate-300 leading-relaxed">
                      {benefit.description}
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
        </div>

        {/* Target Industries - Hexagonal Layout */}
        <div className="max-w-6xl mx-auto mb-20">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-[#f8fafc] mb-4">
              Industries We <span className="text-[#6AAEFF]">Support</span>
            </h3>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Specialized AMC services tailored for different business sectors across the GCC
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {targetIndustries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-sm rounded-2xl p-6 text-center border border-slate-700/50 hover:border-[#6AAEFF]/30 transition-all duration-300">
                  <div className="text-4xl mb-4">{industry.icon}</div>
                  <h4 className="text-white font-bold text-lg mb-2 group-hover:text-[#6AAEFF] transition-colors">
                    {industry.name}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {industry.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Service Features - Split Layout */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left - Service Features List */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Monitor className="w-6 h-6 text-[#6AAEFF] mr-3" />
                  What's Included in Our AMC
                </h3>
                
                <div className="space-y-4">
                  {serviceFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-3 p-3 rounded-xl hover:bg-slate-700/30 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <CheckCircle className="w-5 h-5 text-[#6AAEFF] flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right - Emergency Support */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                {/* Emergency Support Card */}
                <div className="bg-gradient-to-br from-red-500/10 to-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-red-500/20">
                  <div className="flex items-center space-x-4 mb-6">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                    <h3 className="text-2xl font-bold text-white">Emergency Support</h3>
                  </div>
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    Critical system failures? Our emergency response team is available 24/7 to get your business back online quickly.
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2 text-red-400">
                      <Phone className="w-4 h-4" />
                      <span>Emergency Hotline</span>
                    </div>
                    <div className="flex items-center space-x-2 text-red-400">
                      <Clock className="w-4 h-4" />
                      <span>24/7 Available</span>
                    </div>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-gradient-to-br from-[#6AAEFF]/10 to-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-[#6AAEFF]/30">
                  <h3 className="text-2xl font-bold text-white mb-4">Get Your AMC Quote</h3>
                  <p className="text-slate-300 mb-6">
                    Custom AMC packages designed for your specific business needs and budget.
                  </p>
                  
                  <div className="space-y-4">
                    <motion.button
                      className="w-full px-6 py-3 bg-[#6AAEFF] text-white rounded-xl font-semibold hover:bg-white hover:text-[#6AAEFF] transition-all duration-300 shadow-xl hover:shadow-[#6AAEFF]/30 border border-transparent hover:border-[#6AAEFF]"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Get Free AMC Quote
                    </motion.button>
                    <motion.button
                      className="w-full px-6 py-3 bg-slate-700/60 text-white hover:bg-[#6AAEFF] hover:text-white rounded-xl font-semibold transition-all duration-300 border border-slate-600/30 hover:border-[#6AAEFF]"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Schedule Consultation
                    </motion.button>
                  </div>
                </div>
              </div>
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
              <p className="text-slate-300 text-sm mb-2">AMC Team</p>
              <p className="text-xs text-slate-400">Alt: Dedicated IT AMC services team in UAE for software and hardware support</p>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-700/50">
              <p className="text-slate-300 text-sm mb-2">Preventive Maintenance</p>
              <p className="text-xs text-slate-400">Alt: Preventive maintenance and IT infrastructure monitoring for GCC businesses</p>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-700/50">
              <p className="text-slate-300 text-sm mb-2">Support Services</p>
              <p className="text-xs text-slate-400">Alt: Affordable IT support contracts for clinics, schools, and retail</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ItConsulting;
