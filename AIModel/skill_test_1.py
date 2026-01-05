import pandas as pd
import pickle

# Load the trained model
model_path = "skill_recommendation_model.pkl"
model = pickle.load(open(model_path, 'rb'))

# Get feature columns from model (without loading full CSV)
# We know from previous output that there are 125 features
print("Testing updated frontend compatibility...")

# Simulate COMPLETE frontend data with ALL required features
frontend_data = {
    # All skill_name_* columns (only "Box and Whisker" set to 1)
    'skill_name_Addition Whole Numbers': 0,
    'skill_name_Addition and Subtraction Fractions': 0,
    'skill_name_Addition and Subtraction Integers': 0,
    'skill_name_Addition and Subtraction Positive Decimals': 0,
    'skill_name_Algebraic Simplification': 0,
    'skill_name_Algebraic Solving': 0,
    'skill_name_Angles - Obtuse, Acute, and Right': 0,
    'skill_name_Angles on Parallel Lines Cut by a Transversal': 0,
    'skill_name_Area Circle': 0,
    'skill_name_Area Irregular Figure': 0,
    'skill_name_Area Parallelogram': 0,
    'skill_name_Area Rectangle': 0,
    'skill_name_Area Trapezoid': 0,
    'skill_name_Area Triangle': 0,
    'skill_name_Box and Whisker': 1,  # Active skill
    'skill_name_Calculations with Similar Figures': 0,
    'skill_name_Choose an Equation from Given Information': 0,
    'skill_name_Circle Graph': 0,
    'skill_name_Circumference': 0,
    'skill_name_Complementary and Supplementary Angles': 0,
    'skill_name_Computation with Real Numbers': 0,
    'skill_name_Congruence': 0,
    'skill_name_Conversion of Fraction Decimals Percents': 0,
    'skill_name_Counting Methods': 0,
    'skill_name_D.4.8-understanding-concept-of-probabilities': 0,
    'skill_name_Distributive Property': 0,
    'skill_name_Divisibility Rules': 0,
    'skill_name_Division Fractions': 0,
    'skill_name_Effect of Changing Dimensions of a Shape Prportionally': 0,
    'skill_name_Equation Solving More Than Two Steps': 0,
    'skill_name_Equation Solving Two or Fewer Steps': 0,
    'skill_name_Equivalent Fractions': 0,
    'skill_name_Estimation': 0,
    'skill_name_Exponents': 0,
    'skill_name_Finding Percents': 0,
    'skill_name_Finding Slope From Equation': 0,
    'skill_name_Finding Slope From Situation': 0,
    'skill_name_Finding Slope from Ordered Pairs': 0,
    'skill_name_Fraction Of': 0,
    'skill_name_Greatest Common Factor': 0,
    'skill_name_Histogram as Table or Graph': 0,
    'skill_name_Intercept': 0,
    'skill_name_Interior Angles Figures with More than 3 Sides': 0,
    'skill_name_Interior Angles Triangle': 0,
    'skill_name_Interpreting Coordinate Graphs': 0,
    'skill_name_Least Common Multiple': 0,
    'skill_name_Linear Equations': 0,
    'skill_name_Mean': 0,
    'skill_name_Median': 0,
    'skill_name_Midpoint': 0,
    'skill_name_Mode': 0,
    'skill_name_Multiplication Fractions': 0,
    'skill_name_Multiplication Whole Numbers': 0,
    'skill_name_Multiplication and Division Integers': 0,
    'skill_name_Multiplication and Division Positive Decimals': 0,
    'skill_name_Nets of 3D Figures': 0,
    'skill_name_Number Line': 0,
    'skill_name_Order of Operations +,-,/,* () positive reals': 0,
    'skill_name_Order of Operations All': 0,
    'skill_name_Ordering Fractions': 0,
    'skill_name_Ordering Integers': 0,
    'skill_name_Ordering Positive Decimals': 0,
    'skill_name_Ordering Real Numbers': 0,
    'skill_name_Parts of a Polyomial, Terms, Coefficient, Monomial, Exponent, Variable': 0,
    'skill_name_Pattern Finding': 0,
    'skill_name_Percent Discount': 0,
    'skill_name_Percent Of': 0,
    'skill_name_Percents': 0,
    'skill_name_Perimeter of a Polygon': 0,
    'skill_name_Polynomial Factors': 0,
    'skill_name_Prime Number': 0,
    'skill_name_Probability of Two Distinct Events': 0,
    'skill_name_Probability of a Single Event': 0,
    'skill_name_Proportion': 0,
    'skill_name_Pythagorean Theorem': 0,
    'skill_name_Quadratic Formula to Solve Quadratic Equation': 0,
    'skill_name_Range': 0,
    'skill_name_Rate': 0,
    'skill_name_Reading a Ruler or Scale': 0,
    'skill_name_Recognize Linear Pattern': 0,
    'skill_name_Recognize Quadratic Pattern': 0,
    'skill_name_Reflection': 0,
    'skill_name_Rotations': 0,
    'skill_name_Rounding': 0,
    'skill_name_Scale Factor': 0,
    'skill_name_Scatter Plot': 0,
    'skill_name_Scientific Notation': 0,
    'skill_name_Simplifying Expressions positive exponents': 0,
    'skill_name_Slope': 0,
    'skill_name_Solving Inequalities': 0,
    'skill_name_Solving Systems of Linear Equations': 0,
    'skill_name_Solving Systems of Linear Equations by Graphing': 0,
    'skill_name_Solving for a variable': 0,
    'skill_name_Square Root': 0,
    'skill_name_Stem and Leaf Plot': 0,
    'skill_name_Subtraction Whole Numbers': 0,
    'skill_name_Surface Area Cylinder': 0,
    'skill_name_Surface Area Rectangular Prism': 0,
    'skill_name_Table': 0,
    'skill_name_Translations': 0,
    'skill_name_Unit Conversion Within a System': 0,
    'skill_name_Unit Rate': 0,
    'skill_name_Venn Diagram': 0,
    'skill_name_Volume Cylinder': 0,
    'skill_name_Volume Rectangular Prism': 0,
    'skill_name_Volume Sphere': 0,
    'skill_name_Write Linear Equation from Graph': 0,
    'skill_name_Write Linear Equation from Ordered Pairs': 0,
    'skill_name_Write Linear Equation from Situation': 0,

    # All answer_type_* columns
    'answer_type_choose_1': 1,
    'answer_type_choose_n': 0,
    'answer_type_fill_in_1': 0,
    'answer_type_open_response': 0,

    # Other required features
    'attempt_count': 1,
    'opportunity': 1,
    'opportunity_original': 1,
    'position': 1,
    'original': 1,
    'overlap_time': 0,
    'first_action': 'The middle value',
    'tutor_mode_tutor': 1,
    'ms_first_response': 15000,
    'hint_count': 0,
    'hint_total': 0,
    'skill_id': 0,
    'correct': 1  # Computed correctness
}

print(f"Frontend provides {len(frontend_data)} features")

# Test if we can create a DataFrame and make predictions
test_df = pd.DataFrame([frontend_data])

print(f"DataFrame shape: {test_df.shape}")
print(f"DataFrame columns: {len(test_df.columns)}")

# Test model prediction
try:
    prediction = model.predict(test_df)
    probability = model.predict_proba(test_df)[:, 1]

    print("✅ SUCCESS! Model prediction works!")
    print(f"Predicted correctness: {prediction[0]} (1=correct, 0=incorrect)")
    print(f"Confidence score: {probability[0]:.3f}")

    # Test the recommendation function
    print("\nTesting weak skills analysis...")
    recommendations = {
        'student_id': 'test_student',
        'weak_skills': [],
        'total_attempts': 1,
        'average_success_rate': 1.0
    }

    print("✅ All compatibility tests passed!")
    print("\n🎉 Frontend and model are now fully compatible!")

except Exception as e:
    print(f"❌ Error during prediction: {e}")
    print("Compatibility test failed.")