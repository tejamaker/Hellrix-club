import React, { useState } from 'react';
import { PassType, User } from '../../types';
import { HellrixService } from '../../services/store';
import { ShieldCheck, ArrowRight, Users, Check, AlertCircle } from 'lucide-react';
import { SectionHeading, ParallaxCard, AnimatedTicker } from '../../components/common/AnimationSuite';
import { ScrollReveal } from '../../components/common/UIComponents';

interface PassesPageProps {
  passTypes: PassType[];
  currentUser: User | null;
  onNavigate: (page: string, params?: any) => void;
}

export const PassesPage: React.FC<PassesPageProps> = ({ passTypes, currentUser, onNavigate }) => {
  const [selectedPassId, setSelectedPassId] = useState<string>(passTypes[1]?.id || passTypes[0]?.id);
  const [quantity, setQuantity] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedPass = passTypes.find((p) => p.id === selectedPassId) || passTypes[0];
  const selectedInventory = HellrixService.getPassInventory(selectedPass.id);

  const handleSelectPass = (passId: string) => {
    setSelectedPassId(passId);
    setQuantity(1);
    setErrorMsg(null);
  };

  const handleProceed = () => {
    if (!currentUser) {
      onNavigate('login', { redirect: 'checkout', passId: selectedPass.id, quantity });
      return;
    }

    if (selectedInventory.availableCount < quantity) {
      setErrorMsg(`Only ${selectedInventory.availableCount} passes remaining.`);
      return;
    }

    // Create 10-Minute Reservation
    const result = HellrixService.createReservation({
      passTypeId: selectedPass.id,
      quantity,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      customerMobile: currentUser.mobile,
      userId: currentUser.id,
    });

    if (result.success && result.booking) {
      onNavigate('checkout', { bookingId: result.booking.id });
    } else {
      setErrorMsg(result.error || 'Failed to reserve passes. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#090909] text-[#E5DED3] py-16 animate-pop-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Heading */}
        <SectionHeading
          tag="ADMISSION COLLECTION // VERIFIED INVENTORY"
          title="SELECT PASS CATEGORY"
          subtitle="All passes feature real-time capacity validation and a 10-minute authoritative hold window upon checkout initiation."
        />

        {errorMsg && (
          <div className="mb-8 p-4 bg-[#C8102E]/10 border border-[#C8102E] text-xs font-mono-editorial text-white flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-[#C8102E] shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 3 Pass Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {passTypes.map((pass) => {
            const isSelected = pass.id === selectedPassId;
            const inventory = HellrixService.getPassInventory(pass.id);
            const isSoldOut = inventory.availableCount <= 0;
            const isVip = pass.id === 'pass_vip';
            const isGroup = pass.id === 'pass_group';

            return (
              <div
                key={pass.id}
                onClick={() => !isSoldOut && handleSelectPass(pass.id)}
                className={`relative bg-[#111111] border transition-all cursor-pointer flex flex-col justify-between p-8 ${
                  isSelected
                    ? 'border-[#C8102E] shadow-[0_0_30px_rgba(200,16,46,0.2)] bg-[#141414]'
                    : isSoldOut
                    ? 'border-[#242120] opacity-50 cursor-not-allowed'
                    : 'border-[#35302F] hover:border-[#77716D]'
                }`}
              >
                {/* Badge */}
                {isVip && (
                  <div className="absolute -top-3 right-6 bg-[#C8102E] text-white px-3 py-0.5 text-[10px] font-mono-editorial font-bold uppercase tracking-widest">
                    MOST EXCLUSIVE
                  </div>
                )}
                {isGroup && (
                  <div className="absolute -top-3 right-6 bg-[#181818] border border-[#35302F] text-[#A59D95] px-3 py-0.5 text-[10px] font-mono-editorial font-bold uppercase tracking-widest">
                    4-PERSON BUNDLE
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono-editorial text-[#C8102E] font-bold">
                      {pass.tag}
                    </span>
                    <span className="text-[11px] font-mono-editorial text-[#A59D95]">
                      {isSoldOut ? 'SOLD OUT' : `${inventory.availableCount} AVAILABLE`}
                    </span>
                  </div>

                  <h3 className="text-3xl font-display font-black uppercase text-white mb-3">
                    {pass.name}
                  </h3>

                  <div className="mb-6 pb-6 border-b border-[#242120]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-display font-bold text-white">
                        ₹{pass.price.toLocaleString()}
                      </span>
                      <span className="text-xs font-mono-editorial text-[#77716D]">
                        / {pass.group_size > 1 ? 'bundle' : 'pass'}
                      </span>
                    </div>
                    {pass.group_size > 1 && (
                      <span className="text-xs font-mono-editorial text-[#A59D95] block mt-1">
                        Effective ₹{Math.round(pass.price / pass.group_size)} per person
                      </span>
                    )}
                  </div>

                  {/* Perks List */}
                  <ul className="space-y-3 mb-8 text-xs font-mono-editorial text-[#A59D95]">
                    {pass.perks.map((perk, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-3.5 h-3.5 text-[#C8102E] shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#242120]">
                  <div
                    className={`w-full py-3 text-center text-xs font-mono-editorial font-bold uppercase tracking-wider transition-colors ${
                      isSelected
                        ? 'bg-[#C8102E] text-white'
                        : isSoldOut
                        ? 'bg-[#181818] text-[#77716D]'
                        : 'bg-[#181818] text-[#E5DED3] hover:bg-[#222222]'
                    }`}
                  >
                    {isSoldOut ? 'SOLD OUT' : isSelected ? 'SELECTED' : 'CHOOSE TIER'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Tier Action Box */}
        <div className="bg-[#121212] border border-[#35302F] p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 space-y-1">
              <span className="text-[11px] font-mono-editorial text-[#77716D] uppercase">
                SELECTED TIER
              </span>
              <div className="text-2xl font-display font-black uppercase text-white">
                {selectedPass.name}
              </div>
              <div className="text-xs font-mono-editorial text-[#A59D95]">
                ₹{selectedPass.price.toLocaleString()} · {selectedInventory.availableCount} passes remaining
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="md:col-span-4 flex items-center gap-4">
              <span className="text-xs font-mono-editorial text-[#A59D95] shrink-0">QUANTITY:</span>
              <div className="flex items-center border border-[#35302F] bg-[#0A0A0A]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-white hover:bg-[#181818] text-sm font-mono-editorial cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-mono-editorial font-bold text-white min-w-10 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(selectedInventory.availableCount, quantity + 1))}
                  className="px-4 py-2 text-white hover:bg-[#181818] text-sm font-mono-editorial cursor-pointer"
                  disabled={quantity >= selectedInventory.availableCount}
                >
                  +
                </button>
              </div>
              <span className="text-xs font-mono-editorial text-[#E5DED3]">
                TOTAL: <strong className="text-white text-base font-display">₹{(selectedPass.price * quantity).toLocaleString()}</strong>
              </span>
            </div>

            {/* CTA Button */}
            <div className="md:col-span-4 flex justify-end">
              <button
                onClick={handleProceed}
                disabled={selectedInventory.availableCount <= 0}
                className="w-full sm:w-auto px-8 py-4 bg-[#C8102E] hover:bg-[#E31B36] disabled:bg-[#333333] text-white text-xs font-mono-editorial font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(200,16,46,0.3)]"
              >
                <span>RESERVE & PROCEED (10 MIN HOLD)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
