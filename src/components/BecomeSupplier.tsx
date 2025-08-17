import { motion } from 'framer-motion';
import { Code, Laptop, Cloud, Wrench, Truck, Handshake, ArrowRight, CheckCircle, Users, Globe, Star, Award } from 'lucide-react';
import { Link } from "react-router-dom";

const BecomeSupplier = () => {
  const partnerTypes = [
    {
      icon: Code,
      title: "Custom Software & Web App Development",
      description: "Frontend, backend, mobile apps, and custom enterprise solutions for businesses across the GCC region",
      benefits: ["Direct client referrals", "Project collaboration opportunities", "Revenue sharing partnerships"]
    },
    {
      icon: Laptop,
      title: "Hardware & Equipment Supply",
      description: "Comprehensive supply of laptops, network devices, peripherals, and IT hardware for enterprise clients",
      benefits: ["Bulk order contracts", "Regular supply agreements", "UAE-wide distribution network"]
    },
    {
      icon: Cloud,
      title: "Cloud & Server Infrastructure",
      description: "Infrastructure providers specializing in cloud storage, server hardware, and enterprise backup solutions",
      benefits: ["Enterprise client access", "Long-term partnerships", "24/7 technical support"]
    },
    {
      icon: Wrench,
      title: "AMC & Technical Support",
      description: "Annual maintenance contracts, ongoing technical support, and system administration services",
      benefits: ["Recurring revenue streams", "Client retention programs", "Service excellence standards"]
    },
    {
      icon: Truck,
      title: "Logistics & Installation Services",
      description: "Professional installation, deployment, logistics coordination, and on-site technical services",
      benefits: ["Project-based contracts", "Installation agreements", "Ongoing maintenance work"]
    }
  ];

  const gccMarkets = [
    { country: "United Arab Emirates", flag: "🇦🇪", clients: "500+", description: "Primary market with established presence" },
    { country: "Saudi Arabia", flag: "🇸🇦", clients: "250+", description: "Growing market with oil & gas focus" },
    { country: "Qatar", flag: "🇶🇦", clients: "120+", description: "Construction and infrastructure projects" },
    { country: "Oman", flag: "🇴🇲", clients: "95+", description: "Tourism and hospitality sector growth" },
    { country: "Bahrain", flag: "🇧🇭", clients: "80+", description: "Financial services and banking sector" },
    { country: "Kuwait", flag: "🇰🇼", clients: "65+", description: "Trading and commercial enterprises" }
  ];

  const partnerBenefits = [
    { icon: Users, title: "Extensive Client Network", description: "Access to our 1000+ active client database across GCC" },
    { icon: Globe, title: "Regional Market Entry", description: "Seamless expansion to UAE, Saudi Arabia, and Gulf countries" },
    { icon: Star, title: "Quality Assurance Program", description: "Maintain excellence with our proven quality processes" },
    { icon: Award, title: "Brand Partnership", description: "Associate with an established consultancy brand" }
  ];

  return (
    <section className="relative bg-slate-900 min-h-screen overflow-hidden">
      {/* SEO Meta Tags */}
      <title>Become a Supplier – Partner with Maashura Digital Clarity & IT Consultancy in UAE & GCC</title>
      <meta name="description" content="Are you a software developer, IT vendor, or B2B service provider looking for customers in the UAE, Saudi Arabia, or the GCC? Join Maashura as a supplier partner today." />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        
        {/* Hero Section - Enhanced Layout */}
        <motion.div
          className="grid grid-cols-1 xl:grid-cols-5 gap-12 mb-24"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* Left Content - 3 columns */}
          <div className="xl:col-span-3 space-y-8">
            <motion.div
              className="inline-flex items-center px-6 py-3 bg-[#6AAEFF]/15 rounded-full border border-[#6AAEFF]/30"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="text-[#6AAEFF] font-semibold">Supplier Registration Portal</span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl lg:text-7xl font-bold text-[#f8fafc] leading-tight"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Become a <span className="text-[#6AAEFF]">Supplier or Partner</span> with Maashura
            </motion.h2>

            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-xl text-slate-300 leading-relaxed">
                Are you a supplier or software developer looking for clients in the UAE, Saudi Arabia, or the wider GCC? <strong className="text-[#6AAEFF]">Maashura</strong> partners with reliable vendors, developers, and service providers to deliver complete IT solutions — from hardware supply to custom software development and AMC support.
              </p>

              <p className="text-lg text-slate-400 leading-relaxed">
                Whether you're a B2B vendor expanding into Dubai, a software firm searching for clients in Saudi Arabia, or a distributor offering bulk IT hardware, we want to collaborate and grow together.
              </p>
            </motion.div>
            <Link to="/SupplierRegistration" className="mt-6">
  <motion.button
    className="group inline-flex items-center space-x-3 bg-[#6AAEFF] text-white px-10 py-5 rounded-xl font-semibold text-lg hover:bg-white hover:text-[#6AAEFF] transition-all duration-300 shadow-xl hover:shadow-[#6AAEFF]/30 border border-transparent hover:border-[#6AAEFF]"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.8 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    
  >
    <span>Apply as Partner Today</span>
    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
  </motion.button>
</Link>
          </div>

          {/* Right Visual - 2 columns */}
          <motion.div
            className="xl:col-span-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-[#6AAEFF]/20 to-slate-800/80 backdrop-blur-sm rounded-3xl p-10 border border-[#6AAEFF]/30 sticky top-8">
              <div className="text-center mb-8">
                <Handshake className="w-20 h-20 text-[#6AAEFF] mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-3">Partnership Benefits</h3>
                <p className="text-slate-300">Join our expanding network</p>
              </div>

              <div className="space-y-6">
                {partnerBenefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-slate-800/60 rounded-xl border border-slate-700/50 hover:border-[#6AAEFF]/30 transition-all duration-300"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <benefit.icon className="w-6 h-6 text-[#6AAEFF] flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-white font-semibold mb-1">{benefit.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Partnership Categories - Enhanced Grid */}
        <motion.div
          className="mb-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl md:text-5xl font-bold text-[#f8fafc] mb-6">
              🔹 Partnership <span className="text-[#6AAEFF]">Categories</span>
            </h3>
            <p className="text-slate-300 text-xl max-w-4xl mx-auto leading-relaxed">
              Join our partner ecosystem and accelerate your business growth across the GCC region with established market presence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {partnerTypes.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 80, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -15, scale: 1.03 }}
                className="group perspective-1000"
              >
                <div className="bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 hover:border-[#6AAEFF]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#6AAEFF]/15 h-full">
                  <motion.div
                    className="mb-8"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-5 bg-[#6AAEFF] rounded-2xl w-fit border-2 border-white/20">
                      <partner.icon className="w-10 h-10 text-white" />
                    </div>
                  </motion.div>

                  <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-[#6AAEFF] transition-colors">
                    {partner.title}
                  </h4>
                  
                  <p className="text-slate-300 leading-relaxed mb-8">
                    {partner.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    <h5 className="text-[#6AAEFF] font-semibold">Key Benefits:</h5>
                    {partner.benefits.map((benefit, benefitIndex) => (
                      <motion.div
                        key={benefitIndex}
                        className="flex items-center text-slate-400"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: benefitIndex * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="w-2 h-2 bg-[#6AAEFF] rounded-full mr-3 flex-shrink-0" />
                        {benefit}
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    className="inline-flex items-center text-[#6AAEFF] font-semibold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    whileHover={{ x: 10 }}
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </motion.div>

                  <motion.div
                    className="mt-8 h-1 bg-[#6AAEFF] rounded-full mx-auto"
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1.2, delay: index * 0.1 + 0.5 }}
                    viewport={{ once: true }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* GCC Market Opportunities - REDESIGNED WITH GRAY TEXT */}
        <motion.div
          className="mb-24"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-br from-slate-800/80 via-slate-700/60 to-slate-800/80 backdrop-blur-sm rounded-3xl p-12 border border-slate-700/50 shadow-2xl">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                🌍 GCC Market <span className="text-[#6AAEFF]">Opportunities</span>
              </h3>
              <p className="text-slate-300 text-xl max-w-3xl mx-auto leading-relaxed">
                Access expanding markets across the Gulf region through our established network and regional expertise
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {gccMarkets.map((market, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, y: -10 }}
                  className="group"
                >
                  <div className="bg-gray-700/60 backdrop-blur-md rounded-2xl p-8 text-center border border-gray-600/50 hover:border-[#6AAEFF]/40 transition-all duration-500 shadow-lg hover:shadow-xl">
                    <motion.div
                      className="text-5xl mb-6"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {market.flag}
                    </motion.div>
                    
                    <h4 className="text-gray-300 font-semibold text-lg mb-3 group-hover:text-gray-200 transition-colors">
                      {market.country}
                    </h4>
                    
                    <div className="space-y-2">
                      <p className="text-[#6AAEFF] font-bold text-lg">
                        {market.clients} Clients
                      </p>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {market.description}
                      </p>
                    </div>

                    <motion.div
                      className="mt-6 h-1 bg-gradient-to-r from-transparent via-[#6AAEFF] to-transparent rounded-full"
                      initial={{ width: "0%" }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1.0, delay: index * 0.1 + 0.8 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Process Steps - Enhanced Timeline */}
        <motion.div
          className="mb-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl md:text-5xl font-bold text-[#f8fafc] mb-6">
              Partnership <span className="text-[#6AAEFF]">Process</span>
            </h3>
            <p className="text-slate-300 text-xl max-w-3xl mx-auto">
              Simple 4-step process to join our trusted partner ecosystem
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { step: "01", title: "Application", description: "Submit comprehensive company details, expertise areas, and portfolio" },
                { step: "02", title: "Evaluation", description: "Our team thoroughly evaluates capabilities, quality standards, and market fit" },
                { step: "03", title: "Onboarding", description: "Complete partnership agreements, system setup, and integration processes" },
                { step: "04", title: "Collaboration", description: "Begin receiving projects, access client network, and grow together" }
              ].map((process, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, y: -10 }}
                  className="text-center group"
                >
                  <div className="relative mb-8">
                    <motion.div
                      className="w-20 h-20 bg-[#6AAEFF] rounded-full flex items-center justify-center mx-auto border-4 border-slate-900 shadow-xl"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <span className="text-white font-bold text-xl">{process.step}</span>
                    </motion.div>
                    {index < 3 && (
                      <motion.div
                        className="hidden lg:block absolute top-10 left-full w-12 h-0.5 bg-[#6AAEFF]/50"
                        initial={{ width: "0%" }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1.0, delay: index * 0.3 + 0.5 }}
                        viewport={{ once: true }}
                      />
                    )}
                  </div>
                  <h4 className="text-white font-bold text-xl mb-4 group-hover:text-[#6AAEFF] transition-colors">
                    {process.title}
                  </h4>
                  <p className="text-slate-400 leading-relaxed">
                    {process.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Final CTA - Enhanced Two Column */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-10 border border-slate-700/50"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle className="w-16 h-16 text-[#6AAEFF] mb-6" />
            <h3 className="text-3xl font-bold text-white mb-6">
              Ready to Partner with Us?
            </h3>
            <p className="text-slate-300 leading-relaxed mb-8 text-lg">
              Join our network of trusted partners and expand your business across the UAE, Saudi Arabia, and the GCC region. We're seeking reliable suppliers who share our commitment to quality and excellence.
            </p>
            
            <div className="space-y-4 text-slate-400">
              {[
                { icon: Users, text: "1000+ Active Client Database" },
                { icon: Globe, text: "6 GCC Countries Coverage" },
                { icon: Award, text: "Established Market Presence Since 2018" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <item.icon className="w-5 h-5 text-[#6AAEFF]" />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-[#6AAEFF]/15 to-slate-800/60 backdrop-blur-sm rounded-3xl p-10 border border-[#6AAEFF]/30"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-2xl font-bold text-white mb-8 text-center">
              Start Your Partnership Journey
            </h4>
            
            <div className="space-y-6">
              {[
                { text: "Apply as Technology Partner", primary: true },
                { text: "Download Partnership Information", primary: false },
                { text: "Schedule Partnership Consultation", primary: false }
              ].map((button, index) => (
                <motion.button
                  key={index}
                  className={`w-full px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    button.primary
                      ? 'bg-[#6AAEFF] text-white hover:bg-white hover:text-[#6AAEFF] shadow-xl hover:shadow-[#6AAEFF]/30 border border-transparent hover:border-[#6AAEFF]'
                      : 'bg-slate-700/60 text-white hover:bg-[#6AAEFF] hover:text-white border border-slate-600/30 hover:border-[#6AAEFF]'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {button.text}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BecomeSupplier;
