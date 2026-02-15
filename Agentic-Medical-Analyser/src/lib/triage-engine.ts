import { PatientData, TriageResult, RiskLevel, Department, ContributingFactor } from './types';

const SYMPTOM_SEVERITY: Record<string, { severity: number; departments: Department[] }> = {
  'Chest Pain': { severity: 9, departments: ['Cardiology', 'Emergency'] },
  'Shortness of Breath': { severity: 8, departments: ['Pulmonology', 'Emergency', 'Cardiology'] },
  'Severe Headache': { severity: 7, departments: ['Neurology', 'Emergency'] },
  'Dizziness': { severity: 5, departments: ['Neurology', 'General Medicine'] },
  'Nausea': { severity: 3, departments: ['Gastroenterology', 'General Medicine'] },
  'Fever': { severity: 4, departments: ['General Medicine'] },
  'Cough': { severity: 3, departments: ['Pulmonology', 'General Medicine'] },
  'Fatigue': { severity: 2, departments: ['General Medicine', 'Endocrinology'] },
  'Joint Pain': { severity: 4, departments: ['Orthopedics', 'General Medicine'] },
  'Abdominal Pain': { severity: 6, departments: ['Gastroenterology', 'Emergency'] },
  'Back Pain': { severity: 4, departments: ['Orthopedics', 'General Medicine'] },
  'Skin Rash': { severity: 2, departments: ['Dermatology'] },
  'Anxiety': { severity: 3, departments: ['Psychiatry', 'General Medicine'] },
  'Palpitations': { severity: 6, departments: ['Cardiology'] },
  'Vision Problems': { severity: 5, departments: ['Neurology'] },
  'Numbness': { severity: 6, departments: ['Neurology'] },
  'Swelling': { severity: 4, departments: ['General Medicine', 'Cardiology'] },
  'Weight Loss': { severity: 3, departments: ['Endocrinology', 'General Medicine'] },
  'Confusion': { severity: 8, departments: ['Neurology', 'Emergency'] },
  'Bleeding': { severity: 8, departments: ['Emergency'] },
};

const CONDITION_RISK: Record<string, number> = {
  'Diabetes': 3,
  'Hypertension': 4,
  'Heart Disease': 5,
  'Asthma': 3,
  'COPD': 4,
  'Cancer': 5,
  'Stroke History': 5,
  'Kidney Disease': 4,
  'Liver Disease': 4,
  'Obesity': 2,
  'Depression': 2,
  'Epilepsy': 3,
  'None': 0,
};

