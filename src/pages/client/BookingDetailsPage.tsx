import React from 'react';
import { HellrixService } from '../../services/store';
import { Booking, User } from '../../types';
import { HellrixLogo } from '../../components/brand/HellrixLogo';
import {
  ChevronLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  Ticket as TicketIcon,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

interface BookingDetailsPageProps {
  bookingId: string;
  currentUser: User | null;
  onNavigate: (page: string, params?: any) => void;
}

export const BookingDetailsPage: React.FC<BookingDetailsPageProps> = ({
  bookingId,
  currentUser,
  onNavigate,
}) => {
  const booking = HellrixService.getBookingById(bookingId);
  const event = HellrixService.getEvent();
  const tickets = HellrixService.getTickets().filter((t) => t.booking_id === bookingId);
  const payment = HellrixService.getPayments().find((p) => p.booking_id === bookingId);

  if (!booking) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-display uppercase text-white mb-3">BOOKING NOT FOUND</h2>
        <p className="text-xs font-mono-editorial text-[#A59D95] mb-6">
          The requested booking reference does not exist in the database.
        </p>
        <button
          onClick={() => onNavigate('my-tickets')}
          className="px-6 py-3 bg-[#C8102E] text-white text-xs font-mono-editorial font-bold uppercase"
        >
          BACK TO MY TICKETS
        </button>
      </div>
    );
  }

  // Security Check: Customer can only access their own bookings unless staff/owner
  if (currentUser && currentUser.role === 'customer' && booking.user_id !== currentUser.id) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="w-10 h-10 text-rose-500 mb-3" />
        <h2 className="text-2xl font-display uppercase text-white mb-2">UNAUTHORIZED ACCESS</h2>
        <p className="text-xs font-mono-editorial text-[#A59D95] mb-6">
          You do not have permission to view another attendee's booking record.
        </p>
        <button
          onClick={() => onNavigate('my-tickets')}
          className="px-6 py-3 bg-[#C8102E] text-white text-xs font-mono-editorial font-bold uppercase"
        >
          RETURN TO WALLET
        </button>
      </div>
    );
  }

  const isConfirmed = booking.status === 'confirmed';
  const isPending = booking.status === 'verification_pending';
  const isReserved = booking.status === 'reserved';
  const isExpired = booking.status === 'expired' || booking.status === 'payment_rejected';

  return (
    <div className="min-h-screen bg-[#090909] text-[#E5DED3] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-[#35302F] pb-4">
          <button
            onClick={() => onNavigate('my-tickets')}
            className="inline-flex items-center gap-2 text-xs font-mono-editorial text-[#A59D95] hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-[#C8102E]" />
            <span>RETURN TO MY TICKETS</span>
          </button>

          <span className="text-xs font-mono-editorial text-[#77716D]">
            REF: <strong className="text-white">{booking.id}</strong>
          </span>
        </div>

        {/* Booking Dossier Header */}
        <div className="border-2 border-black bg-[#121212] p-8 shadow-[6px_6px_0px_#000000]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#242120] pb-6">
            <div>
              <span className="text-xs font-mono-editorial text-[#C8102E] font-bold tracking-widest uppercase block mb-1">
                AUTHENTICATED BOOKING DOSSIER
              </span>
              <h1 className="text-3xl sm:text-4xl font-display font-black uppercase text-white">
                {booking.pass_type_name}
              </h1>
              <div className="text-xs font-mono-editorial text-[#A59D95] mt-1">
                {event.title} · {event.venue}
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] font-mono-editorial text-[#77716D] uppercase block">
                CURRENT STATUS
              </span>
              <span
                className={`text-sm font-mono-editorial font-bold uppercase px-3 py-1 inline-block mt-1 ${
                  isConfirmed
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/40'
                    : isPending
                    ? 'bg-amber-950/40 text-amber-400 border border-amber-500/40'
                    : isReserved
                    ? 'bg-sky-950/40 text-sky-400 border border-sky-500/40'
                    : 'bg-rose-950/40 text-rose-400 border border-rose-500/40'
                }`}
              >
                ● {booking.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Interactive Timeline of Important Events */}
          <div className="pt-8">
            <span className="text-xs font-mono-editorial text-white font-bold uppercase tracking-wider block mb-6">
              BOOKING TIMELINE & VERIFICATION AUDIT
            </span>

            <div className="space-y-6 relative pl-6 border-l-2 border-[#242120]">
              {booking.timeline.map((item, idx) => (
                <div key={idx} className="relative">
                  {/* Indicator Dot */}
                  <span
                    className={`absolute -left-[31px] top-1 w-3.5 h-3.5 border-2 ${
                      item.completed
                        ? 'bg-[#C8102E] border-black'
                        : 'bg-[#181818] border-[#444444]'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono-editorial font-bold uppercase ${item.completed ? 'text-white' : 'text-[#77716D]'}`}>
                        {item.title}
                      </span>
                      {item.timestamp && (
                        <span className="text-[10px] font-mono-editorial text-[#77716D]">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono-editorial text-[#A59D95] mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="pt-8 mt-8 border-t border-[#242120] grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2 text-xs font-mono-editorial">
              <span className="text-[#77716D] block uppercase font-bold">ATTENDEE DETAILS</span>
              <div className="text-white font-bold">{booking.customer_name}</div>
              <div className="text-[#A59D95]">{booking.customer_email}</div>
              <div className="text-[#A59D95]">{booking.customer_mobile}</div>
            </div>

            <div className="space-y-2 text-xs font-mono-editorial bg-[#161616] p-4 border border-[#2B2726]">
              <span className="text-[#77716D] block uppercase font-bold">FINANCIAL SUMMARY</span>
              <div className="flex justify-between">
                <span className="text-[#A59D95]">QUANTITY:</span>
                <span className="text-white font-bold">{booking.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A59D95]">PRICE PER PASS:</span>
                <span className="text-white">₹{booking.unit_price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A59D95]">APPLICABLE FEES:</span>
                <span className="text-white">₹{booking.booking_fee}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#2B2726] text-sm">
                <span className="text-white font-bold">TOTAL AMOUNT:</span>
                <span className="text-white font-display text-xl font-bold">
                  ₹{booking.total_amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Hub */}
          <div className="pt-8 mt-8 border-t border-[#242120] flex flex-wrap gap-4 items-center justify-between">
            {isConfirmed && tickets[0] && (
              <button
                onClick={() => onNavigate('ticket-details', { ticketId: tickets[0].ticket_number })}
                className="px-6 py-3 bg-[#C8102E] hover:bg-[#E31B36] text-white text-xs font-mono-editorial font-bold uppercase tracking-wider flex items-center gap-2 border-2 border-black shadow-[4px_4px_0px_#000000]"
              >
                <TicketIcon className="w-4 h-4" />
                <span>ACCESS DIGITAL PASS</span>
              </button>
            )}

            {isReserved && (
              <button
                onClick={() => onNavigate('upi-payment', { bookingId: booking.id })}
                className="px-6 py-3 bg-[#C8102E] hover:bg-[#E31B36] text-white text-xs font-mono-editorial font-bold uppercase tracking-wider flex items-center gap-2 border-2 border-black shadow-[4px_4px_0px_#000000]"
              >
                <CreditCard className="w-4 h-4" />
                <span>COMPLETE UPI PAYMENT</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('support', { bookingId: booking.id })}
              className="px-5 py-3 bg-[#181818] hover:bg-[#222222] text-[#A59D95] hover:text-white border border-[#35302F] text-xs font-mono-editorial flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-[#C8102E]" />
              <span>NEED HELP WITH THIS BOOKING?</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
