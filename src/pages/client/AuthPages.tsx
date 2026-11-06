import React, { useState } from 'react';
import { HellrixLogo } from '../../components/brand/HellrixLogo';
import { User } from '../../types';
import { HellrixService } from '../../services/store';
import { Eye, EyeOff, Lock, Mail, User as UserIcon, Phone, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onNavigate: (page: string, params?: any) => void;
  redirectParams?: any;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigate, redirectParams }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const allUsers = HellrixService.getUsers();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const found = allUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (found) {
        HellrixService.setActiveUser(found);
        onLoginSuccess(found);
        if (redirectParams?.redirect === 'checkout') {
          // If redirected to checkout with a selected pass
          const result = HellrixService.createReservation({
            passTypeId: redirectParams.passId,
            quantity: redirectParams.quantity || 1,
            customerName: found.name,
            customerEmail: found.email,
            customerMobile: found.mobile,
            userId: found.id,
          });
          if (result.success && result.booking) {
            onNavigate('checkout', { bookingId: result.booking.id });
            return;
          }
        }
        onNavigate('my-tickets');
      } else {
        setError('No account found with this email. Please check your credentials or register below.');
        setLoading(false);
      }
    }, 400);
  };

  const handleQuickSelect = (u: User) => {
    setEmail(u.email);
    setPassword('Hellrix@2026');
  };

  return (
    <div className="min-h-[85vh] bg-[#090909] text-[#E5DED3] flex items-center justify-center p-4 py-12">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 border border-[#35302F] bg-[#111111]">
        {/* Left Side: Brand & Visual */}
        <div className="md:col-span-5 p-8 border-b md:border-b-0 md:border-r border-[#35302F] bg-[#0C0C0C] flex flex-col justify-between">
          <div className="space-y-6">
            <HellrixLogo variant="full" size="md" />
            <h2 className="text-3xl font-display font-black uppercase text-white leading-tight">
              ACCOUNT <br />
              <span className="text-[#C8102E]">AUTHENTICATION</span>
            </h2>
            <p className="text-xs font-mono-editorial text-[#A59D95] leading-relaxed">
              Access your verified bookings, encrypted digital passes, and payment status.
            </p>
          </div>

          {/* Quick Demo Switcher */}
          <div className="pt-8 border-t border-[#262322] space-y-3">
            <span className="text-[10px] font-mono-editorial text-[#77716D] uppercase tracking-wider block">
              1-CLICK TEST LOGIN PROFILES:
            </span>
            <div className="space-y-1.5">
              {allUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickSelect(u)}
                  className="w-full text-left p-2 bg-[#141414] hover:bg-[#1C1C1C] border border-[#242120] text-xs font-mono-editorial flex items-center justify-between transition-colors"
                >
                  <span className="text-white">{u.name}</span>
                  <span
                    className={`text-[10px] uppercase font-bold ${
                      u.role === 'owner' ? 'text-[#C8102E]' : u.role !== 'customer' ? 'text-amber-400' : 'text-zinc-400'
                    }`}
                  >
                    [{u.role}]
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:col-span-7 p-8 flex flex-col justify-center">
          <h3 className="text-xl font-display font-black uppercase text-white mb-6">
            ENTER CREDENTIALS
          </h3>

          {error && (
            <div className="mb-6 p-3 bg-[#C8102E]/10 border border-[#C8102E] text-xs font-mono-editorial text-white">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-mono-editorial text-[#A59D95] uppercase mb-1.5">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-[#181818] border border-[#35302F] focus:border-[#C8102E] text-white text-xs font-mono-editorial p-3 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono-editorial text-[#A59D95] uppercase">
                  PASSWORD
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-[11px] font-mono-editorial text-[#77716D] hover:text-[#C8102E] transition-colors"
                >
                  FORGOT PASSWORD?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#181818] border border-[#35302F] focus:border-[#C8102E] text-white text-xs font-mono-editorial p-3 pr-10 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#77716D] hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#C8102E] hover:bg-[#E31B36] text-white text-xs font-mono-editorial font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(200,16,46,0.25)]"
            >
              {loading ? 'AUTHENTICATING...' : 'SIGN IN TO HELLRIX'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#262322] flex items-center justify-between text-xs font-mono-editorial">
            <span className="text-[#77716D]">DON'T HAVE AN ACCOUNT?</span>
            <button
              onClick={() => onNavigate('register')}
              className="text-[#C8102E] hover:underline font-bold"
            >
              REGISTER HERE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC<{
  onRegisterSuccess: (user: User) => void;
  onNavigate: (page: string) => void;
}> = ({ onRegisterSuccess, onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!termsAccepted) {
      setError('You must accept the HELLRIX attendance and entry policies.');
      return;
    }

    const newUser = HellrixService.registerUser({
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
    });

    onRegisterSuccess(newUser);
    onNavigate('my-tickets');
  };

  return (
    <div className="min-h-[85vh] bg-[#090909] text-[#E5DED3] flex items-center justify-center p-4 py-12">
      <div className="max-w-2xl w-full border border-[#35302F] bg-[#111111] p-8 sm:p-10">
        <div className="mb-8">
          <HellrixLogo variant="full" size="md" className="mb-4" />
          <h2 className="text-3xl font-display font-black uppercase text-white">
            REGISTER ATTENDEE ACCOUNT
          </h2>
          <p className="text-xs font-mono-editorial text-[#A59D95]">
            Government ID matching these details will be checked at gate terminal.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-[#C8102E]/10 border border-[#C8102E] text-xs font-mono-editorial text-white">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-mono-editorial text-[#A59D95] uppercase mb-1">
              LEGAL FULL NAME (AS ON GOVT ID)
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vikramaditya Sen"
              className="w-full bg-[#181818] border border-[#35302F] focus:border-[#C8102E] text-white text-xs font-mono-editorial p-3 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono-editorial text-[#A59D95] uppercase mb-1">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-[#181818] border border-[#35302F] focus:border-[#C8102E] text-white text-xs font-mono-editorial p-3 focus:outline-none"
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
                placeholder="+91 98765 43210"
                className="w-full bg-[#181818] border border-[#35302F] focus:border-[#C8102E] text-white text-xs font-mono-editorial p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono-editorial text-[#A59D95] uppercase mb-1">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#181818] border border-[#35302F] focus:border-[#C8102E] text-white text-xs font-mono-editorial p-3 pr-10 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#77716D]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono-editorial text-[#A59D95] uppercase mb-1">
                CONFIRM PASSWORD
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#181818] border border-[#35302F] focus:border-[#C8102E] text-white text-xs font-mono-editorial p-3 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 accent-[#C8102E]"
              />
              <span className="text-xs font-mono-editorial text-[#A59D95] leading-normal">
                I confirm I am 21 years of age or older, agree to the HELLRIX entry code of conduct, and acknowledge that entry requires physical photo identification.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#C8102E] hover:bg-[#E31B36] text-white text-xs font-mono-editorial font-bold uppercase tracking-wider transition-all cursor-pointer mt-4"
          >
            CREATE HELLRIX ACCOUNT
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#262322] flex items-center justify-between text-xs font-mono-editorial">
          <span className="text-[#77716D]">ALREADY REGISTERED?</span>
          <button
            onClick={() => onNavigate('login')}
            className="text-[#C8102E] hover:underline font-bold"
          >
            LOG IN
          </button>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] bg-[#090909] text-[#E5DED3] flex items-center justify-center p-4">
      <div className="max-w-md w-full border border-[#35302F] bg-[#111111] p-8">
        <HellrixLogo variant="full" size="md" className="mb-6" />
        <h2 className="text-2xl font-display font-black uppercase text-white mb-2">
          PASSWORD RECOVERY
        </h2>
        <p className="text-xs font-mono-editorial text-[#A59D95] mb-6">
          Enter your registered email address to receive password reset instructions.
        </p>

        {submitted ? (
          <div className="p-4 bg-[#181818] border border-[#35302F] space-y-3">
            <div className="text-xs font-mono-editorial text-emerald-400 font-bold">
              ✓ INSTRUCTIONS DISPATCHED
            </div>
            <p className="text-xs font-mono-editorial text-[#A59D95]">
              If an account is associated with <strong className="text-white">{email}</strong>, recovery instructions have been sent.
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="mt-2 text-xs font-mono-editorial text-[#C8102E] underline block"
            >
              RETURN TO LOGIN
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono-editorial text-[#A59D95] uppercase mb-1">
                REGISTERED EMAIL
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-[#181818] border border-[#35302F] focus:border-[#C8102E] text-white text-xs font-mono-editorial p-3 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#C8102E] hover:bg-[#E31B36] text-white text-xs font-mono-editorial font-bold uppercase tracking-wider transition-colors"
            >
              SEND RECOVERY LINK
            </button>

            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full py-2 text-center text-xs font-mono-editorial text-[#77716D] hover:text-white"
            >
              BACK TO LOGIN
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
