'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Snowflake, Shield, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-cyan-500/15 bg-[#03050c] py-16 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Manifesto Quote */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 relative rounded-full overflow-hidden border border-cyan-400/50 shadow-md shadow-cyan-500/20">
                <Image src="/images/defreeze-logo.png" alt="DEFREEZE Logo" fill className="object-cover" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter uppercase">
                DE<span className="text-cyan-400 ice-glow-text">FREEZE</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              An initiative for young people who want to break free from fears, expectations, limiting beliefs, and habits that keep them stuck.
            </p>

            <p className="text-xs text-cyan-300 font-mono italic">
              Break free. Become.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#about" className="hover:text-cyan-400 transition-colors">
                  The Manifesto
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-cyan-400 transition-colors">
                  Game Experience
                </a>
              </li>
              <li>
                <a href="#pillars" className="hover:text-cyan-400 transition-colors">
                  Four Pillars
                </a>
              </li>
              <li>
                <a href="#reserve" className="hover:text-cyan-400 transition-colors">
                  Reserve Spot (25 Cap)
                </a>
              </li>
            </ul>
          </div>

          {/* Organizer / Admin */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest">
              Event Management
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated physical experience. November 2026. Lagos, Nigeria.
            </p>
            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Review Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 DEFREEZE Initiative. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-slate-400">
            <span>&ldquo;Come as you are, leave a little lighter.&rdquo;</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
