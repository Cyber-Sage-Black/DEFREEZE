'use client';

import React from 'react';
import { Sparkles, MessageSquare, Trophy, ShieldCheck, Flame, Compass } from 'lucide-react';

export default function PillarsSection() {
  const pillars = [
    {
      title: 'Shared Experiences',
      desc: 'Real growth happens shoulder-to-shoulder. Step away from digital screens and dive into physical activities that build genuine camaraderie.',
      icon: Trophy,
      color: 'from-cyan-400 to-blue-500',
    },
    {
      title: 'Honest Conversations',
      desc: 'Drop the facade. A safe, structured environment where you can speak frankly about fears, self-doubt, career transitions, and unspoken aspirations.',
      icon: MessageSquare,
      color: 'from-blue-400 to-indigo-500',
    },
    {
      title: 'Engaging Activities',
      desc: 'Gamified exercises tailored to spark psychological breakthroughs, lateral problem-solving, and emotional unfreezing.',
      icon: Sparkles,
      color: 'from-sky-400 to-cyan-500',
    },
    {
      title: 'Unbreakable Accountability',
      desc: 'Potential without follow-through stays frozen. We pair you with peers who care enough about your future to keep you true to your commitments.',
      icon: ShieldCheck,
      color: 'from-indigo-400 to-purple-500',
    },
  ];

  return (
    <section id="pillars" className="relative py-24 border-t border-cyan-500/10 bg-[#050813]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full ice-glass border border-cyan-400/30 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>The Four Pillars of Thawing</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Built For Real Transformation
          </h2>

          <p className="text-slate-400 text-base sm:text-lg">
            DEFREEZE isn&apos;t a lecture or a motivational seminar. It is a live laboratory where you test your boundaries and expand your worldview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, index) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="group relative p-6 rounded-2xl ice-glass border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} p-0.5 mb-5 shadow-lg shadow-cyan-500/20`}>
                    <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-300">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                    Pillar 0{index + 1}
                  </span>

                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                    {p.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-xs text-cyan-300 font-semibold group-hover:text-cyan-200">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Transformative Pillar</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
