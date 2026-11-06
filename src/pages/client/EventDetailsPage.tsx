import React from 'react';
import { EventData } from '../../types';
import { ArrowRight, MapPin, Calendar, Clock, AlertTriangle, ShieldCheck, CameraOff, UserCheck } from 'lucide-react';

interface EventDetailsPageProps {
  event: EventData;
  onNavigate: (page: string) => void;
}

export const EventDetailsPage: React.FC<EventDetailsPageProps> = ({ event, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#090909] text-[#E5DED3]">
      {/* Poster Style Hero Header with Official Artwork Showcase */}
      <section className="border-b border-[#35302F] pt-16 pb-20 relative bg-[#090909]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-3 text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase">
                <span className="w-2 h-2 bg-[#C8102E]" />
                <span>OFFICIAL EVENT DOSSIER ✙ {event.edition} ✙ MUMBAI</span>
              </div>

              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-black uppercase tracking-tight text-white leading-[0.9]">
                {event.title}
              </h1>

              <p className="text-base sm:text-lg font-mono-editorial text-[#A59D95] leading-relaxed max-w-2xl">
                {event.description}
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('passes')}
                  className="px-8 py-4 bg-[#C8102E] hover:bg-[#E31B36] text-white text-xs font-mono-editorial font-bold uppercase tracking-widest transition-all cursor-pointer border-2 border-black shadow-[5px_5px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
                >
                  ACQUIRE ENTRY PASS
                </button>
              </div>
            </div>

            {/* Official Poster Graphic Showcase */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="border-2 border-black bg-black p-2 shadow-[8px_8px_0px_#C8102E] w-full max-w-xs">
                <img
                  src={event.poster_url}
                  alt="Official HELLRIX 1.0 Poster"
                  className="w-full h-auto object-cover contrast-110"
                  referrerPolicy="no-referrer"
                />
                <div className="p-3 bg-[#111111] border-t border-black text-[10px] font-mono-editorial text-[#A59D95] flex items-center justify-between">
                  <span>OFFICIAL EVENT ARTWORK</span>
                  <span className="text-[#C8102E] font-bold">EDITION 1.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Numbered Information Blocks */}
      <section className="border-b border-[#35302F] bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="border border-[#35302F] p-6 bg-[#141414]">
              <div className="text-[11px] font-mono-editorial text-[#C8102E] font-bold mb-3">01 // DATE</div>
              <div className="text-lg font-display uppercase text-white mb-1">SATURDAY</div>
              <div className="text-xs font-mono-editorial text-[#A59D95]">{event.date}</div>
            </div>

            <div className="border border-[#35302F] p-6 bg-[#141414]">
              <div className="text-[11px] font-mono-editorial text-[#C8102E] font-bold mb-3">02 // TIMELINE</div>
              <div className="text-lg font-display uppercase text-white mb-1">21:00 — 05:00</div>
              <div className="text-xs font-mono-editorial text-[#A59D95]">DOORS LOCK AT 01:00</div>
            </div>

            <div className="border border-[#35302F] p-6 bg-[#141414]">
              <div className="text-[11px] font-mono-editorial text-[#C8102E] font-bold mb-3">03 // VENUE</div>
              <div className="text-lg font-display uppercase text-white mb-1 truncate">{event.venue}</div>
              <div className="text-xs font-mono-editorial text-[#A59D95]">{event.address}</div>
            </div>

            <div className="border border-[#35302F] p-6 bg-[#141414]">
              <div className="text-[11px] font-mono-editorial text-[#C8102E] font-bold mb-3">04 // EXPERIENCE</div>
              <div className="text-lg font-display uppercase text-white mb-1">ANALOG & BASS</div>
              <div className="text-xs font-mono-editorial text-[#A59D95]">CUSTOM POINT-SOURCE</div>
            </div>

            <div className="border border-[#35302F] p-6 bg-[#141414]">
              <div className="text-[11px] font-mono-editorial text-[#C8102E] font-bold mb-3">05 // ENTRY POLICY</div>
              <div className="text-lg font-display uppercase text-white mb-1">21+ STRICT</div>
              <div className="text-xs font-mono-editorial text-[#A59D95]">GOVT PHOTO ID REQUIRED</div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Gallery Grid */}
      <section className="py-20 border-b border-[#35302F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase">
                ATMOSPHERE ARCHIVE
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-black uppercase text-white">
                THE INDUSTRIAL TEMPLE
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {event.gallery_urls.map((url, idx) => (
              <div
                key={idx}
                className="group relative border border-[#35302F] overflow-hidden bg-[#141414] aspect-4/3"
              >
                <img
                  src={url}
                  alt={`HELLRIX Atmosphere ${idx + 1}`}
                  className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-500 group-hover:scale-105 group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-3 left-3 text-[10px] font-mono-editorial text-[#E5DED3] bg-[#090909]/80 px-2 py-0.5">
                  ZONE 0{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Rules & Code of Conduct */}
      <section className="py-20 border-b border-[#35302F] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase">
                GOVERNANCE & ENTRY
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-black uppercase text-white">
                HOUSE RULES & VERIFICATION
              </h2>
              <p className="text-xs font-mono-editorial text-[#A59D95] leading-relaxed">
                HELLRIX operates with high gate security and verified admission. All attendees must adhere to the community standards.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {event.rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="border border-[#292524] bg-[#121212] p-5 flex items-start gap-4"
                >
                  <span className="text-xs font-mono-editorial font-bold text-[#C8102E] shrink-0 mt-0.5">
                    // 0{idx + 1}
                  </span>
                  <p className="text-xs font-mono-editorial text-[#E5DED3] leading-relaxed">
                    {rule}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-[#090909] text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="text-4xl sm:text-5xl font-display font-black uppercase text-white">
            SECURE YOUR ENTRY.
          </h2>
          <p className="text-xs font-mono-editorial text-[#A59D95]">
            Strict 250 cap. 10-minute checkout hold system prevents overbooking.
          </p>
          <div>
            <button
              onClick={() => onNavigate('passes')}
              className="px-8 py-4 bg-[#C8102E] hover:bg-[#E31B36] text-white text-xs font-mono-editorial font-bold uppercase tracking-widest transition-all cursor-pointer"
            >
              EXPLORE PASSES
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
