'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getOrganizers } from '@/lib/storage';
import { Organizer } from '@/types';
import { 
  Users, 
  MessageCircle, 
  Sparkles,
  Flame
} from 'lucide-react';
import { InstagramIcon, TwitterIcon, LinkedinIcon } from '@/components/SocialIcons';

export default function OrganizersSection() {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);

  const loadTeam = () => {
    getOrganizers().then(setOrganizers);
  };

  useEffect(() => {
    loadTeam();

    const handleUpdate = () => loadTeam();
    window.addEventListener('defreeze_organizers_updated', handleUpdate);

    // 10-second active poll interval to keep organizer profiles in live sync with Supabase
    const pollInterval = setInterval(() => {
      loadTeam();
    }, 10000);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('defreeze_organizers_updated', handleUpdate);
    };
  }, []);

  if (!organizers.length) return null;

  return (
    <section id="organizers" className="relative py-24 border-t border-cyan-500/10 bg-[#050814] overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full ice-glass border border-cyan-400/30 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>The Curators &amp; Visionaries</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Meet The Minds Behind DEFREEZE
          </h2>

          <p className="text-slate-400 text-base sm:text-lg">
            We are intentional young leaders creating the non-judgmental space, games, and environment that allows you to unfreeze and step into your potential.
          </p>
        </div>

        {/* Organizers Grid */}
        <div className={`grid grid-cols-1 ${organizers.length === 1 ? 'max-w-md mx-auto' : organizers.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
          {organizers.map((org) => {
            const cleanWhatsapp = org.whatsapp ? org.whatsapp.replace(/[^0-9]/g, '') : '';
            return (
              <div
                key={org.id}
                className="group relative p-6 sm:p-8 rounded-3xl ice-glass-glow border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-xl"
              >
                <div className="space-y-5">
                  {/* Photo & Role Tag */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-cyan-400/60 shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform flex-shrink-0 bg-slate-900">
                      <Image
                        src={org.image_url || '/images/defreeze-logo.png'}
                        alt={org.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                        Organizer
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {org.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-300 mt-0.5">
                        {org.role}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  {org.bio && (
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed italic">
                      &ldquo;{org.bio}&rdquo;
                    </p>
                  )}
                </div>

                {/* Social Links Bar */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    Connect
                  </span>

                  <div className="flex items-center gap-2.5">
                    {org.instagram && (
                      <a
                        href={org.instagram.startsWith('http') ? org.instagram : `https://instagram.com/${org.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Instagram"
                        className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/40 flex items-center justify-center transition-colors"
                      >
                        <InstagramIcon className="w-4 h-4" />
                      </a>
                    )}

                    {org.twitter && (
                      <a
                        href={org.twitter.startsWith('http') ? org.twitter : `https://x.com/${org.twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noreferrer"
                        title="X / Twitter"
                        className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/40 flex items-center justify-center transition-colors"
                      >
                        <TwitterIcon className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {org.linkedin && (
                      <a
                        href={org.linkedin.startsWith('http') ? org.linkedin : `https://linkedin.com/in/${org.linkedin}`}
                        target="_blank"
                        rel="noreferrer"
                        title="LinkedIn"
                        className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/40 flex items-center justify-center transition-colors"
                      >
                        <LinkedinIcon className="w-4 h-4" />
                      </a>
                    )}

                    {cleanWhatsapp && (
                      <a
                        href={`https://wa.me/${cleanWhatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        title="WhatsApp"
                        className="w-8 h-8 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 hover:bg-emerald-900/50 flex items-center justify-center transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
