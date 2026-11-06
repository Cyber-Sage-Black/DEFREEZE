'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ManifestoSection from '@/components/ManifestoSection';
import ExperienceSection from '@/components/ExperienceSection';
import PillarsSection from '@/components/PillarsSection';
import OrganizersSection from '@/components/OrganizersSection';
import DetailsSection from '@/components/DetailsSection';
import ReservationSection from '@/components/ReservationSection';
import Footer from '@/components/Footer';
import SplashModal from '@/components/SplashModal';
import QuestionnaireModal from '@/components/QuestionnaireModal';
import { QuestionnaireAnswers } from '@/types';
import { getSpotsRemaining } from '@/lib/storage';

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
      const urlParams = new URLSearchParams(window.location.search);
      const forceIntro = urlParams.get('intro') === '1';

      // Check if repeat user has elected to skip the entrance popups
      const skipPopups = localStorage.getItem('defreeze_skip_popups') === 'true';
      if (skipPopups && !forceIntro) {
        setShowSplash(false);
        setShowQuestionnaire(false);
      }

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
      localStorage.setItem('defreeze_skip_popups', 'true');
      localStorage.setItem('defreeze_questionnaire_completed', 'true');
    }
  };

  const handleSkipQuestionnaire = () => {
    setShowQuestionnaire(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('defreeze_questionnaire_completed', 'true');
      localStorage.setItem('defreeze_skip_popups', 'true');
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

        {/* Conversation Experience & Flyer showcases */}
        <ExperienceSection
          remainingSpots={spotsData.remaining}
          totalSpots={spotsData.total}
          onReserveClick={scrollToReserve}
        />

        {/* The 4 Pillars */}
        <PillarsSection />

        {/* The Organizers & Team */}
        <OrganizersSection />

        {/* Event Details & Logistics */}
        <DetailsSection />

        {/* Reservation Section with live spots countdown */}
        <ReservationSection
          remainingSpots={spotsData.remaining}
          totalSpots={spotsData.total}
          questionnaire={questionnaire}
        />
      </main>

      {/* 5. Footer */}
      <Footer />
    </div>
  );
}
