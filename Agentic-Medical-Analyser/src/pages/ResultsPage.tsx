import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TriageResult, PatientData } from '@/lib/types';
import { TriageResults } from '@/components/TriageResults';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ClipboardList } from 'lucide-react';

export default function ResultsPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<TriageResult | null>(null);
  const [patient, setPatient] = useState<PatientData | null>(null);

  useEffect(() => {
    const r = sessionStorage.getItem('triageResult');
    const p = sessionStorage.getItem('patientData');
    if (r && p) {
      setResult(JSON.parse(r));
      setPatient(JSON.parse(p));
    }
  }, []);

  if (!result || !patient) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="font-display text-xl font-bold text-foreground mb-2">No Triage Results</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Complete the patient intake form first to see triage results.
        </p>
        <Button onClick={() => navigate('/intake')} className="gradient-primary text-primary-foreground border-0 gap-2">
          <ArrowLeft className="h-4 w-4" /> Go to Patient Intake
        </Button>
      </div>
    );
  }

  return (
    <div className="py-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Triage Results</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-powered assessment complete</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/hospitals')} className="gap-2">
            View Hospitals
          </Button>
          <Button onClick={() => navigate('/intake')} className="gradient-primary text-primary-foreground border-0 gap-2">
            New Assessment
          </Button>
        </div>
      </div>
      <TriageResults result={result} patient={patient} />
    </div>
  );
}
