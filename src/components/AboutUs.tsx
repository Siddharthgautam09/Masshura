import { motion } from 'framer-motion';
import { Users, Target, Award, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AboutUs = () => {
  const stats = [
    {
      icon: Users,
      number: "200+",
      label: "Happy Clients",
      description: "Successful projects delivered"
    },
    {
      icon: Target,
      number: "98%",
      label: "Success Rate",
      description: "Client satisfaction guaranteed"
    },
    {
      icon: Award,
      number: "50+",
      label: "Awards Won",
      description: "Industry recognition received"
    },
    {
      icon: Clock,
      number: "24/7",
      label: "Support",
      description: "Round-the-clock assistance"
    }
  ];

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="bg-gradient-primary bg-clip-text text-transparent">Maashura IT</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Founded with a vision to bridge the gap between technology and business success, 
              Maashura IT Consultancy & Hardwares has been at the forefront of digital transformation 
              for over a decade.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              We specialize in providing comprehensive IT solutions that help businesses leverage 
              technology to achieve their goals. From custom software development to cutting-edge 
              hardware solutions, we deliver excellence in every project.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-foreground">Expert team of certified professionals</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-foreground">Cutting-edge technology solutions</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-foreground">Proven track record of success</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-foreground">24/7 customer support</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="text-center p-6 hover:shadow-elegant transition-all duration-300 bg-card/80 backdrop-blur-sm border-0">
                  <CardContent className="p-0">
                    <motion.div
                      className="mx-auto mb-4 p-3 bg-gradient-primary rounded-full w-fit"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <stat.icon className="text-primary-foreground" size={24} />
                    </motion.div>
                    <motion.h3
                      className="text-3xl font-bold text-primary mb-2"
                      initial={{ scale: 0.5 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                      viewport={{ once: true }}
                    >
                      {stat.number}
                    </motion.h3>
                    <h4 className="text-lg font-semibold text-foreground mb-1">
                      {stat.label}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;