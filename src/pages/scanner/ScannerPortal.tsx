import React, { useState, useRef, useEffect } from 'react';
import { HellrixService } from '../../services/store';
import { ScannerScanResult, Ticket, User } from '../../types';
import { HellrixLogo } from '../../components/brand/HellrixLogo';
import {
  QrCode,
  Camera,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  RefreshCw,
  LogOut,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface ScannerPortalProps {
  currentUser: User | null;
  onNavigateWorld: (world: 'public' | 'admin' | 'scanner') => void;
  onLogout: () => void;
  onUserChange?: (user: User) => void;
}

export const ScannerPortal: React.FC<ScannerPortalProps> = ({
  currentUser,
  onNavigateWorld,
  onLogout,
  onUserChange,
}) => {
  const isAuthorized =
    currentUser &&
    (currentUser.role === 'owner' ||
      currentUser.role === 'admin' ||
      currentUser.role === 'check_in_staff' ||
      (currentUser.permissions && currentUser.permissions.includes('scan.access')));

  const [inputToken, setInputToken] = useState('');
  const [scanResult, setScanResult] = useState<ScannerScanResult | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Available tickets for quick testing
  const allTickets = HellrixService.getTickets();
  const checkedInCount = allTickets.filter((t) => t.status === 'used').length;

  // Camera stream initialization
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (cameraActive && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn('Camera stream unavailable:', err);
          setCameraError('Camera access not available or permission denied in this environment. Use manual token scan below.');
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [cameraActive]);

  // RBAC Guard
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#090909] text-[#E5DED3] flex items-center justify-center p-4">
        <div className="max-w-md w-full border border-rose-600 bg-[#111111] p-8 text-center space-y-6">
          <AlertOctagon className="w-12 h-12 text-rose-500 mx-auto" />
          <div>
            <h2 className="text-2xl font-display uppercase text-white font-bold tracking-wider">
              GATE TERMINAL CLEARANCE REQUIRED
            </h2>
            <p className="text-xs font-mono-editorial text-[#A59D95] mt-2 leading-relaxed">
              This terminal is strictly reserved for authorized check-in staff and security personnel.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => {
                const staff = HellrixService.getUsers().find((u) => u.role === 'check_in_staff') || HellrixService.getUsers().find((u) => u.role === 'owner');
                if (staff) {
                  HellrixService.setActiveUser(staff);
                  if (onUserChange) onUserChange(staff);
                }
              }}
              className="w-full py-3 bg-[#C8102E] hover:bg-[#E31B36] text-white text-xs font-mono-editorial font-bold uppercase tracking-wider cursor-pointer transition-colors"
            >
              LOG IN AS GATE STAFF (ANYA SHARMA)
            </button>

            <button
              onClick={() => onNavigateWorld('public')}
              className="w-full py-3 bg-[#181818] hover:bg-[#222222] border border-[#35302F] text-xs font-mono-editorial text-[#A59D95] hover:text-white uppercase tracking-wider cursor-pointer"
            >
              RETURN TO PUBLIC CLIENT
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Audio Feedback Synthesizer using Web Audio API
  const playAudioBeep = (type: 'valid' | 'invalid' | 'warning') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'valid') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15); // E6
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'invalid') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.setValueAtTime(180, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(330, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  };

  const handleScanToken = (tokenToScan: string) => {
    if (!tokenToScan.trim()) return;
    const result = HellrixService.verifyAndCheckInTicket(tokenToScan.trim(), currentUser);
    setScanResult(result);

    if (result.status === 'VALID') {
      playAudioBeep('valid');
    } else if (result.status === 'ALREADY_USED') {
      playAudioBeep('warning');
    } else {
      playAudioBeep('invalid');
    }
  };

  const handleResetScanner = () => {
    setScanResult(null);
    setInputToken('');
  };

  return (
    <div className="min-h-screen bg-[#090909] text-[#E5DED3] flex flex-col justify-between max-w-lg mx-auto border-x border-[#35302F]">
      {/* Top Header */}
      <header className="p-4 bg-[#0D0D0D] border-b border-[#35302F] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HellrixLogo variant="icon" size="sm" />
          <div>
            <div className="text-sm font-display font-black uppercase text-white tracking-wider">
              GATE TERMINAL // SCANNER
            </div>
            <div className="text-[10px] font-mono-editorial text-[#77716D]">
              OPERATOR: {currentUser.name}
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono-editorial text-[#77716D] block">CHECKED IN</span>
          <span className="text-xs font-mono-editorial font-bold text-emerald-400">
            {checkedInCount} / {allTickets.length}
          </span>
        </div>
      </header>

      {/* Main Scanner Body */}
      <div className="flex-1 p-5 flex flex-col justify-center space-y-6">
        {/* RESULT DISPLAY IF SCANNED */}
        {scanResult ? (
          <div className="space-y-6 animate-fade-in">
            {/* 1. VALID TICKET */}
            {scanResult.status === 'VALID' && scanResult.ticket && (
              <div className="border-2 border-emerald-500 bg-emerald-950/20 p-6 space-y-4">
                <div className="flex items-center gap-3 text-emerald-400">
                  <CheckCircle2 className="w-8 h-8 shrink-0" />
                  <div>
                    <div className="text-xs font-mono-editorial uppercase font-bold">STATUS CONFIRMED</div>
                    <div className="text-2xl font-display font-black uppercase text-white">VALID TICKET</div>
                  </div>
                </div>

                <div className="space-y-2 border-t border-emerald-500/30 pt-4 text-xs font-mono-editorial">
                  <div className="flex justify-between">
                    <span className="text-[#A59D95]">TICKET NO:</span>
                    <span className="text-white font-bold">{scanResult.ticket.ticket_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A59D95]">PASS TIER:</span>
                    <span className="text-[#C8102E] font-bold uppercase">{scanResult.ticket.pass_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A59D95]">ATTENDEE:</span>
                    <span className="text-white font-bold">{scanResult.ticket.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A59D95]">EVENT:</span>
                    <span className="text-white">{scanResult.ticket.event_name}</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-900/40 border border-emerald-500 text-xs font-mono-editorial text-emerald-200 text-center font-bold">
                  ✓ CHECK-IN COMPLETED (UNUSED → USED)
                </div>
              </div>
            )}

            {/* 2. ALREADY USED */}
            {scanResult.status === 'ALREADY_USED' && (
              <div className="border-2 border-amber-500 bg-amber-950/20 p-6 space-y-4">
                <div className="flex items-center gap-3 text-amber-400">
                  <AlertOctagon className="w-8 h-8 shrink-0" />
                  <div>
                    <div className="text-xs font-mono-editorial uppercase font-bold">DUPLICATE ENTRY ALERT</div>
                    <div className="text-2xl font-display font-black uppercase text-white">ALREADY USED</div>
                  </div>
                </div>

                <div className="space-y-2 border-t border-amber-500/30 pt-4 text-xs font-mono-editorial">
                  <div className="flex justify-between">
                    <span className="text-[#A59D95]">TICKET NO:</span>
                    <span className="text-white font-bold">{scanResult.ticket?.ticket_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A59D95]">ATTENDEE:</span>
                    <span className="text-white font-bold">{scanResult.ticket?.customer_name}</span>
                  </div>
                  {scanResult.previous_checkin && (
                    <div className="p-3 bg-amber-900/30 border border-amber-600/40 text-[11px] text-amber-200 space-y-1">
                      <div>PREVIOUS CHECK-IN TIMESTAMP:</div>
                      <div className="font-bold text-white">
                        {new Date(scanResult.previous_checkin.timestamp).toLocaleString()}
                      </div>
                      <div className="text-[#A59D95]">BY: {scanResult.previous_checkin.staff_name}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. INVALID TICKET */}
            {scanResult.status === 'INVALID' && (
              <div className="border-2 border-rose-600 bg-rose-950/30 p-6 space-y-4 text-center">
                <XCircle className="w-10 h-10 text-rose-500 mx-auto" />
                <h3 className="text-3xl font-display font-black uppercase text-white">
                  INVALID TICKET
                </h3>
                <p className="text-xs font-mono-editorial text-[#A59D95]">
                  Token could not be verified against event database. Check for counterfeit or unconfirmed booking.
                </p>
              </div>
            )}

            <button
              onClick={handleResetScanner}
              className="w-full py-4 bg-[#C8102E] hover:bg-[#E31B36] text-white text-xs font-mono-editorial font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>SCAN NEXT TICKET</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Camera Viewport or Mock Frame */}
            <div className="relative border-2 border-dashed border-[#35302F] bg-[#111111] aspect-square flex flex-col items-center justify-center p-6 text-center overflow-hidden">
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <>
                  <QrCode className="w-16 h-16 text-[#C8102E] mb-4 opacity-80" />
                  <div className="text-sm font-display uppercase text-white font-bold mb-1">
                    TARGET TICKET QR CODE
                  </div>
                  <p className="text-xs font-mono-editorial text-[#77716D] max-w-xs mb-4">
                    Position attendee's digital pass or printed QR token within frame.
                  </p>
                </>
              )}

              {/* Red Corner Crosshairs */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#C8102E]" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#C8102E]" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#C8102E]" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#C8102E]" />
            </div>

            {/* Camera Toggle Button */}
            <button
              onClick={() => {
                setCameraError(null);
                setCameraActive(!cameraActive);
              }}
              className="w-full py-3 bg-[#181818] hover:bg-[#222222] border border-[#35302F] text-xs font-mono-editorial text-white flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-[#C8102E]" />
              <span>{cameraActive ? 'DEACTIVATE CAMERA STREAM' : 'ACTIVATE CAMERA STREAM'}</span>
            </button>

            {cameraError && (
              <div className="text-[11px] font-mono-editorial text-amber-400 p-2 bg-[#181818] border border-amber-600/30">
                {cameraError}
              </div>
            )}

            {/* Manual Token Scan Input */}
            <div className="border border-[#35302F] bg-[#121212] p-4 space-y-3">
              <label className="block text-[11px] font-mono-editorial text-[#A59D95] uppercase">
                MANUAL TICKET / TOKEN ENTRY
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputToken}
                  onChange={(e) => setInputToken(e.target.value)}
                  placeholder="e.g. HRX-VIP-10482 or token"
                  className="flex-1 bg-[#181818] border border-[#35302F] p-2.5 text-xs font-mono-editorial text-white focus:outline-none focus:border-[#C8102E]"
                />
                <button
                  onClick={() => handleScanToken(inputToken)}
                  className="px-4 py-2.5 bg-[#C8102E] hover:bg-[#E31B36] text-white text-xs font-mono-editorial font-bold uppercase transition-colors"
                >
                  SCAN
                </button>
              </div>
            </div>

            {/* Quick Demo Scan Buttons */}
            <div className="border border-[#262322] bg-[#0E0E0E] p-3 space-y-2 text-xs font-mono-editorial">
              <span className="text-[10px] text-[#77716D] uppercase block">
                PRELOADED TEST SCANS:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleScanToken('HRX-VIP-10482')}
                  className="p-2 bg-[#181818] hover:bg-[#252525] border border-emerald-500/40 text-[10px] text-emerald-300 font-bold uppercase text-center"
                >
                  TEST VALID (ALEX)
                </button>
                <button
                  type="button"
                  onClick={() => handleScanToken('HRX-SGL-10118')}
                  className="p-2 bg-[#181818] hover:bg-[#252525] border border-amber-500/40 text-[10px] text-amber-300 font-bold uppercase text-center"
                >
                  TEST USED (NEHA)
                </button>
                <button
                  type="button"
                  onClick={() => handleScanToken('HRX-INVALID-FAKE-TOKEN')}
                  className="p-2 bg-[#181818] hover:bg-[#252525] border border-rose-500/40 text-[10px] text-rose-300 font-bold uppercase text-center"
                >
                  TEST INVALID
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <footer className="p-4 bg-[#0D0D0D] border-t border-[#35302F] flex items-center justify-between text-xs font-mono-editorial text-[#77716D]">
        <button
          onClick={() => onNavigateWorld('admin')}
          className="hover:text-white transition-colors"
        >
          ← ADMIN PORTAL
        </button>
        <button
          onClick={() => onNavigateWorld('public')}
          className="hover:text-white transition-colors"
        >
          PUBLIC WEBSITE →
        </button>
      </footer>
    </div>
  );
};
