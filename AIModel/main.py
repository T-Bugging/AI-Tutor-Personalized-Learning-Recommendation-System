import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.impute import SimpleImputer
from sklearn.metrics import (
    accuracy_score,
    roc_auc_score,
    log_loss,
    classification_report
)

# ---------------------------------------------------
# 1. Load dataset
# ---------------------------------------------------
DATA_PATH = "skill_builder_data_processed.csv"

df = pd.read_csv(DATA_PATH)

print("Dataset shape:", df.shape)

# ---------------------------------------------------
# 2. Analyze weak skills BEFORE sampling
# ---------------------------------------------------
print("\n===== WEAK SKILLS ANALYSIS (Full Dataset) =====")

# Extract skill columns (one-hot encoded)
skill_cols = [col for col in df.columns if col.startswith('skill_name_')]

# Calculate average correctness per skill
skill_performance = {}
for skill_col in skill_cols:
    skill_name = skill_col.replace('skill_name_', '')
    
    # Filter rows where this skill is active (value = 1)
    skill_data = df[df[skill_col] == 1]
    
    if len(skill_data) > 0:
        avg_correctness = skill_data['correct'].mean()
        count = len(skill_data)
        skill_performance[skill_name] = {
            'avg_correctness': avg_correctness,
            'count': count
        }

# Sort by average correctness (weakest first)
sorted_skills = sorted(skill_performance.items(), key=lambda x: x[1]['avg_correctness'])

print("\nTop 15 WEAKEST skills (lowest success rate):")
print("-" * 80)
for i, (skill, stats) in enumerate(sorted_skills[:15], 1):
    print(f"{i:2d}. {skill:50s} | Success Rate: {stats['avg_correctness']:.2%} | Attempts: {stats['count']}")

print("\n" + "=" * 80)
print("Top 15 STRONGEST skills (highest success rate):")
print("-" * 80)
for i, (skill, stats) in enumerate(reversed(sorted_skills[-15:]), 1):
    print(f"{i:2d}. {skill:50s} | Success Rate: {stats['avg_correctness']:.2%} | Attempts: {stats['count']}")

# Sample a fraction of the data to handle large datasets
df = df.sample(frac=0.1, random_state=42)
print("\n" + "=" * 80)
print("Sampled dataset shape:", df.shape)

# ---------------------------------------------------
# 3. Basic sanity checks
# ---------------------------------------------------
if "correct" not in df.columns:
    raise ValueError("Target column 'correct' not found in dataset")

# Ensure target is binary int
y = df["correct"].astype(int)

# Drop target from features
X = df.drop(columns=["correct"])

# Convert boolean columns to int (LogisticRegression safety)
bool_cols = X.select_dtypes(include=["bool"]).columns
X[bool_cols] = X[bool_cols].astype(int)

# Handle missing values
imputer = SimpleImputer(strategy='mean')
X = pd.DataFrame(imputer.fit_transform(X), columns=X.columns)

# ---------------------------------------------------
# 4. Train / validation split
# ---------------------------------------------------
X_train, X_val, y_train, y_val = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("Train samples:", X_train.shape[0])
print("Validation samples:", X_val.shape[0])

# ---------------------------------------------------
# 5. Random Forest Classifier (Pure ML for weak skill identification)
# ---------------------------------------------------
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    n_jobs=-1
)

print("\nTraining RandomForest model...")
model.fit(X_train, y_train)

# ---------------------------------------------------
# 6. Pure ML Feature Importance for Weak Skills
# ---------------------------------------------------
importances = pd.DataFrame({
    'Feature': X_train.columns,
    'Importance': model.feature_importances_
})

# Filter to skill features only
skill_importances = importances[importances['Feature'].str.startswith('skill_name_')].copy()
skill_importances['Skill'] = skill_importances['Feature'].str.replace('skill_name_', '')

# Sort by importance (ascending = potentially weak skills)
# Low importance = skill doesn't help predict correctness well (may be consistently hard)
weak_skills_ml = skill_importances.sort_values('Importance').head(15)

