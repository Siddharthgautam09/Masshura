import { motion } from 'framer-motion';
import { Building2, Users, Settings, FileText, CreditCard, Car, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Boxes } from '@/components/ui/background-boxes';
import { HoverEffect } from '@/components/ui/card-hover-effect';

const Products = () => {
  // Transform products data to match HoverEffect component format
  const products = [
    {
      id: "joonms-cafm",
      title: "JoonMS CaFM",
      description: "Smart Facilities Management Software designed specifically for FM contractors in Dubai and UAE. Features include Maintenance Scheduling, Work Order Management, Asset Tracking, and Compliance Reporting.",
      link: "https://www.Joonms.com/cafm",
      icon: Building2,
      price: "Free test drive available",
      popular: true,
      features: ["Maintenance Scheduling", "Work Order Management", "Asset Tracking", "Compliance Reporting"]
    },
    {
      id: "erp-systems",
      title: "ERP Systems for Real Estate, MEP & Trading",
      description: "Ready to deploy, customizable, and region-friendly ERP solutions built for UAE businesses. Includes Real Estate Management, MEP Project Control, Trading Operations, and UAE Compliance.",
      link: "https://www.Joonms.com/erp",
      icon: Settings,
      price: "Customizable pricing",
      popular: false,
      features: ["Real Estate Management", "MEP Project Control", "Trading Operations", "UAE Compliance"]
    },
    {
      id: "inventory-accounting",
      title: "Inventory, Accounting & HRMS Platforms",
      description: "Designed for UAE compliance and simplicity with integrated business management tools. Features Inventory Control, UAE VAT Compliance, HR Management, and Payroll Processing.",
      link: "https://www.Joonms.com/inventory",
      icon: Users,
      price: "Starting from AED 500/month",
      popular: false,
      features: ["Inventory Control", "UAE VAT Compliance", "HR Management", "Payroll Processing"]
    },
    {
      id: "payment-trackers",
      title: "Cheque & Payment Trackers",
      description: "Stay on top of receivables and financial reporting with automated tracking systems. Includes Cheque Tracking, Payment Reminders, Financial Reports, and Cash Flow Management.",
      link: "https://www.Joonms.com/payments",
      icon: CreditCard,
      price: "Starting from AED 300/month",
      popular: false,
      features: ["Cheque Tracking", "Payment Reminders", "Financial Reports", "Cash Flow Management"]
    },
    {
      id: "fleet-management",
      title: "Fleet Management",
      description: "Comprehensive fleet management solution for businesses operating vehicle fleets in the GCC. Features Vehicle Tracking, Maintenance Alerts, Driver Management, and Fuel Monitoring.",
      link: "https://www.Joonms.com/fleet",
      icon: Car,
      price: "Starting from AED 400/month",
      popular: false,
      features: ["Vehicle Tracking", "Maintenance Alerts", "Driver Management", "Fuel Monitoring"]
    },
    {
      id: "attendance-calendar",
      title: "Attendance & Calendar Modules",
      description: "Everything you need to automate workforce management and scheduling operations. Includes Biometric Integration, Shift Scheduling, Leave Management, and Overtime Tracking.",
      link: "https://www.Joonms.com/attendance",
      icon: Calendar,
      price: "Starting from AED 200/month",
      popular: false,
      features: ["Biometric Integration", "Shift Scheduling", "Leave Management", "Overtime Tracking"]
    }
  ];

  return (
    <section id="products" className="relative py-12 md:py-20 bg-slate-900 overflow-hidden">
      {/* Background Layer with Boxes */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute inset-0 w-full h-full">
          <Boxes />
        </div>
        <div className="absolute inset-0 bg-slate-900/70 z-10" />
      </div>

      {/* Meta tags for SEO */}
      <meta name="keywords" content="UAE ERP Software, Facilities Management Software Dubai, CRM UAE, Real Estate ERP, Custom Software UAE, Dubai IT Solutions, GCC Enterprise Tools, Maashura" />
      <meta name="description" content="Explore Maashura – a proven suite of ERP, CRM, and Facilities Management tools developed in Dubai for UAE & GCC businesses. Ready-to-use, customizable, and cost-effective software solutions." />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Clickable H2 heading that links to JoonMS */}
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 text-[#f8fafc] leading-tight cursor-pointer hover:text-[#6AAEFF] transition-colors duration-300"
            onClick={() => window.open('https://www.Joonms.com/', '_blank')}
            whileHover={{ scale: 1.02 }}
            title="Explore Our In house Software Products"
          >
            Explore Our <span className="text-[#6AAEFF]">In-house Software Products</span>
          </motion.h2>
          
          {/* Quick button link */}
          <motion.button
            className="inline-flex items-center space-x-2 bg-[#6AAEFF] text-white px-6 py-3 rounded-full font-semibold mb-8 hover:bg-white hover:text-[#6AAEFF] transition-all duration-300 border border-transparent hover:border-[#6AAEFF] shadow-xl hover:shadow-[#6AAEFF]/30"
            onClick={() => window.open('https://www.Joonms.com/', '_blank')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Our Products</span>
            <span>→</span>
          </motion.button>

          {/* Description content */}
          <div className="max-w-5xl mx-auto text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-700/50 mb-8"
            >
              <p className="text-base md:text-lg text-[#f8fafc] leading-relaxed mb-6">
                In addition to our consultancy services, <strong className="text-[#6AAEFF]">Maashura</strong> proudly develops and maintains its own suite of enterprise tools, built specifically for businesses in the UAE, Dubai, and the wider GCC. These are currently used by leading companies across Dubai and the UAE.
              </p>
              
              <motion.div
                className="bg-slate-700/40 rounded-xl p-6 border border-slate-600/30 hover:border-[#6AAEFF]/30 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-base md:text-lg text-[#f8fafc] leading-relaxed mb-4">
                  🔗 <strong className="text-[#6AAEFF]">Click here to explore our JoonMS Product Portfolio</strong>
                </p>
                <p className="text-base text-slate-300">
                  🔹 <strong>Our Key In-House Solutions Include:</strong>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Product Cards with HoverEffect */}
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <HoverEffect items={products} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
        </motion.div>

        {/* Free Test Drive Section */}
        <motion.div
          className="mt-16 md:mt-20 text-center bg-gradient-to-br from-[#6AAEFF]/10 to-[#6ECCAF]/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#6AAEFF]/30"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Free Test Drives Available — Try Before You Commit!
          </h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            Experience our UAE-built software solutions with no commitment. All our products come with free trial periods so you can see exactly how they'll transform your business operations.
          </p>
          <motion.button
            className="bg-[#6AAEFF] text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-[#6AAEFF] transition-all duration-300 shadow-xl hover:shadow-[#6AAEFF]/30 border border-transparent hover:border-[#6AAEFF] overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            aria-label="Boost Your Business with Simple Tech Solutions"
            title="Boost Your Business with Simple Tech Solutions"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#6AAEFF]/10 to-[#6ECCAF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Boost Your Business with Simple Tech Solutions</span>
          </motion.button>
        </motion.div>

        {/* Image placeholders with proper alt text */}
        <motion.div
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-8 text-center border border-slate-700/50">
            <p className="text-slate-300 text-sm mb-2">Dashboard Screenshot</p>
            <p className="text-xs text-slate-400">Alt: "JoonMS ERP and CaFM software dashboard used in Dubai and UAE"</p>
            <p className="text-xs text-slate-400">Filename: JoonMS-erp-cafm-dashboard-dubai.jpg</p>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-8 text-center border border-slate-700/50">
            <p className="text-slate-300 text-sm mb-2">Product Icons</p>
            <p className="text-xs text-slate-400">Alt: "In-house ERP, CRM, and FM software solutions developed by JoonMS"</p>
            <p className="text-xs text-slate-400">Filename: JoonMS-inhouse-software-uae.jpg</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Products;
