import React, { useState, useEffect } from 'react';
import { Booking, Ticket, User, DigitalVoucher } from '../../types';
import { HellrixService } from '../../services/store';
import { HellrixLogo } from '../../components/brand/HellrixLogo';
import QRCode from 'qrcode';
import {
  Ticket as TicketIcon,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Printer,
  ChevronLeft,
  FileText,
} from 'lucide-react';

interface MyTicketsPageProps {
  currentUser: User | null;
  onNavigate: (page: string, params?: any) => void;
}

export const MyTicketsPage: React.FC<MyTicketsPageProps> = ({ currentUser, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'pending' | 'past' | 'expired'>('upcoming');

  if (!currentUser) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-3xl font-display uppercase text-white mb-3">AUTHENTICATION REQUIRED</h2>
        <p className="text-xs font-mono-editorial text-[#A59D95] mb-6 max-w-sm">
          Please log in to your HELLRIX account to view your confirmed tickets and booking requests.
        </p>
        <button
          onClick={() => onNavigate('login')}
          className="px-8 py-3.5 bg-[#C8102E] text-white text-xs font-mono-editorial font-bold uppercase"
        >
          LOG IN TO MY ACCOUNT
        </button>
      </div>
    );
  }

  const userTickets = HellrixService.getUserTickets(currentUser.id);
  const userBookings = HellrixService.getUserBookings(currentUser.id);

  const upcomingTickets = userTickets.filter((t) => t.status === 'unused');
  const pastTickets = userTickets.filter((t) => t.status === 'used');
  const pendingBookings = userBookings.filter((b) => b.status === 'verification_pending' || b.status === 'reserved');
  const expiredBookings = userBookings.filter((b) => b.status === 'expired' || b.status === 'payment_rejected');

  return (
    <div className="min-h-screen bg-[#090909] text-[#E5DED3] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 border-b border-[#35302F] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase block mb-2">
              ATTENDEE WALLET // {currentUser.name.toUpperCase()}
            </span>
            <h1 className="text-4xl sm:text-6xl font-display font-black uppercase text-white tracking-tight">
              MY TICKETS.
            </h1>
          </div>

          {/* 4 Standard Views: UPCOMING, PAST EVENTS, PENDING, EXPIRED */}
          <div className="flex items-center gap-1 bg-[#141414] border border-[#2E2928] p-1">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3 py-1.5 text-xs font-mono-editorial uppercase transition-colors cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'bg-[#C8102E] text-white font-bold'
                  : 'text-[#A59D95] hover:text-white'
              }`}
            >
              UPCOMING ({upcomingTickets.length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 text-xs font-mono-editorial uppercase transition-colors cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-[#C8102E] text-white font-bold'
                  : 'text-[#A59D95] hover:text-white'
              }`}
            >
              PENDING ({pendingBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-3 py-1.5 text-xs font-mono-editorial uppercase transition-colors cursor-pointer ${
                activeTab === 'past'
                  ? 'bg-[#C8102E] text-white font-bold'
                  : 'text-[#A59D95] hover:text-white'
              }`}
            >
              PAST EVENTS ({pastTickets.length})
            </button>
            <button
              onClick={() => setActiveTab('expired')}
              className={`px-3 py-1.5 text-xs font-mono-editorial uppercase transition-colors cursor-pointer ${
                activeTab === 'expired'
                  ? 'bg-[#C8102E] text-white font-bold'
                  : 'text-[#A59D95] hover:text-white'
              }`}
            >
              EXPIRED ({expiredBookings.length})
            </button>
          </div>
        </div>

        {/* View 1: UPCOMING VALID PASSES */}
        {activeTab === 'upcoming' && (
          <div className="space-y-6">
            {upcomingTickets.length === 0 ? (
              <div className="p-12 border-2 border-black bg-[#111111] text-center space-y-4 shadow-[6px_6px_0px_#000000]">
                <TicketIcon className="w-8 h-8 text-[#77716D] mx-auto" />
                <h3 className="text-xl font-display uppercase text-white">NO ACTIVE PASSES</h3>
                <p className="text-xs font-mono-editorial text-[#A59D95] max-w-sm mx-auto">
                  You currently have no confirmed upcoming passes. Secure entry through the pass collection.
                </p>
                <button
                  onClick={() => onNavigate('passes')}
                  className="px-6 py-3 bg-[#C8102E] text-white text-xs font-mono-editorial font-bold uppercase"
                >
                  SECURE A PASS
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border-2 border-black bg-[#111111] p-6 flex flex-col justify-between hover:border-[#C8102E] transition-all shadow-[6px_6px_0px_#000000]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="text-xs font-mono-editorial font-bold text-[#C8102E]">
                          {ticket.pass_name}
                        </span>
                        <span className="text-[10px] font-mono-editorial font-bold uppercase text-emerald-400">
                          ● READY FOR GATE
                        </span>
                      </div>

                      <h3 className="text-2xl font-display font-black uppercase text-white mb-1">
                        {ticket.event_name}
                      </h3>
                      <div className="text-xs font-mono-editorial text-[#A59D95] mb-4">
                        TICKET ID: <strong className="text-white">{ticket.ticket_number}</strong>
                      </div>

                      <div className="border-t border-[#1F1C1C] pt-3 text-[11px] font-mono-editorial text-[#77716D] space-y-1">
                        <div>VENUE: THE CONCRETE SILO · MUMBAI</div>
                        <div>TIMELINE: 28 NOV 2026 // 21:00 IST</div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[#242120] mt-6 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => onNavigate('ticket-details', { ticketId: ticket.ticket_number })}
                        className="flex-1 py-3 bg-[#C8102E] hover:bg-[#E31B36] text-white text-xs font-mono-editorial font-bold uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-black shadow-[3px_3px_0px_#000000]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>VIEW TICKET</span>
                      </button>
                      <button
                        onClick={() => onNavigate('booking-details', { bookingId: ticket.booking_id })}
                        className="px-3 py-3 bg-[#181818] hover:bg-[#222222] text-[#A59D95] hover:text-white text-xs font-mono-editorial transition-colors flex items-center justify-center"
                        title="View Booking Dossier"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* View 2: PENDING BOOKINGS */}
        {activeTab === 'pending' && (
          <div className="space-y-6">
            {pendingBookings.length === 0 ? (
              <div className="p-12 border border-[#242120] bg-[#111111] text-center text-xs font-mono-editorial text-[#77716D]">
                No pending verification requests or active holds.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingBookings.map((b) => (
                  <div
                    key={b.id}
                    className="border-2 border-black bg-[#121212] p-6 flex flex-col justify-between shadow-[6px_6px_0px_#000000]"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono-editorial font-bold text-amber-400">
                          {b.status === 'verification_pending'
                            ? '● UTR SUBMITTED · AUDIT IN PROGRESS'
                            : '● RESERVED · 10-MIN HOLD'}
                        </span>
                        <span className="text-xs font-mono-editorial text-white font-bold">
                          ₹{b.total_amount.toLocaleString()}
                        </span>
                      </div>

                      <h4 className="text-xl font-display uppercase text-white mb-2">
                        {b.pass_type_name} ({b.quantity}x)
                      </h4>

                      <p className="text-xs font-mono-editorial text-[#A59D95] leading-relaxed mb-4">
                        Booking reference #{b.id}. Bank reconciliation is underway. Verified tickets will appear under Upcoming passes upon audit approval.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#262322] flex items-center justify-between text-xs font-mono-editorial">
                      <button
                        onClick={() => onNavigate('booking-details', { bookingId: b.id })}
                        className="text-white hover:text-[#C8102E] font-bold underline flex items-center gap-1"
                      >
                        <span>VIEW DOSSIER</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      {b.status === 'reserved' && (
                        <button
                          onClick={() => onNavigate('upi-payment', { bookingId: b.id })}
                          className="px-3 py-1.5 bg-[#C8102E] text-white font-bold uppercase text-[11px]"
                        >
                          COMPLETE UPI
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* View 3: PAST EVENTS */}
        {activeTab === 'past' && (
          <div className="space-y-6">
            {pastTickets.length === 0 ? (
              <div className="p-12 border border-[#242120] bg-[#111111] text-center text-xs font-mono-editorial text-[#77716D]">
                No attended past events in this account.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastTickets.map((t) => (
                  <div key={t.id} className="border border-[#242120] bg-[#0E0E0E] p-6 opacity-75">
                    <span className="text-xs font-mono-editorial text-[#77716D] block mb-2">
                      CHECKED IN AT GATE
                    </span>
                    <h4 className="text-xl font-display text-white mb-1">{t.event_name}</h4>
                    <div className="text-xs font-mono-editorial text-[#A59D95]">{t.pass_name}</div>
                    <div className="text-[11px] font-mono-editorial text-[#77716D] mt-3">
                      Checked in on {t.check_in?.timestamp ? new Date(t.check_in.timestamp).toLocaleDateString() : 'Event Night'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* View 4: EXPIRED / REJECTED */}
        {activeTab === 'expired' && (
          <div className="space-y-3">
            {expiredBookings.length === 0 ? (
              <div className="p-12 border border-[#242120] bg-[#111111] text-center text-xs font-mono-editorial text-[#77716D]">
                No expired or rejected sessions.
              </div>
            ) : (
              expiredBookings.map((b) => (
                <div
                  key={b.id}
                  className="border border-[#262322] bg-[#0E0E0E] p-4 flex items-center justify-between text-xs font-mono-editorial text-[#77716D]"
                >
                  <div>
                    <span className="text-white font-bold">#{b.id}</span> · {b.pass_type_name} (₹{b.total_amount})
                  </div>
                  <span className="text-rose-400 uppercase font-bold">
                    {b.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// PAGE 09: DIGITAL COLLECTIBLE TICKET & VOUCHER DETAILS
// ==========================================
export const TicketDetailsPage: React.FC<{
  ticketId: string;
  onNavigate: (page: string, params?: any) => void;
}> = ({ ticketId, onNavigate }) => {
  const [ticket, setTicket] = useState<Ticket | undefined>(() =>
    HellrixService.getTicketById(ticketId)
  );
  const [qrUrl, setQrUrl] = useState<string>('');
  const [voucherQrUrl, setVoucherQrUrl] = useState<string>('');

  const vouchers = HellrixService.getVouchers();
  const associatedVoucher = vouchers.find(
    (v) => (ticket && v.ticket_id === ticket.ticket_number) || v.id === ticket?.voucher_id
  );

  useEffect(() => {
    const found = HellrixService.getTicketById(ticketId);
    setTicket(found);

    if (found) {
      QRCode.toDataURL(found.security_token, {
        margin: 1,
        width: 260,
        color: { dark: '#000000', light: '#FFFFFF' },
      }).then((url) => setQrUrl(url));
    }

    if (associatedVoucher) {
      QRCode.toDataURL(associatedVoucher.redemption_code, {
        margin: 1,
        width: 180,
        color: { dark: '#000000', light: '#FFFFFF' },
      }).then((url) => setVoucherQrUrl(url));
    }
  }, [ticketId, associatedVoucher]);

  if (!ticket) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-display uppercase text-white mb-4">TICKET NOT LOCATED</h2>
        <button
          onClick={() => onNavigate('my-tickets')}
          className="px-6 py-3 bg-[#C8102E] text-white text-xs font-mono-editorial uppercase font-bold"
        >
          BACK TO MY TICKETS
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090909] text-[#E5DED3] py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation & Action Bar */}
        <div className="flex items-center justify-between border-b border-[#35302F] pb-4">
          <button
            onClick={() => onNavigate('my-tickets')}
            className="inline-flex items-center gap-2 text-xs font-mono-editorial text-[#A59D95] hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-[#C8102E]" />
            <span>RETURN TO WALLET</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#181818] hover:bg-[#222222] border border-[#35302F] text-xs font-mono-editorial text-white flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#C8102E]" />
            <span>PRINT / SAVE AS PDF</span>
          </button>
        </div>

        {/* Digital Collectible Artifact Pass */}
        <div className="border-2 border-black bg-[#111111] shadow-[10px_10px_0px_#000000] overflow-hidden">
          {/* Top Notch Brand Header */}
          <div className="bg-[#0A0A0A] border-b-2 border-black p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <HellrixLogo variant="full" size="md" />
              <div className="hidden sm:block border-l border-[#35302F] pl-4">
                <span className="text-[10px] font-mono-editorial text-[#77716D] block uppercase">
                  OFFICIAL ACCESS TOKEN
                </span>
                <span className="text-xs font-mono-editorial text-white font-bold">
                  {ticket.event_name}
                </span>
              </div>
            </div>
            <div className="sm:text-right">
              <span className="text-[10px] font-mono-editorial text-[#77716D] uppercase block">
                CLASSIFICATION
              </span>
              <span className="text-2xl font-display font-black text-white uppercase tracking-wider">
                {ticket.pass_name}
              </span>
              <div className="tracking-[0.2em] text-[10px] text-[#C8102E] font-mono select-none mt-1">
                ||||| ||| |||| | |||||| ||||
              </div>
            </div>
          </div>

          {/* Ticket Information & QR Matrix */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#131313]">
            {/* Metadata */}
            <div className="md:col-span-7 space-y-5 text-xs font-mono-editorial">
              <div>
                <span className="text-[11px] text-[#77716D] block">LEGAL ATTENDEE NAME</span>
                <span className="text-xl font-display text-white">{ticket.customer_name}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-y border-[#262322] py-4">
                <div>
                  <span className="text-[10px] text-[#77716D] block">TICKET IDENTIFIER</span>
                  <span className="text-white font-mono-editorial font-bold">{ticket.ticket_number}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#77716D] block">GATE ADMISSION STATE</span>
                  <span
                    className={`font-bold uppercase ${
                      ticket.status === 'unused' ? 'text-emerald-400' : 'text-zinc-500'
                    }`}
                  >
                    ● {ticket.status}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#77716D] block">VENUE LOCATION</span>
                <span className="text-white block font-bold">THE CONCRETE SILO (WAREHOUSE 07)</span>
                <span className="text-[#A59D95] text-[11px]">Gate 4, Heavy Industrial Estate, Mumbai</span>
              </div>

              <div>
                <span className="text-[10px] text-[#77716D] block">TIMELINE</span>
                <span className="text-[#A59D95]">SATURDAY, 28 NOV 2026 // 21:00 — 05:00 IST</span>
              </div>
            </div>

            {/* Scannable Gate QR Terminal Box */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-white border border-[#35302F]">
              {qrUrl ? (
                <img
                  src={qrUrl}
                  alt="Scannable Gate QR Code"
                  className="w-48 h-48 object-contain"
                />
              ) : (
                <div className="w-48 h-48 bg-zinc-200" />
              )}
              <span className="text-[9px] font-mono-editorial text-black font-bold uppercase tracking-widest mt-3 text-center">
                ENCRYPTED GATE SCAN TOKEN
              </span>
            </div>
          </div>

          {/* If already checked in */}
          {ticket.check_in && (
            <div className="p-4 bg-zinc-900 border-t border-[#292524] text-xs font-mono-editorial text-[#A59D95] flex items-center justify-between">
              <span>CHECKED IN AT: {new Date(ticket.check_in.timestamp).toLocaleString()}</span>
              <span>STAFF: {ticket.check_in.staff_name}</span>
            </div>
          )}

          {/* Separate Digital Voucher Section (Distinct Redemption Code) */}
          {associatedVoucher && (
            <div className="p-6 bg-[#161616] border-t-2 border-black space-y-3 text-xs font-mono-editorial">
              <div className="flex items-center justify-between border-b border-[#2B2726] pb-2">
                <span className="text-white font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#C8102E]" />
                  <span>DIGITAL VOUCHER: {associatedVoucher.benefit_title}</span>
                </span>
                <span className="text-[#C8102E] font-bold">{associatedVoucher.id}</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-[#A59D95] text-[11px] leading-relaxed max-w-md">
                  {associatedVoucher.benefit_description}
                </p>
                <div className="p-2 bg-white border border-black shrink-0 text-center">
                  {voucherQrUrl && (
                    <img src={voucherQrUrl} alt="Voucher QR" className="w-24 h-24 object-contain" />
                  )}
                  <span className="text-[8px] font-mono-editorial text-black font-bold block mt-1">
                    BAR VOUCHER ONLY
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
