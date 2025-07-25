import { motion } from 'framer-motion';
import { MapPin, Globe, Building, Users } from 'lucide-react';

const AreasWeServe = () => {
  const regions = [
    {
      name: "North America",
      countries: ["United States", "Canada", "Mexico"],
      description: "Comprehensive IT solutions across major metropolitan areas",
      clients: "500+"
    },
    {
      name: "Europe",
      countries: ["United Kingdom", "Germany", "France", "Netherlands", "Spain"],
      description: "Supporting businesses across the European Union",
      clients: "300+"
    },
    {
      name: "Asia Pacific",
      countries: ["Australia", "Singapore", "Japan", "South Korea", "India"],
      description: "Growing presence in the Asia-Pacific technology hub",
      clients: "200+"
    },
    {
      name: "Middle East",
      countries: ["UAE", "Saudi Arabia", "Qatar", "Kuwait"],
      description: "Specialized solutions for the Middle Eastern market",
      clients: "150+"
    }
  ];

  const industries = [
    {
      icon: Building,
      name: "Healthcare",
      description: "Hospital management systems, medical devices, compliance solutions"
    },
    {
      icon: Users,
      name: "Education",
      description: "Learning management systems, student portals, educational technology"
    },
    {
      icon: Globe,
      name: "Financial Services",
      description: "Banking software, fintech solutions, security systems"
    },
    {
      icon: MapPin,
      name: "Manufacturing",
      description: "Industrial automation, inventory management, quality control"
    },
    {
      icon: Building,
      name: "Retail",
      description: "E-commerce platforms, POS systems, inventory management"
    },
    {
      icon: Users,
      name: "Government",
      description: "Public sector solutions, digital transformation, citizen services"
    }
  ];

  return (
    <section id="areas" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Areas We <span className="bg-gradient-primary bg-clip-text text-transparent">Serve</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            With a global presence, we deliver our IT solutions and services to clients 
            across multiple continents and industries.
          </p>
        </motion.div>

        {/* Geographic Coverage */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {regions.map((region, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-card/80 backdrop-blur-sm rounded-xl p-6 hover:shadow-elegant transition-all duration-300"
            >
              <motion.div
                className="mb-4 p-3 bg-gradient-primary rounded-full w-fit"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <MapPin className="text-primary-foreground" size={24} />
              </motion.div>
              
              <h3 className="text-xl font-bold text-foreground mb-2">
                {region.name}
              </h3>
              
              <p className="text-muted-foreground text-sm mb-4">
                {region.description}
              </p>
              
              <div className="mb-4">
                <div className="text-2xl font-bold text-primary mb-1">
                  {region.clients}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Clients
                </div>
              </div>
              
              <div className="space-y-1">
                {region.countries.map((country, countryIndex) => (
                  <div key={countryIndex} className="text-sm text-muted-foreground flex items-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" />
                    {country}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Industries */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">
            Industries We Specialize In
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-card/60 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-card/80 transition-all duration-300"
              >
                <motion.div
                  className="mx-auto mb-4 p-3 bg-gradient-primary rounded-full w-fit"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <industry.icon className="text-primary-foreground" size={24} />
                </motion.div>
                
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  {industry.name}
                </h4>
                
                <p className="text-muted-foreground text-sm">
                  {industry.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Global Reach CTA */}
        <motion.div
          className="mt-16 text-center bg-gradient-primary/10 rounded-xl p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Expanding Our Reach
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're constantly growing our global presence. If you don't see your region listed, 
            contact us to discuss how we can support your business remotely.
          </p>
          <motion.button
            className="bg-gradient-primary text-primary-foreground px-8 py-4 rounded-full font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Discuss Your Project
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default AreasWeServe;