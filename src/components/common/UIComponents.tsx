import React, { useEffect, useState } from 'react';
import { ArrowUp, ShieldCheck, QrCode, Monitor, UserCheck, Check, AlertCircle } from 'lucide-react';
import { HellrixService } from '../../services/store';
import { User, UserRole } from '../../types';

// Scroll Progress Bar
export const ScrollProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] bg-transparent z-[100] pointer-events-none">
      <div
        className="h-full bg-[#C8102E] transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// Back to Top Button
export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', toggleVisible, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 p-3 bg-[#111111] hover:bg-[#C8102E] text-[#E5DED3] hover:text-white border border-[#35302F] hover:border-[#C8102E] transition-colors duration-200 group cursor-pointer"
    >
      <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
    </button>
  );
};

// Cookie Consent Banner
export const CookieBanner: React.FC = () => {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('hrx_cookie_consent');
    if (!consent) {
      setAccepted(false);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('hrx_cookie_consent', 'true');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-[#090909]/95 backdrop-blur-md border-t border-[#35302F] p-4 text-xs font-mono-editorial">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[#A59D95]">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 bg-[#C8102E] shrink-0" />
          <span>
            HELLRIX uses strictly essential session telemetry and cryptographic token storage for entry validation. No marketing tracking.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={accept}
            className="px-4 py-1.5 bg-[#C8102E] hover:bg-[#E31B36] text-white font-mono-editorial font-bold uppercase transition-colors"
          >
            ACKNOWLEDGE
          </button>
        </div>
      </div>
    </div>
  );
};

// Marquee Text Strip
export const BrutalistMarquee: React.FC<{ text?: string }> = ({
  text = 'HELLRIX — NO ORDINARY NIGHT — THE UNDERGROUND AUDIOVISUAL EXPERIENCE — MUMBAI 2026 — SECURE YOUR PASS',
}) => {
  return (
    <div className="w-full overflow-hidden border-y border-[#35302F] bg-[#111111] py-3 select-none">
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="mx-4 text-sm font-display uppercase tracking-widest text-[#E5DED3]">
          {text} · {text}
        </span>
        <span className="mx-4 text-sm font-display uppercase tracking-widest text-[#C8102E]">
          {text} · {text}
        </span>
      </div>
    </div>
  );
};

// Skeleton Loader
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = 'h-64' }) => {
  return (
    <div className={`bg-[#181818] border border-[#35302F] skeleton-shimmer p-6 ${className}`}>
      <div className="h-4 bg-[#262626] w-1/3 mb-4" />
      <div className="h-8 bg-[#262626] w-2/3 mb-6" />
      <div className="space-y-2">
        <div className="h-3 bg-[#262626] w-full" />
        <div className="h-3 bg-[#262626] w-4/5" />
      </div>
    </div>
  );
};

// Scroll Reveal Component (Smooth Pop Up On Scroll)
interface ScrollRevealProps {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
  variant?: 'pop-up' | 'pop-scale';
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delayMs = 0,
  className = '',
  variant = 'pop-up',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const animClass = variant === 'pop-scale' ? 'animate-pop-scale' : 'animate-pop-up';

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delayMs}ms` }}
      className={`${className} ${
        isVisible ? animClass : 'opacity-0 translate-y-6 pointer-events-none'
      } transition-opacity duration-300`}
    >
      {children}
    </div>
  );
};

// Portal Environment & Role Switcher Bar (Top Utility Header)
interface PortalSwitchBarProps {
  currentWorld: 'public' | 'admin' | 'scanner';
  onWorldChange: (world: 'public' | 'admin' | 'scanner') => void;
  currentUser: User | null;
  onUserChange: (user: User) => void;
}

export const PortalSwitchBar: React.FC<PortalSwitchBarProps> = ({
  currentWorld,
  onWorldChange,
  currentUser,
  onUserChange,
}) => {
  const users = HellrixService.getUsers();
  const activeUser = currentUser || users[0];

  return (
    <header className="bg-[#0D0D0D] border-b border-[#35302F] text-xs font-mono-editorial py-1.5 px-4 z-[90]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* World Environments */}
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-[#77716D] hidden md:inline">ENVIRONMENT:</span>
          <button
            onClick={() => onWorldChange('public')}
            className={`px-2.5 py-1 flex items-center gap-1.5 transition-colors ${
              currentWorld === 'public'
                ? 'bg-[#181818] text-[#E5DED3] border border-[#C8102E]'
                : 'text-[#A59D95] hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-[#C8102E]" />
            <span>WORLD 1 (CLIENT)</span>
          </button>

          <button
            onClick={() => onWorldChange('admin')}
            className={`px-2.5 py-1 flex items-center gap-1.5 transition-colors ${
              currentWorld === 'admin'
                ? 'bg-[#181818] text-[#E5DED3] border border-[#C8102E]'
                : 'text-[#A59D95] hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#C8102E]" />
            <span>WORLD 2 (ADMIN / STAFF)</span>
          </button>

          <button
            onClick={() => onWorldChange('scanner')}
            className={`px-2.5 py-1 flex items-center gap-1.5 transition-colors ${
              currentWorld === 'scanner'
                ? 'bg-[#181818] text-[#E5DED3] border border-[#C8102E]'
                : 'text-[#A59D95] hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-[#C8102E]" />
            <span>WORLD 3 (SCANNER)</span>
          </button>
        </div>

        {/* Active Identity Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[#77716D] hidden sm:inline">ACTING AS:</span>
          <div className="flex items-center gap-1 bg-[#141414] border border-[#2E2928] p-0.5">
            {users.map((u) => {
              const isActive = u.id === activeUser.id;
              const roleColor =
                u.role === 'owner' ? 'text-[#C8102E]' : u.role !== 'customer' ? 'text-amber-400' : 'text-zinc-300';

              return (
                <button
                  key={u.id}
                  onClick={() => onUserChange(u)}
                  title={`Switch to ${u.name} (${u.role.toUpperCase()})`}
                  className={`px-2 py-0.5 transition-colors text-[11px] flex items-center gap-1 ${
                    isActive ? 'bg-[#222222] text-white font-bold' : 'text-[#77716D] hover:text-[#A59D95]'
                  }`}
                >
                  <span className={roleColor}>[{u.role.substring(0, 3).toUpperCase()}]</span>
                  <span>{u.name.split(' ')[0]}</span>
                  {isActive && <Check className="w-3 h-3 text-[#C8102E]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
