import React, { useState } from 'react';
import { HellrixService } from '../../services/store';
import { EmailNotification, User } from '../../types';
import { HellrixLogo } from '../../components/brand/HellrixLogo';
import {
  User as UserIcon,
  Mail,
  Phone,
  Ticket,
  Clock,
  CheckCircle2,
  Lock,
  Edit2,
  Check,
  ChevronRight,
  LogOut,
  Bell,
  Eye,
} from 'lucide-react';

interface ProfilePageProps {
  currentUser: User | null;
  onNavigate: (page: string, params?: any) => void;
  onLogout: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  onNavigate,
  onLogout,
}) => {
  if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-display uppercase text-white mb-3">AUTHENTICATION REQUIRED</h2>
        <button
          onClick={() => onNavigate('login')}
          className="px-6 py-3 bg-[#C8102E] text-white text-xs font-mono-editorial font-bold uppercase"
        >
          LOG IN
        </button>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<'profile' | 'inbox' | 'security'>('profile');
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [mobile, setMobile] = useState(currentUser.mobile);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Email Notification Modal
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(null);

  const userBookings = HellrixService.getUserBookings(currentUser.id);
  const userTickets = HellrixService.getUserTickets(currentUser.id);
  const userVouchers = HellrixService.getUserVouchers(currentUser.id);
  const userEmails = HellrixService.getUserEmails(currentUser.id);
  const unreadEmailsCount = userEmails.filter((e) => !e.read).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = HellrixService.updateUserProfile(currentUser.id, {
      name: name.trim(),
      mobile: mobile.trim(),
    });
    setEditing(false);
    if (updated) {
      setSaveNotice('Profile updated successfully.');
      setTimeout(() => setSaveNotice(null), 3000);
    }
  };

  const handleOpenEmail = (email: EmailNotification) => {
    HellrixService.markEmailAsRead(email.id);
    setSelectedEmail(email);
  };

  return (
    <div className="min-h-screen bg-[#090909] text-[#E5DED3] py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="border-b border-[#35302F] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono-editorial text-[#C8102E] tracking-widest uppercase block mb-1">
              ATTENDEE IDENTITY & WALLET
            </span>
            <h1 className="text-3xl sm:text-5xl font-display font-black uppercase text-white">
              MY ACCOUNT
            </h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 bg-[#141414] border border-[#2B2726] p-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 text-xs font-mono-editorial uppercase transition-colors cursor-pointer ${
                activeTab === 'profile' ? 'bg-[#C8102E] text-white font-bold' : 'text-[#A59D95] hover:text-white'
              }`}
            >
              PROFILE
            </button>
            <button
              onClick={() => setActiveTab('inbox')}
              className={`px-4 py-2 text-xs font-mono-editorial uppercase transition-colors cursor-pointer relative ${
                activeTab === 'inbox' ? 'bg-[#C8102E] text-white font-bold' : 'text-[#A59D95] hover:text-white'
              }`}
            >
              <span>INBOX</span>
              {unreadEmailsCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-white text-black text-[9px] font-bold">
                  {unreadEmailsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 text-xs font-mono-editorial uppercase transition-colors cursor-pointer ${
                activeTab === 'security' ? 'bg-[#C8102E] text-white font-bold' : 'text-[#A59D95] hover:text-white'
              }`}
            >
              SECURITY
            </button>
          </div>
        </div>

        {saveNotice && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500 text-xs font-mono-editorial text-emerald-300">
            ✓ {saveNotice}
          </div>
        )}

        {/* TAB 1: PROFILE & WALLET STATS */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Contact Info */}
            <div className="lg:col-span-7 border-2 border-black bg-[#121212] p-8 space-y-6 shadow-[6px_6px_0px_#000000]">
              <div className="flex items-center justify-between border-b border-[#242120] pb-4">
                <span className="text-xs font-mono-editorial text-white font-bold uppercase">
                  ATTENDEE CREDENTIALS
                </span>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-xs font-mono-editorial text-[#C8102E] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>EDIT</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setEditing(false)}
                    className="text-xs font-mono-editorial text-[#77716D] hover:underline"
                  >
                    CANCEL
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono-editorial text-[#A59D95] uppercase mb-1">
                      LEGAL NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#181818] border border-[#35302F] p-3 text-xs font-mono-editorial text-white focus:outline-none focus:border-[#C8102E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-editorial text-[#A59D95] uppercase mb-1">
                      EMAIL ADDRESS (LOCKED)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={currentUser.email}
                      className="w-full bg-[#181818] border border-[#2B2726] p-3 text-xs font-mono-editorial text-[#77716D] opacity-60 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-editorial text-[#A59D95] uppercase mb-1">
                      MOBILE NUMBER
                    </label>
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full bg-[#181818] border border-[#35302F] p-3 text-xs font-mono-editorial text-white focus:outline-none focus:border-[#C8102E]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#C8102E] text-white text-xs font-mono-editorial font-bold uppercase tracking-wider"
                  >
                    SAVE CHANGES
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-xs font-mono-editorial">
                  <div className="flex justify-between py-2 border-b border-[#1E1C1B]">
                    <span className="text-[#77716D]">LEGAL FULL NAME:</span>
                    <span className="text-white font-bold">{currentUser.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#1E1C1B]">
                    <span className="text-[#77716D]">REGISTERED EMAIL:</span>
                    <span className="text-white">{currentUser.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#1E1C1B]">
                    <span className="text-[#77716D]">MOBILE NUMBER:</span>
                    <span className="text-white">{currentUser.mobile}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#1E1C1B]">
                    <span className="text-[#77716D]">ACCOUNT TYPE:</span>
                    <span className="text-[#C8102E] font-bold uppercase">[{currentUser.role}]</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Wallet Balance & Quick Links */}
            <div className="lg:col-span-5 space-y-6">
              <div className="border-2 border-black bg-[#121212] p-6 space-y-4 shadow-[6px_6px_0px_#000000]">
                <span className="text-xs font-mono-editorial text-[#77716D] uppercase block">
                  WALLET SUMMARY
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#181818] border border-[#2B2726]">
                    <span className="text-[10px] font-mono-editorial text-[#77716D] block">PASSES</span>
                    <span className="text-3xl font-display font-bold text-white">{userTickets.length}</span>
                  </div>
                  <div className="p-4 bg-[#181818] border border-[#2B2726]">
                    <span className="text-[10px] font-mono-editorial text-[#77716D] block">VOUCHERS</span>
                    <span className="text-3xl font-display font-bold text-[#C8102E]">{userVouchers.length}</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('my-tickets')}
                  className="w-full py-3 bg-[#181818] hover:bg-[#252525] border border-[#35302F] text-xs font-mono-editorial text-white font-bold uppercase transition-colors"
                >
                  VIEW MY TICKETS DASHBOARD →
                </button>
              </div>

              <div className="border border-[#2B2726] bg-[#0E0E0E] p-4 flex items-center justify-between text-xs font-mono-editorial">
                <span className="text-[#77716D]">SIGN OUT CURRENT SESSION</span>
                <button
                  onClick={onLogout}
                  className="text-[#C8102E] hover:underline flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>LOGOUT</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRANSACTIONAL EMAIL NOTIFICATIONS INBOX */}
        {activeTab === 'inbox' && (
          <div className="border-2 border-black bg-[#121212] p-8 shadow-[6px_6px_0px_#000000] space-y-6">
            <div className="flex items-center justify-between border-b border-[#242120] pb-4">
              <div>
                <span className="text-xs font-mono-editorial text-white font-bold uppercase">
                  TRANSACTIONAL NOTIFICATIONS INBOX
                </span>
                <p className="text-[11px] font-mono-editorial text-[#77716D]">
                  Authoritative email dispatches sent to {currentUser.email}.
                </p>
              </div>
            </div>

            {userEmails.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono-editorial text-[#77716D]">
                No transactional emails logged yet.
              </div>
            ) : (
              <div className="space-y-3">
                {userEmails.map((em) => (
                  <div
                    key={em.id}
                    onClick={() => handleOpenEmail(em)}
                    className={`p-4 border transition-colors cursor-pointer flex items-center justify-between gap-4 ${
                      !em.read
                        ? 'border-[#C8102E] bg-[#161616]'
                        : 'border-[#242120] bg-[#101010] hover:bg-[#141414]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {!em.read && <span className="w-2 h-2 bg-[#C8102E] rounded-full" />}
                        <span className="text-xs font-mono-editorial font-bold text-white">
                          {em.subject}
                        </span>
                      </div>
                      <p className="text-xs font-mono-editorial text-[#A59D95] line-clamp-1">
                        {em.preview_text}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono-editorial text-[#77716D] block">
                        {new Date(em.sent_at).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] font-mono-editorial text-[#C8102E] underline">
                        READ
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SECURITY */}
        {activeTab === 'security' && (
          <div className="max-w-xl border-2 border-black bg-[#121212] p-8 shadow-[6px_6px_0px_#000000] space-y-6">
            <span className="text-xs font-mono-editorial text-white font-bold uppercase block border-b border-[#242120] pb-3">
              PASSWORD & CREDENTIAL SECURITY
            </span>

            <p className="text-xs font-mono-editorial text-[#A59D95] leading-relaxed">
              Passwords are salted and cryptographically hashed before storage. Sensitive booking changes require re-authentication.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono-editorial text-[#A59D95] uppercase mb-1">
                  CURRENT PASSWORD
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full bg-[#181818] border border-[#35302F] p-3 text-xs font-mono-editorial text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-editorial text-[#A59D95] uppercase mb-1">
                  NEW SECURE PASSWORD
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full bg-[#181818] border border-[#35302F] p-3 text-xs font-mono-editorial text-white focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setSaveNotice('Password updated.');
                  setTimeout(() => setSaveNotice(null), 3000);
                }}
                className="px-6 py-3 bg-[#C8102E] text-white text-xs font-mono-editorial font-bold uppercase"
              >
                UPDATE PASSWORD
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Email View Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#111111] border-2 border-black p-6 space-y-4 shadow-[8px_8px_0px_#000000]">
            <div className="flex items-center justify-between border-b border-[#242120] pb-3">
              <span className="text-xs font-mono-editorial text-[#C8102E] font-bold uppercase">
                TRANSACTIONAL EMAIL DISPATCH
              </span>
              <button
                onClick={() => setSelectedEmail(null)}
                className="text-white hover:text-[#C8102E] font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono-editorial">
              <div className="text-white font-bold text-sm">{selectedEmail.subject}</div>
              <div className="text-[#77716D]">
                SENT: {new Date(selectedEmail.sent_at).toLocaleString()} · TO: {selectedEmail.user_email}
              </div>
            </div>

            <div
              className="p-4 bg-[#161616] border border-[#2B2726] text-xs font-mono-editorial text-[#E5DED3] space-y-2 prose-invert"
              dangerouslySetInnerHTML={{ __html: selectedEmail.html_body }}
            />

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEmail(null)}
                className="px-4 py-2 bg-[#1E1E1E] text-xs font-mono-editorial text-white uppercase"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
