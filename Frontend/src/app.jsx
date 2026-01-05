import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import CategorySelection from "./pages/CategorySelection";
import Quiz from "./pages/quiz";
import Results from "./pages/Results";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<CategorySelection />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}
