import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

// Magnetic hover effect - element follows cursor within bounds
export function useMagneticHover<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.3, ease: 'power2.out' });
    };

    const handleLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [strength]);

  return ref;
}

// Tilt 3D hover effect
export function useTiltHover<T extends HTMLElement>(maxTilt = 8) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.transformStyle = 'preserve-3d';
    el.style.willChange = 'transform';

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(el, {
        rotateY: x * maxTilt,
        rotateX: -y * maxTilt,
        scale: 1.02,
        boxShadow: `${x * 15}px ${y * 15}px 30px hsl(210 40% 11% / 0.12)`,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const handleLeave = () => {
      gsap.to(el, {
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        boxShadow: '0 2px 8px -2px hsl(210 40% 11% / 0.06)',
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      });
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [maxTilt]);

  return ref;
}

// Stagger children animation on mount
export function useStaggerReveal<T extends HTMLElement>(stagger = 0.08, delay = 0.1) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = el.children;
    gsap.fromTo(
      children,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, stagger, delay, duration: 0.6, ease: 'power3.out' }
    );
  }, [stagger, delay]);

  return ref;
}

// Hover glow + lift effect
export function useHoverLift<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleEnter = () => {
      gsap.to(el, {
        y: -6,
        scale: 1.02,
        boxShadow: '0 20px 40px -12px hsl(174 62% 38% / 0.2), 0 0 0 1px hsl(174 62% 38% / 0.1)',
        duration: 0.35,
        ease: 'power2.out',
      });
    };

    const handleLeave = () => {
      gsap.to(el, {
        y: 0,
        scale: 1,
        boxShadow: '0 2px 8px -2px hsl(210 40% 11% / 0.06), 0 0 0 1px hsl(200 18% 90% / 0.6)',
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return ref;
}

// Text scramble reveal effect
export function useTextScramble<T extends HTMLElement>(text: string, trigger = true) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !trigger) return;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let frame = 0;
    const totalFrames = 20;

    const interval = setInterval(() => {
      el.textContent = text
        .split('')
        .map((char, i) => {
          if (i < frame) return text[i];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      frame++;
      if (frame > text.length + 5) {
        el.textContent = text;
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text, trigger]);

  return ref;
}

// Ripple click effect
export function useRipple<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.overflow = 'hidden';
    el.style.position = 'relative';

    const handleClick = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: hsl(174 62% 38% / 0.15);
        left: ${e.clientX - rect.left - size / 2}px;
        top: ${e.clientY - rect.top - size / 2}px;
        pointer-events: none;
      `;
      el.appendChild(ripple);
      gsap.fromTo(ripple, { scale: 0, opacity: 1 }, {
        scale: 1, opacity: 0, duration: 0.6, ease: 'power2.out',
        onComplete: () => ripple.remove(),
      });
    };

    el.addEventListener('click', handleClick);
    return () => el.removeEventListener('click', handleClick);
  }, []);

  return ref;
}

// Parallax on scroll
export function useParallax<T extends HTMLElement>(speed = 0.3) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      gsap.to(el, { y: center * speed * -1, duration: 0.5, ease: 'none' });
    };

    const parent = el.closest('.flex-1.overflow-auto, main') || window;
    const target = parent === window ? window : parent;
    target.addEventListener('scroll', handleScroll, { passive: true });
    return () => target.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return ref;
}

// Counter animation 
export function useCountUp(end: number, duration = 1.5, trigger = true) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !trigger) return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: end,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = Math.round(obj.val).toLocaleString();
      },
    });
  }, [end, duration, trigger]);

  return ref;
}
