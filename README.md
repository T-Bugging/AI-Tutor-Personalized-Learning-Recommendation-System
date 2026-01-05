# AI Math Tutor 
This project integrates a React frontend quiz application with a Python ML model to provide personalized learning recommendations.

## 🚀 Quick Start

### 1. Start the ML API Server
```bash
cd AIModel
run_api.bat
```
This starts the Flask API on `http://localhost:5000`

### 2. Start the Frontend
```bash
cd Frontend
npm run dev
```
This starts the React app on `http://localhost:5173`

### 3. Take the Quiz
1. Open `http://localhost:5173` in your browser
2. Click "Give Quiz"
3. Answer 20 questions
4. View AI-powered weak skills analysis and recommendations

## 🏗️ System Architecture

```
Frontend (React) → API Call → Python ML Model → Analysis → Frontend Results
     ↓                    ↓              ↓              ↓            ↓
Quiz Data (125 features) → JSON → get_weak_skills_recommendations() → Weak Skills → Personalized Recommendations
```

## 📊 Data Flow

1. **Quiz Collection**: Frontend collects 20 questions with 125 features each
2. **API Transmission**: Quiz data sent to `/api/analyze-quiz` endpoint
3. **ML Analysis**: Model analyzes performance using `get_weak_skills_recommendations()`
4. **Results Display**: Frontend shows weak skills with targeted learning resources

## 🎯 ML Model Features

The model analyzes these 125 features per question:
- **100+ skill_name_* columns**: One-hot encoded skills
- **4 answer_type_* columns**: Question format encoding
- **21 other features**: timing, attempts, hints, etc.

## 📈 Weak Skills Detection

The system identifies weak skills using:
- **Success Rate Analysis**: Skills with <65% accuracy
- **Priority Classification**: HIGH (<50%) or MEDIUM (50-65%)
- **Personalized Recommendations**: Curated videos and articles

## 🛠️ API Endpoints

- `POST /api/analyze-quiz` - Analyze quiz results for weak skills
- `POST /api/predict-difficulty` - Predict question difficulty
- `GET /api/health` - Health check

## 📚 Supported Skills

The system currently supports 20+ math skills including:
- Statistics: Box plots, histograms, scatter plots
- Geometry: Angles, congruence, Pythagorean theorem
- Probability: Single events, compound events
- And more...

## 🔧 Development

### Adding New Skills
1. Add skill to `Quiz_question.json`
2. Add `skill_name_*` column to model features
3. Add media recommendations in `Results.jsx`

### Model Retraining
1. Update training data with new skills
2. Retrain model: `python main.py`
3. Update API server with new model

## 📋 Requirements

- Python 3.8+
- Node.js 16+
- Flask
- scikit-learn
- pandas
- React

## 🎉 Results

After completing the quiz, students receive:
- ✅ **AI-powered weak skills identification**
- 📚 **Personalized learning recommendations**
- 📊 **Detailed performance analytics**
- 🎯 **Targeted improvement suggestions**
