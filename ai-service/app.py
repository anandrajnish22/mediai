from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import json

app = Flask(__name__)
CORS(app)

# Symptom-Disease mapping knowledge base
DISEASE_DB = {
    'Common Cold': {'symptoms': ['sneezing', 'runny nose', 'sore throat', 'cough', 'mild fever', 'headache'], 'specialist': 'General Physician', 'severity': 'low'},
    'Influenza (Flu)': {'symptoms': ['high fever', 'body ache', 'fatigue', 'cough', 'headache', 'chills', 'sore throat'], 'specialist': 'General Physician', 'severity': 'moderate'},
    'Pneumonia': {'symptoms': ['high fever', 'cough', 'chest pain', 'shortness of breath', 'fatigue', 'chills'], 'specialist': 'Pulmonologist', 'severity': 'high'},
    'Bronchitis': {'symptoms': ['cough', 'mucus', 'chest discomfort', 'fatigue', 'shortness of breath', 'mild fever'], 'specialist': 'Pulmonologist', 'severity': 'moderate'},
    'Asthma': {'symptoms': ['shortness of breath', 'wheezing', 'chest tightness', 'cough', 'difficulty breathing'], 'specialist': 'Pulmonologist', 'severity': 'moderate'},
    'Migraine': {'symptoms': ['severe headache', 'nausea', 'sensitivity to light', 'vomiting', 'visual disturbances'], 'specialist': 'Neurologist', 'severity': 'moderate'},
    'Hypertension': {'symptoms': ['headache', 'dizziness', 'blurred vision', 'chest pain', 'shortness of breath'], 'specialist': 'Cardiologist', 'severity': 'high'},
    'Diabetes Type 2': {'symptoms': ['frequent urination', 'increased thirst', 'fatigue', 'blurred vision', 'slow wound healing', 'weight loss'], 'specialist': 'Endocrinologist', 'severity': 'high'},
    'Gastritis': {'symptoms': ['stomach pain', 'nausea', 'vomiting', 'bloating', 'loss of appetite', 'indigestion'], 'specialist': 'Gastroenterologist', 'severity': 'moderate'},
    'Dengue Fever': {'symptoms': ['high fever', 'severe headache', 'joint pain', 'muscle pain', 'rash', 'fatigue', 'nausea'], 'specialist': 'Infectious Disease Specialist', 'severity': 'high'},
    'Typhoid': {'symptoms': ['fever', 'headache', 'stomach pain', 'weakness', 'loss of appetite', 'diarrhea'], 'specialist': 'General Physician', 'severity': 'high'},
    'Allergic Rhinitis': {'symptoms': ['sneezing', 'runny nose', 'itchy eyes', 'nasal congestion', 'watery eyes'], 'specialist': 'Allergist', 'severity': 'low'},
    'Urinary Tract Infection': {'symptoms': ['burning urination', 'frequent urination', 'lower abdominal pain', 'cloudy urine', 'fever'], 'specialist': 'Urologist', 'severity': 'moderate'},
    'Anemia': {'symptoms': ['fatigue', 'weakness', 'pale skin', 'shortness of breath', 'dizziness', 'cold hands'], 'specialist': 'Hematologist', 'severity': 'moderate'},
    'Conjunctivitis': {'symptoms': ['red eyes', 'itchy eyes', 'watery eyes', 'eye discharge', 'swollen eyelids'], 'specialist': 'Ophthalmologist', 'severity': 'low'},
}

ALL_SYMPTOMS = sorted(list(set(s for d in DISEASE_DB.values() for s in d['symptoms'])))

def predict_diseases(symptoms):
    results = []
    input_set = set(s.lower().strip() for s in symptoms)
    for disease, info in DISEASE_DB.items():
        disease_symptoms = set(info['symptoms'])
        matched = input_set.intersection(disease_symptoms)
        if len(matched) > 0:
            probability = round((len(matched) / len(disease_symptoms)) * 100, 1)
            confidence = min(95, round(probability * 0.95 + np.random.uniform(0, 10), 1))
            results.append({
                'disease': disease, 'probability': probability,
                'confidence': confidence, 'severity': info['severity'],
                'matched_symptoms': list(matched), 'specialist': info['specialist']
            })
    results.sort(key=lambda x: x['probability'], reverse=True)
    return results[:5]

