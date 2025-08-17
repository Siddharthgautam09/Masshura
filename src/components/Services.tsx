import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Code2, 
  Users, 
  ShoppingCart, 
  Database, 
  Cloud, 
  Link,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Mock 3D Card Components for demonstration
const CardContainer = ({ children, className, containerClassName }) => (
  <div className={`${containerClassName} perspective-1000`}>
    <div className={className}>{children}</div>
  </div>
);

const CardBody = ({ children, className }) => (
  <div className={`${className} transform-gpu transition-transform duration-300 hover:rotateX-5 hover:rotateY-5`}>
    {children}
  </div>
);

const CardItem = ({ children, className, translateZ, as: Component = 'div', ...props }) => (
  <Component className={className} {...props}>
    {children}
  </Component>
);

const Services = () => {
  const [expandedService, setExpandedService] = useState(null);
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      icon: Code2,
      title: "Custom Software Development",
      subtitle: "Easy, Fast, Functional",
      shortDescription: "From idea to execution, we deliver custom-built software solutions.",
      fullDescription: "From idea to execution, we deliver custom-built software that's fast, functional, and future-ready. Our expert developers work closely with your team to build intuitive systems that grow with your business.",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      alt: "Custom software development team building ERP system in Dubai"
    },
    {
      id: 2,
      icon: Users,
      title: "IT Consulting & Digital Transformation",
      subtitle: "Strategic Technology Guidance",
      shortDescription: "Expert IT consulting services built around what actually works.",
      fullDescription: "Tired of generic advice? Our IT consulting services in Dubai and across GCC are built around what actually works for your industry. We help you digitize operations, improve performance, and stay ahead of competitors.",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      alt: "Maashura experts delivering digital transformation through custom IT software"
    },
    {
      id: 3,
      icon: ShoppingCart,
      title: "E-commerce Development",
      subtitle: "Mobile & Web Optimized",
      shortDescription: "Scalable e-commerce platforms tailored to your brand.",
      fullDescription: "We create scalable e-commerce platforms tailored to your brand — built to perform across mobile and web. Whether you're in retail, B2B, or subscriptions, we deliver performance-focused solutions.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      alt: "E-commerce development for businesses in UAE and GCC"
    },
    {
      id: 4,
      icon: Database,
      title: "ERP & CRM Development",
      subtitle: "Streamline Without the Complexity",
      shortDescription: "Affordable ERP and CRM systems for small to mid-scale businesses.",
      fullDescription: "Boost productivity with our affordable ERP and CRM systems made for small to mid-scale businesses in the UAE. Automate workflows, track leads, and generate reports — all without the overhead of bulky legacy systems.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      alt: "ERP and SaaS consulting for small businesses in UAE"
    },
    {
      id: 5,
      icon: Cloud,
      title: "SaaS Platform Development",
      subtitle: "Launch Your Own Cloud Product",
      shortDescription: "Build your own SaaS product with cloud-native architectures.",
      fullDescription: "Want to build your own SaaS product? We help bring your idea to life with cloud-native architectures designed for industries like finance, retail, healthcare, education, and niche services.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      alt: "SaaS platform development for cloud-based business solutions"
    },
    {
      id: 6,
      icon: Link,
      title: "API Integration & System Syncing",
      subtitle: "No More Silos",
      shortDescription: "Seamless API integration to connect your digital tools.",
      fullDescription: "Tired of disconnected systems? We offer API integration and custom data migrations to ensure your tools work together seamlessly. From payment gateways to CRMs, we make your digital tools talk to each other.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      alt: "API integration services connecting business systems in UAE"
    },
        // New IT AMC – Software & Hardware card
    {
      id: 8,
      icon: Cloud, // Reusing an existing icon; consider replacing with a shield/gear if available
      title: "IT AMC – Software & Hardware",
      subtitle: "Stay Up, Stay Secure",
      shortDescription: "Avoid costly downtimes with our annual maintenance contracts for software and hardware.",
      fullDescription: "Avoid costly downtimes with our annual maintenance contracts. We offer proactive support, regular updates, on-site visits, and quick hardware fixes — so your business tech stays fast, secure, and headache-free across the UAE and GCC.",
      image: "https://media.istockphoto.com/id/1494073880/photo/a-man-holding-icon-virtual-24-7-support-services-for-worldwide-nonstop-and-full-time.jpg?s=612x612&w=0&k=20&c=4YF-otaX3n8OiPOC4L_-_pAX1ibayzdvpkK1Ih2-p50=", // Technician working on server
      alt: "Technician maintaining server hardware, symbolizing IT AMC and proactive support."
    },
    // New IT Hardware Supply card
    {
      id: 7,
      icon: Database, // Reusing an existing icon for hardware, or you can import a more suitable one
      title: "IT Hardware Supply",
      subtitle: "Reliable Tech, Ready to Deploy",
      shortDescription: "High-quality IT hardware tailored to your business size and needs — from laptops and networking gear to servers and peripherals.",
      fullDescription: "We supply high-quality IT hardware tailored to your business size and needs — from laptops and networking gear to servers and peripherals. Whether you’re a clinic, school, or trading firm, we deliver cost-effective solutions that keep your operations running smoothly.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80", // Flat-lay/isometric generic hardware
      alt: "Flat-lay of generic IT hardware: laptop, router, server rack, monitor, in a professional office setting. No brand logos."
    },
  ];

  const toggleExpand = (serviceId) => {
    console.log('Toggle expand called for service:', serviceId);
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  const handleGetStarted = () => {
    navigate('/contact');
  };

  return (
    <section id="services" className="relative py-12 md:py-20 bg-slate-900 overflow-hidden">
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-gpu { transform-style: preserve-3d; }
        .hover\\:rotateX-5:hover { transform: rotateX(5deg); }
        .hover\\:rotateY-5:hover { transform: rotateY(5deg); }
      `}</style>

      {/* Content Layer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20" style={{ paddingTop: '20px' }}>
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-[#f8fafc] leading-tight">
            Our Services
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[#f8fafc] max-w-4xl mx-auto leading-relaxed">
            At Maashura, we specialize in Custom Software Development for businesses across the UAE and GCC. 
            Whether you're launching a new venture or scaling an existing one, our solutions are simple, 
            affordable, and fully customized to your goals.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 justify-items-center items-start">
          
          {/* All Services Visible */}
          {services.map((service, index) => {
            const isExpanded = expandedService === service.id;
              
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="w-full max-w-sm mx-auto"
                layout
              >
                <CardContainer className="inter-var" containerClassName="py-0">
                  <motion.div
                    layout
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <CardBody className="bg-slate-800/90 relative group/card hover:shadow-2xl hover:shadow-[#6AAEFF]/[0.1] border-slate-700/50 w-full rounded-xl border backdrop-blur-sm overflow-visible flex flex-col">
                      
                      {/* Image Section */}
                      <CardItem translateZ="100" className="w-full flex-shrink-0">
                        <div className="relative h-36 w-full overflow-hidden rounded-t-xl">
                          <img
                            src={service.image}
                            alt={service.alt}
                            className="h-full w-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                          
                          <CardItem
                            translateZ="120"
                            className="absolute top-3 left-3 p-1.5 bg-[#6AAEFF] rounded-full shadow-lg border border-white/20"
                          >
                            <service.icon className="text-white" size={18} />
                          </CardItem>
                        </div>
                      </CardItem>

                      {/* Content Section */}
                      <div className="p-4 flex flex-col">
                        <div className="mb-3 flex-shrink-0">
                          <CardItem
                            translateZ="50"
                            className="text-lg font-bold text-white mb-1 block leading-tight"
                          >
                            {service.title}
                          </CardItem>
                          <CardItem
                            as="p"
                            translateZ="40"
                            className="text-sm text-[#6AAEFF] font-medium"
                          >
                            {service.subtitle}
                          </CardItem>
                        </div>

                        <CardItem translateZ="60" className="w-full mb-4">
                          <AnimatePresence mode="wait">
                            {isExpanded ? (
                              <motion.div
                                key="full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                layout
                              >
                                <p className="text-base text-white leading-relaxed">
                                  {service.fullDescription}
                                </p>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="short"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                layout
                              >
                                <p className="text-base text-white leading-relaxed">
                                  {service.shortDescription}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardItem>

                        {/* Button Section - Fixed with proper event handling */}
                        <div className="flex justify-between items-center flex-shrink-0 relative z-50">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleExpand(service.id);
                            }}
                            className="flex items-center text-[#6AAEFF] hover:text-white transition-colors duration-300 font-medium text-sm px-3 py-2 rounded-lg border border-[#6AAEFF]/30 hover:border-[#6AAEFF] hover:bg-[#6AAEFF]/10 backdrop-blur-sm cursor-pointer select-none"
                            type="button"
                          >
                            {isExpanded ? (
                              <>
                                Show Less <ChevronUp className="ml-1" size={14} />
                              </>
                            ) : (
                              <>
                                Learn More <ChevronDown className="ml-1" size={14} />
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleGetStarted();
                            }}
                            className="relative px-4 py-2 rounded-lg bg-[#6AAEFF] text-white text-sm font-bold hover:bg-white hover:text-[#6AAEFF] transition-all duration-300 hover:scale-105 border border-transparent hover:border-[#6AAEFF] shadow-lg hover:shadow-[#6AAEFF]/25 overflow-hidden group cursor-pointer select-none"
                            type="button"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#6AAEFF]/10 to-[#6ECCAF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative z-10">Get Started</span>
                          </button>
                        </div>
                      </div>

                      <CardItem
                        translateZ={80}
                        className="absolute top-3 right-3 w-1.5 h-1.5 bg-[#6AAEFF] rounded-full opacity-60 pointer-events-none"
                      >
                        <span />
                      </CardItem>
                      <CardItem
                        translateZ={85}
                        className="absolute bottom-3 right-3 w-1 h-1 bg-white rounded-full opacity-40 pointer-events-none"
                      >
                        <span />
                      </CardItem>

                      <div className="absolute inset-0 bg-gradient-to-br from-[#6AAEFF]/5 via-transparent to-[#6ECCAF]/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    </CardBody>
                  </motion.div>
                </CardContainer>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;