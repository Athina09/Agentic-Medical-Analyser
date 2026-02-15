import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientForm } from '@/components/PatientForm';
import { PatientData, TriageResult, Department } from '@/lib/types';
import { classifyPatient } from '@/lib/triage-engine';
import { triage as apiTriage, predict as apiPredict } from '@/lib/api';

// Map backend department names to frontend Department type
function mapDepartment(backendDept: string): Department {
  const map: Record<string, Department> = {
    "Emergency Medicine": "Emergency",
    "General Medicine": "General Medicine",
    "Cardiology": "Cardiology",
    "Neurology": "Neurology",
    "Pulmonology": "Pulmonology",
    "Orthopedics": "Orthopedics",
    "Gastroenterology": "Gastroenterology",
    "Endocrinology": "Endocrinology",
    "Psychiatry": "Psychiatry",
    "Dermatology": "Dermatology",
  };
  return (map[backendDept] || "General Medicine") as Department;
}

export default function IntakePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: PatientData) => {
    setLoading(true);
    setError(null);
    const symptomsStr = data.symptoms.join(", ");

    try {
      // Call backend for risk level and department prediction
      const [triageRes, predictRes] = await Promise.all([
        apiTriage({
          Name: data.name,
          Age: data.age,
          Gender: data.gender,
          Systolic_BP: data.bloodPressureSystolic,
          Diastolic_BP: data.bloodPressureDiastolic,
          Heart_Rate: data.heartRate,
          Temperature: data.temperature,
          Symptoms: symptomsStr,
        }),
        apiPredict(symptomsStr),
      ]);

      // Use backend risk; fallback to local classifyPatient for full structure
      const localResult = classifyPatient(data);
      const backendRisk = triageRes.risk_level;
      const riskLevel = (["Low", "Medium", "High"].includes(backendRisk)
        ? backendRisk
        : localResult.riskLevel) as TriageResult["riskLevel"];

      const topDept = predictRes["Top 3 Recommendations"]?.[0]?.Department;
      const department = topDept ? mapDepartment(topDept) : localResult.department;
      const confidenceScore = topDept
        ? predictRes["Top 3 Recommendations"][0]["Final Confidence (%)"] ?? localResult.confidenceScore
        : localResult.confidenceScore;

      const result: TriageResult = {
        ...localResult,
        riskLevel,
        department,
        confidenceScore,
        recommendations: predictRes.Emergency
          ? [predictRes.Message || "Seek immediate care", ...localResult.recommendations]
          : localResult.recommendations,
      };

      sessionStorage.setItem("triageResult", JSON.stringify(result));
      sessionStorage.setItem(
        "patientData",
        JSON.stringify({
          ...data,
          uploadedReport: data.uploadedReport ? data.uploadedReport.name : null,
        })
      );
      navigate("/results");
    } catch (err) {
      console.error("Backend unavailable, using local triage:", err);
      setError("Backend unreachable. Using local AI assessment.");
      const result = classifyPatient(data);
      sessionStorage.setItem("triageResult", JSON.stringify(result));
      sessionStorage.setItem(
        "patientData",
        JSON.stringify({
          ...data,
          uploadedReport: data.uploadedReport ? data.uploadedReport.name : null,
        })
      );
      navigate("/results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Patient Intake</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter patient details for AI-powered triage assessment
        </p>
        {error && (
          <p className="mt-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}
      </div>
      <PatientForm onSubmit={handleSubmit} isSubmitting={loading} />
    </div>
  );
}
