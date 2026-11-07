'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import OrganizersSection from '@/components/OrganizersSection';
import DetailsSection from '@/components/DetailsSection';
import Footer from '@/components/Footer';
import { getSpotsRemaining } from '@/lib/storage';
import { Sparkles, ArrowRight, ArrowLeft, ShieldCheck, Calendar, Users, MapPin } from 'lucide-react';

export default function InfoPage() {
  const [spotsData, setSpotsData] = useState({
    remaining: 25,
    total: 25,
    confirmedCount: 0,
  });

  const refreshSpots = async () => {
    const data = await getSpotsRemaining();
    setSpotsData(data);
  };

  useEffect(() => {
    refreshSpots();
    const interval = setInterval(refreshSpots, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050713] text-slate-100 selection:bg-cyan-400 selection:text-slate-950 flex flex-col justify-between">
      {/* Navigation */}
      <Navbar
        remainingSpots={spotsData.remaining}
        totalSpots={spotsData.total}
        onReserveClick={() => {
          window.location.href = '/#reserve';
        }}
      />

      <main className="flex-1">
        {/* Page Hero Header */}
        <div className="relative pt-32 pb-16 border-b border-cyan-500/10 bg-[#070b18] overflow-hidden text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ice-glass border border-cyan-400/40 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full Event Guide &amp; Curators</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase">
              Everything You Need To Know
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Explore the logistics, understand the vision, and meet the curators designing this transformative 25-capacity physical experience.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" /> November 2026
              </span>
              <span className="flex items-center gap-1.5 text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Private Curated Lagos Venue
              </span>
              <span className="flex items-center gap-1.5 text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <Users className="w-3.5 h-3.5 text-cyan-400" /> Strictly 25 Cohort Limit
              </span>
            </div>
          </div>
        </div>

        {/* 1. Organizers & Curators Team */}
        <OrganizersSection />

        {/* 2. Event Logistics & FAQ Breakdown */}
        <DetailsSection />

        {/* Bottom CTA to return to Registration */}
        <section className="py-20 bg-gradient-to-b from-[#060914] to-[#040711] border-t border-cyan-500/10 text-center">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
              Capacity Status: {spotsData.remaining} of {spotsData.total} spots remaining
            </span>

            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
              Ready To Stop Waiting &amp; Thaw Your Freeze?
            </h3>

            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Don&apos;t watch from the sidelines. Secure your pass before the 25 attendee cap is locked.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#reserve"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-cyan-500/25 active:scale-95 cursor-pointer"
              >
                <span>Claim Your Spot At DEFREEZE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back To Main Page</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
