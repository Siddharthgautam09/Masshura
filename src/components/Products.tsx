import { motion } from 'framer-motion';
import { Monitor, Smartphone, Cloud, Database, Shield, Code } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Products = () => {
  const products = [
    {
      icon: Monitor,
      title: "Enterprise Software Suite",
      description: "Comprehensive business management platform with CRM, ERP, and analytics modules.",
      features: ["Customer Management", "Inventory Tracking", "Financial Reports", "Analytics Dashboard"],
      price: "Starting at $299/month",
      popular: false
    },
    {
      icon: Cloud,
      title: "Cloud Infrastructure Platform",
      description: "Scalable cloud hosting and infrastructure management solution for businesses of all sizes.",
      features: ["Auto-scaling", "Load Balancing", "24/7 Monitoring", "Backup & Recovery"],
      price: "Starting at $49/month",
      popular: true
    },
    {
      icon: Shield,
      title: "Cybersecurity Suite",
      description: "Complete security solution with threat detection, firewall management, and compliance tools.",
      features: ["Threat Detection", "Firewall Management", "Compliance Reporting", "Security Audits"],
      price: "Starting at $199/month",
      popular: false
    },
    {
      icon: Smartphone,
      title: "Mobile App Framework",
      description: "Rapid mobile app development platform for creating cross-platform applications.",
      features: ["Cross-platform", "Native Performance", "Cloud Integration", "Push Notifications"],
      price: "Starting at $149/month",
      popular: false
    },
    {
      icon: Database,
      title: "Data Analytics Platform",
      description: "Advanced business intelligence and data visualization platform for informed decision-making.",
      features: ["Real-time Analytics", "Custom Dashboards", "Data Visualization", "Predictive Insights"],
      price: "Starting at $399/month",
      popular: false
    },
    {
      icon: Code,
      title: "API Management Gateway",
      description: "Comprehensive API management solution for building, deploying, and monitoring APIs.",
      features: ["API Gateway", "Rate Limiting", "Analytics", "Developer Portal"],
      price: "Starting at $99/month",
      popular: false
    }
  ];

  return (
    <section id="products" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="bg-gradient-primary bg-clip-text text-transparent">Products</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our range of innovative software products designed to streamline 
            your business operations and drive growth.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card className={`h-full hover:shadow-elegant transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm relative ${
                product.popular ? 'ring-2 ring-primary/50' : ''
              }`}>
                {product.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <motion.div
                    className="mx-auto mb-4 p-4 bg-gradient-primary rounded-xl w-fit"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <product.icon className="text-primary-foreground" size={36} />
                  </motion.div>
                  <CardTitle className="text-xl font-bold text-foreground mb-2">
                    {product.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {product.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-sm text-muted-foreground"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-4">
                      {product.price}
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        className={`w-full ${
                          product.popular
                            ? 'bg-gradient-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'
                        }`}
                      >
                        Learn More
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Custom Solutions CTA */}
        <motion.div
          className="mt-16 text-center bg-gradient-primary/10 rounded-xl p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Need Something Custom?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We also create bespoke software solutions tailored to your specific business requirements. 
            Let's discuss how we can build the perfect solution for you.
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
            Request Custom Solution
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Products;