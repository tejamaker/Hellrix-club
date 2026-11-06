import React, { useEffect, useRef, useState } from 'react';

// =========================================================================
// 1. CUSTOM BRUTALIST INTERACTIVE CURSOR (MAGNETIC & REACTING FOLLOWER)
// =========================================================================
export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check for touch / mobile screen
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    let animationFrameId: number;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPos({ x: targetX, y: targetY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering over clickable elements
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('button') ||
        target?.closest('a') ||
        target?.closest('[data-cursor="pointer"]') ||
        target?.closest('input') ||
        target?.closest('select') ||
        target?.closest('.cursor-pointer')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);

    // Smooth lerp follower loop with buttery damping
    const followLoop = () => {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      setFollowerPos({ x: currentX, y: currentY });
      animationFrameId = requestAnimationFrame(followLoop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    animationFrameId = requestAnimationFrame(followLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* Center Precise Dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`,
          transition: 'transform 0.04s ease-out',
        }}
      >
        <div
          className={`w-2 h-2 rounded-full transition-all duration-200 ${
            isHovered ? 'bg-[#FFFFFF] scale-150 shadow-[0_0_12px_#FFFFFF]' : 'bg-[#C8102E] shadow-[0_0_8px_#C8102E]'
          }`}
        />
      </div>

      {/* Outer Lagging Brutalist Crosshair Ring with glow */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          transform: `translate3d(${followerPos.x}px, ${followerPos.y}px, 0) translate(-50%, -50%)`,
        }}
      >
        <div
          className={`rounded-full border transition-all duration-300 flex items-center justify-center ${
            isHovered
              ? 'w-14 h-14 border-[#C8102E] bg-[#C8102E]/15 scale-110 shadow-[0_0_20px_rgba(200,16,46,0.35)]'
              : isClicked
              ? 'w-6 h-6 border-[#FFFFFF] bg-white/30 scale-90'
              : 'w-8 h-8 border-[#C8102E]/50'
          }`}
        >
          {isHovered && (
            <div className="w-1.5 h-1.5 bg-[#C8102E] rounded-full animate-ping" />
          )}
        </div>
      </div>
    </>
  );
};

// =========================================================================
// 2. SMOOTH TEXT REVEAL (STAGGERED WORD-BY-WORD UPWARD SLIDE & FADE)
// =========================================================================
interface SmoothTextRevealProps {
  text: string;
  className?: string;
  delayMs?: number;
  revealed?: boolean;
}

export const SmoothTextReveal: React.FC<SmoothTextRevealProps> = ({
  text,
  className = '',
  delayMs = 0,
  revealed = true,
}) => {
  const words = text.split(' ');

  return (
    <span className={`inline-flex flex-wrap gap-x-2 gap-y-1 ${className}`}>
      {words.map((word, idx) => (
        <span key={idx} className="overflow-hidden inline-block leading-tight">
          <span
            className="inline-block transform transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
            style={{
              transitionDelay: `${delayMs + idx * 35}ms`,
              transform: revealed ? 'translateY(0%)' : 'translateY(115%)',
              opacity: revealed ? 1 : 0,
              filter: revealed ? 'blur(0px)' : 'blur(4px)',
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
};

// =========================================================================
// 3. SCROLL REVEAL WRAPPER (RANDOM/MULTI-SIDE FADE-SLIDE WITH SPRING & BLUR)
// =========================================================================
export type RevealDirection =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'scale'
  | 'fade'
  | 'random'
  | 'alternate';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: RevealDirection;
  index?: number;
  delayMs?: number;
  durationMs?: number;
  distancePx?: number;
  blur?: boolean;
  className?: string;
  threshold?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  index,
  delayMs = 0,
  durationMs = 850,
  distancePx = 36,
  blur = true,
  className = '',
  threshold = 0.08,
}) => {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Compute deterministic or random side for each element instance
  const [activeDirection] = useState<string>(() => {
    if (direction === 'random') {
      const sides = ['left', 'right', 'up', 'down'];
      return sides[Math.floor(Math.random() * sides.length)];
    }
    if (direction === 'alternate' && typeof index === 'number') {
      const sides = ['left', 'up', 'right', 'down'];
      return sides[index % sides.length];
    }
    return direction;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const getInitialTransform = () => {
    switch (activeDirection) {
      case 'left':
        return `translateX(-${distancePx}px) translateY(8px) scale(0.97)`;
      case 'right':
        return `translateX(${distancePx}px) translateY(8px) scale(0.97)`;
      case 'up':
        return `translateY(${distancePx}px) scale(0.97)`;
      case 'down':
        return `translateY(-${distancePx}px) scale(0.97)`;
      case 'scale':
        return 'scale(0.92)';
      case 'fade':
      default:
        return 'scale(0.98)';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transform: revealed ? 'translate(0, 0) scale(1)' : getInitialTransform(),
        opacity: revealed ? 1 : 0,
        filter: blur ? (revealed ? 'blur(0px)' : 'blur(5px)') : 'none',
        transition: `opacity ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1), filter ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delayMs}ms`,
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  );
};

// Convenient Multi-Directional Shorthand
export const DynamicSideReveal: React.FC<ScrollRevealProps> = (props) => {
  return <ScrollReveal direction="alternate" {...props} />;
};

// =========================================================================
// 4. ANIMATED SECTION HEADING (KINETIC TEXT REVEAL, GLOW LINE & ACCENT BADGE)
// =========================================================================
interface SectionHeadingProps {
  tag: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  tag,
  title,
  subtitle,
  align = 'left',
  className = '',
}) => {
  const [revealed, setRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const alignmentClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div
      ref={containerRef}
      className={`flex flex-col ${alignmentClass} space-y-3 mb-10 ${className}`}
    >
      {/* Pill Badge */}
      <div
        className={`inline-flex items-center gap-2 border border-[#35302F] bg-[#121212] px-3.5 py-1 text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          revealed ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95'
        }`}
      >
        <span className="w-1.5 h-1.5 bg-[#C8102E] rounded-full animate-ping" />
        <span>{tag}</span>
      </div>

      {/* Main Title with Buttery Word-by-Word Slide & Blur */}
      <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase text-white tracking-tight">
        <SmoothTextReveal text={title} revealed={revealed} delayMs={80} />
      </h2>

      {/* Growing Crimson Accent Line with Smooth Spring Expansion */}
      <div className="w-full max-w-xs h-[2px] bg-[#222222] overflow-hidden my-1 relative">
        <div
          className="h-full bg-gradient-to-r from-[#C8102E] via-[#E31B36] to-[#C8102E] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            width: revealed ? '100%' : '0%',
            transitionDelay: '150ms',
          }}
        />
      </div>

      {/* Subtitle with Smooth Fade and Offset */}
      {subtitle && (
        <p
          className={`text-xs sm:text-sm font-mono-editorial text-[#A59D95] max-w-2xl leading-relaxed transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            revealed ? 'opacity-100 translate-y-0 filter-none' : 'opacity-0 translate-y-4 blur-[2px]'
          }`}
          style={{ transitionDelay: '220ms' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

// =========================================================================
// 5. 3D INTERACTIVE MOUSE PARALLAX TILT CARD
// =========================================================================
interface ParallaxCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export const ParallaxCard: React.FC<ParallaxCardProps> = ({
  children,
  className = '',
  maxTilt = 7,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transform,
        transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  );
};

// =========================================================================
// 6. ANIMATED NUMBER TICKER (SMOOTH ROLLUP ON VIEWPORT ENTRY)
// =========================================================================
export const AnimatedTicker: React.FC<{
  end: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
}> = ({ end, prefix = '', suffix = '', durationMs = 1200 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          const startTime = performance.now();

          const update = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            // Ease-out cubic with spring finish
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));

            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(update);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, durationMs, hasStarted]);

  return (
    <span ref={ref} className="font-display font-black tracking-tight inline-block">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// =========================================================================
// 7. FLOATING BRUTALIST ORNAMENT GLYPH
// =========================================================================
export const FloatingGlyph: React.FC<{
  glyph: string;
  className?: string;
  delayMs?: number;
}> = ({ glyph, className = '', delayMs = 0 }) => {
  return (
    <div
      style={{ animationDelay: `${delayMs}ms` }}
      className={`absolute pointer-events-none select-none text-[#C8102E]/20 font-mono text-xs uppercase animate-float ${className}`}
    >
      {glyph}
    </div>
  );
};
