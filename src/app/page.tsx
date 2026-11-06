'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ManifestoSection from '@/components/ManifestoSection';
import ExperienceSection from '@/components/ExperienceSection';
import PillarsSection from '@/components/PillarsSection';
import DetailsSection from '@/components/DetailsSection';
import ReservationSection from '@/components/ReservationSection';
import Footer from '@/components/Footer';
import SplashModal from '@/components/SplashModal';
import QuestionnaireModal from '@/components/QuestionnaireModal';
import PaymentModal from '@/components/PaymentModal';
import { QuestionnaireAnswers, Reservation } from '@/types';
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

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    gender: 'Male',
  });

  // Load spots & visit state
  const refreshSpots = async () => {
    const data = await getSpotsRemaining();
    setSpotsData(data);
  };

  useEffect(() => {
    refreshSpots();

    if (typeof window !== 'undefined') {
      const visited = sessionStorage.getItem('defreeze_visited_splash');
      if (visited === 'true') {
        setShowSplash(false);
        setHasVisited(true);
      }

      const cachedQuestions = localStorage.getItem('defreeze_questionnaire_answers');
      if (cachedQuestions) {
        try {
          setQuestionnaire(JSON.parse(cachedQuestions));
        } catch {}
      }

      // Listen for updates from other tabs or admin actions
      const handleStorageUpdate = () => {
        refreshSpots();
      };

      window.addEventListener('defreeze_reservations_updated', handleStorageUpdate);
      window.addEventListener('defreeze_bank_updated', handleStorageUpdate);

      return () => {
        window.removeEventListener('defreeze_reservations_updated', handleStorageUpdate);
        window.removeEventListener('defreeze_bank_updated', handleStorageUpdate);
      };
    }
  }, []);

  // Handlers for step flow
  const handleEnterFromSplash = () => {
    setShowSplash(false);
    sessionStorage.setItem('defreeze_visited_splash', 'true');
    // Open questionnaire overlay right after splash
    setShowQuestionnaire(true);
  };

  const handleCompleteQuestionnaire = (answers: QuestionnaireAnswers) => {
    setQuestionnaire(answers);
    setShowQuestionnaire(false);
  };

  const handleOpenPaymentModal = (userData: {
    fullName: string;
    phone: string;
    email: string;
    gender: string;
  }) => {
    setUserFormData(userData);
    setIsPaymentModalOpen(true);
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
      />

      {/* 2. Questionnaire Overlay */}
      <QuestionnaireModal
        isOpen={showQuestionnaire}
        onComplete={handleCompleteQuestionnaire}
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

        {/* Game Experience & Flyer showcases */}
        <ExperienceSection
          remainingSpots={spotsData.remaining}
          totalSpots={spotsData.total}
          onReserveClick={scrollToReserve}
        />

        {/* The 4 Pillars */}
        <PillarsSection />

        {/* Event Details & Logistics */}
        <DetailsSection />

        {/* Reservation Section with live spots countdown */}
        <ReservationSection
          remainingSpots={spotsData.remaining}
          totalSpots={spotsData.total}
          questionnaire={questionnaire}
          onOpenPaymentModal={handleOpenPaymentModal}
        />
      </main>

      {/* 5. Footer */}
      <Footer />

      {/* 6. Payment Pop-up with Editable Bank Details & Receipt Upload */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        userData={userFormData}
        questionnaire={questionnaire}
        onSuccess={() => {
          refreshSpots();
        }}
      />
    </div>
  );
}
