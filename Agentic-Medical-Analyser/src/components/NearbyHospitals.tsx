import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { NEARBY_HOSPITALS } from '@/lib/hospitals-data';
import { Department } from '@/lib/types';
import { MapPin, Clock, Star, Phone, Stethoscope } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useStaggerReveal } from '@/hooks/useGsap';

interface NearbyHospitalsProps {
  recommendedDepartment?: Department;
}

function HospitalCard({ hospital, recommendedDepartment, index }: { hospital: typeof NEARBY_HOSPITALS[0]; recommendedDepartment?: Department; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const hasRecommended = recommendedDepartment && hospital.specialties.includes(recommendedDepartment);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleEnter = () => {
      gsap.to(el, { y: -4, scale: 1.01, boxShadow: '0 16px 40px -12px hsl(174 62% 38% / 0.15)', duration: 0.3, ease: 'power2.out' });
      gsap.to(el.querySelector('.hospital-name'), { x: 4, color: 'hsl(174 62% 38%)', duration: 0.3, ease: 'power2.out' });
    };

    const handleLeave = () => {
      gsap.to(el, { y: 0, scale: 1, boxShadow: '0 2px 8px -2px hsl(210 40% 11% / 0.06)', duration: 0.35, ease: 'power2.out' });
      gsap.to(el.querySelector('.hospital-name'), { x: 0, clearProps: 'color', duration: 0.3, ease: 'power2.out' });
    };

    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mouseleave', handleLeave);
    return () => { el.removeEventListener('mouseenter', handleEnter); el.removeEventListener('mouseleave', handleLeave); };
  }, []);

  return (
    <div
      ref={ref}
      className={`rounded-2xl border bg-card p-5 shadow-card cursor-default ${
        hasRecommended ? 'border-primary/30 ring-1 ring-primary/10' : 'border-border'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="hospital-name font-display font-bold text-foreground">{hospital.name}</h3>
            {hasRecommended && (
              <Badge className="bg-primary text-primary-foreground text-xs">Recommended</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{hospital.address}</p>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 text-risk-medium fill-current" />
          <span className="font-semibold text-foreground">{hospital.rating}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm mb-3">
        <div className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{hospital.distance}</div>
        <div className="flex items-center gap-1.5 text-muted-foreground"><Clock className="h-3.5 w-3.5" />{hospital.waitTime}</div>
        <div className="flex items-center gap-1.5 text-muted-foreground"><Phone className="h-3.5 w-3.5" />{hospital.phone}</div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <Stethoscope className="h-3.5 w-3.5 text-muted-foreground" />
        {hospital.specialties.map(s => (
          <Badge key={s} variant="outline" className={`text-xs ${s === recommendedDepartment ? 'border-primary/40 bg-accent text-accent-foreground' : ''}`}>
            {s}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function NearbyHospitals({ recommendedDepartment }: NearbyHospitalsProps) {
  const listRef = useStaggerReveal<HTMLDivElement>(0.1, 0.15);

  const sorted = recommendedDepartment
    ? [...NEARBY_HOSPITALS].sort((a, b) => {
        const aHas = a.specialties.includes(recommendedDepartment) ? 0 : 1;
        const bHas = b.specialties.includes(recommendedDepartment) ? 0 : 1;
        return aHas - bHas;
      })
    : NEARBY_HOSPITALS;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Nearby Hospitals</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {recommendedDepartment ? `Sorted by ${recommendedDepartment} availability` : 'Hospitals near your location'}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
      </div>

      <div ref={listRef} className="space-y-4">
        {sorted.map((hospital, i) => (
          <HospitalCard key={hospital.id} hospital={hospital} recommendedDepartment={recommendedDepartment} index={i} />
        ))}
      </div>
    </div>
  );
}
