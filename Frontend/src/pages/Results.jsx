import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizData, analysis, questions } = location.state || { quizData: [], analysis: null, questions: [] };

  const [questionResults, setQuestionResults] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'weak-by-category' | 'questions'
  const [skillCategoryMap, setSkillCategoryMap] = useState({});

  // Media recommendations for skills
  const mediaRecommendations = {
    "Box and Whisker": [
      { type: "video", title: "Khan Academy: Box and Whisker Plots", url: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data/box-whisker-plots" },
      { type: "article", title: "Box Plot Explained", url: "https://www.mathsisfun.com/definitions/box-and-whisker-plot.html" }
    ],
    "Circle Graph": [
      { type: "video", title: "Pie Charts and Circle Graphs", url: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data/pie-charts" },
      { type: "article", title: "Understanding Pie Charts", url: "https://www.mathsisfun.com/data/pie-charts.html" }
    ],
    "Histogram as Table or Graph": [
      { type: "video", title: "Histograms", url: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data/histograms" },
      { type: "article", title: "Histogram Guide", url: "https://www.mathsisfun.com/data/histograms.html" }
    ],
    "Number Line": [
      { type: "video", title: "Number Lines", url: "https://www.khanacademy.org/math/arithmetic/arith-review-negative-numbers/arith-review-number-line" },
      { type: "article", title: "Number Line Basics", url: "https://www.mathsisfun.com/numbers/number-line.html" }
    ],
    "Scatter Plot": [
      { type: "video", title: "Scatter Plots", url: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data/scatter-plots" },
      { type: "article", title: "Scatter Plot Tutorial", url: "https://www.mathsisfun.com/data/scatter-xy-plots.html" }
    ],
    "Stem and Leaf Plot": [
      { type: "video", title: "Stem and Leaf Plots", url: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data/stem-leaf-plots" },
      { type: "article", title: "Stem and Leaf Plots", url: "https://www.mathsisfun.com/data/stem-leaf-plots.html" }
    ],
    "Table": [
      { type: "video", title: "Reading Tables", url: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data" },
      { type: "article", title: "Data Tables", url: "https://www.mathsisfun.com/data/data-tables.html" }
    ],
    "Venn Diagram": [
      { type: "video", title: "Venn Diagrams", url: "https://www.khanacademy.org/math/statistics-probability/probability-library/venn-diagrams" },
      { type: "article", title: "Venn Diagram", url: "https://www.mathsisfun.com/sets/venn-diagrams.html" }
    ],
    "Mean": [
      { type: "video", title: "Mean, Median, Mode", url: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data/mean-median-basics" },
      { type: "article", title: "Average (Mean)", url: "https://www.mathsisfun.com/mean.html" }
    ],
    "Median": [
      { type: "video", title: "Median", url: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data/mean-median-basics" },
      { type: "article", title: "Median", url: "https://www.mathsisfun.com/median.html" }
    ],
    "Mode": [
      { type: "video", title: "Mode", url: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data/mean-median-basics" },
      { type: "article", title: "Mode", url: "https://www.mathsisfun.com/mode.html" }
    ],
    "Range": [
      { type: "video", title: "Range", url: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data/range-variance" },
      { type: "article", title: "Range", url: "https://www.mathsisfun.com/definitions/range.html" }
    ],
    "Counting Methods": [
      { type: "video", title: "Counting Principles", url: "https://www.khanacademy.org/math/statistics-probability/counting-permutations-and-combinations" },
      { type: "article", title: "Counting Methods", url: "https://www.mathsisfun.com/combinatorics/combinations-permutations.html" }
    ],
    "Probability of a Single Event": [
      { type: "video", title: "Basic Probability", url: "https://www.khanacademy.org/math/statistics-probability/probability-library/basic-probability" },
      { type: "article", title: "Probability", url: "https://www.mathsisfun.com/probability.html" }
    ],
    "Probability of Two Distinct Events": [
      { type: "video", title: "Compound Probability", url: "https://www.khanacademy.org/math/statistics-probability/probability-library/compound-probability" },
      { type: "article", title: "Compound Events", url: "https://www.mathsisfun.com/probability/compound-events.html" }
    ],
    "Interior Angles Triangle": [
      { type: "video", title: "Triangle Angles", url: "https://www.khanacademy.org/math/geometry/hs-geo-foundations/hs-geo-angles" },
      { type: "article", title: "Triangle Interior Angles", url: "https://www.mathsisfun.com/geometry/triangles.html" }
    ],
    "Interior Angles Figures with More than 3 Sides": [
      { type: "video", title: "Polygon Interior Angles", url: "https://www.khanacademy.org/math/geometry/hs-geo-foundations/hs-geo-polygons" },
      { type: "article", title: "Polygon Angles", url: "https://www.mathsisfun.com/geometry/polygons.html" }
    ],
    "Congruence": [
      { type: "video", title: "Congruent Shapes", url: "https://www.khanacademy.org/math/geometry/hs-geo-congruence" },
      { type: "article", title: "Congruence", url: "https://www.mathsisfun.com/geometry/congruence.html" }
    ],
    "Complementary and Supplementary Angles": [
      { type: "video", title: "Complementary and Supplementary Angles", url: "https://www.khanacademy.org/math/geometry/hs-geo-foundations/hs-geo-angles" },
      { type: "article", title: "Angle Pairs", url: "https://www.mathsisfun.com/geometry/complementary-supplementary-angles.html" }
    ],
    "Angles on Parallel Lines Cut by a Transversal": [
      { type: "video", title: "Parallel Lines and Transversals", url: "https://www.khanacademy.org/math/geometry/hs-geo-congruence/hs-geo-parallel-lines" },
      { type: "article", title: "Parallel Lines", url: "https://www.mathsisfun.com/geometry/parallel-lines.html" }
    ],
    "Pythagorean Theorem": [
      { type: "video", title: "Pythagorean Theorem", url: "https://www.khanacademy.org/math/geometry/hs-geo-trig/hs-geo-pythagorean-theorem" },
      { type: "article", title: "Pythagorean Theorem", url: "https://www.mathsisfun.com/pythagoras.html" }
    ],
    "Nets of 3D Figures": [
      { type: "video", title: "Nets of 3D Shapes", url: "https://www.khanacademy.org/math/geometry/hs-geo-solids" },
      { type: "article", title: "3D Nets", url: "https://www.mathsisfun.com/geometry/nets.html" }
    ],
    "Unit Conversion Within a System": [
      { type: "video", title: "Unit Conversion", url: "https://www.khanacademy.org/math/arithmetic-home/arith-review-measurement" },
      { type: "article", title: "Converting Units", url: "https://www.mathsisfun.com/measure/unit-conversion.html" }
    ],
    "Effect of Changing Dimensions of a Shape Prportionally": [
      { type: "video", title: "Scale Factors", url: "https://www.khanacademy.org/math/geometry/hs-geo-transformations" },
      { type: "article", title: "Scale Factor", url: "https://www.mathsisfun.com/definitions/scale-factor.html" }
    ],
    "Area Circle": [
      { type: "video", title: "Area of a Circle", url: "https://www.khanacademy.org/math/geometry/hs-geo-circles" },
      { type: "article", title: "Circle Area", url: "https://www.mathsisfun.com/geometry/circle-area.html" }
    ],
    "Circumference": [
      { type: "video", title: "Circumference", url: "https://www.khanacademy.org/math/geometry/hs-geo-circles" },
      { type: "article", title: "Circle Circumference", url: "https://www.mathsisfun.com/geometry/circle-circumference.html" }
    ],
    "Perimeter of a Polygon": [
      { type: "video", title: "Perimeter", url: "https://www.khanacademy.org/math/geometry/hs-geo-foundations" },
      { type: "article", title: "Perimeter", url: "https://www.mathsisfun.com/geometry/perimeter.html" }
    ],
    "Reading a Ruler or Scale": [
      { type: "video", title: "Reading Rulers", url: "https://www.khanacademy.org/math/arithmetic-home/arith-review-measurement" },
      { type: "article", title: "Measuring Length", url: "https://www.mathsisfun.com/measure/measure-length.html" }
    ],
    "Calculations with Similar Figures": [
      { type: "video", title: "Similar Figures", url: "https://www.khanacademy.org/math/geometry/hs-geo-similarity" },
      { type: "article", title: "Similar Shapes", url: "https://www.mathsisfun.com/geometry/similar.html" }
    ],
    "Conversion of Fraction Decimals Percents": [
      { type: "video", title: "Fractions, Decimals, Percents", url: "https://www.khanacademy.org/math/arithmetic-home/arith-review-fractions-decimals" },
      { type: "article", title: "Converting Fractions", url: "https://www.mathsisfun.com/converting-fractions-decimals.html" }
    ],
    "Equivalent Fractions": [
      { type: "video", title: "Equivalent Fractions", url: "https://www.khanacademy.org/math/arithmetic-home/fractions" },
      { type: "article", title: "Equivalent Fractions", url: "https://www.mathsisfun.com/equivalent_fractions.html" }
    ],
    "Ordering Positive Decimals": [
      { type: "video", title: "Ordering Decimals", url: "https://www.khanacademy.org/math/arithmetic-home/arith-review-decimals" },
      { type: "article", title: "Ordering Decimals", url: "https://www.mathsisfun.com/ordering_decimals.html" }
    ],
    "Ordering Fractions": [
      { type: "video", title: "Comparing Fractions", url: "https://www.khanacademy.org/math/arithmetic-home/fractions" },
      { type: "article", title: "Comparing Fractions", url: "https://www.mathsisfun.com/comparing.html" }
    ],
    "Ordering Integers": [
      { type: "video", title: "Ordering Integers", url: "https://www.khanacademy.org/math/arithmetic/arith-review-negative-numbers" },
      { type: "article", title: "Integers", url: "https://www.mathsisfun.com/numbers/integers.html" }
    ],
    "Rounding": [
      { type: "video", title: "Rounding Numbers", url: "https://www.khanacademy.org/math/arithmetic-home/arith-review-rounding" },
      { type: "article", title: "Rounding", url: "https://www.mathsisfun.com/numbers/rounding.html" }
    ],
    "Addition Whole Numbers": [
      { type: "video", title: "Adding Whole Numbers", url: "https://www.khanacademy.org/math/arithmetic-home/addition-subtraction" },
      { type: "article", title: "Addition", url: "https://www.mathsisfun.com/numbers/addition.html" }
    ],
    "Division Fractions": [
      { type: "video", title: "Dividing Fractions", url: "https://www.khanacademy.org/math/arithmetic-home/fractions" },
      { type: "article", title: "Dividing Fractions", url: "https://www.mathsisfun.com/fractions_division.html" }
    ],
    "Estimation": [
      { type: "video", title: "Estimation", url: "https://www.khanacademy.org/math/arithmetic-home/arith-review-estimation" },
      { type: "article", title: "Estimation", url: "https://www.mathsisfun.com/numbers/estimation.html" }
    ],
    "Fraction Of": [
      { type: "video", title: "Fractions of Amounts", url: "https://www.khanacademy.org/math/arithmetic-home/fractions" },
      { type: "article", title: "Fractions", url: "https://www.mathsisfun.com/numbers/fraction.html" }
    ],
    "Least Common Multiple": [
      { type: "video", title: "LCM", url: "https://www.khanacademy.org/math/arithmetic-home/arith-review-multiplication-division" },
      { type: "article", title: "LCM", url: "https://www.mathsisfun.com/least-common-multiple.html" }
    ],
    "Multiplication Fractions": [
      { type: "video", title: "Multiplying Fractions", url: "https://www.khanacademy.org/math/arithmetic-home/fractions" },
      { type: "article", title: "Multiplying Fractions", url: "https://www.mathsisfun.com/fractions_multiplication.html" }
    ],
    "Multiplication Whole Numbers": [
      { type: "video", title: "Multiplication", url: "https://www.khanacademy.org/math/arithmetic-home/arith-review-multiplication-division" },
      { type: "article", title: "Multiplication", url: "https://www.mathsisfun.com/numbers/multiplication.html" }
    ],
    "Percent Of": [
      { type: "video", title: "Percents", url: "https://www.khanacademy.org/math/arithmetic-home/arith-review-percents" },
      { type: "article", title: "Percent", url: "https://www.mathsisfun.com/percentage.html" }
    ],
    "Subtraction Whole Numbers": [
      { type: "video", title: "Subtraction", url: "https://www.khanacademy.org/math/arithmetic-home/addition-subtraction" },
      { type: "article", title: "Subtraction", url: "https://www.mathsisfun.com/numbers/subtraction.html" }
    ],
    "Square Root": [
      { type: "video", title: "Square Roots", url: "https://www.khanacademy.org/math/algebra-basics/basic-alg-foundations" },
      { type: "article", title: "Square Root", url: "https://www.mathsisfun.com/square-root.html" }
    ],
    "Finding Percents": [
      { type: "video", title: "Finding Percents", url: "https://www.khanacademy.org/math/arithmetic-home/arith-review-percents" },
      { type: "article", title: "Percentages", url: "https://www.mathsisfun.com/percentage.html" }
    ],
    "Proportion": [
      { type: "video", title: "Ratios and Proportions", url: "https://www.khanacademy.org/math/arithmetic-home/arith-review-ratios-proportions" },
      { type: "article", title: "Proportion", url: "https://www.mathsisfun.com/definitions/proportion.html" }
    ],
    "Scale Factor": [
      { type: "video", title: "Scale Factor", url: "https://www.khanacademy.org/math/geometry/hs-geo-transformations" },
      { type: "article", title: "Scale Factor", url: "https://www.mathsisfun.com/definitions/scale-factor.html" }
    ],
    "Unit Rate": [
      { type: "video", title: "Unit Rates", url: "https://www.khanacademy.org/math/arithmetic-home/arith-review-ratios-proportions" },
      { type: "article", title: "Unit Rate", url: "https://www.mathsisfun.com/definitions/unit-rate.html" }
    ],
    "Scientific Notation": [
      { type: "video", title: "Scientific Notation", url: "https://www.khanacademy.org/math/arithmetic-home/arith-review-scientific-notation" },
      { type: "article", title: "Scientific Notation", url: "https://www.mathsisfun.com/numbers/scientific-notation.html" }
    ],
    "Divisibility Rules": [
      { type: "video", title: "Divisibility Rules", url: "https://www.khanacademy.org/math/arithmetic-home/arith-review-multiplication-division" },
      { type: "article", title: "Divisibility Rules", url: "https://www.mathsisfun.com/divisibility.html" }
    ],
    "Prime Number": [
      { type: "video", title: "Prime Numbers", url: "https://www.khanacademy.org/math/arithmetic-home/arith-review-multiplication-division" },
      { type: "article", title: "Prime Numbers", url: "https://www.mathsisfun.com/prime_numbers.html" }
    ],
    "Absolute Value": [
      { type: "video", title: "Absolute Value", url: "https://www.khanacademy.org/math/arithmetic/arith-review-negative-numbers" },
      { type: "article", title: "Absolute Value", url: "https://www.mathsisfun.com/numbers/absolute-value.html" }
    ],
    "Exponents": [
      { type: "video", title: "Exponents", url: "https://www.khanacademy.org/math/algebra-basics/basic-alg-foundations" },
      { type: "article", title: "Exponents", url: "https://www.mathsisfun.com/exponent.html" }
    ],
    "Pattern Finding": [
      { type: "video", title: "Patterns", url: "https://www.khanacademy.org/math/algebra-basics/basic-alg-foundations" },
      { type: "article", title: "Patterns", url: "https://www.mathsisfun.com/algebra/patterns.html" }
    ],
    "Algebraic Simplification": [
      { type: "video", title: "Simplifying Expressions", url: "https://www.khanacademy.org/math/algebra-home/alg-intro-to-algebra" },
      { type: "article", title: "Algebra", url: "https://www.mathsisfun.com/algebra/" }
    ],
    "Algebraic Solving": [
      { type: "video", title: "Solving Equations", url: "https://www.khanacademy.org/math/algebra-home/alg-intro-to-algebra" },
      { type: "article", title: "Solving Equations", url: "https://www.mathsisfun.com/algebra/" }
    ],
    "Linear Equations": [
      { type: "video", title: "Linear Equations", url: "https://www.khanacademy.org/math/algebra-home/alg-linear-eq-func" },
      { type: "article", title: "Linear Equations", url: "https://www.mathsisfun.com/algebra/linear-equations.html" }
    ],
    "Slope": [
      { type: "video", title: "Slope", url: "https://www.khanacademy.org/math/algebra-home/alg-linear-eq-func" },
      { type: "article", title: "Slope", url: "https://www.mathsisfun.com/geometry/slope.html" }
    ],
    "Order of Operations +,-,/,* () positive reals": [
      { type: "video", title: "Order of Operations", url: "https://www.khanacademy.org/math/arithmetic-home/arith-review-order-of-operations" },
      { type: "article", title: "Order of Operations", url: "https://www.mathsisfun.com/operation-order-pemdas.html" }
    ],
    "Order of Operations All": [
      { type: "video", title: "Order of Operations", url: "https://www.khanacademy.org/math/arithmetic-home/arith-review-order-of-operations" },
      { type: "article", title: "Order of Operations", url: "https://www.mathsisfun.com/operation-order-pemdas.html" }
    ],
    "Equation Solving Two or Fewer Steps": [
      { type: "video", title: "Solving Equations", url: "https://www.khanacademy.org/math/algebra-home/alg-intro-to-algebra" },
      { type: "article", title: "Solving Equations", url: "https://www.mathsisfun.com/algebra/" }
    ],
    "Equation Solving More Than Two Steps": [
      { type: "video", title: "Solving Equations", url: "https://www.khanacademy.org/math/algebra-home/alg-intro-to-algebra" },
      { type: "article", title: "Solving Equations", url: "https://www.mathsisfun.com/algebra/" }
    ],
    "Greatest Common Factor": [
      { type: "video", title: "GCF", url: "https://www.khanacademy.org/math/arithmetic-home/arith-review-multiplication-division" },
      { type: "article", title: "GCF", url: "https://www.mathsisfun.com/greatest-common-factor.html" }
    ],
    "Computation with Real Numbers": [
      { type: "video", title: "Real Numbers", url: "https://www.khanacademy.org/math/algebra-basics/basic-alg-foundations" },
      { type: "article", title: "Real Numbers", url: "https://www.mathsisfun.com/numbers/real-numbers.html" }
    ],
    "Solving Inequalities": [
      { type: "video", title: "Inequalities", url: "https://www.khanacademy.org/math/algebra-home/alg-intro-to-algebra" },
      { type: "article", title: "Inequalities", url: "https://www.mathsisfun.com/algebra/inequality.html" }
    ],
    "Solving Systems of Linear Equations": [
      { type: "video", title: "Systems of Equations", url: "https://www.khanacademy.org/math/algebra-home/alg-system-of-equations" },
      { type: "article", title: "Systems of Equations", url: "https://www.mathsisfun.com/algebra/systems-linear-equations.html" }
    ],
    "Quadratic Formula to Solve Quadratic Equation": [
      { type: "video", title: "Quadratic Formula", url: "https://www.khanacademy.org/math/algebra-home/alg-quadratics" },
      { type: "article", title: "Quadratic Formula", url: "https://www.mathsisfun.com/algebra/quadratic-equation.html" }
    ],
    // Add more as needed
  };

  // Helper: prefer YouTube for videos and trusted-site search for articles
  // Curated article pages (specific reputable pages). Add more entries as needed.
  const curatedArticles = {
    'Venn Diagram': [
      { type: 'article', title: 'GeeksforGeeks: Venn Diagram', url: 'https://www.geeksforgeeks.org/venn-diagram/' },
      { type: 'article', title: 'Javatpoint: Venn Diagram', url: 'https://www.javatpoint.com/venn-diagram' }
    ],
    'Box and Whisker': [
      { type: 'article', title: 'GeeksforGeeks: Box and Whisker Plot', url: 'https://www.geeksforgeeks.org/box-plot-box-and-whisker-plot/' },
      { type: 'article', title: 'MathsisFun: Box-and-Whisker Plot', url: 'https://www.mathsisfun.com/data/box-plot.html' }
    ],
    // add specific curated entries here as needed
  };

  // Optional curated direct video URLs (YouTube). Leave empty to use search fallback.
  const curatedVideos = {
    // 'Venn Diagram': 'https://www.youtube.com/watch?v=9ZcYkenxkWk',
  };

  const getMediaRecommendations = (skill) => {
    const q = encodeURIComponent(skill || 'math topic');

    // Articles: prefer curated specific pages, otherwise provide site-specific searches on reputable domains
    const articles = curatedArticles[skill] || [
      { type: 'article', title: `GeeksforGeeks: ${skill}`, url: `https://www.geeksforgeeks.org/?s=${q}` },
      { type: 'article', title: `JavatPoint: ${skill}`, url: `https://www.javatpoint.com/?s=${q}` },
      { type: 'article', title: `Wikipedia: ${skill}`, url: `https://en.wikipedia.org/w/index.php?search=${q}` }
    ];

    // Video: use curated video if available else YouTube search
    const videoUrl = curatedVideos[skill] || `https://www.youtube.com/results?search_query=${q}`;

    return [
      { type: 'video', title: `YouTube: ${skill}`, url: videoUrl },
      ...articles
    ];
  };

  useEffect(() => {
    if (!quizData.length || !questions.length) return;

    // Process question results for display
    const results = quizData.map((data, idx) => {
      const question = questions[idx];
      return {
        question: `Question ${idx + 1}`,
        questionText: question?.question_text || 'Question text not available',
        userAnswer: data.first_action,
        correctAnswer: question?.correct_answer || 'N/A',
        isCorrect: data.correct === 1,
        skill: question?.skill || 'General Math',
        time: data.ms_first_response,
        aiPredictedHard: data.ai_hard_prediction || false,
        aiConfidence: data.predicted_difficulty || null
      };
    });

    setQuestionResults(results);
  }, [quizData, questions]);

  useEffect(() => {
    // load skill->category mapping from public JSON
    fetch('/Quiz_question.json')
      .then(r => r.json())
      .then(data => {
        const map = {};
        const normalized = {};
        const normalize = (s) => (s || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');
        data.forEach(item => {
          if (item.skill_name && item.category) {
            map[item.skill_name] = item.category;
            normalized[normalize(item.skill_name)] = item.category;
          }
        });
        // store both raw and normalized maps
        setSkillCategoryMap({ raw: map, normalized });
      })
      .catch(() => setSkillCategoryMap({}));
  }, []);

  // If backend analysis is missing, compute a simple fallback analysis from question results
  const computedAnalysis = (() => {
    if (!questionResults || questionResults.length === 0) return null;
    const bySkill = {};
    questionResults.forEach(r => {
      const name = r.skill || 'General Math';
      if (!bySkill[name]) bySkill[name] = { skill: name, correct: 0, total: 0 };
      bySkill[name].total += 1;
      if (r.isCorrect) bySkill[name].correct += 1;
    });
    const weak_skills = Object.values(bySkill).map(s => {
      const actual_success_rate = s.total ? s.correct / s.total : 1.0;
      let priority = 'Low';
      if (actual_success_rate < 0.5) priority = 'High';
      else if (actual_success_rate < 0.75) priority = 'Medium';
      return {
        skill: s.skill,
        actual_success_rate,
        hard_questions_count: s.total - s.correct,
        total_questions: s.total,
        priority
      };
    }).filter(s => s.total_questions > 0 && s.actual_success_rate < 0.75);

    const avg = Object.values(bySkill).reduce((a,b) => a + (b.total ? b.correct / b.total : 1), 0) / Math.max(1, Object.keys(bySkill).length);
    return {
      average_success_rate: avg,
      total_attempts: questionResults.length,
      weak_skills
    };
  })();

  const displayAnalysis = analysis || computedAnalysis || { weak_skills: [] };

  // Prefer model-provided skill predictions if available (model decides weak skills)
  const baseWeakList = (displayAnalysis.skill_predictions && displayAnalysis.skill_predictions.length > 0)
    ? displayAnalysis.skill_predictions.filter(p => p.is_weak).map(p => ({
        skill: p.skill,
        actual_success_rate: p.actual_success_rate,
        hard_questions_count: p.hard_questions_count,
        total_questions: p.total_questions,
        priority: p.is_weak ? (p.model_score < 0.5 ? 'HIGH' : 'MEDIUM') : 'LOW'
      }))
    : (displayAnalysis.weak_skills || []);

  const groupedWeakSkills = (baseWeakList || []).reduce((acc, s) => {
    const skillName = s.skill || s.skill_name || s.name || '';
    const normalize = (t) => (t || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');
    let category = 'Uncategorized';
    if (skillCategoryMap && skillCategoryMap.raw && skillCategoryMap.raw[skillName]) {
      category = skillCategoryMap.raw[skillName];
    } else if (skillCategoryMap && skillCategoryMap.normalized) {
      const n = normalize(skillName);
      if (skillCategoryMap.normalized[n]) category = skillCategoryMap.normalized[n];
      else {
        // fallback: try includes match against normalized keys
        const keys = Object.keys(skillCategoryMap.normalized || {});
        const found = keys.find(k => k && n && (k.includes(n) || n.includes(k)));
        if (found) category = skillCategoryMap.normalized[found];
      }
    }
    if (!acc[category]) acc[category] = [];
    acc[category].push(s);
    return acc;
  }, {});

  if (!quizData.length) {
    return (
      <div className="results-page">
        <div className="results-container">
          <h1>No Results Available</h1>
          <p>Please take the quiz first.</p>
          <button onClick={() => navigate('/')} className="primary-btn">Go Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="results-dashboard">
        <header className="results-header">
          <h1>Quiz Results Dashboard</h1>
          {analysis && (
            <div className="score-card">
              <div className="score-display">
                <span className="score-number">{Math.round(analysis.average_success_rate * 100)}</span>
                <span className="score-percent">%</span>
              </div>
            </div>
          )}

          {/* Tabs for report */}
          <div className="results-tabs">
            <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
            <button className={`tab-btn ${activeTab === 'weak-by-category' ? 'active' : ''}`} onClick={() => setActiveTab('weak-by-category')}>Weak Skills by Category</button>
            <button className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`} onClick={() => setActiveTab('questions')}>Questions</button>
          </div>
        </header>

        {/* Weak Skills by Category tab content */}
        {activeTab === 'weak-by-category' && (
          <div className="weak-by-category-panel">
            <h2>Weak Skills by Category</h2>
            <p className="card-description">Skills identified as weak, grouped by category. Click resources to review.</p>
            <div className="category-list">
              {displayAnalysis?.weak_skills && displayAnalysis.weak_skills.length === 0 && (
                <div>No weak skills detected.</div>
              )}
              {(!Object.keys(groupedWeakSkills).length && (displayAnalysis?.weak_skills && displayAnalysis.weak_skills.length > 0)) && (
                <div>Category mapping not loaded yet or skill names don't match the mapping.</div>
              )}
              {Object.entries(groupedWeakSkills).map(([category, skills]) => (
                <div key={category} className="category-block">
                  <h3 className="category-name">{category}</h3>
                  <div className="category-skills">
                    {skills.map((s, i) => (
                      <div key={s.skill + i} className="category-skill-item">
                        <div className="skill-left">
                          <strong>{s.skill}</strong>
                          <div className="skill-meta">Success: {(s.actual_success_rate * 100).toFixed(0)}% • Attempts: {s.total_questions}</div>
                        </div>
                        <div className="skill-right">
                          <span className={`priority-badge ${s.priority?.toLowerCase()}`}>{s.priority}</span>
                          <div className="skill-media">
                            {getMediaRecommendations(s.skill).map((m, mi) => (
                              <div key={mi} className="media-resource-row">
                                <button
                                  className={`media-btn ${m.type.toLowerCase()}`}
                                  onClick={() => window.open(m.url, '_blank')}
                                  aria-label={`${m.type} for ${s.skill}`}
                                >
                                  {m.type.toUpperCase()}
                                </button>
                                <button className="media-title-btn" onClick={() => window.open(m.url, '_blank')}>{m.title}</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overview tab content */}
        {activeTab === 'overview' && (
          <div className="dashboard-grid">
            {/* Performance Overview Card (always shown; uses fallbacks if analysis missing) */}
            <div className="dashboard-card overview-card">
              <h2>Performance Overview</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">{analysis?.total_attempts ?? questionResults.length}</span>
                  <span className="stat-label">Questions</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{questionResults.filter(q => q.isCorrect).length}</span>
                  <span className="stat-label">Correct</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{questionResults.filter(q => !q.isCorrect).length}</span>
                  <span className="stat-label">Incorrect</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{displayAnalysis?.weak_skills ? displayAnalysis.weak_skills.length : 0}</span>
                  <span className="stat-label">Weak Skills</span>
                </div>
              </div>
              {!analysis && (
                <p className="card-description">Detailed AI analysis not available — showing basic results.</p>
              )}
            </div>

          {/* AI Skills Analysis Card */}
          {displayAnalysis && displayAnalysis.weak_skills && displayAnalysis.weak_skills.length > 0 && (
            <div className="dashboard-card skills-card">
              <h2>AI Skills Analysis</h2>
              <p className="card-description">Skills identified as challenging based on your performance</p>
              <div className="skills-list">
                {displayAnalysis.weak_skills.map((skill, idx) => (
                  <div key={idx} className="skill-item">
                    <div className="skill-header">
                      <h3>{skill.skill}</h3>
                      <span className={`priority-badge ${skill.priority?.toLowerCase()}`}>
                        {skill.priority}
                      </span>
                    </div>
                    <div className="skill-metrics">
                      <div className="metric">
                        <span className="metric-label">Success Rate</span>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{width: `${skill.actual_success_rate * 100}%`}}
                          ></div>
                        </div>
                        <span className="metric-value">{(skill.actual_success_rate * 100).toFixed(1)}%</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Hard Questions</span>
                        <span className="metric-value">{skill.hard_questions_count}/{skill.total_questions}</span>
                      </div>
                    </div>
                    <div className="skill-resources">
                      <h4>Recommended Resources</h4>
                      <div className="resource-links">
                        <span>See the "Weak Skills by Category" tab for curated resources and media recommendations.</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Weak Skills & Resources Card */}
          {displayAnalysis && displayAnalysis.weak_skills && displayAnalysis.weak_skills.length > 0 && (
            <div className="dashboard-card resources-card">
              <h2>Top Weak Skills & Resources</h2>
              <p className="card-description">Focus on these key areas with targeted learning materials</p>
              <div className="weak-skills-resources">
                {displayAnalysis.weak_skills.slice(0, 5).map((skill, idx) => (
                  <div key={idx} className="weak-skill-resource">
                    <div className="skill-info">
                      <h3>{skill.skill}</h3>
                      <div className="skill-metrics-compact">
                        <span className="metric-compact">
                          Success: {(skill.actual_success_rate * 100).toFixed(0)}%
                        </span>
                        <span className={`priority-compact ${skill.priority?.toLowerCase()}`}>
                          {skill.priority}
                        </span>
                      </div>
                    </div>
                    <div className="skill-media-list">
                      <span>View full resources in the "Weak Skills by Category" tab.</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Question Timeline (moved to Questions tab) */}
        </div>
        )}

        {activeTab === 'questions' && (
          <div className="dashboard-grid">
            <div className="dashboard-card questions-card">
              <h2>Question Timeline</h2>
              <p className="card-description">Review your answers and AI insights</p>
              <div className="questions-timeline">
                {questionResults.map((result, idx) => (
                  <div key={idx} className={`timeline-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="timeline-marker">
                      <span className={`status-icon ${result.isCorrect ? 'correct-icon' : 'incorrect-icon'}`}>
                        {result.isCorrect ? '✓' : '✗'}
                      </span>
                      {result.aiPredictedHard && (
                        <span className="ai-badge">AI Hard</span>
                      )}
                    </div>
                    <div className="timeline-content">
                      <div className="question-summary">
                        <h4>Question {idx + 1}</h4>
                        <p className="question-text">{result.questionText.substring(0, 100)}...</p>
                      </div>
                      <div className="question-details">
                        <div className="detail-row">
                          <span className="detail-label">Your Answer:</span>
                          <span className={`detail-value ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                            {result.userAnswer || 'No answer'}
                          </span>
                        </div>
                        {!result.isCorrect && (
                          <div className="detail-row">
                            <span className="detail-label">Correct:</span>
                            <span className="detail-value correct">{result.correctAnswer}</span>
                          </div>
                        )}
                        <div className="detail-row">
                          <span className="detail-label">Skill:</span>
                          <span className="detail-value">{result.skill}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Time:</span>
                          <span className="detail-value">{result.time ? `${Math.round(result.time / 1000)}s` : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="dashboard-actions">
          <button onClick={() => navigate('/')} className="primary-btn">Take Another Quiz</button>
        </div>
      </div>
    </div>
  );
}