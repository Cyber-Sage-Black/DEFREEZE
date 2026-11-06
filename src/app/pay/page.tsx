'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { BankDetails, QuestionnaireAnswers, Reservation } from '@/types';
import { getBankSettings, createReservation } from '@/lib/storage';
import { 
  Copy, 
  Check, 
  UploadCloud, 
  CheckCircle, 
  Sparkles, 
  ShieldAlert, 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Edit3, 
  CreditCard,
  FileCheck
} from 'lucide-react';

export default function PaymentPage() {
  const router = useRouter();

  // Step state: 1 = Bank Transfer, 2 = Upload Receipt, 3 = Confirmation
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Bank Details
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // User details from reservation form
  const [userData, setUserData] = useState({
    fullName: '',
    phone: '',
    email: '',
    gender: 'Male',
  });
  const [isEditingUser, setIsEditingUser] = useState(false);

  const [questionnaire, setQuestionnaire] = useState<QuestionnaireAnswers>({
    stuckArea: 'Creative Projects & Ideas',
    biggestObstacle: 'Overthinking & analysis paralysis',
    growthGoal: 'Break free into massive action with my circle',
    readinessScore: 9,
  });

  // Receipt state
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReservation, setSubmittedReservation] = useState<Reservation | null>(null);

  // Load user data & bank settings on mount
  useEffect(() => {
    getBankSettings().then(setBankDetails);

    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('defreeze_pending_reservation');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUserData(parsed);
        } catch {}
      }

      const storedQuestions = localStorage.getItem('defreeze_questionnaire_answers');
      if (storedQuestions) {
        try {
          setQuestionnaire(JSON.parse(storedQuestions));
        } catch {}
      }
    }
  }, []);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmPayment = async () => {
    if (!receiptPreview) {
      alert('Please upload a screenshot or photo of your payment receipt before confirming.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createReservation({
        full_name: userData.fullName || 'Attendee',
        email: userData.email || 'attendee@example.com',
        phone: userData.phone || 'N/A',
        gender: userData.gender || 'Not specified',
        questionnaire,
        receipt_url: receiptPreview,
      });

      setSubmittedReservation(res);
      setCurrentStep(3);

      try {
        confetti({
          particleCount: 130,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#60a5fa', '#93c5fd', '#ffffff'],
        });
      } catch {}
    } catch (err) {
      console.error('Error submitting payment:', err);
      alert('Unable to submit reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040713] text-slate-100 flex flex-col justify-between selection:bg-cyan-400 selection:text-slate-950">
      {/* Top Navigation */}
      <header className="border-b border-cyan-500/20 ice-glass px-4 sm:px-8 py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 relative rounded-full overflow-hidden border-2 border-cyan-400/60 shadow-md shadow-cyan-500/20">
              <Image src="/images/defreeze-logo.png" alt="DEFREEZE Logo" fill className="object-cover" />
            </div>
            <span className="text-xl font-black text-white uppercase tracking-tight">
              DE<span className="text-cyan-400 ice-glow-text">FREEZE</span>
            </span>
          </Link>

          <Link
            href="/#reserve"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Event Page</span>
          </Link>
        </div>
      </header>

      {/* Main Payment Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto mb-3 text-xs font-mono">
            <span className={`flex items-center gap-1.5 ${currentStep >= 1 ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 1 ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-800'}`}>1</span>
              <span>Bank Details</span>
            </span>
            <div className={`h-0.5 flex-1 mx-3 ${currentStep >= 2 ? 'bg-cyan-400' : 'bg-slate-800'}`} />
            <span className={`flex items-center gap-1.5 ${currentStep >= 2 ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 2 ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-800'}`}>2</span>
              <span>Upload Proof</span>
            </span>
            <div className={`h-0.5 flex-1 mx-3 ${currentStep >= 3 ? 'bg-cyan-400' : 'bg-slate-800'}`} />
            <span className={`flex items-center gap-1.5 ${currentStep >= 3 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 3 ? 'bg-emerald-400 text-slate-950 font-black' : 'bg-slate-800'}`}>3</span>
              <span>Confirmation</span>
            </span>
          </div>
        </div>

        {/* Card Wrapper */}
        <div className="ice-glass-glow rounded-3xl p-6 sm:p-10 border border-cyan-500/30 shadow-2xl space-y-6">
          {/* Attendee Info Bar */}
          {currentStep !== 3 && (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Reserving Spot For:</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingUser(!isEditingUser)}
                  className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] flex items-center gap-1 underline"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isEditingUser ? 'Close Editing' : 'Edit Info'}</span>
                </button>
              </div>

              {!isEditingUser ? (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm">
                  <span className="font-bold text-white">{userData.fullName || 'Attendee Name'}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-300">{userData.email || 'Email not entered'}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-300">{userData.phone || 'Phone not entered'}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-cyan-300 font-mono">{userData.gender}</span>
                </div>
              ) : (
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={userData.fullName}
                    onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                    className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      sessionStorage.setItem('defreeze_pending_reservation', JSON.stringify(userData));
                      setIsEditingUser(false);
                    }}
                    className="px-3 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 1: BANK DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                  Official DEFREEZE Account
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  Complete Your Spot Payment
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Make the exact transfer to the verified account details below. Both account number and amount have 1-click copy buttons.
                </p>
              </div>

              {bankDetails ? (
                <div className="space-y-3.5 bg-slate-900/80 rounded-2xl p-5 sm:p-6 border border-cyan-500/25">
                  {/* Bank Name */}
                  <div className="flex items-center justify-between py-2 border-b border-slate-800">
                    <span className="text-xs text-slate-400 font-medium">Bank Name</span>
                    <span className="text-sm font-bold text-white">{bankDetails.bank_name}</span>
                  </div>

                  {/* Account Number (Copiable) */}
                  <div className="flex items-center justify-between py-2 border-b border-slate-800">
                    <div>
                      <span className="block text-xs text-slate-400 font-medium">Account Number</span>
                      <span className="text-xl sm:text-2xl font-mono font-black text-cyan-300 tracking-wider">
                        {bankDetails.account_number}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankDetails.account_number, 'account_number')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-400/40 transition-all cursor-pointer"
                    >
                      {copiedField === 'account_number' ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Account</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Account Name */}
                  <div className="flex items-center justify-between py-2 border-b border-slate-800">
                    <span className="text-xs text-slate-400 font-medium">Account Name</span>
                    <span className="text-sm font-semibold text-slate-200">{bankDetails.account_name}</span>
                  </div>

                  {/* Amount (Copiable) */}
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <span className="block text-xs text-slate-400 font-medium">Reservation Fee</span>
                      <span className="text-2xl font-black text-emerald-400 tracking-tight font-mono">
                        {bankDetails.amount}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankDetails.amount, 'amount')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-400/40 transition-all cursor-pointer"
                    >
                      {copiedField === 'amount' ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Amount</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 text-sm animate-pulse">
                  Loading verified bank information...
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/40 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-300 leading-relaxed">
                  Use your name (<strong className="text-cyan-300">{userData.fullName || 'your name'}</strong>) as payment reference/narration for instant verification.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Link
                  href="/#reserve"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-xl ice-glass text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Back to Event Page</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
                >
                  <span>I Have Sent The Money</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: UPLOAD RECEIPT */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                  Proof of Transfer
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  Upload Payment Receipt
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Upload a clear screenshot or photo of your payment receipt (.jpg, .jpeg, or .png).
                </p>
              </div>

              {/* Upload Box */}
              <label className="block border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-3xl p-6 sm:p-10 text-center cursor-pointer bg-slate-900/60 hover:bg-slate-900/90 transition-all">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {receiptPreview ? (
                  <div className="space-y-4">
                    <div className="relative max-h-56 rounded-2xl overflow-hidden border border-cyan-500/50 inline-block shadow-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={receiptPreview}
                        alt="Receipt Preview"
                        className="max-h-56 object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-cyan-300 font-medium">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Receipt ready: {receiptFile?.name}</span>
                    </div>
                    <span className="block text-xs text-slate-400 underline">Click to choose a different image</span>
                  </div>
                ) : (
                  <div className="space-y-3 py-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-400/40">
                      <UploadCloud className="w-8 h-8 animate-bounce" />
                    </div>
                    <div>
                      <span className="text-base font-bold text-white block">
                        Click to select or drop JPG receipt here
                      </span>
                      <span className="text-xs text-slate-400 block mt-1">
                        Supports JPG, JPEG, PNG (max 5MB)
                      </span>
                    </div>
                  </div>
                )}
              </label>

              {/* Navigation Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* WORKING BACK BUTTON: GOES BACK TO STEP 1 */}
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-xl ice-glass text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Back to Account Details</span>
                </button>

                <button
                  type="button"
                  disabled={!receiptPreview || isSubmitting}
                  onClick={handleConfirmPayment}
                  className={`w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${
                    receiptPreview && !isSubmitting
                      ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 shadow-xl shadow-emerald-500/25 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  {isSubmitting ? (
                    <span>Submitting Proof...</span>
                  ) : (
                    <>
                      <span>Confirm Payment</span>
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CELEBRATION & FINAL CONFIRMATION */}
          {currentStep === 3 && (
            <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center shadow-xl shadow-cyan-500/30">
                <Sparkles className="w-12 h-12 text-slate-950 animate-pulse" />
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider border border-emerald-400/30">
                  Reservation Request Received
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
                  You&apos;re One Step Away From Becoming.
                </h2>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-slate-200 text-sm leading-relaxed space-y-3 max-w-lg mx-auto">
                <p>
                  The DEFREEZE team will verify your payment, and a confirmation email will be sent to you as soon as payment has been confirmed.
                </p>
                <p className="font-semibold text-cyan-300">
                  Confirmation sent to: <span className="underline">{userData.email || 'your email'}</span>
                </p>
                <div className="pt-3 border-t border-slate-800 text-xs italic text-slate-400">
                  &ldquo;Come as you are, leave a little lighter.&rdquo;
                </div>
              </div>

              <div className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 uppercase">
                See you at DEFREEZE.
              </div>

              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all border border-slate-600 shadow-md"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Homepage</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        DEFREEZE Initiative • 25 Spots Capped • November 2026
      </footer>
    </div>
  );
}
