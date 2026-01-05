from flask import Flask, request, jsonify
import pandas as pd
import pickle
import numpy as np

app = Flask(__name__)

# Load the trained model and imputer
model = pickle.load(open('skill_recommendation_model.pkl', 'rb'))

# Load imputer from training (we need to recreate it since it's not saved)
# For now, we'll use mean imputation
from sklearn.impute import SimpleImputer
imputer = SimpleImputer(strategy='mean')

def get_weak_skills_recommendations(student_test_data, threshold=0.65):
    """
    Identify weak skills from a student's initial test using AI predictions.

    Args:
        student_test_data (pd.DataFrame): Student's test attempts with columns:
                                         'skill_name_*', 'correct', 'attempt_count', 'hint_count', etc.
        threshold (float): Probability threshold below which a question is considered hard (default 0.65)

    Returns:
        dict: Weak skills with their success rates and recommendations
    """

    # Use AI model to predict difficulty for each question
    predictions = predict_question_difficulty(student_test_data)

    # Add predictions to the data
    student_test_data = student_test_data.copy()
    student_test_data['predicted_difficulty'] = predictions['confidence']
    student_test_data['ai_hard_prediction'] = student_test_data['predicted_difficulty'] < threshold

    # Group by skill and analyze
    skill_cols = [col for col in student_test_data.columns if col.startswith('skill_name_')]
    weak_skills = []
    skill_predictions = []

    for skill_col in skill_cols:
        skill_name = skill_col.replace('skill_name_', '')
        skill_data = student_test_data[student_test_data[skill_col] == 1]

        if len(skill_data) > 0:
            # Count how many questions were predicted as hard by AI
            hard_questions = skill_data[skill_data['ai_hard_prediction'] == True]
            total_questions = len(skill_data)
            hard_ratio = len(hard_questions) / total_questions

            # Also calculate actual success rate
            actual_success_rate = skill_data['correct'].mean()

            # Model-based score: average predicted difficulty for the skill (lower -> harder)
            avg_predicted = float(skill_data['predicted_difficulty'].mean()) if 'predicted_difficulty' in skill_data else 1.0
            model_is_weak = avg_predicted < threshold

            # A skill is weak if AI predicts many questions as hard OR actual performance is poor
            if hard_ratio > 0.5 or actual_success_rate < 0.7:
                weak_skills.append({
                    'skill': skill_name,
                    'hard_questions_ratio': hard_ratio,
                    'actual_success_rate': actual_success_rate,
                    'total_questions': total_questions,
                    'hard_questions_count': len(hard_questions),
                    'priority': 'HIGH' if hard_ratio > 0.7 or actual_success_rate < 0.5 else 'MEDIUM',
                    'model_score': avg_predicted,
                    'model_is_weak': model_is_weak
                })

            # include model prediction for every skill for frontend use
            skill_predictions.append({
                'skill': skill_name,
                'model_score': avg_predicted,
                'is_weak': model_is_weak,
                'actual_success_rate': actual_success_rate,
                'total_questions': total_questions,
                'hard_questions_count': len(hard_questions)
            })

    # Sort weak skills by hard questions ratio (worst first)
    weak_skills_sorted = sorted(weak_skills, key=lambda x: x['hard_questions_ratio'], reverse=True)

    return {
        'student_id': 'quiz_student',
        'weak_skills': weak_skills_sorted,
        'skill_predictions': skill_predictions,
        'total_attempts': len(student_test_data),
        'average_success_rate': float(student_test_data['correct'].mean()),
        'ai_analysis_used': True
    }

def predict_question_difficulty(question_features):
    """
    Predict if a student will get a specific question correct.

    Args:
        question_features (pd.DataFrame): Features for one or more questions

    Returns:
        dict: Predictions with probability scores
    """

    # Handle missing values
    question_features_imputed = question_features.copy()
    question_features_imputed = pd.DataFrame(
        imputer.fit_transform(question_features_imputed),
        columns=question_features.columns
    )

    predictions = model.predict(question_features_imputed)
    probabilities = model.predict_proba(question_features_imputed)[:, 1]

    return {
        'predictions': predictions.tolist(),
        'confidence': probabilities.tolist()
    }

@app.route('/api/analyze-quiz', methods=['POST'])
def analyze_quiz():
    """
    API endpoint to analyze quiz results and identify weak skills
    """
    try:
        # Get quiz data from frontend
        quiz_data = request.json.get('quizData', [])

        if not quiz_data:
            return jsonify({'error': 'No quiz data provided'}), 400

        # Convert to DataFrame
        quiz_df = pd.DataFrame(quiz_data)

        # Get AI predictions for each question
        predictions = predict_question_difficulty(quiz_df)

        # Add AI predictions to quiz data
        enhanced_quiz_data = quiz_data.copy()
        for i, item in enumerate(enhanced_quiz_data):
            item['predicted_difficulty'] = predictions['confidence'][i]
            item['ai_hard_prediction'] = predictions['confidence'][i] < 0.65  # Same threshold as analysis

        # Get weak skills analysis
        analysis = get_weak_skills_recommendations(quiz_df)

        # Return both analysis and enhanced quiz data
        return jsonify({
            **analysis,
            'enhanced_quiz_data': enhanced_quiz_data
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict-difficulty', methods=['POST'])
def predict_difficulty():
    """
    API endpoint to predict question difficulty
    """
    try:
        question_data = request.json.get('questionData', [])

        if not question_data:
            return jsonify({'error': 'No question data provided'}), 400

        # Convert to DataFrame
        question_df = pd.DataFrame(question_data)

        # Get predictions
        predictions = predict_question_difficulty(question_df)

        return jsonify(predictions)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'model_loaded': True})

if __name__ == '__main__':
    print("Starting AI Tutor API server...")
    print("Endpoints:")
    print("  POST /api/analyze-quiz - Analyze quiz results for weak skills")
    print("  POST /api/predict-difficulty - Predict question difficulty")
    print("  GET /api/health - Health check")
    app.run(debug=True, host='0.0.0.0', port=5000)