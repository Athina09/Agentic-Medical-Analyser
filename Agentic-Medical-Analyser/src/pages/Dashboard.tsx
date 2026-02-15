import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { 
  Activity, Users, Clock, TrendingUp, ArrowRight, 
  Heart, Brain, Stethoscope, Shield, Zap, BarChart3
} from 'lucide-react';
import { useTiltHover, useStaggerReveal, useHoverLift, useTextScramble, useRipple, useCountUp, useMagneticHover } from '@/hooks/useGsap';

const stats = [
  { label: 'Patients Triaged', value: 2847, display: '2,847', icon: Users, trend: '+12%' },
  { label: 'Avg. Response Time', value: 30, display: '< 30s', icon: Clock, trend: '-18%' },
  { label: 'Accuracy Rate', value: 94.2, display: '94.2%', icon: TrendingUp, trend: '+3%' },
  { label: 'High Risk Detected', value: 156, display: '156', icon: Activity, trend: '+8%' },
];

const departments = [
  { name: 'Emergency', count: 42, color: 'bg-risk-high/10 text-risk-high' },
  { name: 'Cardiology', count: 38, color: 'bg-medical-blue-light text-medical-blue' },
  { name: 'Neurology', count: 29, color: 'bg-medical-purple-light text-medical-purple' },
  { name: 'General Medicine', count: 67, color: 'bg-accent text-accent-foreground' },
  { name: 'Pulmonology', count: 23, color: 'bg-medical-teal-light text-medical-teal' },
  { name: 'Orthopedics', count: 18, color: 'bg-risk-medium-bg text-risk-medium' },
];

const features = [
  { icon: Brain, title: 'AI Classification', desc: 'ML-powered risk assessment with confidence scoring' },
  { icon: Stethoscope, title: 'Dept. Routing', desc: 'Automatic department recommendation engine' },
  { icon: Shield, title: 'Explainable AI', desc: 'Transparent insights behind every prediction' },
  { icon: Zap, title: 'Instant Results', desc: 'Real-time triage in under 30 seconds' },
];

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const tiltRef = useTiltHover<HTMLDivElement>(6);
  const Icon = stat.icon;

  return (
    <div ref={tiltRef} className="rounded-2xl border border-border bg-card p-5 shadow-card cursor-default">
      <div className="flex items-center justify-between mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
          <Icon className="h-4.5 w-4.5 text-primary" />
        </div>
        <span className="text-xs font-semibold text-risk-low">{stat.trend}</span>
      </div>
      <p className="font-display text-2xl font-bold text-foreground">{stat.display}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
    </div>
  );
}

function FeatureCard({ feat }: { feat: typeof features[0] }) {
  const hoverRef = useHoverLift<HTMLDivElement>();
  const Icon = feat.icon;

  return (
    <div ref={hoverRef} className="p-4 rounded-xl bg-muted/50 cursor-default">
      <Icon className="h-5 w-5 text-primary mb-2" />
      <p className="text-sm font-semibold text-foreground">{feat.title}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{feat.desc}</p>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useTextScramble<HTMLHeadingElement>('Smart Patient Triage System');
  const statsRef = useStaggerReveal<HTMLDivElement>(0.1, 0.3);
  const bottomRef = useStaggerReveal<HTMLDivElement>(0.15, 0.5);
  const ctaRef = useMagneticHover<HTMLButtonElement>(0.2);
  const barsRef = useRef<HTMLDivElement>(null);

  // Hero entrance animation
  useEffect(() => {
    if (!heroRef.current) return;
    gsap.fromTo(heroRef.current, 
      { opacity: 0, y: 40, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  // Animated bars
  useEffect(() => {
    if (!barsRef.current) return;
    const bars = barsRef.current.querySelectorAll('.dept-bar');
    gsap.fromTo(bars, 
      { width: '0%', opacity: 0 },
      { width: (i: number) => `${(departments[i].count / 70) * 100}%`, opacity: 1, stagger: 0.1, delay: 0.6, duration: 1, ease: 'power3.out' }
    );
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div
        ref={heroRef}
        className="rounded-2xl gradient-hero p-8 text-primary-foreground relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-5 w-5" />
            <span className="text-sm font-medium opacity-90">MedTriage AI</span>
          </div>
          <h1 ref={titleRef} className="font-display text-3xl font-bold mb-2">Smart Patient Triage System</h1>
          <p className="text-sm opacity-90 max-w-lg mb-6">
            AI-powered patient risk classification with explainable insights, 
            department routing, and real-time prioritization.
          </p>
          <Button
            ref={ctaRef}
            onClick={() => navigate('/intake')}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2"
          >
            Start New Triage <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div ref={statsRef} className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* Department distribution + Features */}
      <div ref={bottomRef} className="grid grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="font-display text-lg font-bold text-foreground">Department Distribution</h3>
          </div>
          <div ref={barsRef} className="space-y-3">
            {departments.map(dept => (
              <div key={dept.name} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-32 shrink-0">{dept.name}</span>
                <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                  <div
                    className={`dept-bar h-full rounded-full ${dept.color} flex items-center justify-end pr-2`}
                    style={{ width: '0%' }}
                  >
                    <span className="text-xs font-semibold">{dept.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h3 className="font-display text-lg font-bold text-foreground mb-5">System Capabilities</h3>
          <div className="grid grid-cols-2 gap-4">
            {features.map(feat => (
              <FeatureCard key={feat.title} feat={feat} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
