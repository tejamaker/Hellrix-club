import React from 'react';
import { HellrixLogo, HellrixStarSvg } from '../../components/brand/HellrixLogo';
import { ArrowRight, Eye, Shield, Compass, Sparkles } from 'lucide-react';
import { ParallaxCard, SectionHeading } from '../../components/common/AnimationSuite';

export const AboutPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#090909] text-[#E5DED3] animate-pop-up">
      {/* Azuki Reference Inspired Top Header Bar */}
      <div className="border-b border-[#35302F] bg-[#111111] py-2 px-4 text-xs font-mono-editorial text-[#A59D95] flex items-center justify-between">
        <span>02 // ABOUT DOSSIER</span>
        <span className="text-[#C8102E] font-bold">HELLRIX ✙ EXPERIENCES ✙ IDENTITY ✙ 1.0</span>
        <span className="hidden sm:inline">MUMBAI // 2026</span>
      </div>

      {/* Section A: About Hero with Azuki-Style Giant Vertical Rotated "ABOUT US" Typography */}
      <section className="relative py-20 border-b border-[#35302F] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Azuki Vertical Rotated Title Bar + Text */}
            <div className="lg:col-span-2 hidden lg:flex flex-col items-center justify-center">
              <div className="rotate-180 text-8xl font-display font-black uppercase text-[#C8102E] tracking-tighter opacity-80 select-none [writing-mode:vertical-rl]">
                ABOUT US
              </div>
            </div>

            {/* Central Manifesto Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase">
                <span className="w-2 h-2 bg-[#C8102E]" />
                <span>BRAND MANIFESTO & IDENTITY</span>
              </div>

              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-display font-black uppercase tracking-tight text-white leading-[0.88]">
                WE ARE <br />
                <span className="text-[#C8102E]">HELLRIX.</span>
              </h1>

              <p className="text-lg sm:text-2xl font-mono-editorial text-[#A59D95] max-w-xl leading-relaxed pt-2">
                MORE THAN AN EVENT. A CULTURE BUILT AROUND EXPERIENCES.
              </p>

              <div className="pt-4 border-t border-[#262322] space-y-3 text-xs font-mono-editorial text-[#A59D95] leading-relaxed">
                <p>
                  HELLRIX is an event platform built around bringing people together through thoughtfully curated experiences, distinctive visual identity and unforgettable moments.
                </p>
                <p>
                  We believe an event should be more than a date on a calendar. It should create an atmosphere, a connection and a memory.
                </p>
              </div>
            </div>

            {/* Right: Vector Brand Monolith Card */}
            <div className="lg:col-span-4 flex justify-center">
              <ParallaxCard maxTilt={8} className="w-full max-w-xs">
                <div className="relative border-2 border-black bg-[#121212] p-6 shadow-[8px_8px_0px_#C8102E] flex flex-col items-center text-center space-y-4">
                  <HellrixStarSvg size={100} className="my-4 animate-float" />
                  <div className="font-display font-black text-2xl uppercase tracking-wider text-white">
                    HELL<span className="text-[#C8102E]">RIX</span>
                  </div>
                  <div className="text-[11px] font-mono-editorial text-[#77716D] uppercase">
                    UNDERGROUND GATHERINGS · EDITION 1.0
                  </div>
                  <div className="w-full pt-3 border-t border-[#222] text-[10px] font-mono-editorial text-[#A59D95] flex items-center justify-between">
                    <span>PURE BRAND VECTOR</span>
                    <span className="text-[#C8102E] font-bold">AUTHENTIC</span>
                  </div>
                </div>
              </ParallaxCard>
            </div>
          </div>
        </div>
      </section>

      {/* Section B: Our Vision with Brutalist Quotation */}
      <section className="py-20 border-b border-[#35302F] bg-[#0E0E0E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl space-y-6">
            <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase">
              01 // THE NORTH STAR
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-black uppercase text-white">
              OUR VISION.
            </h2>
            <div className="border-l-4 border-[#C8102E] pl-6 py-3 bg-[#131313] p-6 shadow-[5px_5px_0px_#000000]">
              <p className="text-xl sm:text-2xl font-mono-editorial text-white leading-relaxed">
                "To build a recognizable event identity that connects people through creativity, culture and experiences worth remembering."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section C: Our Approach (4 Numbered Blocks) */}
      <section className="py-24 border-b border-[#35302F] bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase block mb-2">
              02 // METHODOLOGY
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-black uppercase text-white">
              OUR APPROACH
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                title: 'EXPERIENCE',
                desc: 'Every touchpoint—from digital ticket issuance to gate scanning and warehouse acoustics—is designed as one unified experience.',
              },
              {
                num: '02',
                title: 'IDENTITY',
                desc: 'A brutalist, underground aesthetic anchored in crimson, raw materials, typography and intentional lighting design.',
              },
              {
                num: '03',
                title: 'COMMUNITY',
                desc: 'Cultivating a respectful, forward-thinking circle of music enthusiasts who prioritize quality and underground culture.',
              },
              {
                num: '04',
                title: 'CREATIVITY',
                desc: 'Rejecting sterile commercial nightclub formulas in favor of bold spatial curation and uncompromised audio engineering.',
              },
            ].map((item) => (
              <div
                key={item.num}
                className="bg-[#141414] border-2 border-black p-8 flex flex-col justify-between hover:border-[#C8102E] transition-all shadow-[6px_6px_0px_#000000]"
              >
                <div>
                  <span className="text-xs font-mono-editorial text-[#C8102E] font-bold block mb-4">
                    // {item.num}
                  </span>
                  <h3 className="text-2xl font-display font-black uppercase text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs font-mono-editorial text-[#A59D95] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section D: The HELLRIX Difference */}
      <section className="py-24 border-b border-[#35302F] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase">
                03 // THE INFRASTRUCTURE
              </span>
              <h2 className="text-4xl sm:text-5xl font-display font-black uppercase text-white leading-tight">
                HOW WE APPROACH <br />
                THE NIGHT.
              </h2>
              <div className="space-y-4 text-xs font-mono-editorial text-[#A59D95] leading-relaxed">
                <p>
                  Most events treat ticketing as an afterthought—clunky third-party forms, generic barcodes, and chaotic door lines.
                </p>
                <p>
                  At HELLRIX, the entry token is an encrypted digital artifact. The reservation window guarantees capacity fairness. The door scanner is an authoritative gate terminal. And the space itself is designed with raw architectural intent.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="border-2 border-black p-8 bg-[#111111] space-y-4 shadow-[8px_8px_0px_#000000]">
                <div className="text-xs font-mono-editorial text-[#C8102E] font-bold uppercase">
                  CORE SPECIFICATIONS
                </div>
                <div className="text-sm font-mono-editorial text-white flex items-center justify-between border-b border-[#242120] py-3">
                  <span>AUDIENCE LIMIT</span>
                  <span className="font-bold">250 ATTENDEES STRICT</span>
                </div>
                <div className="text-sm font-mono-editorial text-white flex items-center justify-between border-b border-[#242120] py-3">
                  <span>TICKET DISCIPLINE</span>
                  <span className="font-bold text-[#C8102E]">CRYPTOGRAPHIC QR</span>
                </div>
                <div className="text-sm font-mono-editorial text-white flex items-center justify-between border-b border-[#242120] py-3">
                  <span>PAYMENT PATH</span>
                  <span className="font-bold">VERIFIED UPI / UTR</span>
                </div>
                <div className="text-sm font-mono-editorial text-white flex items-center justify-between py-3">
                  <span>CURATION</span>
                  <span className="font-bold">UNDERGROUND AUDIOVISUAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section E: Closing CTA */}
      <section className="py-24 bg-[#090909] text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase">
            COMMUNITY ACCESS
          </span>
          <h2 className="text-4xl sm:text-6xl font-display font-black uppercase text-white">
            THE NEXT CHAPTER STARTS HERE.
          </h2>
          <p className="text-xs font-mono-editorial text-[#A59D95]">
            Experience HELLRIX Edition 1.0 at The Concrete Silo Warehouse.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('event')}
              className="px-8 py-4 bg-[#C8102E] hover:bg-[#E31B36] text-white text-xs font-mono-editorial font-bold uppercase tracking-widest transition-all cursor-pointer border-2 border-black shadow-[5px_5px_0px_#000000]"
            >
              EXPLORE OUR EVENT
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
