import { motion } from 'framer-motion';
import { CheckCircle, DollarSign, Rocket, Globe, Users, Briefcase, RotateCcw, Smartphone, Settings, TrendingUp, Link } from 'lucide-react';
// import { Boxes } from '@/components/ui/background-boxes';

const WhyUs = () => {
  const reasons = [
    {
      icon: CheckCircle,
      title: "Easy-to-use Software Systems",
      description: "Software systems that don't require lengthy training - intuitive interfaces designed for immediate productivity."
    },
    {
      icon: DollarSign,
      title: "Budget-friendly ERP and CRM Development",
      description: "No unnecessary features, just what works. Cost-effective solutions that deliver maximum value for your investment."
    },
    {
      icon: Rocket,
      title: "Quick Deployment Times",
      description: "From idea to implementation, fast. We deliver ready-to-use solutions without months of waiting."
    },
    {
      icon: Globe,
      title: "Regionally Relevant Solutions",
      description: "Tailored specifically for businesses in Dubai, UAE, and across the GCC region with local market understanding."
    },
    {
      icon: Users,
      title: "We Listen First, Build Later",
      description: "Every solution is fully personalized. We understand your unique needs before crafting the perfect solution."
    },
    {
      icon: Briefcase,
      title: "Comprehensive Consultancy Services",
      description: "Expert guidance for custom apps, SaaS, e-commerce platforms, and data-driven tools across all industries."
    },
    {
      icon: RotateCcw,
      title: "Full-cycle Support",
      description: "From planning to post-deployment upgrades. We're with you every step of the way for long-term success."
    },
    {
      icon: Smartphone,
      title: "Mobile-first Approach",
      description: "Most apps we build are designed for both web & Android/iOS, ensuring accessibility across all platforms."
    }
  ];

  const optimizationServices = [
    {
      icon: DollarSign,
      title: "Cost-saving hardware upgrades",
      description: "Optimize your infrastructure with smart hardware investments that reduce costs and improve performance."
    },
    {
      icon: Settings,
      title: "Software replacements or add-ons",
      description: "Enhance existing systems with better alternatives or complementary solutions that integrate seamlessly."
    },
    {
      icon: Link,
      title: "Integration of old systems into new solutions",
      description: "Bridge legacy systems with modern technology for smooth operations and data continuity."
    }
  ];

  return (
    <section id="why-us" className="relative py-12 md:py-20 bg-slate-900 overflow-hidden">
      {/* Properly Contained Background Layer 
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute inset-0 w-full h-full">
          <Boxes />
        </div>
        <div className="absolute inset-0 bg-slate-900/70 z-10" />
      </div>*/}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 text-[#f8fafc] leading-tight">
            Why Choose <span className="text-[#6AAEFF]">Maashura</span> as your IT Consultant?
          </h2>
          
          {/* Full Description */}
          <div className="max-w-5xl mx-auto text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-700/50 mb-8"
            >
              <p className="text-base md:text-lg text-[#f8fafc] leading-relaxed mb-6">
                At Maashura, we go beyond advice—we <strong className="text-[#6AAEFF]">deliver</strong>. Whether you're in real estate, facilities management, retail, healthcare, or service industries, we provide ready-to-use software solutions tailored to your exact needs. No need to wait months for development—we bring tools that are battle-tested, cost-effective, and customizable, right from Day 1.
              </p>
              <p className="text-base md:text-lg text-[#f8fafc] leading-relaxed">
                We specialize in providing practical, result-driven solutions that save time, cut costs, and increase ROI. Whether you're planning a simple project or an enterprise ecosystem, we've got your back.
              </p>
            </motion.div>
          </div>

          <motion.h3
            className="text-2xl md:text-3xl font-bold text-[#f8fafc] mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            🌟 What Makes Us the Best (and Most Practical) Choice?
          </motion.h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 h-full hover:shadow-2xl hover:shadow-[#6AAEFF]/20 transition-all duration-300 border border-slate-700/50 hover:border-[#6AAEFF]/30">
                <motion.div
                  className="mb-4 p-3 bg-[#6AAEFF] rounded-xl w-fit mx-auto border border-white/20"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <reason.icon className="text-white" size={28} />
                </motion.div>
                
                <h4 className="text-lg font-bold text-white mb-3 group-hover:text-[#6AAEFF] transition-colors text-center">
                  {reason.title}
                </h4>
                
                <p className="text-sm text-white leading-relaxed text-center opacity-90">
                  {reason.description}
                </p>
                
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

        {/* Already Using a System Section */}
        <motion.div
          className="mt-16 md:mt-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#f8fafc] mb-6">
                Already Using a System? <span className="text-[#6AAEFF]">Still Worth Talking</span>
              </h3>
            </motion.div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Description Section */}
              <motion.div
                className="lg:col-span-8"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-700/50 h-full">
                  <p className="text-base md:text-lg text-[#f8fafc] leading-relaxed mb-6">
                    Whether your systems are in place or you've bought from another supplier — our job is to help you compare, optimize, and scale better. Get insights on:
                  </p>
                  
                  <div className="space-y-4">
                    {optimizationServices.map((service, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-slate-700/40 rounded-xl border border-slate-600/30 hover:border-[#6AAEFF]/30 transition-all duration-300"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02, x: 10 }}
                      >
                        <div className="flex-shrink-0">
                          <div className="p-2 bg-[#6AAEFF]/20 rounded-lg border border-[#6AAEFF]/30">
                            <service.icon className="text-[#6AAEFF]" size={20} />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold mb-2">{service.title}</h4>
                          <p className="text-slate-300 text-sm leading-relaxed">{service.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* CTA Section */}
              <motion.div
                className="lg:col-span-4 flex justify-center"
                initial={{ opacity: 0, x: 50, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-br from-[#6AAEFF]/10 to-[#6ECCAF]/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#6AAEFF]/30 w-full max-w-sm flex flex-col justify-center items-center text-center transform translate-y-8">
                  <motion.div
                    className="mb-6 p-4 bg-[#6AAEFF] rounded-2xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TrendingUp className="text-white" size={32} />
                  </motion.div>
                  
                  <h4 className="text-xl font-bold text-white mb-4">
                    Ready to Optimize Your Current Systems?
                  </h4>
                  
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                    Don't let existing investments go to waste. Let us help you maximize their potential.
                  </p>
                  
                  <motion.button
                    className="w-full px-6 py-4 rounded-full bg-[#6AAEFF] text-white font-semibold hover:bg-white hover:text-[#6AAEFF] transition-all duration-300 hover:scale-105 border border-transparent hover:border-[#6AAEFF] shadow-xl hover:shadow-[#6AAEFF]/30 overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const element = document.getElementById('contact');
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }}
                    aria-label="Get Expert Advice for ERP & Software in the UAE"
                    title="Get Expert Advice for ERP & Software in the UAE"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#6AAEFF]/10 to-[#6ECCAF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 text-sm">Get Expert Advice for ERP & Software in the UAE</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Original Call to Action */}
        <motion.div
          className="text-center mt-12 md:mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-lg md:text-xl text-white mb-6">
            Ready to transform your business with our expertise?
          </p>
          <motion.button
            className="relative px-8 py-4 rounded-full bg-[#6AAEFF] text-white font-semibold text-lg hover:bg-white hover:text-[#6AAEFF] transition-all duration-300 hover:scale-105 border border-transparent hover:border-[#6AAEFF] shadow-xl hover:shadow-[#6AAEFF]/30 overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#6AAEFF]/10 to-[#6ECCAF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Get Started Today</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyUs;
