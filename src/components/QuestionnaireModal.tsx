'use client';

import React, { useState } from 'react';
import { QuestionnaireAnswers } from '@/types';
import { Compass, CheckCircle2, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface QuestionnaireModalProps {
  isOpen: boolean;
  onComplete: (answers: QuestionnaireAnswers) => void;
}

export default function QuestionnaireModal({ isOpen, onComplete }: QuestionnaireModalProps) {
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    stuckArea: 'Creative Projects & Ideas',
    biggestObstacle: 'Overthinking & analysis paralysis',
    growthGoal: '',
    readinessScore: 8,
  });

  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('defreeze_questionnaire_answers', JSON.stringify(answers));
    }
    onComplete(answers);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040711]/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl ice-glass-glow rounded-3xl p-6 md:p-8 text-white shadow-2xl border border-cyan-500/30">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-bold tracking-widest text-cyan-400 uppercase">
                Mindset Check-In
              </span>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
                Understanding Where You Are
              </h2>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700">
            Step {step} of 2
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 ? (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Question 1 */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
                  <span>1. What area of your life feels most &apos;frozen&apos; or stuck?</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Career & Purpose',
                    'Creative Projects & Ideas',
                    'Personal Growth & Habits',
                    'Confidence & Relationships',
                    'Taking the First Bold Step',
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setAnswers({ ...answers, stuckArea: opt })}
                      className={`text-left px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all border ${
                        answers.stuckArea === opt
                          ? 'bg-cyan-500/25 border-cyan-400 text-white font-semibold shadow-sm shadow-cyan-500/20'
                          : 'bg-slate-900/40 border-slate-700/60 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  2. What has been holding you back the most?
                </label>
                <div className="space-y-2">
                  {[
                    'Overthinking & analysis paralysis',
                    'Fear of failure or being judged',
                    'Comparing my progress to everyone else',
                    'Simply not knowing where or how to begin',
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setAnswers({ ...answers, biggestObstacle: opt })}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all border flex items-center justify-between ${
                        answers.biggestObstacle === opt
                          ? 'bg-blue-600/30 border-blue-400 text-cyan-200 font-semibold'
                          : 'bg-slate-900/40 border-slate-700/60 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <span>{opt}</span>
                      {answers.biggestObstacle === opt && (
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-cyan-500/20"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Question 3 */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  3. What are you hoping to experience or break free into at DEFREEZE?
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Stop hesitating, connect with genuine people who hold me accountable, and rediscover my spark..."
                  value={answers.growthGoal}
                  onChange={(e) => setAnswers({ ...answers, growthGoal: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              {/* Question 4 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-200">
                    4. How ready are you to step out of your comfort zone?
                  </label>
                  <span className="text-cyan-400 font-mono font-bold text-base">
                    {answers.readinessScore} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={answers.readinessScore}
                  onChange={(e) => setAnswers({ ...answers, readinessScore: parseInt(e.target.value) })}
                  className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                  <span>Hesitant (1)</span>
                  <span>Ready to thaw (5)</span>
                  <span>Fully committed (10)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-300">
                  Your answers help our team tailor the game mechanics and accountability pairing during the event.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  ← Back to Step 1
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-sm tracking-wide uppercase transition-all shadow-lg shadow-cyan-500/25"
                >
                  <span>Enter The Experience</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
