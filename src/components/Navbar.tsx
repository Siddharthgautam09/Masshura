import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { navbarVariant } from '@/animations/variants';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Why Us', path: '/WhyUs' },
    { name: 'Our Products', path: '/products' },
    { name: 'Industries We Serve', path: '/AreaWeServe' },
    { name: 'Supplier Registration', path: '/SupplierRegistration' },
    { name: 'Contact', path: '/contact' },
    { name: 'IT Consulting', path: '/ItConsulting' }
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 backdrop-blur-lg shadow-lg' 
          : 'bg-transparent shadow-none'
      }`}
      variants={navbarVariant}
      animate={isScrolled ? 'solid' : 'transparent'}
    >
      {/* Background Pattern - Only show when scrolled */}
      {isScrolled && (
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
        </div>
      )}

      {/* Full width container */}
      <div className="w-full px-4 py-4 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo on Left Side */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-slate-800/5 transition-all duration-300 border border-slate-600/30"
              >
                <img
                  src="/lovable-uploads/2597bf43-3192-45f3-bdf1-f242324ff2f5.png"
                  alt="Maashura IT Consultancy Logo"
                  className="h-8 w-auto rounded-md"
                />
              </motion.div>
            </Link>
          </motion.div>

          {/* Navigation Links on Right Side - Desktop */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`text-gray-300 hover:text-white transition-colors relative px-3 py-2 rounded-lg hover:bg-slate-800/30 ${
                      location.pathname === link.path ? 'text-[#6AAEFF] font-semibold bg-slate-800/40' : ''
                    }`}
                  >
                    <motion.span
                      className="relative text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                    >
                      {link.name}
                      <motion.div
                        className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#6AAEFF] to-blue-400"
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button - Right Side */}
          <motion.button
            className="lg:hidden text-gray-300 hover:text-white p-2 transition-colors rounded-lg hover:bg-slate-800/30 flex-shrink-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="lg:hidden relative z-10"
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          height: isMobileMenuOpen ? 'auto' : 0
        }}
        transition={{ duration: 0.3 }}
        style={{ overflow: 'hidden' }}
      >
        <div className="w-full px-4 pb-4">
          <div className="bg-slate-800/90 backdrop-blur-lg rounded-lg p-4 space-y-2 border border-slate-700/50 shadow-xl">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block w-full text-left text-gray-300 hover:text-white transition-colors py-3 px-4 rounded-lg hover:bg-slate-700/50 ${
                    location.pathname === link.path ? 'text-[#6AAEFF] font-semibold bg-slate-700/30' : ''
                  }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
