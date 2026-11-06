import React, { useState } from 'react';
import { HellrixService } from '../../services/store';
import { User } from '../../types';
import { ChevronDown, ChevronUp, Mail, Phone, MessageSquare, ShieldCheck, Check } from 'lucide-react';

export const SupportPage: React.FC<{
  currentUser: User | null;
  prefillBookingId?: string;
  prefillCategory?:
    | 'payment_verification'
    | 'utr_problem'
    | 'booking_problem'
    | 'ticket_not_received'
    | 'qr_scanning_issue'
    | 'general_enquiry';
}> = ({ currentUser, prefillBookingId = '', prefillCategory = 'payment_verification' }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [bookingId, setBookingId] = useState(prefillBookingId);
  const [category, setCategory] = useState<
    | 'payment_verification'
    | 'utr_problem'
    | 'booking_problem'
    | 'ticket_not_received'
    | 'qr_scanning_issue'
    | 'general_enquiry'
  >(prefillCategory);
  const [subject, setSubject] = useState(prefillBookingId ? `Inquiry regarding booking #${prefillBookingId}` : '');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const settings = HellrixService.getSettings();

  const faqs = [
    {
      q: 'How long does UPI / UTR payment verification take?',
      a: 'UTR submissions are verified directly against our banking records within 24 hours (or within 2 hours during event day). Once confirmed by operations, your scannable digital ticket is automatically generated in "My Tickets".',
    },
    {
      q: 'What if I typed the wrong UTR number during checkout?',
      a: 'Submit a ticket below with your Booking ID and correct 12-digit UTR transaction reference from your banking app. Our desk will update the record.',
    },
    {
      q: 'What are the physical gate admission requirements?',
      a: 'Entry is strictly restricted to attendees aged 21 and above. A physical government-issued photo ID (Aadhaar, Passport, or Driver License) matching the attendee name on the ticket must be presented alongside the digital QR code.',
    },
    {
      q: 'Can passes be refunded or transferred?',
      a: 'Due to strictly capped capacity (250 attendees), all ticket confirmations are final and non-refundable. If an unverified booking expires, the hold is released automatically.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    HellrixService.createSupportTicket({
      name,
      email,
      booking_id: bookingId.trim() || undefined,
      category,
      subject,
      message,
      user_id: currentUser?.id,
    });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#090909] text-[#E5DED3] py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-[#35302F] pb-8">
          <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase block mb-2">
            HELP & VERIFICATION DESK
          </span>
          <h1 className="text-4xl sm:text-6xl font-display font-black uppercase text-white tracking-tight">
            SUPPORT & FAQ
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: FAQ Accordion */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xl font-display font-black uppercase text-white mb-6">
              FREQUENTLY ASKED QUESTIONS
            </h2>

            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-[#2D2827] bg-[#111111] transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-xs font-mono-editorial text-white font-bold cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-[#C8102E] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#77716D] shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 text-xs font-mono-editorial text-[#A59D95] leading-relaxed border-t border-[#1F1C1C]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}

            {/* Direct Contact Cards */}
            <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-[#35302F] bg-[#111111] p-5">
                <span className="text-[10px] font-mono-editorial text-[#77716D] uppercase block">
                  DESK EMAIL
                </span>
                <span className="text-xs font-mono-editorial font-bold text-white block mt-1">
                  {settings.support_email}
                </span>
              </div>
              <div className="border border-[#35302F] bg-[#111111] p-5">
                <span className="text-[10px] font-mono-editorial text-[#77716D] uppercase block">
                  OPERATIONS PHONE
                </span>
                <span className="text-xs font-mono-editorial font-bold text-white block mt-1">
                  {settings.support_phone}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Support Form */}
          <div className="lg:col-span-5 border border-[#35302F] bg-[#121212] p-8">
            <h3 className="text-xl font-display font-black uppercase text-white mb-2">
              DISPATCH INQUIRY
            </h3>
            <p className="text-xs font-mono-editorial text-[#A59D95] mb-6">
              Our live verification operations team responds promptly to all transaction inquiries.
            </p>

            {submitted ? (
              <div className="p-6 bg-[#181818] border border-emerald-500/40 text-center space-y-3">
                <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                <div className="text-sm font-mono-editorial text-white font-bold">
                  TICKET RECORDED
                </div>
                <p className="text-xs font-mono-editorial text-[#A59D95]">
                  Your inquiry has been assigned to the operations team queue. You will receive an email update.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 bg-[#252525] text-xs font-mono-editorial text-white uppercase"
                >
                  SUBMIT ANOTHER
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono-editorial text-[#A59D95] uppercase mb-1">
                    NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#181818] border border-[#35302F] focus:border-[#C8102E] text-white text-xs font-mono-editorial p-3 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-editorial text-[#A59D95] uppercase mb-1">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#181818] border border-[#35302F] focus:border-[#C8102E] text-white text-xs font-mono-editorial p-3 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-editorial text-[#A59D95] uppercase mb-1">
                    BOOKING ID (IF APPLICABLE)
                  </label>
                  <input
                    type="text"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    placeholder="e.g. HRX-10482"
                    className="w-full bg-[#181818] border border-[#35302F] focus:border-[#C8102E] text-white text-xs font-mono-editorial p-3 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-editorial text-[#A59D95] uppercase mb-1">
                    CATEGORY
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#181818] border border-[#35302F] focus:border-[#C8102E] text-white text-xs font-mono-editorial p-3 focus:outline-none"
                  >
                    <option value="payment_verification">Payment Verification</option>
                    <option value="utr_problem">UTR Submission Problem</option>
                    <option value="booking_problem">Booking Hold / Reservation Issue</option>
                    <option value="ticket_not_received">Ticket Not Received</option>
                    <option value="qr_scanning_issue">QR Scanning / Gate Admission Issue</option>
                    <option value="general_enquiry">General Event Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-editorial text-[#A59D95] uppercase mb-1">
                    SUBJECT
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief description"
                    className="w-full bg-[#181818] border border-[#35302F] focus:border-[#C8102E] text-white text-xs font-mono-editorial p-3 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-editorial text-[#A59D95] uppercase mb-1">
                    MESSAGE / UTR DETAILS
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide relevant details..."
                    className="w-full bg-[#181818] border border-[#35302F] focus:border-[#C8102E] text-white text-xs font-mono-editorial p-3 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#C8102E] hover:bg-[#E31B36] text-white text-xs font-mono-editorial font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  DISPATCH TO OPERATIONS
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const PoliciesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#090909] text-[#E5DED3] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="border-b border-[#35302F] pb-8">
          <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase block mb-2">
            LEGAL, ADMISSION & SECURITY PROTOCOLS
          </span>
          <h1 className="text-4xl sm:text-6xl font-display font-black uppercase text-white tracking-tight">
            POLICIES & GOVERNANCE
          </h1>
        </div>

        {/* Policy 1: Entry & Age */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase text-white border-b border-[#242120] pb-2">
            01 // EVENT ENTRY & AGE RESTRICTION
          </h2>
          <div className="text-xs font-mono-editorial text-[#A59D95] space-y-3 leading-relaxed">
            <p>
              1.1 All attendees must be 21 years of age or older on the date of the event (November 28, 2026).
            </p>
            <p>
              1.2 Physical Government-issued photo identification (Aadhaar Card, Passport, Voter ID, or Driver’s License) is mandatory. Digital photocopies or student IDs will not be accepted at the gate.
            </p>
            <p>
              1.3 The gate terminal scans cryptographic QR tokens. Once a ticket status transitions to "used", re-entry is strictly prohibited.
            </p>
          </div>
        </section>

        {/* Policy 2: Refund & UTR */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase text-white border-b border-[#242120] pb-2">
            02 // UTR SUBMISSION & REFUND POLICY
          </h2>
          <div className="text-xs font-mono-editorial text-[#A59D95] space-y-3 leading-relaxed">
            <p>
              2.1 HELLRIX employs direct UPI transfer with manual or automated bank UTR reconciliation. A submitted UTR does not constitute admission until approved by the audit team.
            </p>
            <p>
              2.2 All confirmed ticket purchases are final. No refunds or ticket cancellations are issued once confirmed, except in the event of total cancellation by organizers.
            </p>
            <p>
              2.3 If a payment cannot be matched with bank ledger within 48 hours, the booking is marked rejected and the customer will be contacted for manual refund.
            </p>
          </div>
        </section>

        {/* Policy 3: Conduct & Recording */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase text-white border-b border-[#242120] pb-2">
            03 // CODE OF CONDUCT & FLASH RESTRICTION
          </h2>
          <div className="text-xs font-mono-editorial text-[#A59D95] space-y-3 leading-relaxed">
            <p>
              3.1 HELLRIX enforces a zero-tolerance policy against any form of harassment, discrimination, or non-consensual behavior. Violators will be removed immediately without refund.
            </p>
            <p>
              3.2 No commercial cameras, tripods, or flash photography are permitted inside the warehouse. We preserve the visual purity and underground immersion of the performance.
            </p>
          </div>
        </section>

        {/* Policy 4: Privacy & Data */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display font-black uppercase text-white border-b border-[#242120] pb-2">
            04 // PRIVACY & ESSENTIAL COOKIES
          </h2>
          <div className="text-xs font-mono-editorial text-[#A59D95] space-y-3 leading-relaxed">
            <p>
              4.1 HELLRIX collects only essential attendee verification data (legal name, phone number, email address) solely for gate admission and ticket distribution.
            </p>
            <p>
              4.2 Attendee data is never sold or shared with third-party advertising brokers.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
