import { cn } from '@/lib/utils';
import { RiskLevel } from '@/lib/types';
import { Shield, AlertTriangle, AlertCircle } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function RiskBadge({ level, size = 'md', showIcon = true }: RiskBadgeProps) {
  const config = {
    Low: {
      icon: Shield,
      bg: 'bg-risk-low-bg',
      text: 'text-risk-low',
      border: 'border-risk-low/20',
    },
    Medium: {
      icon: AlertTriangle,
      bg: 'bg-risk-medium-bg',
      text: 'text-risk-medium',
      border: 'border-risk-medium/20',
    },
    High: {
      icon: AlertCircle,
      bg: 'bg-risk-high-bg',
      text: 'text-risk-high',
      border: 'border-risk-high/20',
    },
  };

  const { icon: Icon, bg, text, border } = config[level];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  };

  const iconSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <span className={cn(
      'inline-flex items-center font-semibold rounded-full border',
      bg, text, border,
      sizeClasses[size]
    )}>
      {showIcon && <Icon className={iconSize[size]} />}
      {level} Risk
    </span>
  );
}
