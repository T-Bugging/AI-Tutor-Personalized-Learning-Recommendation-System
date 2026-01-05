import { motion } from "framer-motion";

export default function AnimatedButton({ children, className = '', ...props }) {
  const combined = `primary-btn ${className}`.trim();
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={combined}
      {...props}
    >
      {children}
    </motion.button>
  );
}
