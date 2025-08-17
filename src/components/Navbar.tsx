import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState as useReactState } from 'react';
import { navbarVariant } from '@/animations/variants';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [showSupplierLogin, setShowSupplierLogin] = useReactState(false);

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
    { name: 'IT Consulting', path: '/ItConsulting' },
    { name: 'Supplier Registration', path: '/SupplierRegistration' },
    { name: 'IT Hardware', path: '/ItHardware' },
    { name: 'Contact', path: '/contact' },

  ];

  return (
    <motion.nav
      className={`fixed top-0  left-0 right-0 z-50 w-full transition-all duration-300 ${
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
      <div className="w-full px-2 py-4 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo on Left Side */}
          <motion.div
            className="flex-shrink-0 mr-2"
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
                  alt="Maashura Digital Clarity & IT Consultancy Logo"
                  className="h-10 sm:h-12 w-auto rounded-md max-w-none"
                  loading="eager"
                  onError={(e) => {
                    // Fallback to text logo if image fails
                    e.currentTarget.style.display = 'none';
                    const textLogo = e.currentTarget.nextElementSibling as HTMLElement;
                    if (textLogo) textLogo.style.display = 'block';
                  }}
                />
                <div 
                  className="text-xl sm:text-2xl font-bold text-white hidden"
                  style={{ lineHeight: '1.2' }}
                >
                  Maashura
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Navigation Links on Right Side - Desktop */}
          <div className="hidden lg:flex items-center flex-1 justify-end pr-2">
            <div className="flex items-center space-x-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <Link
                    to={link.path}
                    className={`group relative px-2.5 py-2 xl:py-2.5 rounded-xl transition-all duration-300 ${
                      location.pathname === link.path 
                        ? 'text-[#6AAEFF] font-semibold bg-slate-800/50 shadow-lg border border-[#6AAEFF]/20' 
                        : 'text-gray-300 hover:text-white hover:bg-slate-800/40 border border-transparent hover:border-slate-600/30'
                    }`}
                  >
                    <motion.span
                      className="relative text-xs xl:text-sm font-medium whitespace-nowrap"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {link.name}
                      {/* Enhanced hover underline */}
                      <motion.div
                        className="absolute -bottom-1.5 left-0 h-0.5 bg-gradient-to-r from-[#6AAEFF] to-blue-400 rounded-full"
                        initial={{ width: location.pathname === link.path ? "100%" : "0%" }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                      {/* Subtle glow effect on hover */}
                      <motion.div
                        className="absolute inset-0 bg-[#6AAEFF]/5 rounded-xl -z-10"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.span>
                  </Link>
                </motion.div>
              ))}
              {/* Supplier Login button */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: navLinks.length * 0.08 }}
              >
                <Link
                  to="/supplier-login"
                  className={`group relative px-2.5 py-2 xl:py-2.5 rounded-xl transition-all duration-300 text-[#6AAEFF] font-semibold bg-slate-800/50 shadow-lg border border-[#6AAEFF]/20`}
                >
                  <motion.span
                    className="relative text-xs xl:text-sm font-medium whitespace-nowrap"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Login
                  </motion.span>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Mobile Menu Button - Right Side */}
          <motion.button
            className="lg:hidden text-gray-300 hover:text-white p-2.5 transition-all duration-300 rounded-xl hover:bg-slate-800/40 flex-shrink-0 border border-slate-600/20 hover:border-slate-500/40"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.div>
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
        <div className="w-full px-4 pb-4" style={{ marginTop: '16px' }}>
          <motion.div 
            className="bg-slate-800/95 backdrop-blur-lg rounded-2xl p-6 space-y-3 border border-slate-700/50 shadow-2xl"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {navLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group block w-full text-left py-3.5 px-5 rounded-xl transition-all duration-300 ${
                    location.pathname === link.path 
                      ? 'text-[#6AAEFF] font-semibold bg-slate-700/50 shadow-lg border border-[#6AAEFF]/20' 
                      : 'text-gray-300 hover:text-white hover:bg-slate-700/40 border border-transparent hover:border-slate-600/30'
                  }`}
                >
                  <motion.div
                    className="flex items-center justify-between"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="font-medium">{link.name}</span>
                    <motion.div
                      className="w-2 h-2 bg-[#6AAEFF] rounded-full"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: location.pathname === link.path ? 1 : 0, 
                        opacity: location.pathname === link.path ? 1 : 0 
                      }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
