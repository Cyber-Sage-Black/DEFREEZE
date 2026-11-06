'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Sparkles, ShieldCheck, Flame, ArrowRight, UserCheck } from 'lucide-react';
import { QuestionnaireAnswers } from '@/types';

interface ReservationSectionProps {
  remainingSpots: number;
  totalSpots: number;
  questionnaire: QuestionnaireAnswers;
  onOpenPaymentModal?: (userData: {
    fullName: string;
    phone: string;
    email: string;
    gender: string;
  }) => void;
}

export default function ReservationSection({
  remainingSpots,
  totalSpots,
  questionnaire,
  onOpenPaymentModal,
}: ReservationSectionProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('Male');

  const percentClaimed = Math.round(((totalSpots - remainingSpots) / totalSpots) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email || !gender) {
      alert('Please fill in all fields to reserve your spot.');
      return;
    }
    const payload = { fullName, phone, email, gender };
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('defreeze_pending_reservation', JSON.stringify(payload));
    }
    if (onOpenPaymentModal) {
      onOpenPaymentModal(payload);
    }
    router.push('/pay');
  };

  return (
    <section id="reserve" className="relative py-24 border-t border-cyan-500/10 bg-[#050711] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[180px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Countdown Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ice-glass border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Strictly 25 Slots • Live Capacity Tracking</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Claim Your Spot At DEFREEZE
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto">
            Ready to break free? Secure your entry now. Once 25 payments are confirmed, reservations close automatically.
          </p>

          {/* Interactive Countdown Meter */}
          <div className="max-w-md mx-auto p-5 rounded-2xl ice-glass-glow border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Available Spots</span>
                <span className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono">
                  {remainingSpots}
                  <span className="text-xs text-slate-400 font-normal"> / {totalSpots} Remaining</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Confirmed Rate</span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {percentClaimed}% Full
                </span>
              </div>
            </div>

            {/* Meter Bar */}
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-cyan-500/30 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 rounded-full transition-all duration-700 shadow-sm shadow-cyan-400"
                style={{ width: `${percentClaimed}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400 italic">
              {remainingSpots <= 5 ? (
                <span className="text-amber-400 font-semibold">⚠️ Hurry! Less than 5 spots left!</span>
              ) : (
                'Live countdown automatically updates as the team confirms verified payments.'
              )}
            </p>
          </div>
        </div>

        {/* Reservation Form Card */}
        <div className="ice-glass-glow rounded-3xl p-6 sm:p-10 border border-cyan-500/30 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Full Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oluwaseun Adeleke"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. seun@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Phone Number (WhatsApp) <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +234 801 234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Gender <span className="text-cyan-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Male', 'Female', 'Prefer not to say'].map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setGender(g)}
                      className={`py-3 px-2 rounded-xl text-xs font-semibold transition-all border text-center ${
                        gender === g
                          ? 'bg-cyan-500/25 border-cyan-400 text-white shadow-sm shadow-cyan-500/20'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mindset Check Status preview */}
            {questionnaire && (
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Mindset check-in linked: &ldquo;{questionnaire.stuckArea}&rdquo;</span>
                </span>
                <span className="text-cyan-400 font-mono font-semibold">
                  Readiness {questionnaire.readinessScore}/10
                </span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={remainingSpots <= 0}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-3 ${
                  remainingSpots > 0
                    ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-xl shadow-cyan-500/25 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                {remainingSpots > 0 ? (
                  <>
                    <UserCheck className="w-5 h-5 text-slate-950" />
                    <span>Reserve My Spot &amp; Proceed to Transfer</span>
                    <ArrowRight className="w-5 h-5 text-slate-950" />
                  </>
                ) : (
                  <span>All 25 Spots Filled</span>
                )}
              </button>
            </div>

            <div className="text-center text-[11px] text-slate-400 space-y-1">
              <p>🔒 Next step: View official copiable bank account details &amp; upload receipt.</p>
              <p className="text-cyan-400/80 italic">&ldquo;Come as you are, leave a little lighter.&rdquo;</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
