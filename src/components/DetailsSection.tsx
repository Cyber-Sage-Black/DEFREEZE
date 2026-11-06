'use client';

import React from 'react';
import { Calendar, MapPin, Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DetailsSection() {
  const faqs = [
    {
      q: "Do I need to have my life figured out to attend?",
      a: "Absolutely not! You don't need to be the most confident person in the room. You just need to be willing to question where you are, take responsibility for where you're going, and do the work required to get there.",
    },
    {
      q: "Why are there only 25 spots?",
      a: "To preserve deep intimacy and psychological safety. In a crowd of 100, you can hide in the corner. In a tight group of 25, every voice is heard, every connection is meaningful, and real accountability thrives.",
    },
    {
      q: "What kind of games are we playing?",
      a: "Expect dynamic, highly engaging physical games, team dilemmas, and playful challenges designed to test decision making, reveal behavioral patterns, and spark laughs and breakthroughs.",
    },
    {
      q: "Where is the venue?",
      a: "A private, curated space in Lagos selected specifically to provide an inspiring, non-judgmental environment. The exact address is sent via email alongside your event pass once your payment is confirmed.",
    },
  ];

  return (
    <section id="details" className="relative py-24 border-t border-cyan-500/10 bg-[#060914]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full ice-glass border border-cyan-400/30 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Event Logistics &amp; Essentials</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Everything You Need To Know
          </h2>

          <p className="text-slate-400 text-base sm:text-lg">
            Mark your calendar. Prepare your mindset. One afternoon can change your trajectory.
          </p>
        </div>

        {/* 4 Cards Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="p-6 rounded-2xl ice-glass border border-cyan-500/20 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono uppercase text-slate-400 block">Date</span>
            <h4 className="text-lg font-bold text-white">November 2026</h4>
            <p className="text-xs text-slate-400">Exclusive weekend session</p>
          </div>

          <div className="p-6 rounded-2xl ice-glass border border-cyan-500/20 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono uppercase text-slate-400 block">Duration</span>
            <h4 className="text-lg font-bold text-white">1:00 PM – 6:00 PM</h4>
            <p className="text-xs text-slate-400">Immersive 5-hour experience</p>
          </div>

          <div className="p-6 rounded-2xl ice-glass border border-cyan-500/20 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono uppercase text-slate-400 block">Location</span>
            <h4 className="text-lg font-bold text-white">Curated Lagos Venue</h4>
            <p className="text-xs text-slate-400">Disclosed upon confirmation</p>
          </div>

          <div className="p-6 rounded-2xl ice-glass border border-cyan-500/20 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-mono uppercase text-slate-400 block">Cohort Size</span>
            <h4 className="text-lg font-bold text-white">25 Participants</h4>
            <p className="text-xs text-slate-400">Zero overflow allowed</p>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto space-y-4">
          <h3 className="text-xl font-bold text-white text-center mb-6 uppercase tracking-wider">
            Frequently Asked Questions
          </h3>
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl ice-glass border border-cyan-500/20 space-y-2"
            >
              <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
