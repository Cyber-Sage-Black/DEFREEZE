'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ManifestoSection from '@/components/ManifestoSection';
import ExperienceSection from '@/components/ExperienceSection';
import PillarsSection from '@/components/PillarsSection';
import ReservationSection from '@/components/ReservationSection';
import Footer from '@/components/Footer';
import SplashModal from '@/components/SplashModal';
import QuestionnaireModal from '@/components/QuestionnaireModal';
import { QuestionnaireAnswers } from '@/types';
import { getSpotsRemaining } from '@/lib/storage';
import { ArrowRight, Users, Sparkles, HelpCircle } from 'lucide-react';

export default function Home() {
  // Splash & Questionnaire Flow
  const [showSplash, setShowSplash] = useState(true);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [hasVisited, setHasVisited] = useState(false);

  // User Questionnaire Answers
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireAnswers>({
    stuckArea: 'Creative Projects & Ideas',
    biggestObstacle: 'Overthinking & analysis paralysis',
    growthGoal: 'Stop waiting for the right moment and take massive intentional action with an accountability circle.',
    readinessScore: 9,
  });

  // Spots Data (Live Countdown for 25 slots)
  const [spotsData, setSpotsData] = useState({
    remaining: 25,
    total: 25,
    confirmedCount: 0,
  });

  // Load spots & visit state
  const refreshSpots = async () => {
    const data = await getSpotsRemaining();
    setSpotsData(data);
  };

  useEffect(() => {
    refreshSpots();

    if (typeof window !== 'undefined') {
      // Clear legacy suppress flag so entrance popup displays reliably for visitors
      localStorage.removeItem('defreeze_skip_popups');
      setShowSplash(true);

      const cachedQuestions = localStorage.getItem('defreeze_questionnaire_answers');
      if (cachedQuestions) {
        try {
          setQuestionnaire(JSON.parse(cachedQuestions));
        } catch {}
      }

      // 10-second active poll interval to keep spots and countdown in live sync with Supabase
      const pollInterval = setInterval(() => {
        refreshSpots();
      }, 10000);

      // Listen for updates from other tabs or admin actions
      const handleStorageUpdate = () => {
        refreshSpots();
      };

      window.addEventListener('defreeze_reservations_updated', handleStorageUpdate);
      window.addEventListener('defreeze_bank_updated', handleStorageUpdate);

      return () => {
        clearInterval(pollInterval);
        window.removeEventListener('defreeze_reservations_updated', handleStorageUpdate);
        window.removeEventListener('defreeze_bank_updated', handleStorageUpdate);
      };
    }
  }, []);

  // Handlers for step flow
  const handleEnterFromSplash = () => {
    setShowSplash(false);
    // If repeat user already filled questionnaire, bypass it
    const questionnaireDone = typeof window !== 'undefined' && localStorage.getItem('defreeze_questionnaire_completed') === 'true';
    if (questionnaireDone) {
      setShowQuestionnaire(false);
    } else {
      setShowQuestionnaire(true);
    }
  };

  const handleDirectEnter = () => {
    setShowSplash(false);
    setShowQuestionnaire(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('defreeze_questionnaire_completed', 'true');
    }
  };

  const handleSkipQuestionnaire = () => {
    setShowQuestionnaire(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('defreeze_questionnaire_completed', 'true');
    }
  };

  const handleCompleteQuestionnaire = (answers: QuestionnaireAnswers) => {
    setQuestionnaire(answers);
    setShowQuestionnaire(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('defreeze_questionnaire_completed', 'true');
    }
  };

  const scrollToReserve = () => {
    const el = document.getElementById('reserve');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050713] text-slate-100 selection:bg-cyan-400 selection:text-slate-950">
      {/* 1. Landing Splash with 3D Thawing Mind */}
      <SplashModal
        isOpen={showSplash}
        onEnter={handleEnterFromSplash}
        onDirectEnter={handleDirectEnter}
      />

      {/* 2. Questionnaire Overlay */}
      <QuestionnaireModal
        isOpen={showQuestionnaire}
        onComplete={handleCompleteQuestionnaire}
        onSkip={handleSkipQuestionnaire}
      />

      {/* 3. Navigation Bar */}
      <Navbar
        remainingSpots={spotsData.remaining}
        totalSpots={spotsData.total}
        onReserveClick={scrollToReserve}
      />

      {/* 4. Main Site Content */}
      <main>
        {/* Hero with continuous 3D interactive crystal character */}
        <HeroSection
          remainingSpots={spotsData.remaining}
          totalSpots={spotsData.total}
          onReserveClick={scrollToReserve}
        />

        {/* Narrative & Story from user brief */}
        <ManifestoSection />

        {/* Claim Your Spot At DEFREEZE (Strictly 25 Slots • Live Capacity Tracking) - Positioned immediately after Manifesto */}
        <ReservationSection
          remainingSpots={spotsData.remaining}
          totalSpots={spotsData.total}
          questionnaire={questionnaire}
        />

        {/* Conversation Experience & Flyer showcases */}
        <ExperienceSection
          remainingSpots={spotsData.remaining}
          totalSpots={spotsData.total}
          onReserveClick={scrollToReserve}
        />

        {/* The 4 Pillars */}
        <PillarsSection />

        {/* Dedicated Link Banner to More Info & Curators */}
        <section className="py-16 bg-gradient-to-b from-[#050814] to-[#040610] border-t border-cyan-500/15">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="p-8 sm:p-10 rounded-3xl ice-glass-glow border border-cyan-500/30 text-center space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/15 transition-all" />
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ice-glass border border-cyan-400/40 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Deep Dive Into DEFREEZE</span>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
                  Meet The Curators &amp; View Full Event Logistics
                </h3>
                <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                  Discover the visionary leaders behind DEFREEZE, check detailed event timings, venue disclosures, and review our full attendee FAQ.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/info"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Users className="w-4 h-4 text-slate-950" />
                  <span>View Curators, Logistics &amp; FAQs</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </Link>

                <button
                  type="button"
                  onClick={scrollToReserve}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <span>Claim Your Spot (25 Max)</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}
