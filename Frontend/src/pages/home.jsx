import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";
import AnimatedButton from "../components/AnimatedButton";
import bg from "../assets/math-bg.svg";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <ThemeToggle />

      <motion.div
        className="home-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* decorative background image imported so it resolves in production builds */}
        <img src={bg} alt="" className="home-bg" aria-hidden="true" />
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Sharpen Your Math Skills
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Start a short diagnostic quiz. Receive instant, personalized
          recommendations and curated resources to improve faster.
        </motion.p>

        <AnimatedButton onClick={() => navigate("/categories")}>
          Give Quiz
        </AnimatedButton>
      </motion.div>
    </div>
  );
}
