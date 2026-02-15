export type RiskLevel = 'Low' | 'Medium' | 'High';

export type Department = 
  | 'General Medicine'
  | 'Cardiology'
  | 'Neurology'
  | 'Pulmonology'
  | 'Emergency'
  | 'Orthopedics'
  | 'Gastroenterology'
  | 'Endocrinology'
  | 'Psychiatry'
  | 'Dermatology';

export interface PatientData {
  patientId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  symptoms: string[];
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  temperature: number;
  oxygenSaturation: number;
  preExistingConditions: string[];
  emergencyContacts: EmergencyContact[];
  uploadedReport?: File | null;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface TriageResult {
  riskLevel: RiskLevel;
  confidenceScore: number;
  department: Department;
  contributingFactors: ContributingFactor[];
  recommendations: string[];
  waitTimePriority: number; // 1 = most urgent
}

export interface ContributingFactor {
  factor: string;
  impact: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface Hospital {
  id: string;
  name: string;
  distance: string;
  specialties: string[];
  waitTime: string;
  rating: number;
  address: string;
  phone: string;
  lat: number;
  lng: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
