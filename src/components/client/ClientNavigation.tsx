import React, { useState } from 'react';
import { HellrixLogo } from '../brand/HellrixLogo';
import { User } from '../../types';
import { Menu, X, Ticket, User as UserIcon, LogOut } from 'lucide-react';

interface ClientHeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'event', label: 'EVENT' },
    { id: 'passes', label: 'PASSES' },
    { id: 'about', label: 'ABOUT' },
    { id: 'support', label: 'SUPPORT' },
  ];

  const handleLinkClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#090909]/95 backdrop-blur-md border-b border-[#35302F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
            aria-label="HELLRIX Home"
          >
            <HellrixLogo variant="full" size="md" />
          </button>

          {/* Zone 2: Navigation Links (Single-Line, No Pills) */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative text-xs font-mono-editorial font-bold uppercase tracking-widest transition-colors py-1 cursor-pointer ${
                    isActive ? 'text-[#E5DED3]' : 'text-[#A59D95] hover:text-[#E5DED3]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C8102E]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Customer Auth (Strictly Zero Admin/Staff links) */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => handleLinkClick('my-tickets')}
                  className={`flex items-center gap-1.5 text-xs font-mono-editorial px-3 py-1.5 border transition-colors cursor-pointer ${
                    currentPage === 'my-tickets'
                      ? 'border-[#C8102E] text-white bg-[#181818]'
                      : 'border-[#35302F] text-[#A59D95] hover:text-white hover:border-[#77716D]'
                  }`}
                >
                  <Ticket className="w-3.5 h-3.5 text-[#C8102E]" />
                  <span>MY TICKETS</span>
                </button>

                <button
                  onClick={() => handleLinkClick('profile')}
                  className={`flex items-center gap-1.5 text-xs font-mono-editorial px-3 py-1.5 border transition-colors cursor-pointer relative ${
                    currentPage === 'profile'
                      ? 'border-[#C8102E] text-white bg-[#181818]'
                      : 'border-[#35302F] text-[#A59D95] hover:text-white hover:border-[#77716D]'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#C8102E]" />
                  <span>MY ACCOUNT</span>
                </button>

                <button
                  onClick={onLogout}
                  title="Sign out"
                  className="p-1.5 text-[#77716D] hover:text-[#C8102E] transition-colors cursor-pointer ml-1"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleLinkClick('login')}
                className="hidden sm:inline-flex text-xs font-mono-editorial font-bold text-[#A59D95] hover:text-white uppercase transition-colors cursor-pointer"
              >
                LOGIN
              </button>
            )}

            <button
              onClick={() => handleLinkClick('passes')}
              className="px-5 py-2 bg-[#C8102E] hover:bg-[#E31B36] text-white text-xs font-mono-editorial font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer border border-black shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
            >
              BOOK NOW
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#E5DED3] hover:text-[#C8102E] focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[100px] z-50 bg-[#090909]/98 backdrop-blur-xl border-t border-[#35302F] p-6 flex flex-col justify-between">
          <div className="flex flex-col gap-6">
            <span className="text-[10px] font-mono-editorial text-[#77716D] tracking-widest">
              NAVIGATION
            </span>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-2xl font-display uppercase text-left tracking-wide flex items-center justify-between py-2 border-b border-[#1F1D1C] ${
                  currentPage === link.id ? 'text-[#C8102E]' : 'text-[#E5DED3]'
                }`}
              >
                <span>{link.label}</span>
                <span className="text-sm font-mono-editorial text-[#77716D]">0{navLinks.indexOf(link) + 1}</span>
              </button>
            ))}

            <button
              onClick={() => handleLinkClick('my-tickets')}
              className="text-2xl font-display uppercase text-left tracking-wide flex items-center justify-between py-2 border-b border-[#1F1D1C] text-[#E5DED3]"
            >
              <span>MY TICKETS</span>
              <Ticket className="w-5 h-5 text-[#C8102E]" />
            </button>
          </div>

          <div className="pt-6 border-t border-[#35302F] flex flex-col gap-3">
            {currentUser ? (
              <div className="flex items-center justify-between text-xs font-mono-editorial text-[#A59D95]">
                <span>Signed in as {currentUser.name}</span>
                <button onClick={onLogout} className="text-[#C8102E] underline">
                  LOGOUT
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => handleLinkClick('login')}
                  className="flex-1 py-3 bg-[#181818] border border-[#35302F] text-center text-xs font-mono-editorial font-bold uppercase text-white"
                >
                  LOGIN
                </button>
                <button
                  onClick={() => handleLinkClick('register')}
                  className="flex-1 py-3 bg-[#C8102E] text-center text-xs font-mono-editorial font-bold uppercase text-white"
                >
                  REGISTER
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export const ClientFooter: React.FC<{
  onNavigate: (page: string) => void;
  onNavigateWorld?: (world: 'public' | 'admin' | 'scanner') => void;
}> = ({ onNavigate, onNavigateWorld }) => {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#35302F] pt-16 pb-12 text-[#A59D95]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#242120]">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <HellrixLogo variant="full" size="lg" />
            <p className="text-xs font-mono-editorial text-[#77716D] max-w-sm leading-relaxed">
              HELLRIX IS AN INDEPENDENT BRUTALIST AUDIOVISUAL GATHERING. LIMITED CAPACITY · VERIFIED ACCESS · ZERO COMMERCIAL FILLER.
            </p>
            <div className="pt-2 text-[11px] font-mono-editorial text-[#A59D95] space-y-1">
              <div>COORDINATES: 18.9696° N, 72.8428° E</div>
              <div>VENUE: THE CONCRETE SILO · WAREHOUSE 07</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-xs font-mono-editorial font-bold text-[#E5DED3] tracking-widest uppercase">
              EXPERIENCE
            </span>
            <ul className="space-y-2 text-xs font-mono-editorial">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  HOME
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('event')} className="hover:text-white transition-colors">
                  EVENT SPECIFICATIONS
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('passes')} className="hover:text-white transition-colors">
                  SECURE PASSES
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  ABOUT HELLRIX
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('my-tickets')} className="hover:text-white transition-colors">
                  MY TICKETS
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs font-mono-editorial font-bold text-[#E5DED3] tracking-widest uppercase">
              POLICIES & AUDIT
            </span>
            <ul className="space-y-2 text-xs font-mono-editorial">
              <li>
                <button onClick={() => onNavigate('policies')} className="hover:text-white transition-colors">
                  EVENT ENTRY & AGE POLICIES (21+)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policies')} className="hover:text-white transition-colors">
                  TERMS OF ATTENDANCE & CONDUCT
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policies')} className="hover:text-white transition-colors">
                  REFUND & UTR VERIFICATION POLICY
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('support')} className="hover:text-white transition-colors">
                  VERIFICATION & SUPPORT DESK
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-editorial text-[#77716D]">
          <div>© 2026 HELLRIX COLLECTIVE. ALL RIGHTS RESERVED.</div>
          <div className="flex items-center gap-4">
            <span className="text-[#C8102E]">SECURE UPI / TOKEN DISCIPLINE</span>
            <span>·</span>
            {onNavigateWorld && (
              <button
                onClick={() => onNavigateWorld('admin')}
                className="text-[#555] hover:text-[#C8102E] transition-colors uppercase text-[10px] cursor-pointer"
                title="Restricted Staff & Admin Gateway"
              >
                [STAFF & OPS GATEWAY]
              </button>
            )}
            <span>·</span>
            <span>EDITION 001</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
