import React from 'react';
import { EventData, PassType } from '../../types';
import { HellrixLogo, HellrixStarSvg } from '../../components/brand/HellrixLogo';
import { BrutalistMarquee } from '../../components/common/UIComponents';
import {
  SectionHeading,
  ParallaxCard,
  AnimatedTicker,
  FloatingGlyph,
} from '../../components/common/AnimationSuite';
import { ScrollReveal } from '../../components/common/UIComponents';
import { ArrowRight, Calendar, MapPin, Clock, ShieldCheck, Sparkles, Ticket } from 'lucide-react';
import { HellrixService } from '../../services/store';

interface HomePageProps {
  event: EventData;
  passTypes: PassType[];
  onNavigate: (page: string, params?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ event, passTypes, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#090909] text-[#E5DED3] selection:bg-[#C8102E] selection:text-white relative overflow-hidden">
      {/* Ambient Floating Brutalist Glyphs */}
      <FloatingGlyph glyph="[1.0]" className="top-24 left-10 text-xs hidden lg:block" delayMs={0} />
      <FloatingGlyph glyph="18.9696° N ✙ 72.8428° E" className="top-40 right-16 text-xs hidden lg:block" delayMs={1200} />
      <FloatingGlyph glyph="STRICT_CAP_250" className="top-[45%] left-6 text-xs hidden lg:block" delayMs={600} />
      <FloatingGlyph glyph="HMAC_SHA256_ACTIVE" className="top-[70%] right-10 text-xs hidden lg:block" delayMs={1800} />

      {/* ========================================================================= */}
      {/* SECTION A: HERO WITH 3D INTERACTIVE TILT, ANIMATED REVEAL & VECTOR STAR   */}
      {/* ========================================================================= */}
      <section className="relative min-h-[94vh] flex flex-col justify-between border-b border-[#35302F] overflow-hidden">
        {/* Dark smoke & brutalist coordinate grid */}
        <div className="absolute inset-0 z-0 bg-grid-brutalist opacity-25 pointer-events-none" />

        {/* Top Meta Strip */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-wrap items-center justify-between text-xs font-mono-editorial text-[#A59D95] border-b border-[#242120] pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#C8102E] animate-ping" />
            <span className="tracking-widest">HELLRIX ✙ NO ORDINARY NIGHT ✙ EDITION 1.0</span>
          </div>
          <div className="flex items-center gap-4 text-[#77716D]">
            <span>18.9696° N, 72.8428° E · MUMBAI</span>
            <span className="text-[#C8102E] font-bold">250 CAP STRICT</span>
          </div>
        </div>

        {/* Hero Central Asymmetric Split */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Oversized Brutalist Editorial Typography with Animated Pop-Up */}
            <div className="lg:col-span-7 space-y-6">
              <div className="animate-pop-up inline-flex items-center gap-2 border border-[#35302F] bg-[#121212] px-3.5 py-1.5 text-xs font-mono-editorial text-[#E5DED3] tracking-widest uppercase shadow-[3px_3px_0px_#000000]">
                <HellrixStarSvg size={14} />
                <span>{event.date} · {event.time}</span>
              </div>

              <h1 className="animate-pop-up text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black tracking-tight leading-[0.88] uppercase text-white">
                ENTER THE <br />
                <span className="text-[#C8102E] tracking-tighter inline-block hover:scale-[1.02] transition-transform">
                  HELLRIX.
                </span>
              </h1>

              <p className="animate-pop-up text-base sm:text-xl font-mono-editorial text-[#A59D95] max-w-xl leading-relaxed">
                {event.tagline} AN INTIMATE GATHERING OF INDUSTRIAL SOUND, CONCRETE ARCHITECTURE & ZERO COMPROMISE.
              </p>

              {/* Brutalist Action Buttons with 3D Offset Shadows */}
              <div className="animate-pop-up pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('passes')}
                  className="px-8 py-4 bg-[#C8102E] hover:bg-[#E31B36] text-white text-xs font-mono-editorial font-bold uppercase tracking-widest transition-all duration-150 cursor-pointer flex items-center gap-3 border-2 border-black shadow-[5px_5px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] active:translate-x-1 active:translate-y-1"
                >
                  <span>GET YOUR PASS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('event')}
                  className="px-8 py-4 bg-[#141414] hover:bg-[#1E1E1E] text-[#E5DED3] border-2 border-[#35302F] hover:border-[#77716D] text-xs font-mono-editorial font-bold uppercase tracking-widest transition-all cursor-pointer shadow-[5px_5px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] active:translate-x-1 active:translate-y-1"
                >
                  EXPLORE DOSSIER
                </button>
              </div>

              {/* Barcode & Studio-style Micro Specs */}
              <div className="pt-4 flex items-center gap-6 text-[11px] font-mono-editorial text-[#77716D]">
                <div className="tracking-[0.25em] text-white font-mono font-bold select-none">
                  ||| | |||| ||| | |||||| ||||
                </div>
                <div>SECURE GATE TOKEN // 10-MIN HOLD</div>
              </div>
            </div>

            {/* Right: 3D Interactive Parallax Showcase Window */}
            <div className="lg:col-span-5 relative flex justify-center">
              <ParallaxCard maxTilt={8} className="w-full max-w-md">
                {/* Studio-style Red Angular Geometric Backing Block */}
                <div className="absolute -inset-2 bg-[#C8102E] -rotate-1 opacity-90 filter blur-xs hidden sm:block" />

                {/* Retro Brutalist Window Frame */}
                <div className="relative border-2 border-black bg-[#0C0C0C] shadow-[8px_8px_0px_#000000] w-full overflow-hidden">
                  {/* Window Header */}
                  <div className="bg-[#181818] border-b-2 border-black px-4 py-2 flex items-center justify-between text-[11px] font-mono-editorial text-white">
                    <span className="font-bold tracking-wider flex items-center gap-2">
                      <HellrixStarSvg size={12} />
                      <span>HELLRIX.SYS // 1.0_LIVE_FEED</span>
                    </span>
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className="w-3 h-3 border border-black bg-zinc-600 flex items-center justify-center text-[9px] leading-none">_</span>
                      <span className="w-3 h-3 border border-black bg-zinc-600 flex items-center justify-center text-[9px] leading-none">□</span>
                      <span className="w-3 h-3 border border-black bg-[#C8102E] flex items-center justify-center text-[9px] leading-none text-white">✕</span>
                    </div>
                  </div>

                  {/* High-Fidelity Event Atmosphere Image with Overlaid Vector Brand Badge */}
                  <div className="relative aspect-4/5 overflow-hidden bg-black group">
                    <img
                      src={event.poster_url}
                      alt="HELLRIX Underground Gathering"
                      className="w-full h-full object-cover contrast-125 filter group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                    {/* Pure Vector Brand Badge Overlay */}
                    <div className="absolute top-4 right-4 bg-[#111111]/90 backdrop-blur-sm border border-[#35302F] p-2 flex items-center gap-2 shadow-[3px_3px_0px_#000000]">
                      <HellrixStarSvg size={24} />
                      <div className="text-left font-mono-editorial leading-none">
                        <span className="text-[10px] text-white font-bold block uppercase">HELLRIX 1.0</span>
                        <span className="text-[8px] text-[#C8102E] font-bold uppercase">MUMBAI 2026</span>
                      </div>
                    </div>

                    {/* Live Ticket Counter Tag */}
                    <div className="absolute bottom-4 left-4 right-4 bg-black/90 border border-[#35302F] p-3 flex items-center justify-between text-xs font-mono-editorial text-white shadow-[3px_3px_0px_#000000]">
                      <div>
                        <span className="text-[10px] text-[#77716D] block uppercase">CAPPED ATTENDANCE</span>
                        <span className="font-bold text-[#E5DED3]">
                          <AnimatedTicker end={250} suffix=" ATTENDEES STRICT" />
                        </span>
                      </div>
                      <button
                        onClick={() => onNavigate('passes')}
                        className="px-3 py-1.5 bg-[#C8102E] hover:bg-[#E31B36] text-white font-bold uppercase text-[10px]"
                      >
                        BOOK
                      </button>
                    </div>
                  </div>
                </div>
              </ParallaxCard>
            </div>
          </div>
        </div>

        {/* Hero Bottom Metric Strip */}
        <div className="relative z-10 border-t border-[#35302F] bg-[#0C0C0C]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-mono-editorial">
            <div className="border-l-2 border-[#C8102E] pl-3">
              <span className="text-[#77716D] block">VENUE</span>
              <span className="text-white font-bold">{event.venue}</span>
            </div>
            <div className="border-l-2 border-[#35302F] pl-3">
              <span className="text-[#77716D] block">TIMELINE</span>
              <span className="text-white font-bold">{event.time}</span>
            </div>
            <div className="border-l-2 border-[#35302F] pl-3">
              <span className="text-[#77716D] block">ENTRY DISCIPLINE</span>
              <span className="text-white font-bold">21+ · NO FLASH · PHYSICAL ID</span>
            </div>
            <div className="border-l-2 border-[#C8102E] pl-3">
              <span className="text-[#77716D] block">SETTLEMENT GATE</span>
              <span className="text-[#C8102E] font-bold">DIRECT UPI + HMAC PASS</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B: MARQUEE */}
      <BrutalistMarquee text="THE HELLRIX 1.0 ✙ NO ORDINARY NIGHT ✙ MUMBAI 2026 ✙ UNDERGROUND AUDIOVISUAL ✙ SECURE YOUR PASS" />

      {/* ========================================================================= */}
      {/* SECTION C: EVENT INTRODUCTION WITH ANIMATED SECTION HEADING              */}
      {/* ========================================================================= */}
      <section className="py-24 border-b border-[#35302F] relative bg-[#090909]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="01. CURATED EXPERIENCE"
            title="RAW CONCRETE. PULSING FREQUENCIES."
            subtitle="HELLRIX is an intimate, brutalist audiovisual gathering built for 250 verified attendees. Designed as an underground temple of industrial acoustics, low-frequency pressure, and crimson illumination."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Column with Parallax Card */}
            <div className="lg:col-span-6 relative">
              <ParallaxCard maxTilt={6}>
                <div className="relative border-2 border-black p-2 bg-[#111111] shadow-[8px_8px_0px_#000000]">
                  <img
                    src={event.gallery_urls[1] || event.poster_url}
                    alt="Industrial Stage Atmosphere"
                    className="w-full h-[450px] object-cover grayscale contrast-125"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-black border border-[#35302F] px-3 py-1 text-[11px] font-mono-editorial text-[#C8102E] font-bold">
                    STAGE SPEC // RAW MONOLITH
                  </div>
                </div>
              </ParallaxCard>
            </div>

            {/* Editorial Content */}
            <div className="lg:col-span-6 space-y-6">
              <p className="text-sm font-mono-editorial text-[#A59D95] leading-relaxed">
                {event.description}
              </p>
              <div className="pt-4 border-t border-[#262322] grid grid-cols-2 gap-4 text-xs font-mono-editorial">
                <div>
                  <span className="text-[#77716D] block">CURATOR</span>
                  <span className="text-white font-bold">{event.curator}</span>
                </div>
                <div>
                  <span className="text-[#77716D] block">DOORS LOCK</span>
                  <span className="text-white font-bold">01:00 IST SHARP</span>
                </div>
              </div>
              <div className="pt-4">
                <button
                  onClick={() => onNavigate('event')}
                  className="inline-flex items-center gap-2 text-xs font-mono-editorial font-bold text-[#E5DED3] hover:text-[#C8102E] uppercase transition-colors cursor-pointer group"
                >
                  <span>READ FULL EVENT DOSSIER</span>
                  <ArrowRight className="w-4 h-4 text-[#C8102E] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION D: FOUR HIGHLIGHT PILLARS WITH POP-UP CARDS                      */}
      {/* ========================================================================= */}
      <section className="py-24 border-b border-[#35302F] bg-[#0C0C0C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="02. PILLARS"
            title="THE ARCHITECTURAL FOUNDATION"
            subtitle="Engineered for attendees who demand an immersive night without commercial clutter."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                title: 'THE SOUND SYSTEM',
                desc: 'Tuned point-source acoustics designed specifically to fill raw warehouse concrete with physical low-end weight.',
              },
              {
                num: '02',
                title: 'CRIMSON LIGHTING',
                desc: 'Minimalist volumetric red lasers and slow-moving architectural beams. No distracting LED sponsor screens.',
              },
              {
                num: '03',
                title: 'LIMITED CAPACITY',
                desc: 'Capped at 250 attendees strictly to ensure personal room, rapid bar access, and an unhurried atmosphere.',
              },
              {
                num: '04',
                title: 'GATE INTEGRITY',
                desc: 'Every pass features a cryptographic token scanned live at the gate terminal. Zero duplicate admissions.',
              },
            ].map((pillar, idx) => (
              <ScrollReveal key={pillar.num} delayMs={idx * 100}>
                <ParallaxCard maxTilt={5}>
                  <div className="bg-[#111111] border-2 border-black p-8 flex flex-col justify-between hover:border-[#C8102E] transition-all shadow-[6px_6px_0px_#000000] hover:shadow-[6px_6px_0px_#C8102E] h-full">
                    <div>
                      <div className="text-xs font-mono-editorial text-[#C8102E] font-bold mb-6 flex items-center justify-between">
                        <span>// {pillar.num}</span>
                        <HellrixStarSvg size={14} />
                      </div>
                      <h3 className="text-xl font-display font-black uppercase text-[#E5DED3] mb-3">
                        {pillar.title}
                      </h3>
                      <p className="text-xs font-mono-editorial text-[#A59D95] leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                </ParallaxCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION E: PASS SELECTION WITH POP-UP CARDS & 3D TILT                    */}
      {/* ========================================================================= */}
      <section className="py-24 border-b border-[#35302F] bg-[#090909]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="03. TICKETING"
            title="SELECT ADMISSION TIER"
            subtitle="Strictly 250 admissions across all tiers. Includes temporary 10-minute authoritative reservation window."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {passTypes.map((pass, idx) => {
              const inv = HellrixService.getPassInventory(pass.id);
              const isVip = pass.id === 'pass_vip';

              return (
                <ScrollReveal key={pass.id} delayMs={idx * 120}>
                  <ParallaxCard maxTilt={6}>
                    <div
                      className={`bg-[#111111] border-2 flex flex-col justify-between p-8 transition-all h-full ${
                        isVip
                          ? 'border-[#C8102E] shadow-[8px_8px_0px_#000000] relative bg-[#141414]'
                          : 'border-black shadow-[6px_6px_0px_#000000] hover:border-[#77716D]'
                      }`}
                    >
                      {isVip && (
                        <div className="absolute -top-3.5 right-6 bg-[#C8102E] text-white px-3 py-0.5 text-[10px] font-mono-editorial font-bold uppercase tracking-widest border border-black shadow-[2px_2px_0px_#000000]">
                          RECOMMENDED TIER
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className="text-xs font-mono-editorial text-[#C8102E] font-bold">
                            {pass.tag}
                          </span>
                          <span className="text-[11px] font-mono-editorial text-[#A59D95]">
                            {inv.availableCount} LEFT
                          </span>
                        </div>

                        <h3 className="text-2xl font-display font-black uppercase text-[#E5DED3] mb-4">
                          {pass.name}
                        </h3>

                        <div className="mb-6 pb-6 border-b border-[#242120]">
                          <span className="text-4xl font-display font-bold text-white">
                            ₹<AnimatedTicker end={pass.price} />
                          </span>
                          {pass.group_size > 1 && (
                            <span className="text-xs font-mono-editorial text-[#77716D] block mt-1">
                              FOR {pass.group_size} PERSONS (₹{Math.round(pass.price / pass.group_size)} / PERSON)
                            </span>
                          )}
                        </div>

                        <ul className="space-y-3 mb-8 text-xs font-mono-editorial text-[#A59D95]">
                          {pass.perks.slice(0, 4).map((perk, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-[#C8102E] font-bold">―</span>
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => onNavigate('passes')}
                        className={`w-full py-3.5 text-center text-xs font-mono-editorial font-bold uppercase tracking-wider transition-all cursor-pointer border border-black shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 ${
                          isVip
                            ? 'bg-[#C8102E] hover:bg-[#E31B36] text-white'
                            : 'bg-[#181818] hover:bg-[#252525] text-white'
                        }`}
                      >
                        SELECT PASS
                      </button>
                    </div>
                  </ParallaxCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION F: MANIFESTO & ATMOSPHERE                                         */}
      {/* ========================================================================= */}
      <section className="py-24 border-b border-[#35302F] bg-[#0C0C0C] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <SectionHeading
                tag="04. MANIFESTO"
                title="NOT JUST AN EVENT. AN IDENTITY."
                subtitle="HELLRIX is an event ecosystem built around bringing people together through thoughtfully curated sound, distinctive visual design, and unforgettable collective energy."
              />
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('about')}
                  className="px-6 py-3.5 bg-[#161616] hover:bg-[#222222] border-2 border-black text-xs font-mono-editorial font-bold uppercase tracking-wider text-white shadow-[4px_4px_0px_#000000] cursor-pointer"
                >
                  DISCOVER ABOUT HELLRIX
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <ParallaxCard maxTilt={5}>
                <div className="border-2 border-black p-2 bg-[#121212] shadow-[8px_8px_0px_#C8102E]">
                  <img
                    src={event.gallery_urls[2] || event.poster_url}
                    alt="HELLRIX Community"
                    className="w-full h-80 object-cover grayscale contrast-125"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </ParallaxCard>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION G: FINAL CALL TO ACTION                                          */}
      {/* ========================================================================= */}
      <section className="py-28 bg-[#090909] text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
          <SectionHeading
            align="center"
            tag="RESERVATION SYSTEM ACTIVE // 250 CAPACITY"
            title="YOUR NIGHT. YOUR ENTRY. YOUR HELLRIX."
            subtitle="10-minute pass reservation windows apply. Verified via direct UPI transaction reference."
          />

          <div>
            <button
              onClick={() => onNavigate('passes')}
              className="px-10 py-5 bg-[#C8102E] hover:bg-[#E31B36] text-white font-mono-editorial font-bold uppercase text-sm tracking-widest transition-all duration-150 cursor-pointer border-2 border-black shadow-[6px_6px_0px_#000000] hover:shadow-[3px_3px_0px_#000000] active:translate-x-1 active:translate-y-1"
            >
              GET YOUR PASS NOW
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
