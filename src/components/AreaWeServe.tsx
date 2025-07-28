import { motion } from 'framer-motion';
import { MapPin, Building2, Hospital, GraduationCap, ShoppingCart, Factory, Globe, ArrowRight, CheckCircle, Users, TrendingUp, Award } from 'lucide-react';

const AreasWeServe = () => {
  const uaeLocations = [
    { name: "Dubai", icon: "🏙️", description: "Real Estate & Financial Hub", projects: "150+" },
    { name: "Abu Dhabi", icon: "🏛️", description: "Government & Healthcare", projects: "120+" },
    { name: "Sharjah", icon: "🏪", description: "Trading & Education", projects: "80+" },
    { name: "Ajman", icon: "🏢", description: "Manufacturing & Retail", projects: "60+" },
    { name: "Ras Al Khaimah", icon: "⚙️", description: "Industrial & Trading", projects: "45+" },
    { name: "Fujairah", icon: "🚢", description: "Logistics & Ports", projects: "35+" },
    { name: "Umm Al Quwain", icon: "🏭", description: "Manufacturing & SMEs", projects: "25+" }
  ];

  const sectors = [
    {
      icon: Building2,
      title: "Real Estate & Facilities Management",
      locations: "Dubai, Abu Dhabi",
      description: "Property management systems, tenant portals, and facility maintenance solutions",
      stats: "200+ Properties"
    },
    {
      icon: Hospital,
      title: "Clinics, Hospitals & Labs",
      locations: "UAE-wide",
      description: "Healthcare management systems, patient records, and laboratory information systems",
      stats: "50+ Clinics"
    },
    {
      icon: GraduationCap,
      title: "Educational Institutions",
      locations: "Schools & Colleges",
      description: "Student management systems, e-learning platforms, and administrative tools",
      stats: "75+ Institutions"
    },
    {
      icon: ShoppingCart,
      title: "Trading & Retail",
      locations: "Sharjah, Ras Al Khaimah",
      description: "Inventory management, POS systems, and e-commerce platforms",
      stats: "300+ Stores"
    },
    {
      icon: Factory,
      title: "Manufacturing & Workshops",
      locations: "Al Ain, Umm Al Quwain",
      description: "Production planning, quality control, and supply chain management",
      stats: "100+ Factories"
    },
    {
      icon: Globe,
      title: "International Clients",
      locations: "KSA, Qatar, Oman & Bahrain",
      description: "Cross-border solutions with GCC regulatory compliance",
      stats: "8+ Countries"
    }
  ];

  const gccCountries = [
    { name: "Saudi Arabia", flag: "🇸🇦", projects: "25+", specialty: "Oil & Gas" },
    { name: "Qatar", flag: "🇶🇦", projects: "15+", specialty: "Construction" },
    { name: "Oman", flag: "🇴🇲", projects: "20+", specialty: "Tourism" },
    { name: "Bahrain", flag: "🇧🇭", projects: "10+", specialty: "Finance" },
    { name: "Kuwait", flag: "🇰🇼", projects: "8+", specialty: "Trading" }
  ];

  return (
    <section className="relative bg-slate-900 min-h-screen overflow-hidden">
      {/* SEO Meta Tags */}
      <title>Areas We Serve | IT Consulting in Dubai, Abu Dhabi, Sharjah & GCC – Maashura</title>
      <meta name="description" content="Maashura provides IT consultancy, ERP, CRM, and software development across Dubai, Abu Dhabi, Sharjah, and the UAE. We also serve GCC countries like Saudi Arabia, Oman, and Qatar." />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
        
        {/* Hero Section - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center px-4 py-2 bg-[#6AAEFF]/10 rounded-full border border-[#6AAEFF]/20">
              <span className="text-[#6AAEFF] font-semibold text-sm">Industries we serve</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#f8fafc] leading-tight">
              <span className="text-[#6AAEFF]">Areas</span> We Serve
            </h2>

            <p className="text-lg text-slate-300 leading-relaxed">
              At <strong className="text-[#6AAEFF]">Maashura</strong>, we proudly deliver IT consultancy, digital transformation, and enterprise software solutions across Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, and all other Emirates of the UAE.
            </p>

            <p className="text-slate-400 leading-relaxed">
              Whether you're a real estate firm in Dubai, a clinic in Abu Dhabi, a school in Sharjah, or a trading company in Oman or Saudi Arabia, our team understands your environment and delivers accordingly.
            </p>
          </motion.div>

          {/* Right Visual - Interactive UAE Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/50 relative">
              <div className="text-center mb-6">
                <h3 className="text-white font-bold text-xl">🇦🇪 UAE Coverage</h3>
                <p className="text-slate-400 text-sm">All 7 Emirates</p>
              </div>
              
              {/* UAE Visual Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#6AAEFF] text-white p-3 rounded-lg text-center text-sm font-semibold col-span-2">
                  Dubai<br /><span className="text-xs opacity-80">150+ Projects</span>
                </div>
                <div className="bg-slate-700/60 text-white p-3 rounded-lg text-center text-xs">
                  Fujairah<br /><span className="opacity-60">35+</span>
                </div>
                <div className="bg-slate-700/60 text-white p-3 rounded-lg text-center text-xs">
                  Abu Dhabi<br /><span className="opacity-60">120+</span>
                </div>
                <div className="bg-[#6AAEFF]/80 text-white p-3 rounded-lg text-center text-xs">
                  Sharjah<br /><span className="opacity-80">80+</span>
                </div>
                <div className="bg-slate-700/60 text-white p-3 rounded-lg text-center text-xs">
                  RAK<br /><span className="opacity-60">45+</span>
                </div>
              </div>

              <motion.div
                className="absolute -top-4 -right-4 bg-[#6AAEFF] text-white p-3 rounded-full shadow-lg"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MapPin className="w-5 h-5" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Statistics Bar - Horizontal Layout */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "UAE Cities", value: "7", icon: MapPin, color: "text-[#6AAEFF]" },
                { label: "GCC Countries", value: "5", icon: Globe, color: "text-[#6AAEFF]" },
                { label: "Total Projects", value: "500+", icon: TrendingUp, color: "text-[#6AAEFF]" },
                { label: "Happy Clients", value: "300+", icon: Users, color: "text-[#6AAEFF]" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* UAE Locations - Masonry Grid */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-[#f8fafc] mb-4">
              🏙️ UAE <span className="text-[#6AAEFF]">Presence</span>
            </h3>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Strategic presence across all Emirates for comprehensive coverage
            </p>
          </div>

          {/* Asymmetric Grid Layout */}
          <div className="grid grid-cols-12 gap-4 max-w-6xl mx-auto">
            {/* Dubai - Large Card */}
            <motion.div
              className="col-span-12 md:col-span-6 lg:col-span-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-gradient-to-r from-[#6AAEFF]/20 to-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-[#6AAEFF]/30 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-5xl">🏙️</div>
                  <div className="bg-[#6AAEFF]/20 rounded-full px-4 py-2">
                    <span className="text-[#6AAEFF] font-bold">150+ Projects</span>
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">Dubai</h4>
                <p className="text-slate-300 mb-4">Real Estate & Financial Hub</p>
                <p className="text-slate-400 text-sm">Leading digital transformation across Dubai's business district with cutting-edge solutions for real estate, finance, and enterprise clients.</p>
              </div>
            </motion.div>

            {/* Abu Dhabi */}
            <motion.div
              className="col-span-6 md:col-span-3 lg:col-span-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 h-full hover:border-[#6AAEFF]/30 transition-all duration-300">
                <div className="text-3xl mb-3">🏛️</div>
                <h4 className="text-lg font-bold text-white mb-2">Abu Dhabi</h4>
                <p className="text-slate-400 text-xs mb-2">Government & Healthcare</p>
                <div className="text-[#6AAEFF] text-sm font-semibold">120+ Projects</div>
              </div>
            </motion.div>

            {/* Sharjah */}
            <motion.div
              className="col-span-6 md:col-span-3 lg:col-span-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 h-full hover:border-[#6AAEFF]/30 transition-all duration-300">
                <div className="text-3xl mb-3">🏪</div>
                <h4 className="text-lg font-bold text-white mb-2">Sharjah</h4>
                <p className="text-slate-400 text-xs mb-2">Trading & Education</p>
                <div className="text-[#6AAEFF] text-sm font-semibold">80+ Projects</div>
              </div>
            </motion.div>

            {/* Remaining Emirates - Compact Cards */}
            {uaeLocations.slice(3).map((location, index) => (
              <motion.div
                key={index}
                className="col-span-4 md:col-span-2 lg:col-span-2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index + 3) * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 text-center hover:border-[#6AAEFF]/30 transition-all duration-300 h-full">
                  <div className="text-2xl mb-2">{location.icon}</div>
                  <h5 className="text-white text-sm font-bold mb-1">{location.name}</h5>
                  <p className="text-[#6AAEFF] text-xs">{location.projects}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Industry Sectors - REDESIGNED PROFESSIONALLY */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-[#f8fafc] mb-4">
              🏭 Industry <span className="text-[#6AAEFF]">Expertise</span>
            </h3>
            <p className="text-slate-300 text-lg max-w-3xl mx-auto">
              Deep domain knowledge across key sectors driving UAE's economic growth
            </p>
          </div>

          {/* Professional Grid Layout - No Alternating */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sectors.map((sector, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-[#6AAEFF]/30 transition-all duration-300 hover:shadow-2xl hover:shadow-[#6AAEFF]/10 h-full">
                  {/* Top Section - Icon and Title */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="p-3 bg-[#6AAEFF] rounded-xl border border-white/20 flex-shrink-0">
                      <sector.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-1 group-hover:text-[#6AAEFF] transition-colors">
                        {sector.title}
                      </h4>
                      <p className="text-[#6AAEFF] text-sm font-semibold">{sector.locations}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {sector.description}
                  </p>

                  {/* Bottom Section - Stats and CTA */}
                  <div className="flex items-center justify-between">
                    <div className="bg-slate-700/60 rounded-lg px-3 py-1">
                      <span className="text-white text-xs font-semibold">{sector.stats}</span>
                    </div>
                    
                    <motion.div
                      className="inline-flex items-center text-[#6AAEFF] font-semibold opacity-0 group-hover:opacity-100 transition-opacity text-sm cursor-pointer"
                      whileHover={{ x: 5 }}
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </motion.div>
                  </div>

                  {/* Animated bottom border */}
                  <motion.div
                    className="mt-4 h-1 bg-[#6AAEFF] rounded-full mx-auto"
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

        {/* GCC Countries - Horizontal Scroll/Timeline */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/40 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-slate-700/50">
            <div className="text-center mb-8">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                🌍 GCC <span className="text-[#6AAEFF]">Expansion</span>
              </h3>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Strategic partnerships across the Gulf region
              </p>
            </div>

            {/* Horizontal Cards */}
            <div className="flex flex-wrap justify-center gap-6">
              {gccCountries.map((country, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, y: -10 }}
                  className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-[#6AAEFF]/50 transition-all duration-300 text-center min-w-[150px]"
                >
                  <div className="text-4xl mb-3">{country.flag}</div>
                  <h4 className="text-white font-bold text-lg mb-2">{country.name}</h4>
                  <p className="text-[#6AAEFF] text-sm font-semibold mb-1">{country.projects} Projects</p>
                  <p className="text-slate-400 text-xs">{country.specialty}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to Action - Split Layout */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Left - Compliance Info */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
            <CheckCircle className="w-12 h-12 text-[#6AAEFF] mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Regionally Compliant Solutions
            </h3>
            <p className="text-slate-300 leading-relaxed mb-6">
              We specialize in offering regionally compliant, easy-to-use, and cost-effective IT solutions with support tailored to UAE regulatory standards and GCC expectations.
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-[#6AAEFF]" />
                <span>ISO Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-[#6AAEFF]" />
                <span>UAE Compliant</span>
              </div>
            </div>
          </div>

          {/* Right - Action Buttons */}
          <div className="bg-gradient-to-br from-[#6AAEFF]/10 to-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-[#6AAEFF]/30 flex flex-col justify-center">
            <h4 className="text-xl font-bold text-white mb-6 text-center">
              Ready to Start Your Project?
            </h4>
            
            <div className="space-y-4">
              <motion.button
                className="w-full px-6 py-3 bg-[#6AAEFF] text-white rounded-xl font-semibold hover:bg-white hover:text-[#6AAEFF] transition-all duration-300 shadow-xl hover:shadow-[#6AAEFF]/30 border border-transparent hover:border-[#6AAEFF]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Your Project
              </motion.button>
              <motion.button
                className="w-full px-6 py-3 bg-slate-700/60 text-white hover:bg-[#6AAEFF] hover:text-white rounded-xl font-semibold transition-all duration-300 border border-slate-600/30 hover:border-[#6AAEFF]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Portfolio
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Image Placeholders - Horizontal Layout */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-700/50">
            <p className="text-slate-300 text-sm mb-2">UAE & GCC Map</p>
            <p className="text-xs text-slate-400">Alt: Map showing IT consultancy coverage across Dubai, Abu Dhabi, Sharjah, and GCC countries – Maashura</p>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-700/50">
            <p className="text-slate-300 text-sm mb-2">Dubai Office</p>
            <p className="text-xs text-slate-400">Alt: IT consultants discussing project with Dubai skyline – Maashura UAE-based services</p>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 text-center border border-slate-700/50">
            <p className="text-slate-300 text-sm mb-2">Industry Icons</p>
            <p className="text-xs text-slate-400">Alt: Icons representing UAE business sectors served by Maashura – healthcare, retail, real estate</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AreasWeServe;
