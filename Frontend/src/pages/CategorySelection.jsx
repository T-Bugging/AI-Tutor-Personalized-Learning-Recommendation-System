import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";
import AnimatedButton from "../components/AnimatedButton";

const categories = [
  "Data Handling & Statistics",
  "Number Sense",
  "Logic and Sets",
  "Probability",
  "Geometry",
  "Algebra"
];

const getCategoryIcon = (category) => {
  // Larger, decorative SVGs with subtle shapes and a centered symbol
  switch (category) {
    case "Data Handling & Statistics":
      return (
        <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0" stopColor="rgba(255,255,255,0.12)" />
              <stop offset="1" stopColor="rgba(255,255,255,0.06)" />
            </linearGradient>
          </defs>
          <rect x="8" y="18" width="14" height="44" rx="3" fill="white" opacity="0.95" />
          <rect x="30" y="12" width="14" height="50" rx="3" fill="white" opacity="0.9" />
          <rect x="52" y="6" width="14" height="56" rx="3" fill="white" opacity="0.85" />
          <rect x="74" y="0" width="14" height="62" rx="3" fill="white" opacity="0.8" />
        </svg>
      );
    case "Number Sense":
      return (
        <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="35" r="28" fill="rgba(255,255,255,0.06)" />
          <text x="60" y="42" textAnchor="middle" fill="white" fontSize="20" fontWeight="700">1-9</text>
        </svg>
      );
    case "Logic and Sets":
      return (
        <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
          <circle cx="45" cy="35" r="22" stroke="white" strokeWidth="2" fill="rgba(255,255,255,0.02)" />
          <circle cx="75" cy="35" r="22" stroke="white" strokeWidth="2" fill="rgba(255,255,255,0.02)" />
          <circle cx="60" cy="55" r="22" stroke="white" strokeWidth="2" fill="rgba(255,255,255,0.02)" />
        </svg>
      );
    case "Probability":
      return (
        <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
          <rect x="18" y="8" width="84" height="64" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" />
          <g fill="white">
            <circle cx="60" cy="40" r="6" />
            <circle cx="46" cy="28" r="4" />
            <circle cx="74" cy="28" r="4" />
            <circle cx="46" cy="52" r="4" />
            <circle cx="74" cy="52" r="4" />
          </g>
        </svg>
      );
    case "Geometry":
      return (
        <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
          <polygon points="60,8 110,70 10,70" stroke="white" strokeWidth="2" fill="rgba(255,255,255,0.02)" />
        </svg>
      );
    case "Algebra":
      return (
        <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="18" width="80" height="44" rx="6" fill="rgba(255,255,255,0.02)" />
          <text x="60" y="46" textAnchor="middle" fill="white" fontSize="18" fontWeight="700">x + y</text>
        </svg>
      );
    default:
      return <div style={{ width: 120, height: 80, backgroundColor: 'rgba(255,255,255,0.03)' }}></div>;
  }
};

export default function CategorySelection() {
  const navigate = useNavigate();

  const handleCategorySelect = (category) => {
    navigate("/quiz", { state: { category } });
  };

  return (
    <div className="page" style={{ maxWidth: 'none', width: '100%', padding: '2rem' }}>
      <ThemeToggle />

      <motion.div
        className="home-card"
        style={{ width: '100%', maxWidth: 'none', padding: '2rem' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1>Select a Category</h1>
        <p>Choose a math category to start your quiz.</p>

        <div className="category-grid">
          {categories.map((category) => (
            <AnimatedButton
              key={category}
              className="category-card"
              onClick={() => handleCategorySelect(category)}
              style={{ padding: 0 }}
            >
              <div className="category-hero">
                <div className="category-ribbon">ONLINE</div>
                <div className="category-hero-image">{getCategoryIcon(category)}</div>
              </div>

              <div className="category-body">
                <h3 className="category-title">{category}</h3>
              </div>
            </AnimatedButton>
          ))}
        </div>
      </motion.div>
    </div>
  );
}