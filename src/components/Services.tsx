import { motion } from 'framer-motion';
import { 
  Code2, 
  Cloud, 
  Smartphone, 
  Database, 
  Shield, 
  Cog,
  Globe,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Services = () => {
  const services = [
    {
      icon: Code2,
      title: "Custom Software Development",
      description: "Tailored software solutions built to meet your specific business requirements and scale with your growth.",
      features: ["Web Applications", "Desktop Software", "API Development"]
    },
    {
      icon: Cloud,
      title: "SaaS Solutions",
      description: "Cloud-based software-as-a-service platforms that provide scalable and accessible business solutions.",
      features: ["Cloud Hosting", "Multi-tenant Architecture", "Subscription Management"]
    },
    {
      icon: Smartphone,
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications for iOS and Android that engage your customers.",
      features: ["iOS Development", "Android Development", "Cross-platform Solutions"]
    },
    {
      icon: Database,
      title: "Database Solutions",
      description: "Robust database design, optimization, and management services for efficient data handling.",
      features: ["Database Design", "Performance Optimization", "Data Migration"]
    },
    {
      icon: Shield,
      title: "Cybersecurity",
      description: "Comprehensive security solutions to protect your digital assets and ensure compliance.",
      features: ["Security Audits", "Penetration Testing", "Compliance Management"]
    },
    {
      icon: Cog,
      title: "IT Consulting",
      description: "Strategic IT consulting to help you make informed technology decisions and optimize operations.",
      features: ["Technology Strategy", "Digital Transformation", "Process Optimization"]
    },
    {
      icon: Globe,
      title: "Web Development",
      description: "Modern, responsive websites and web applications that deliver exceptional user experiences.",
      features: ["Responsive Design", "E-commerce Solutions", "CMS Development"]
    },
    {
      icon: Zap,
      title: "System Integration",
      description: "Seamless integration of various systems and applications to streamline your business processes.",
      features: ["API Integration", "Legacy System Modernization", "Workflow Automation"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="bg-gradient-primary bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We provide comprehensive IT solutions that drive digital transformation 
            and accelerate business growth through innovative technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-elegant transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <motion.div
                    className="mx-auto mb-4 p-3 bg-gradient-primary rounded-full w-fit"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <service.icon className="text-primary-foreground" size={32} />
                  </motion.div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground mb-4 text-center">
                    {service.description}
                  </CardDescription>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="text-sm text-muted-foreground flex items-center"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;