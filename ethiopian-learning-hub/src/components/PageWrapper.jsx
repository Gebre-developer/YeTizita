import { motion } from 'framer-motion';

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} // Starts slightly shifted down to optimize transition layouts
      animate={{ 
        opacity: 1,
        y: 0,
        transition: { 
          duration: 0.35,      // Snappy, professional mobile-first loading speeds
          ease: [0.25, 1, 0.5, 1] // Modern, natural cubic-bezier physics deceleration curve
        }
      }}
      exit={{ 
        opacity: 0,
        y: -8,
        transition: { duration: 0.2, ease: "easeIn" }
      }}
    >
      {children}
    </motion.div>
  );
};
export default PageWrapper;