print("\n===== PURE ML WEAK SKILLS IDENTIFICATION =====")
print("Skills with LOW feature importance are potentially weak")
print("(They don't strongly influence correctness prediction)")
print("-" * 80)
for i, row in weak_skills_ml.iterrows():
    print(f"{i+1:2d}. {row['Skill']:50s} | Importance: {row['Importance']:.4f}")

# ---------------------------------------------------
# 7. Predictions
# ---------------------------------------------------
y_train_pred = model.predict(X_train)
y_val_pred = model.predict(X_val)

y_train_prob = model.predict_proba(X_train)[:, 1]
y_val_prob = model.predict_proba(X_val)[:, 1]

# ---------------------------------------------------
# 8. Performance metrics
# ---------------------------------------------------
print("\n===== TRAIN METRICS =====")
print("Accuracy:", accuracy_score(y_train, y_train_pred))
print("ROC-AUC:", roc_auc_score(y_train, y_train_prob))
print("Log Loss:", log_loss(y_train, y_train_prob))

print("\n===== VALIDATION METRICS =====")
print("Accuracy:", accuracy_score(y_val, y_val_pred))
print("ROC-AUC:", roc_auc_score(y_val, y_val_prob))
print("Log Loss:", log_loss(y_val, y_val_prob))

print("\n===== CLASSIFICATION REPORT (Validation) =====")
print(classification_report(y_val, y_val_pred))
# ---------------------------------------------------
# 9. Save model for later use in recommendations
# ---------------------------------------------------
import pickle

model_path = "skill_recommendation_model.pkl"
pickle.dump(model, open(model_path, 'wb'))
print(f"\n✓ Model saved to {model_path}")

# ---------------------------------------------------
# 10. Create a recommendation function
# ---------------------------------------------------

def get_weak_skills_recommendations(student_test_data, threshold=0.65):
    """
    Identify weak skills from a student's initial test.
    
    Args:
        student_test_data (pd.DataFrame): Student's test attempts with columns:
                                         'skill_name_*', 'correct', 'attempt_count', 'hint_count', etc.
        threshold (float): Success rate below this is considered weak (default 0.65 = 65%)
    
    Returns:
        dict: Weak skills with their success rates and recommendations
    """
    
    skill_cols = [col for col in student_test_data.columns if col.startswith('skill_name_')]
    
    weak_skills = []
    
    for skill_col in skill_cols:
        skill_name = skill_col.replace('skill_name_', '')
        skill_data = student_test_data[student_test_data[skill_col] == 1]
        
        if len(skill_data) > 0:
            success_rate = skill_data['correct'].mean()
            attempt_count = len(skill_data)
            
            if success_rate < threshold:
                weak_skills.append({
                    'skill': skill_name,
                    'success_rate': success_rate,
                    'attempts': attempt_count,
                    'priority': 'HIGH' if success_rate < 0.5 else 'MEDIUM'
                })
    
    # Sort by success rate (worst first)
    weak_skills_sorted = sorted(weak_skills, key=lambda x: x['success_rate'])
    
    return {
        'student_id': student_test_data.get('student_id', 'unknown') if isinstance(student_test_data, dict) else 'unknown',
        'weak_skills': weak_skills_sorted,
        'total_attempts': len(student_test_data),
        'average_success_rate': student_test_data['correct'].mean()
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
        imputer.transform(question_features_imputed),
        columns=question_features.columns
    )
    
    predictions = model.predict(question_features_imputed)
    probabilities = model.predict_proba(question_features_imputed)[:, 1]
    
    return {
        'predictions': predictions,
        'confidence': probabilities
    }


print("\n" + "=" * 80)
print("✓ Recommendation functions ready!")
print("=" * 80)
print("\nTo use in your app:")
print("1. Load model: pickle.load(open('skill_recommendation_model.pkl', 'rb'))")
print("2. Get weak skills: get_weak_skills_recommendations(student_test_df)")
print("3. Predict question difficulty: predict_question_difficulty(question_features_df)")
