import { motion } from 'framer-motion';
import { CheckCircle, Zap, Shield, HeartHandshake, Rocket, Star } from 'lucide-react';

const WhyUs = () => {
  const reasons = [
    {
      icon: CheckCircle,
      title: "Proven Expertise",
      description: "Over a decade of experience delivering successful IT solutions across various industries."
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Agile development methodology ensures quick turnaround times without compromising quality."
    },
    {
      icon: Shield,
      title: "Secure Solutions",
      description: "Enterprise-grade security measures implemented in all our software and hardware solutions."
    },
    {
      icon: HeartHandshake,
      title: "Client-Centric",
      description: "We prioritize your business needs and work closely with you throughout the project lifecycle."
    },
    {
      icon: Rocket,
      title: "Innovation First",
      description: "We leverage the latest technologies and industry best practices to deliver cutting-edge solutions."
    },
    {
      icon: Star,
      title: "Quality Assured",
      description: "Rigorous testing and quality assurance processes ensure reliable and robust solutions."
    }
  ];

  return (
    <section id="why-us" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose <span className="bg-gradient-primary bg-clip-text text-transparent">Maashura IT</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We combine technical expertise with business acumen to deliver solutions 
            that drive real results for your organization.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-8 h-full hover:shadow-elegant transition-all duration-300 border-0">
                <motion.div
                  className="mb-6 p-4 bg-gradient-primary rounded-xl w-fit"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <reason.icon className="text-primary-foreground" size={32} />
                </motion.div>
                
                <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {reason.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {reason.description}
                </p>
                
                {/* Animated bottom border */}
                <motion.div
                  className="mt-6 h-1 bg-gradient-primary rounded-full"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-muted-foreground mb-6">
            Ready to transform your business with our expertise?
          </p>
          <motion.button
            className="bg-gradient-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Get Started Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyUs;