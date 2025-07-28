// ui/card-hover-effect.tsx
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
    icon?: any;
    price?: string;
    popular?: boolean;
    features?: string[];
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item?.link}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-gradient-to-br from-[#6AAEFF]/10 to-[#6ECCAF]/10 block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card className={item.popular ? "ring-2 ring-[#6AAEFF]/50" : ""}>
            {item.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <span className="bg-[#6AAEFF] text-white px-4 py-1 rounded-full text-sm font-semibold border border-white/20">
                  Most Popular
                </span>
              </div>
            )}
            
            <CardTitle>
              {item.icon && (
                <motion.div
                  className="mx-auto mb-4 p-4 bg-[#6AAEFF] rounded-xl w-fit border border-white/20"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <item.icon className="text-white" size={36} />
                </motion.div>
              )}
              {item.title}
            </CardTitle>
            
            <CardDescription>{item.description}</CardDescription>
            
            {item.features && (
              <ul className="space-y-2 mb-4 mt-4">
                {item.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center text-sm text-slate-300"
                  >
                    <div className="w-2 h-2 bg-[#6AAEFF] rounded-full mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}
            
            {item.price && (
              <div className="text-center mt-4">
                <div className="text-lg font-bold text-[#6AAEFF] mb-4">
                  {item.price}
                </div>
                <motion.button
                  className="w-full bg-slate-700/60 text-white hover:bg-[#6AAEFF] hover:text-white px-4 py-2 rounded-lg transition-all duration-300 border border-transparent hover:border-[#6AAEFF]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(item.link, '_blank')}
                >
                  Try Free Demo
                </motion.button>
              </div>
            )}
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-6 overflow-hidden bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 hover:border-[#6AAEFF]/30 group-hover:border-[#6AAEFF]/50 relative z-20 transition-all duration-300",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-white font-bold text-xl text-center mb-4 group-hover:text-[#6AAEFF] transition-colors", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "text-slate-300 text-sm leading-relaxed text-center",
        className
      )}
    >
      {children}
    </p>
  );
};
export default HoverEffect;