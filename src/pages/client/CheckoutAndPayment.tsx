import React, { useEffect, useState } from 'react';
import { Booking, DigitalVoucher, Payment, User } from '../../types';
import { HellrixService } from '../../services/store';
import { HellrixLogo } from '../../components/brand/HellrixLogo';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import {
  Clock,
  ShieldCheck,
  Copy,
  Check,
  AlertCircle,
  ArrowRight,
  Download,
  Ticket as TicketIcon,
  QrCode as QrIcon,
  HelpCircle,
  FileText,
  AlertTriangle,
} from 'lucide-react';

// ==========================================
// PAGE 10: CHECKOUT WITH AUTHORITATIVE 10-MINUTE HOLD
// ==========================================
export const CheckoutPage: React.FC<{
  bookingId: string;
  currentUser: User | null;
  onNavigate: (page: string, params?: any) => void;
}> = ({ bookingId, currentUser, onNavigate }) => {
  const [booking, setBooking] = useState<Booking | undefined>(() =>
    HellrixService.getBookingById(bookingId)
  );

  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number }>({
    minutes: 10,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  // Customer form details state
  const [customerName, setCustomerName] = useState(currentUser?.name || booking?.customer_name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || booking?.customer_email || '');
  const [customerMobile, setCustomerMobile] = useState(currentUser?.mobile || booking?.customer_mobile || '');
  const [errors, setErrors] = useState<{ name?: string; email?: string; mobile?: string }>({});

  useEffect(() => {
    const current = HellrixService.getBookingById(bookingId);
    setBooking(current);

    if (!current) return;

    if (currentUser) {
      setCustomerName(currentUser.name);
      setCustomerEmail(currentUser.email);
      setCustomerMobile(currentUser.mobile);
    }

    const checkTimer = () => {
      const expiresAt = new Date(current.reservation_expires_at).getTime();
      const diff = expiresAt - Date.now();

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft({ minutes: 0, seconds: 0 });
        HellrixService.cleanExpiredReservations();
      } else {
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft({ minutes: m, seconds: s });
      }
    };

    checkTimer();
    const interval = setInterval(checkTimer, 1000);
    return () => clearInterval(interval);
  }, [bookingId, currentUser]);

  if (!booking) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-display uppercase text-white mb-4">RESERVATION NOT FOUND</h2>
        <button
          onClick={() => onNavigate('passes')}
          className="px-6 py-3 bg-[#C8102E] text-white text-xs font-mono-editorial font-bold uppercase"
        >
          EXPLORE PASSES
        </button>
      </div>
    );
  }

  const formatTimer = () => {
    const min = String(timeLeft.minutes).padStart(2, '0');
    const sec = String(timeLeft.seconds).padStart(2, '0');
    return `${min}:${sec}`;
  };

  const validateForm = () => {
    const errs: { name?: string; email?: string; mobile?: string } = {};
    if (!customerName.trim()) errs.name = 'Full name is required.';
    if (!customerEmail.trim() || !customerEmail.includes('@')) errs.email = 'Valid email is required.';
    if (!customerMobile.trim() || customerMobile.trim().length < 10) errs.mobile = '10-digit mobile number is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToPayment = () => {
    if (!validateForm()) return;

    // If not authenticated, preserve booking selection and direct to login
    if (!currentUser) {
      onNavigate('login', {
        redirect: 'checkout',
        bookingId: booking.id,
        passId: booking.pass_type_id,
        quantity: booking.quantity,
      });
      return;
    }

    onNavigate('upi-payment', { bookingId: booking.id });
  };

  return (
    <div className="min-h-screen bg-[#090909] text-[#E5DED3] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Authoritative 10-Minute Hold Header */}
        <div className="mb-8 border-2 border-black bg-[#121212] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[6px_6px_0px_#000000]">
          <div className="space-y-1">
            <span className="text-[11px] font-mono-editorial text-[#C8102E] tracking-widest uppercase font-bold">
              AUTHORITATIVE 10-MINUTE RESERVATION ENGINE
            </span>
            <div className="text-sm font-mono-editorial text-[#A59D95]">
              Capacity temporarily reserved from event pool. Countdown persists across refreshes.
            </div>
          </div>

          <div
            className={`px-5 py-3 border-2 flex items-center gap-3 ${
              isExpired
                ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                : 'bg-[#181818] border-black text-white shadow-[4px_4px_0px_#C8102E]'
            }`}
          >
            <Clock className={`w-5 h-5 ${isExpired ? 'text-rose-400' : 'text-[#C8102E]'}`} />
            <div>
              <div className="text-[10px] font-mono-editorial text-[#77716D] uppercase">
                {isExpired ? 'HOLD EXPIRED' : 'HOLD EXPIRES IN'}
              </div>
              <div className="text-2xl font-mono-editorial font-bold tabular-nums">
                {isExpired ? '00:00' : formatTimer()}
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Expired State */}
        {isExpired ? (
          <div className="border-2 border-rose-600 bg-[#141414] p-10 text-center space-y-6 shadow-[8px_8px_0px_#000000]">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-3xl font-display font-black uppercase text-white">
              YOUR RESERVATION HAS EXPIRED.
            </h3>
            <p className="text-xs font-mono-editorial text-[#A59D95] max-w-md mx-auto leading-relaxed">
              The 10-minute hold window for Booking #{booking.id} has elapsed. In accordance with event capacity policy, your hold has been released back into the available pool.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <button
                onClick={() => onNavigate('passes')}
                className="px-8 py-3.5 bg-[#C8102E] hover:bg-[#E31B36] text-white text-xs font-mono-editorial font-bold uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000000]"
              >
                TRY AGAIN
              </button>
              <button
                onClick={() => onNavigate('passes')}
                className="px-8 py-3.5 bg-[#181818] hover:bg-[#252525] text-[#E5DED3] text-xs font-mono-editorial uppercase border border-[#35302F]"
              >
                BACK TO PASSES
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Booking Summary */}
            <div className="md:col-span-7 border-2 border-black bg-[#121212] p-8 space-y-6 shadow-[6px_6px_0px_#000000]">
              <div className="border-b border-[#242120] pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono-editorial text-[#77716D] block">
                    RESERVATION REFERENCE
                  </span>
                  <span className="text-xl font-display font-bold text-white tracking-wider">
                    {booking.id}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono-editorial text-[#77716D] block">
                    INVENTORY STATE
                  </span>
                  <span className="text-xs font-mono-editorial text-amber-400 font-bold uppercase">
                    ACTIVE HOLD
                  </span>
                </div>
              </div>

              {/* Price Calculation (Single Source of Truth) */}
              <div className="space-y-3 text-xs font-mono-editorial">
                <div className="flex justify-between py-2 border-b border-[#1E1C1B]">
                  <span className="text-[#A59D95]">SELECTED PASS:</span>
                  <span className="text-white font-bold">{booking.pass_type_name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1E1C1B]">
                  <span className="text-[#A59D95]">QUANTITY:</span>
                  <span className="text-white">{booking.quantity}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1E1C1B]">
                  <span className="text-[#A59D95]">PRICE PER PASS:</span>
                  <span className="text-white">₹{booking.unit_price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1E1C1B]">
                  <span className="text-[#A59D95]">SUBTOTAL:</span>
                  <span className="text-white">₹{booking.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1E1C1B]">
                  <span className="text-[#A59D95]">APPLICABLE FEES:</span>
                  <span className="text-white">₹{booking.booking_fee}</span>
                </div>
                <div className="flex justify-between py-3 text-base">
                  <span className="text-[#E5DED3] font-bold">TOTAL AMOUNT:</span>
                  <span className="text-white font-display text-2xl font-bold">
                    ₹{booking.total_amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Customer Details Form */}
              <div className="pt-4 border-t border-[#242120] space-y-4">
                <span className="text-xs font-mono-editorial text-white font-bold uppercase block">
                  ATTENDEE IDENTIFICATION (MATCHES GOVT ID)
                </span>

                <div>
                  <label className="block text-[11px] font-mono-editorial text-[#A59D95] uppercase mb-1">
                    FULL LEGAL NAME <span className="text-[#C8102E]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Alex Mercer"
                    className="w-full bg-[#181818] border border-[#35302F] focus:border-[#C8102E] text-white text-xs font-mono-editorial p-3 focus:outline-none"
                  />
                  {errors.name && <span className="text-[10px] text-rose-400 mt-1 block">{errors.name}</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono-editorial text-[#A59D95] uppercase mb-1">
                      EMAIL ADDRESS <span className="text-[#C8102E]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="alex@domain.com"
                      className="w-full bg-[#181818] border border-[#35302F] focus:border-[#C8102E] text-white text-xs font-mono-editorial p-3 focus:outline-none"
                    />
                    {errors.email && <span className="text-[10px] text-rose-400 mt-1 block">{errors.email}</span>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono-editorial text-[#A59D95] uppercase mb-1">
                      MOBILE NUMBER <span className="text-[#C8102E]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerMobile}
                      onChange={(e) => setCustomerMobile(e.target.value)}
                      placeholder="+91 98222 33445"
                      className="w-full bg-[#181818] border border-[#35302F] focus:border-[#C8102E] text-white text-xs font-mono-editorial p-3 focus:outline-none"
                    />
                    {errors.mobile && <span className="text-[10px] text-rose-400 mt-1 block">{errors.mobile}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Next Step Action Box */}
            <div className="md:col-span-5 flex flex-col justify-between border-2 border-black bg-[#141414] p-8 space-y-6 shadow-[6px_6px_0px_#000000]">
              <div className="space-y-4">
                <span className="text-xs font-mono-editorial text-[#C8102E] font-bold tracking-widest uppercase block">
                  STEP 2 OF 3
                </span>
                <h3 className="text-2xl font-display font-black uppercase text-white">
                  CONFIRM & PROCEED
                </h3>

                <div className="p-4 bg-[#181818] border border-[#2E2928] text-xs font-mono-editorial space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <span className="w-2 h-2 bg-[#C8102E]" />
                    <span>DIRECT UPI PAYMENT</span>
                  </div>
                  <p className="text-[#A59D95] leading-relaxed">
                    Zero gateway processing surcharges. Instant UPI transfer instructions with 12-digit UTR submission.
                  </p>
                </div>

                {!currentUser && (
                  <div className="p-3 bg-amber-950/30 border border-amber-600/40 text-[11px] font-mono-editorial text-amber-300">
                    Signing in during checkout preserves your pass reservation.
                  </div>
                )}
              </div>

              <button
                onClick={handleProceedToPayment}
                className="w-full py-4 bg-[#C8102E] hover:bg-[#E31B36] text-white text-xs font-mono-editorial font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 border-2 border-black shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
              >
                <span>PROCEED TO UPI PAYMENT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// PAGE 11: UPI PAYMENT & UTR SUBMISSION (WITH DUPLICATE GUARD)
// ==========================================
export const UpiPaymentPage: React.FC<{
  bookingId: string;
  onNavigate: (page: string, params?: any) => void;
}> = ({ bookingId, onNavigate }) => {
  const [booking, setBooking] = useState<Booking | undefined>(() =>
    HellrixService.getBookingById(bookingId)
  );
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [utrNumber, setUtrNumber] = useState('');
  const [payerName, setPayerName] = useState(booking?.customer_name || '');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const settings = HellrixService.getSettings();

  useEffect(() => {
    if (!booking) return;

    // Generated UPI Intent Link
    const upiLink = `upi://pay?pa=${settings.upi_id}&pn=${encodeURIComponent(
      settings.upi_receiver_name
    )}&am=${booking.total_amount}&tr=${booking.id}&cu=INR`;

    QRCode.toDataURL(upiLink, {
      margin: 2,
      width: 280,
      color: { dark: '#000000', light: '#FFFFFF' },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [booking, settings]);

  if (!booking) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-display uppercase text-white mb-4">BOOKING NOT FOUND</h2>
        <button
          onClick={() => onNavigate('passes')}
          className="px-6 py-3 bg-[#C8102E] text-white text-xs font-mono-editorial font-bold uppercase"
        >
          EXPLORE PASSES
        </button>
      </div>
    );
  }

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(settings.upi_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitUtr = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = HellrixService.submitUtr({
      bookingId: booking.id,
      utrNumber: utrNumber.trim(),
      payerAccountName: payerName.trim(),
      notes: notes.trim(),
      userId: booking.user_id,
    });

    if (result.success && result.payment) {
      onNavigate('payment-pending', { bookingId: booking.id, paymentId: result.payment.id });
    } else {
      setError(result.error || 'Failed to submit UTR. Please ensure it is at least 8 digits.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090909] text-[#E5DED3] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Bar */}
        <div className="mb-8 border-b border-[#35302F] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase block mb-1">
              STEP 3 // UPI TRANSFER & SUBMISSION
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-black uppercase text-white">
              PAY ₹{booking.total_amount.toLocaleString()} VIA UPI
            </h1>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-mono-editorial text-[#77716D] block">BOOKING REF</span>
            <span className="text-sm font-mono-editorial text-white font-bold">{booking.id}</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-950/40 border-2 border-rose-500 text-xs font-mono-editorial text-white flex items-start gap-3 shadow-[4px_4px_0px_#000000]">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold uppercase">SUBMISSION FAILED</div>
              <div className="text-rose-200 mt-1">{error}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Dynamic QR & Configured UPI ID */}
          <div className="md:col-span-5 border-2 border-black bg-[#111111] p-6 flex flex-col items-center text-center shadow-[6px_6px_0px_#000000]">
            <span className="text-[11px] font-mono-editorial text-[#A59D95] uppercase tracking-wider mb-4">
              SCAN WITH ANY UPI APP
            </span>

            {/* QR Matrix */}
            <div className="p-3 bg-white border-2 border-black mb-4">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Configured UPI QR Code"
                  className="w-56 h-56 object-contain"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-black text-xs font-mono-editorial">
                  GENERATING QR...
                </div>
              )}
            </div>

            {/* Copyable UPI ID */}
            <div className="w-full bg-[#181818] border border-[#2B2726] p-3 flex items-center justify-between gap-2 mb-4">
              <div className="text-left overflow-hidden">
                <span className="text-[10px] font-mono-editorial text-[#77716D] block">UPI ID:</span>
                <span className="text-xs font-mono-editorial font-bold text-white truncate block">
                  {settings.upi_id}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="px-3 py-1.5 bg-[#252525] hover:bg-[#C8102E] text-white text-[11px] font-mono-editorial uppercase flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>

            <div className="text-[11px] font-mono-editorial text-[#77716D] space-y-1">
              <div>RECEIVER: {settings.upi_receiver_name}</div>
              <div>AMOUNT: ₹{booking.total_amount.toLocaleString()}</div>
            </div>
          </div>

          {/* Right: Clear 5-Step Instructions & UTR Form */}
          <div className="md:col-span-7 border-2 border-black bg-[#121212] p-8 flex flex-col justify-between shadow-[6px_6px_0px_#000000]">
            <div className="space-y-6">
              <h3 className="text-xl font-display font-black uppercase text-white">
                PAYMENT INSTRUCTIONS
              </h3>

              <div className="space-y-2.5 text-xs font-mono-editorial text-[#A59D95]">
                <div className="flex gap-3">
                  <span className="text-[#C8102E] font-bold">01.</span>
                  <span>Open your UPI application (Google Pay, PhonePe, Paytm, or BHIM).</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#C8102E] font-bold">02.</span>
                  <span>Scan the displayed QR code or copy the UPI ID above.</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#C8102E] font-bold">03.</span>
                  <span>Verify receiver: <strong>{settings.upi_receiver_name}</strong>.</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#C8102E] font-bold">04.</span>
                  <span>Complete payment of exactly <strong>₹{booking.total_amount.toLocaleString()}</strong>.</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#C8102E] font-bold">05.</span>
                  <span>Copy the 12-digit UTR reference number from your app and submit below.</span>
                </div>
              </div>

              {/* UTR Submission Form */}
              <form onSubmit={handleSubmitUtr} className="pt-4 border-t border-[#262322] space-y-4">
                <div>
                  <label className="block text-xs font-mono-editorial text-[#A59D95] uppercase mb-1">
                    12-DIGIT UTR / TRANSACTION ID <span className="text-[#C8102E]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value.replace(/\s+/g, ''))}
                    placeholder="e.g. 824719123456"
                    maxLength={16}
                    className="w-full bg-[#181818] border border-[#35302F] focus:border-[#C8102E] text-white text-sm font-mono-editorial p-3 focus:outline-none"
                  />
                  <span className="text-[10px] font-mono-editorial text-[#77716D] block mt-1">
                    Found in your UPI transaction receipt under UTR / Bank Reference.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono-editorial text-[#A59D95] uppercase mb-1">
                    REMITTER ACCOUNT NAME
                  </label>
                  <input
                    type="text"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    placeholder="Account holder name used to send payment"
                    className="w-full bg-[#181818] border border-[#35302F] focus:border-[#C8102E] text-white text-xs font-mono-editorial p-3 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-[#C8102E] hover:bg-[#E31B36] text-white text-xs font-mono-editorial font-bold uppercase tracking-wider transition-all cursor-pointer border-2 border-black shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
                  >
                    {submitting ? 'RECORDING SUBMISSION...' : 'SUBMIT UTR FOR VERIFICATION'}
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-6 text-[10px] font-mono-editorial text-[#77716D]">
              Note: Duplicate UTR detection is active. Every submission is reconciled against the official bank statement.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// PAGE 12: PAYMENT PENDING REVIEW (REAL-TIME SYNC)
// ==========================================
export const PaymentPendingPage: React.FC<{
  bookingId: string;
  onNavigate: (page: string, params?: any) => void;
}> = ({ bookingId, onNavigate }) => {
  const [booking, setBooking] = useState<Booking | undefined>(() =>
    HellrixService.getBookingById(bookingId)
  );

  // Poll for verification approval every 2 seconds
  useEffect(() => {
    const pollInterval = setInterval(() => {
      const current = HellrixService.getBookingById(bookingId);
      setBooking(current);

      if (current?.status === 'confirmed') {
        clearInterval(pollInterval);
        onNavigate('payment-success', { bookingId });
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [bookingId, onNavigate]);

  const payments = HellrixService.getPayments();
  const payment = payments.find((p) => p.booking_id === bookingId);

  return (
    <div className="min-h-[85vh] bg-[#090909] text-[#E5DED3] flex items-center justify-center p-4 py-16">
      <div className="max-w-xl w-full border-2 border-black bg-[#111111] p-8 sm:p-10 space-y-8 shadow-[8px_8px_0px_#000000]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#242120] pb-6">
          <HellrixLogo variant="full" size="md" />
          <div className="text-right">
            <span className="text-[10px] font-mono-editorial text-[#77716D] block">AUDIT STATE</span>
            <span className="text-xs font-mono-editorial font-bold text-amber-400 uppercase">
              ● VERIFICATION IN PROGRESS
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="inline-block px-3 py-1 bg-amber-400/10 border border-amber-400/40 text-amber-400 text-xs font-mono-editorial font-bold uppercase">
            YOUR PAYMENT IS UNDER REVIEW
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-black uppercase text-white leading-tight">
            TRANSACTION REFERENCE <br />
            BEING RECONCILED.
          </h2>

          <p className="text-xs font-mono-editorial text-[#A59D95] leading-relaxed">
            We have received your transaction reference. Our team will verify the payment against our banking records and update your booking. Expected processing window: within 24 hours.
          </p>
        </div>

        {/* Details Card */}
        <div className="bg-[#181818] border border-[#292524] p-5 space-y-3 text-xs font-mono-editorial">
          <div className="flex justify-between">
            <span className="text-[#77716D]">BOOKING REFERENCE:</span>
            <span className="text-white font-bold">{booking?.id || bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#77716D]">SUBMITTED UTR:</span>
            <span className="text-white font-bold">{payment?.utr_number || 'Under audit'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#77716D]">AMOUNT:</span>
            <span className="text-white font-bold">₹{booking?.total_amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#77716D]">PASS TIER:</span>
            <span className="text-white">{booking?.pass_type_name}</span>
          </div>
        </div>

        {/* Action Hub */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#242120]">
          <button
            onClick={() => onNavigate('booking-details', { bookingId })}
            className="py-3 bg-[#181818] hover:bg-[#252525] border border-[#35302F] text-white text-xs font-mono-editorial font-bold uppercase transition-colors text-center"
          >
            VIEW BOOKING
          </button>
          <button
            onClick={() => onNavigate('my-tickets')}
            className="py-3 bg-[#C8102E] hover:bg-[#E31B36] text-white text-xs font-mono-editorial font-bold uppercase transition-colors text-center"
          >
            MY TICKETS
          </button>
          <button
            onClick={() => onNavigate('support', { bookingId })}
            className="py-3 bg-[#181818] hover:bg-[#252525] border border-[#35302F] text-[#A59D95] hover:text-white text-xs font-mono-editorial font-bold uppercase transition-colors text-center"
          >
            SUPPORT
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// PAGE 13: PAYMENT SUCCESS / YOU'RE IN (TICKET & VOUCHER)
// ==========================================
export const PaymentSuccessPage: React.FC<{
  bookingId: string;
  onNavigate: (page: string, params?: any) => void;
}> = ({ bookingId, onNavigate }) => {
  const booking = HellrixService.getBookingById(bookingId);
  const tickets = HellrixService.getTickets().filter((t) => t.booking_id === bookingId);
  const primaryTicket = tickets[0];
  const vouchers = HellrixService.getVouchers().filter((v) => v.booking_id === bookingId);
  const primaryVoucher = vouchers[0];

  const [ticketQrUrl, setTicketQrUrl] = useState<string>('');
  const [voucherQrUrl, setVoucherQrUrl] = useState<string>('');

  useEffect(() => {
    // Confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C8102E', '#E5DED3', '#FFFFFF', '#790D20'],
    });

    if (primaryTicket) {
      QRCode.toDataURL(primaryTicket.security_token, {
        margin: 1,
        width: 220,
        color: { dark: '#000000', light: '#FFFFFF' },
      }).then((url) => setTicketQrUrl(url));
    }

    if (primaryVoucher) {
      QRCode.toDataURL(primaryVoucher.redemption_code, {
        margin: 1,
        width: 180,
        color: { dark: '#000000', light: '#FFFFFF' },
      }).then((url) => setVoucherQrUrl(url));
    }
  }, [primaryTicket, primaryVoucher]);

  return (
    <div className="min-h-screen bg-[#090909] text-[#E5DED3] py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Confirmed Header */}
        <div className="text-center space-y-4">
          <div className="inline-block px-3 py-1 bg-[#C8102E]/10 border border-[#C8102E] text-[#C8102E] text-xs font-mono-editorial font-bold uppercase tracking-widest">
            PAYMENT CONFIRMED & AUDITED
          </div>
          <h1 className="text-6xl sm:text-7xl font-display font-black uppercase text-white tracking-tight leading-none">
            YOU'RE <span className="text-[#C8102E]">IN.</span>
          </h1>
          <p className="text-sm font-mono-editorial text-[#A59D95]">
            YOUR HELLRIX ENTRY IS CONFIRMED. PRESENT THIS SECURE TICKET AT THE GATE.
          </p>
        </div>

        {/* Digital Collectible Ticket Card */}
        {primaryTicket ? (
          <div className="border-2 border-black bg-[#121212] shadow-[10px_10px_0px_#000000] overflow-hidden">
            {/* Header */}
            <div className="p-6 sm:p-8 border-b-2 border-black bg-[#0E0E0E] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <HellrixLogo variant="full" size="md" />
                <div className="text-xs font-mono-editorial text-[#C8102E] font-bold">
                  {primaryTicket.event_name}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] font-mono-editorial text-[#77716D] block">PASS TIER</span>
                <span className="text-xl font-display font-black text-white uppercase tracking-wider">
                  {primaryTicket.pass_name}
                </span>
                <div className="tracking-[0.2em] text-[10px] text-[#C8102E] font-mono select-none mt-1">
                  ||||| ||| |||| | |||||| ||||
                </div>
              </div>
            </div>

            {/* Ticket Information & Scannable Entry QR */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#131313]">
              <div className="md:col-span-7 space-y-4 text-xs font-mono-editorial">
                <div>
                  <span className="text-[#77716D] block">ATTENDEE NAME</span>
                  <span className="text-lg font-display text-white">{primaryTicket.customer_name}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[#77716D] block">TICKET ID</span>
                    <span className="text-white font-mono-editorial font-bold">{primaryTicket.ticket_number}</span>
                  </div>
                  <div>
                    <span className="text-[#77716D] block">GATE ADMISSION STATE</span>
                    <span className="text-emerald-400 font-bold uppercase">{primaryTicket.status}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[#77716D] block">VENUE & TIMELINE</span>
                  <span className="text-[#A59D95]">THE CONCRETE SILO · SATURDAY, 28 NOV 2026 (21:00 IST)</span>
                </div>
              </div>

              {/* Scannable Gate QR Terminal Box */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-white border border-[#35302F]">
                {ticketQrUrl ? (
                  <img
                    src={ticketQrUrl}
                    alt="Encrypted Entry QR"
                    className="w-40 h-40 object-contain"
                  />
                ) : (
                  <div className="w-40 h-40 bg-zinc-200" />
                )}
                <span className="text-[9px] font-mono-editorial text-black font-bold uppercase tracking-widest mt-2">
                  CRYPTOGRAPHIC GATE TOKEN
                </span>
              </div>
            </div>

            {/* Separate Digital Voucher Card (Distinct Redemption Code) */}
            {primaryVoucher && (
              <div className="p-6 bg-[#181818] border-t-2 border-black space-y-3 text-xs font-mono-editorial">
                <div className="flex items-center justify-between border-b border-[#2B2726] pb-2">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <span className="w-2 h-2 bg-[#C8102E]" />
                    <span>DIGITAL VOUCHER: {primaryVoucher.benefit_title}</span>
                  </div>
                  <span className="text-[#C8102E] font-bold">{primaryVoucher.id}</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[#A59D95] text-[11px] leading-relaxed max-w-md">
                    {primaryVoucher.benefit_description}
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
        ) : (
          <div className="p-8 bg-[#141414] border border-[#35302F] text-center text-xs font-mono-editorial text-[#A59D95]">
            Ticket issuance in progress.
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onNavigate('my-tickets')}
            className="px-8 py-4 bg-[#C8102E] hover:bg-[#E31B36] text-white text-xs font-mono-editorial font-bold uppercase tracking-wider transition-colors cursor-pointer border-2 border-black shadow-[4px_4px_0px_#000000]"
          >
            VIEW IN MY TICKETS
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-4 bg-[#181818] hover:bg-[#252525] border-2 border-black text-white text-xs font-mono-editorial font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-[4px_4px_0px_#000000]"
          >
            <Download className="w-4 h-4 text-[#C8102E]" />
            <span>DOWNLOAD TICKET & VOUCHER</span>
          </button>
        </div>
      </div>
    </div>
  );
};
