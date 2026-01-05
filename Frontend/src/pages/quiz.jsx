import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [quizData, setQuizData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.state?.category;

  useEffect(() => {
    fetch("/Quiz_question.json")
      .then(res => res.json())
      .then(data => {
        let allQuestions = [];
        data.forEach(skill => {
          if (skill.category === category) {
            allQuestions.push(...skill.questions.map(q => ({ ...q, skill: skill.skill_name })));
          }
        });

        // Shuffle allQuestions
        for (let i = allQuestions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
        }

        let numQuestions;
        if (category === "Logic and Sets") {
          numQuestions = allQuestions.length;
        } else {
          numQuestions = Math.min(20, Math.max(10, allQuestions.length));
        }

        const selectedQuestions = allQuestions.slice(0, numQuestions);
        setQuestions(selectedQuestions);
      });
  }, [category]);

  const handleNext = (questionData) => {
    setQuizData(prev => [...prev, questionData]);
    if (index + 1 < questions.length) {
      setIndex(i => i + 1);
    } else {
      // End of quiz - send data to ML model API
      analyzeQuizResults([...quizData, questionData]);
    }
  };

  const analyzeQuizResults = async (finalQuizData) => {
    try {
      const response = await fetch('http://localhost:5000/api/analyze-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizData: finalQuizData
        })
      });

      if (response.ok) {
        const apiResponse = await response.json();
        console.log('AI-powered analysis:', apiResponse);
        // Navigate to results with analysis data and enhanced quiz data
        navigate('/results', { 
          state: { 
            quizData: apiResponse.enhanced_quiz_data || finalQuizData, 
            analysis: apiResponse, 
            questions 
          } 
        });
      } else {
        console.error('Failed to analyze quiz results');
        // Fallback: navigate without analysis
        navigate('/results', { state: { quizData: finalQuizData, questions } });
      }
    } catch (error) {
      console.error('Error connecting to ML API:', error);
      // Fallback: navigate without analysis
      navigate('/results', { state: { quizData: finalQuizData, questions } });
    }
  };

  if (!questions.length) {
    return <div className="page">Loading quiz...</div>;
  }

  if (index >= questions.length) {
    return (
      <div className="page">
        <div className="home-card">
          <h1>Quiz Completed!</h1>
          <p>Your responses have been recorded for analysis.</p>
          <p>The data is ready to be processed by the ML model.</p>
          <button onClick={() => navigate('/')} className="primary-btn">Take Another Quiz</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <QuestionCard
        key={index}
        question={questions[index]}
        index={index}
        total={questions.length}
        onNext={handleNext}
      />
    </div>
  );
}