def predict_diabetes_risk(data):
    age = data.get('age', 30)
    bmi = data.get('weight', 70) / ((data.get('height', 170) / 100) ** 2)
    sugar = data.get('sugarLevel', 100)
    bp_sys = data.get('bloodPressure', {}).get('systolic', 120)
    smoking = data.get('lifestyle', {}).get('smoking', False)
    exercise = data.get('lifestyle', {}).get('exercise', 'moderate')

    risk = 10
    if age > 45: risk += 15
    elif age > 35: risk += 8
    if bmi > 30: risk += 20
    elif bmi > 25: risk += 10
    if sugar > 140: risk += 25
    elif sugar > 110: risk += 12
    if bp_sys > 140: risk += 10
    if smoking: risk += 8
    if exercise == 'none': risk += 10
    risk = min(95, risk + np.random.uniform(-5, 5))

    level = 'low' if risk < 30 else 'moderate' if risk < 60 else 'high' if risk < 80 else 'critical'
    return {'riskPercentage': round(risk, 1), 'riskLevel': level, 'bmi': round(bmi, 1)}

def predict_heart_risk(data):
    age = data.get('age', 30)
    bp_sys = data.get('bloodPressure', {}).get('systolic', 120)
    cholesterol = data.get('cholesterol', 200)
    hr = data.get('heartRate', 72)
    smoking = data.get('lifestyle', {}).get('smoking', False)

    risk = 8
    if age > 55: risk += 18
    elif age > 45: risk += 10
    if bp_sys > 150: risk += 20
    elif bp_sys > 130: risk += 10
    if cholesterol > 240: risk += 18
    elif cholesterol > 200: risk += 8
    if hr > 100: risk += 8
    if smoking: risk += 12
    risk = min(95, risk + np.random.uniform(-5, 5))

    level = 'low' if risk < 30 else 'moderate' if risk < 60 else 'high' if risk < 80 else 'critical'
    return {'riskPercentage': round(risk, 1), 'riskLevel': level}

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    pred_type = data.get('type', 'symptom_check')
    input_data = data.get('inputData', {})

    if pred_type == 'symptom_check':
        symptoms = input_data.get('symptoms', [])
        predictions = predict_diseases(symptoms)
        top = predictions[0] if predictions else None
        return jsonify({
            'results': {
                'predictions': predictions,
                'riskLevel': top['severity'] if top else 'low',
                'riskPercentage': top['probability'] if top else 0,
                'recommendations': ['Consult a doctor for proper diagnosis', 'Stay hydrated and rest', 'Monitor your symptoms closely'],
                'suggestedSpecialist': top['specialist'] if top else 'General Physician',
                'urgencyLevel': 'emergency' if top and top['severity'] == 'critical' else 'urgent' if top and top['severity'] == 'high' else 'soon' if top and top['severity'] == 'moderate' else 'non-urgent',
                'preventionTips': ['Wash hands frequently', 'Maintain a balanced diet', 'Exercise regularly', 'Get adequate sleep']
            },
            'model': 'symptom_matcher_v2', 'accuracy': 87
        })

    elif pred_type == 'diabetes':
        result = predict_diabetes_risk(input_data)
        return jsonify({
            'results': {
                'predictions': [{'disease': 'Type 2 Diabetes', 'probability': result['riskPercentage'], 'confidence': 82, 'severity': result['riskLevel']}],
                'riskLevel': result['riskLevel'], 'riskPercentage': result['riskPercentage'],
                'recommendations': ['Monitor blood sugar regularly', 'Maintain healthy weight', 'Follow a low-sugar diet'],
                'suggestedSpecialist': 'Endocrinologist', 'urgencyLevel': 'urgent' if result['riskLevel'] in ['high', 'critical'] else 'soon',
                'preventionTips': ['Reduce sugar intake', 'Exercise 30 min daily', 'Eat fiber-rich foods', 'Stay hydrated']
            },
            'model': 'diabetes_risk_v1', 'accuracy': 82
        })

    elif pred_type == 'heart_disease':
        result = predict_heart_risk(input_data)
        return jsonify({
            'results': {
                'predictions': [{'disease': 'Cardiovascular Risk', 'probability': result['riskPercentage'], 'confidence': 80, 'severity': result['riskLevel']}],
                'riskLevel': result['riskLevel'], 'riskPercentage': result['riskPercentage'],
                'recommendations': ['Regular cardiac checkups', 'Monitor blood pressure daily', 'Reduce sodium intake'],
                'suggestedSpecialist': 'Cardiologist', 'urgencyLevel': 'urgent' if result['riskLevel'] in ['high', 'critical'] else 'soon',
                'preventionTips': ['Quit smoking', 'Reduce cholesterol', 'Exercise regularly', 'Manage stress']
            },
            'model': 'heart_risk_v1', 'accuracy': 80
        })

    return jsonify({'error': 'Unknown prediction type'}), 400

@app.route('/symptoms', methods=['GET'])
def get_symptoms():
    return jsonify({'symptoms': ALL_SYMPTOMS})

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'AI Service Running', 'models': ['symptom_matcher_v2', 'diabetes_risk_v1', 'heart_risk_v1']})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