export function classifyPatient(patient: PatientData): TriageResult {
  const factors: ContributingFactor[] = [];
  let totalScore = 0;

  // Age risk
  if (patient.age > 65) {
    totalScore += 3;
    factors.push({ factor: 'Age > 65', impact: 'Medium', description: 'Elderly patients are at higher risk for complications' });
  } else if (patient.age > 50) {
    totalScore += 1.5;
    factors.push({ factor: 'Age 50-65', impact: 'Low', description: 'Middle-aged patients have moderate risk factors' });
  }
  if (patient.age < 5) {
    totalScore += 2;
    factors.push({ factor: 'Age < 5', impact: 'Medium', description: 'Very young patients require careful monitoring' });
  }

  // Symptom severity
  const departmentVotes: Record<string, number> = {};
  patient.symptoms.forEach(symptom => {
    const info = SYMPTOM_SEVERITY[symptom];
    if (info) {
      totalScore += info.severity;
      info.departments.forEach(dept => {
        departmentVotes[dept] = (departmentVotes[dept] || 0) + info.severity;
      });
      if (info.severity >= 7) {
        factors.push({ factor: symptom, impact: 'High', description: `${symptom} is a high-severity symptom requiring immediate attention` });
      } else if (info.severity >= 4) {
        factors.push({ factor: symptom, impact: 'Medium', description: `${symptom} contributes to moderate risk assessment` });
      } else {
        factors.push({ factor: symptom, impact: 'Low', description: `${symptom} is a low-severity symptom` });
      }
    }
  });

  // Vitals analysis
  if (patient.bloodPressureSystolic > 180 || patient.bloodPressureDiastolic > 120) {
    totalScore += 5;
    factors.push({ factor: 'Critical Blood Pressure', impact: 'High', description: `BP ${patient.bloodPressureSystolic}/${patient.bloodPressureDiastolic} is dangerously high` });
    departmentVotes['Cardiology'] = (departmentVotes['Cardiology'] || 0) + 5;
    departmentVotes['Emergency'] = (departmentVotes['Emergency'] || 0) + 5;
  } else if (patient.bloodPressureSystolic > 140 || patient.bloodPressureDiastolic > 90) {
    totalScore += 2.5;
    factors.push({ factor: 'Elevated Blood Pressure', impact: 'Medium', description: `BP ${patient.bloodPressureSystolic}/${patient.bloodPressureDiastolic} is above normal` });
    departmentVotes['Cardiology'] = (departmentVotes['Cardiology'] || 0) + 2;
  }

  if (patient.heartRate > 120 || patient.heartRate < 50) {
    totalScore += 4;
    factors.push({ factor: 'Abnormal Heart Rate', impact: 'High', description: `Heart rate of ${patient.heartRate} bpm is outside normal range` });
    departmentVotes['Cardiology'] = (departmentVotes['Cardiology'] || 0) + 4;
  } else if (patient.heartRate > 100) {
    totalScore += 2;
    factors.push({ factor: 'Elevated Heart Rate', impact: 'Medium', description: `Heart rate of ${patient.heartRate} bpm is mildly elevated` });
  }

  if (patient.temperature > 39.5) {
    totalScore += 4;
    factors.push({ factor: 'High Fever', impact: 'High', description: `Temperature of ${patient.temperature}°C indicates significant infection` });
  } else if (patient.temperature > 38) {
    totalScore += 2;
    factors.push({ factor: 'Mild Fever', impact: 'Medium', description: `Temperature of ${patient.temperature}°C indicates mild fever` });
  }

  if (patient.oxygenSaturation < 90) {
    totalScore += 6;
    factors.push({ factor: 'Critical Oxygen Saturation', impact: 'High', description: `SpO2 of ${patient.oxygenSaturation}% requires immediate oxygen support` });
    departmentVotes['Emergency'] = (departmentVotes['Emergency'] || 0) + 6;
    departmentVotes['Pulmonology'] = (departmentVotes['Pulmonology'] || 0) + 4;
  } else if (patient.oxygenSaturation < 95) {
    totalScore += 3;
    factors.push({ factor: 'Low Oxygen Saturation', impact: 'Medium', description: `SpO2 of ${patient.oxygenSaturation}% is below normal` });
  }

  // Pre-existing conditions
  patient.preExistingConditions.forEach(condition => {
    const risk = CONDITION_RISK[condition] || 0;
    if (risk > 0) {
      totalScore += risk;
      factors.push({
        factor: condition,
        impact: risk >= 4 ? 'High' : risk >= 3 ? 'Medium' : 'Low',
        description: `Pre-existing ${condition} increases complexity of care`
      });
    }
  });

  // Determine risk level
  let riskLevel: RiskLevel;
  let waitTimePriority: number;
  if (totalScore >= 20) {
    riskLevel = 'High';
    waitTimePriority = 1;
  } else if (totalScore >= 10) {
    riskLevel = 'Medium';
    waitTimePriority = 2;
  } else {
    riskLevel = 'Low';
    waitTimePriority = 3;
  }

  // Determine department
  const sortedDepts = Object.entries(departmentVotes).sort(([, a], [, b]) => b - a);
  const department: Department = (sortedDepts[0]?.[0] as Department) || 'General Medicine';

  // Confidence score (0-100)
  const maxPossibleScore = 50;
  const confidenceScore = Math.min(95, Math.round(60 + (totalScore / maxPossibleScore) * 35));

  // Recommendations
  const recommendations: string[] = [];
  if (riskLevel === 'High') {
    recommendations.push('Immediate medical attention required');
    recommendations.push('Prepare emergency response team');
    recommendations.push('Continuous vital sign monitoring');
  } else if (riskLevel === 'Medium') {
    recommendations.push('Schedule priority consultation');
    recommendations.push('Monitor vitals every 30 minutes');
    recommendations.push('Review medication history');
  } else {
    recommendations.push('Standard consultation recommended');
    recommendations.push('Routine vital checks');
    recommendations.push('Follow-up appointment in 1-2 weeks');
  }

  return {
    riskLevel,
    confidenceScore,
    department,
    contributingFactors: factors.sort((a, b) => {
      const order = { High: 0, Medium: 1, Low: 2 };
      return order[a.impact] - order[b.impact];
    }),
    recommendations,
    waitTimePriority,
  };
}

export const ALL_SYMPTOMS = Object.keys(SYMPTOM_SEVERITY);
export const ALL_CONDITIONS = Object.keys(CONDITION_RISK);
