import { motion } from 'framer-motion';
import { Cpu, HardDrive, Monitor, Printer, Router, Server } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Hardware = () => {
  const hardwareCategories = [
    {
      icon: Server,
      title: "Servers & Networking",
      description: "Enterprise-grade servers, switches, and networking equipment for robust infrastructure.",
      items: ["Dell PowerEdge Servers", "Cisco Networking Equipment", "HP Enterprise Solutions", "Custom Server Builds"]
    },
    {
      icon: Cpu,
      title: "Computing Systems",
      description: "High-performance workstations, laptops, and desktop computers for all business needs.",
      items: ["Business Workstations", "Gaming PCs", "Laptops & Tablets", "Mini PCs"]
    },
    {
      icon: Monitor,
      title: "Display Solutions",
      description: "Professional monitors, displays, and presentation equipment for modern workplaces.",
      items: ["4K Professional Monitors", "Interactive Displays", "Projectors", "Digital Signage"]
    },
    {
      icon: HardDrive,
      title: "Storage Solutions",
      description: "Reliable storage systems including SSDs, hard drives, and backup solutions.",
      items: ["Enterprise SSDs", "Network Storage (NAS)", "Backup Systems", "Cloud Storage Gateways"]
    },
    {
      icon: Printer,
      title: "Office Equipment",
      description: "Complete office hardware solutions including printers, scanners, and communication devices.",
      items: ["Multifunction Printers", "3D Printers", "Scanners", "Video Conferencing Systems"]
    },
    {
      icon: Router,
      title: "Connectivity & Security",
      description: "Network infrastructure and security hardware to keep your business connected and protected.",
      items: ["Enterprise Routers", "Firewalls", "Access Points", "Security Cameras"]
    }
  ];

  const brands = [
    "Dell", "HP", "Cisco", "Lenovo", "ASUS", "Intel", "AMD", "NVIDIA", 
    "Microsoft", "Samsung", "Canon", "Epson", "Brother", "Ubiquiti"
  ];

  return (
    <section id="hardware" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Hardware <span className="bg-gradient-primary bg-clip-text text-transparent">Supply</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We supply premium hardware solutions from leading manufacturers to power 
            your business operations with reliability and performance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {hardwareCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card className="h-full hover:shadow-elegant transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <motion.div
                    className="mx-auto mb-4 p-4 bg-gradient-primary rounded-xl w-fit"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <category.icon className="text-primary-foreground" size={32} />
                  </motion.div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="text-sm text-muted-foreground flex items-center"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trusted Brands */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-foreground mb-8">
            Trusted Brands We Partner With
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 items-center">
            {brands.map((brand, index) => (
              <motion.div
                key={index}
                className="bg-card/60 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-card/80 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-muted-foreground font-semibold text-sm">
                  {brand}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact for Quote */}
        <motion.div
          className="mt-16 text-center bg-gradient-primary/10 rounded-xl p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Need a Hardware Quote?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Contact us for competitive pricing on all hardware solutions. 
            We offer bulk discounts and custom configurations to meet your specific requirements.
          </p>
          <motion.button
            className="bg-gradient-primary text-primary-foreground px-8 py-4 rounded-full font-semibold mr-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Request Quote
          </motion.button>
          <motion.button
            className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground px-8 py-4 rounded-full font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const element = document.getElementById('supplier');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Become a Supplier
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hardware;