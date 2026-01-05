import { useState, useEffect } from "react";

export default function QuestionCard({ question, index, total, onNext }) {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    setStartTime(Date.now());
  }, [question]);

  const handleSubmit = () => {
    const msFirstResponse = Date.now() - startTime;
    
    // All skills that the model expects (from training data)
    const allModelSkills = [
      "Addition Whole Numbers",
      "Addition and Subtraction Fractions", 
      "Addition and Subtraction Integers",
      "Addition and Subtraction Positive Decimals",
      "Algebraic Simplification",
      "Algebraic Solving",
      "Angles - Obtuse, Acute, and Right",
      "Angles on Parallel Lines Cut by a Transversal",
      "Area Circle",
      "Area Irregular Figure",
      "Area Parallelogram",
      "Area Rectangle",
      "Area Trapezoid",
      "Area Triangle",
      "Box and Whisker",
      "Calculations with Similar Figures",
      "Choose an Equation from Given Information",
      "Circle Graph",
      "Circumference",
      "Complementary and Supplementary Angles",
      "Computation with Real Numbers",
      "Congruence",
      "Conversion of Fraction Decimals Percents",
      "Counting Methods",
      "D.4.8-understanding-concept-of-probabilities",
      "Distributive Property",
      "Divisibility Rules",
      "Division Fractions",
      "Effect of Changing Dimensions of a Shape Prportionally",
      "Equation Solving More Than Two Steps",
      "Equation Solving Two or Fewer Steps",
      "Equivalent Fractions",
      "Estimation",
      "Exponents",
      "Finding Percents",
      "Finding Slope From Equation",
      "Finding Slope From Situation",
      "Finding Slope from Ordered Pairs",
      "Fraction Of",
      "Greatest Common Factor",
      "Histogram as Table or Graph",
      "Intercept",
      "Interior Angles Figures with More than 3 Sides",
      "Interior Angles Triangle",
      "Interpreting Coordinate Graphs",
      "Least Common Multiple",
      "Linear Equations",
      "Mean",
      "Median",
      "Midpoint",
      "Mode",
      "Multiplication Fractions",
      "Multiplication Whole Numbers",
      "Multiplication and Division Integers",
      "Multiplication and Division Positive Decimals",
      "Nets of 3D Figures",
      "Number Line",
      "Order of Operations +,-,/,* () positive reals",
      "Order of Operations All",
      "Ordering Fractions",
      "Ordering Integers",
      "Ordering Positive Decimals",
      "Ordering Real Numbers",
      "Parts of a Polyomial, Terms, Coefficient, Monomial, Exponent, Variable",
      "Pattern Finding",
      "Percent Discount",
      "Percent Of",
      "Percents",
      "Perimeter of a Polygon",
      "Polynomial Factors",
      "Prime Number",
      "Probability of Two Distinct Events",
      "Probability of a Single Event",
      "Proportion",
      "Pythagorean Theorem",
      "Quadratic Formula to Solve Quadratic Equation",
      "Range",
      "Rate",
      "Reading a Ruler or Scale",
      "Recognize Linear Pattern",
      "Recognize Quadratic Pattern",
      "Reflection",
      "Rotations",
      "Rounding",
      "Scale Factor",
      "Scatter Plot",
      "Scientific Notation",
      "Simplifying Expressions positive exponents",
      "Slope",
      "Solving Inequalities",
      "Solving Systems of Linear Equations",
      "Solving Systems of Linear Equations by Graphing",
      "Solving for a variable",
      "Square Root",
      "Stem and Leaf Plot",
      "Subtraction Whole Numbers",
      "Surface Area Cylinder",
      "Surface Area Rectangular Prism",
      "Table",
      "Translations",
      "Unit Conversion Within a System",
      "Unit Rate",
      "Venn Diagram",
      "Volume Cylinder",
      "Volume Rectangular Prism",
      "Volume Sphere",
      "Write Linear Equation from Graph",
      "Write Linear Equation from Ordered Pairs",
      "Write Linear Equation from Situation"
    ];

    // Create one-hot encoded skill_name columns for ALL skills
    const skillData = {};
    allModelSkills.forEach(skill => {
      const key = `skill_name_${skill}`;
      skillData[key] = (question.skill === skill) ? 1 : 0;
    });

    // Create one-hot encoded answer_type columns for ALL types
    const answerTypeData = {
      answer_type_choose_1: question.answer_type === 'choose_1' ? 1 : 0,
      answer_type_choose_n: 0,  // Not used in current quiz
      answer_type_fill_in_1: question.answer_type === 'fill_in' ? 1 : 0,
      answer_type_open_response: 0  // Not used in current quiz
    };

    // Compute correctness
    let isCorrect = 0;
    if (question.answer_type === 'choose_1') {
      isCorrect = selectedAnswer === question.correct_answer ? 1 : 0;
    } else if (question.answer_type === 'fill_in') {
      // Handle numeric comparison for fill-in questions
      try {
        const userNum = parseFloat(selectedAnswer);
        const correctNum = parseFloat(question.correct_answer);
        isCorrect = Math.abs(userNum - correctNum) < 0.01 ? 1 : 0;
      } catch (e) {
        isCorrect = 0;
      }
    }

    const questionData = {
      ...skillData,
      ...answerTypeData,
      attempt_count: 1,
      opportunity: index + 1,
      opportunity_original: index + 1,
      position: index + 1,
      original: 1,
      overlap_time: 0,
      first_action: selectedAnswer,
      tutor_mode_tutor: 1,
      ms_first_response: msFirstResponse,
      hint_count: 0,
      hint_total: 0,
      skill_id: 0,  // Convert to numeric, model expects this as feature
      correct: isCorrect  // Add computed correctness
    };

    onNext(questionData);
  };

  return (
    <div className="question-card">
      <div className="progress">
        <span>Question {index + 1} of {total}</span>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          ></div>
        </div>
      </div>

      <h2>{question.question_text}</h2>

      {question.answer_type === "choose_1" && question.options ? (
        <div className="options">
          {question.options.map((option, i) => (
            <label key={i} className="option">
              <input
                type="radio"
                name="answer"
                value={option}
                checked={selectedAnswer === option}
                onChange={(e) => setSelectedAnswer(e.target.value)}
              />
              {option}
            </label>
          ))}
        </div>
      ) : (
        <div className="fill-in">
          <input
            type="text"
            placeholder="Enter your answer"
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(e.target.value)}
          />
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!selectedAnswer}
        className="submit-btn"
      >
        Submit Answer
      </button>
    </div>
  );
}