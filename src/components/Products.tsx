import { motion } from 'framer-motion';
import { Building2, Users, Settings, FileText, CreditCard, Car, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ProductOrderDialog from './ProductOrderDialog';
// import { Boxes } from '@/components/ui/background-boxes';
import { HoverEffect } from '@/components/ui/card-hover-effect';

const Products = () => {
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });
  // Transform products data to match HoverEffect component format
  const products = [
    {
      id: "joonms-cafm",
      title: "JoonMS CaFM",
      description: "Smart Facilities Management Software designed specifically for FM contractors in Dubai and UAE. Features include Maintenance Scheduling, Work Order Management, Asset Tracking, and Compliance Reporting.",
      link: "https://www.Joonms.com/cafm",
      icon: Building2,
      price: "₹15,000",
      actualPrice: 15000,
      popular: true,
      features: ["Maintenance Scheduling", "Work Order Management", "Asset Tracking", "Compliance Reporting"]
    },
    {
      id: "erp-systems",
      title: "ERP Systems for Real Estate, MEP & Trading",
      description: "Ready to deploy, customizable, and region-friendly ERP solutions built for UAE businesses. Includes Real Estate Management, MEP Project Control, Trading Operations, and UAE Compliance.",
      link: "https://www.Joonms.com/erp",
      icon: Settings,
      price: "₹25,000",
      actualPrice: 25000,
      popular: false,
      features: ["Real Estate Management", "MEP Project Control", "Trading Operations", "UAE Compliance"]
    },
    {
      id: "inventory-accounting",
      title: "Inventory, Accounting & HRMS Platforms",
      description: "Designed for UAE compliance and simplicity with integrated business management tools. Features Inventory Control, UAE VAT Compliance, HR Management, and Payroll Processing.",
      link: "https://www.Joonms.com/inventory",
      icon: Users,
      price: "₹18,000",
      actualPrice: 18000,
      popular: false,
      features: ["Inventory Control", "UAE VAT Compliance", "HR Management", "Payroll Processing"]
    },
    {
      id: "payment-trackers",
      title: "Cheque & Payment Trackers",
      description: "Stay on top of receivables and financial reporting with automated tracking systems. Includes Cheque Tracking, Payment Reminders, Financial Reports, and Cash Flow Management.",
      link: "https://www.Joonms.com/payments",
      icon: CreditCard,
      price: "₹12,000",
      actualPrice: 12000,
      popular: false,
      features: ["Cheque Tracking", "Payment Reminders", "Financial Reports", "Cash Flow Management"]
    },
    {
      id: "fleet-management",
      title: "Fleet Management",
      description: "Comprehensive fleet management solution for businesses operating vehicle fleets in the GCC. Features Vehicle Tracking, Maintenance Alerts, Driver Management, and Fuel Monitoring.",
      link: "https://www.Joonms.com/fleet",
      icon: Car,
      price: "₹20,000",
      actualPrice: 20000,
      popular: false,
      features: ["Vehicle Tracking", "Maintenance Alerts", "Driver Management", "Fuel Monitoring"]
    },
    {
      id: "attendance-calendar",
      title: "Attendance & Calendar Modules",
      description: "Everything you need to automate workforce management and scheduling operations. Includes Biometric Integration, Shift Scheduling, Leave Management, and Overtime Tracking.",
      link: "https://www.Joonms.com/attendance",
      icon: Calendar,
      price: "₹8,000",
      actualPrice: 8000,
      popular: false,
      features: ["Biometric Integration", "Shift Scheduling", "Leave Management", "Overtime Tracking"]
    }
  ];

  // Navigation function - Choose one of these options based on your setup
  const navigateToContact = () => {
    // Option 1: For React Router (most common)
    // If using React Router, uncomment the import and use this:
    // import { useNavigate } from 'react-router-dom';
    // const navigate = useNavigate();
    // navigate('/contact');

    // Option 2: For Next.js Router
    // If using Next.js, uncomment the import and use this:
    // import { useRouter } from 'next/router';
    // const router = useRouter();
    // router.push('/contact');

    // Option 3: For Next.js App Router (Next.js 13+)
    // If using Next.js App Router, uncomment the import and use this:
    // import { useRouter } from 'next/navigation';
    // const router = useRouter();
    // router.push('/contact');

    // Option 4: Simple window.location (works with any setup)
    window.location.href = '/contact';

    // Option 5: For external contact page
    // window.open('https://yourwebsite.com/contact', '_self');
  };

  // Order functionality
  const handleOrderProduct = (product: any) => {
    // Simple customer data collection (you can make this more sophisticated)
    const name = prompt('Enter your name:');
    const email = prompt('Enter your email:');
    const phone = prompt('Enter your phone (optional):');
    const company = prompt('Enter your company name (optional):');

    if (name && email) {
      setCustomerData({ name, email, phone: phone || '', company: company || '' });
      setSelectedProducts([{
        id: product.id,
        title: product.title,
        price: product.actualPrice,
        quantity: 1,
        description: product.description
      }]);
      setShowOrderDialog(true);
    }
  };

  return (
    <section id="products" className="relative py-12 md:py-20 bg-slate-900 overflow-hidden">
      {/* Background Layer with Boxes
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute inset-0 w-full h-full">
          <Boxes />
        </div>
        <div className="absolute inset-0 bg-slate-900/70 z-10" />
      </div>*/}

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
              <p className="text-base md:text-lg text-[#f8fafc] leading-relaxed mb-4 text-center">
                🔹 <a href="https://www.joonms.com/" target="_blank" rel="noopener noreferrer" className="text-[#6AAEFF] hover:text-white transition-colors duration-300 font-semibold">Click here to explore our JoonMS Product Portfolio</a>
              </p>
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

        {/* Customizable Pricing Section */}
        <motion.div
          className="mt-16 md:mt-20 text-center bg-gradient-to-br from-[#6AAEFF]/10 to-[#6ECCAF]/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#6AAEFF]/30"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Customizable Pricing — Solutions That Fit Your Budget
          </h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto leading-relaxed">
            Every business is unique, and so are our pricing plans. We offer flexible, customizable pricing options tailored to your specific needs and budget requirements across all our software solutions.
          </p>
          <motion.button
            className="bg-[#6AAEFF] text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-[#6AAEFF] transition-all duration-300 shadow-xl hover:shadow-[#6AAEFF]/30 border border-transparent hover:border-[#6AAEFF] overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={navigateToContact}
            aria-label="Get Custom Pricing Quote"
            title="Get Custom Pricing Quote"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#6AAEFF]/10 to-[#6ECCAF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">Get Custom Pricing Quote</span>
          </motion.button>
        </motion.div>

        {/* Add Order Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-300 mb-6">Ready to purchase any of our software solutions?</p>
          <motion.button
            className="relative overflow-hidden group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-green-500/30"
            onClick={() => {
              // For demo, you can directly order the popular product
              const popularProduct = products.find(p => p.popular);
              if (popularProduct) {
                handleOrderProduct(popularProduct);
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Order Software Products"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">🛒 Order Our Products</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Product Order Dialog */}
      {showOrderDialog && (
        <ProductOrderDialog
          isOpen={showOrderDialog}
          onClose={() => setShowOrderDialog(false)}
          orderItems={selectedProducts}
          customerData={customerData}
        />
      )}
    </section>
  );
};

export default Products;