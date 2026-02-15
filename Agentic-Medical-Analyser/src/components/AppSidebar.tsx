import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { 
  Activity, ClipboardList, LayoutDashboard, MapPin, MessageCircle, Heart, FileText
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/intake', label: 'Patient Intake', icon: ClipboardList },
  { path: '/results', label: 'Triage Results', icon: Activity },
  { path: '/hospitals', label: 'Nearby Hospitals', icon: MapPin },
  { path: '/chat', label: 'AI Assistant', icon: MessageCircle },
];

function NavItem({ item, isActive }: { item: typeof navItems[0]; isActive: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const Icon = item.icon;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleEnter = () => {
      if (isActive) return;
      gsap.to(el, { x: 6, duration: 0.3, ease: 'power2.out' });
      gsap.to(el.querySelector('.nav-icon'), { scale: 1.2, rotate: 5, duration: 0.3, ease: 'back.out(2)' });
    };

    const handleLeave = () => {
      gsap.to(el, { x: 0, duration: 0.3, ease: 'power2.out' });
      gsap.to(el.querySelector('.nav-icon'), { scale: 1, rotate: 0, duration: 0.3, ease: 'power2.out' });
    };

    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [isActive]);

  return (
    <Link
      ref={ref}
      to={item.path}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200',
        isActive
          ? 'bg-accent text-accent-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      <Icon className="nav-icon h-4.5 w-4.5" />
      {item.label}
    </Link>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const sidebarRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // Sidebar slide-in + logo pulse
  useEffect(() => {
    if (sidebarRef.current) {
      gsap.fromTo(sidebarRef.current, 
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
      );
    }
    if (logoRef.current) {
      gsap.fromTo(logoRef.current,
        { scale: 0.5, rotate: -180 },
        { scale: 1, rotate: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)', delay: 0.3 }
      );
    }
  }, []);

  // Logo hover
  useEffect(() => {
    const el = logoRef.current;
    if (!el) return;
    const handleEnter = () => gsap.to(el, { rotate: 360, scale: 1.1, duration: 0.6, ease: 'power2.out' });
    const handleLeave = () => gsap.to(el, { rotate: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mouseleave', handleLeave);
    return () => { el.removeEventListener('mouseenter', handleEnter); el.removeEventListener('mouseleave', handleLeave); };
  }, []);

  return (
    <aside ref={sidebarRef} className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card flex flex-col">
      <div className="flex items-center gap-3 p-6 border-b border-border">
        <div ref={logoRef} className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary cursor-pointer">
          <Heart className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold text-foreground">MedTriage</h1>
          <p className="text-xs text-muted-foreground">AI-Powered Triage</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => (
          <NavItem key={item.path} item={item} isActive={location.pathname === item.path} />
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="rounded-xl bg-accent/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">Quick Help</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Upload patient data or use the AI assistant for instant triage guidance.
          </p>
        </div>
      </div>
    </aside>
  );
}
