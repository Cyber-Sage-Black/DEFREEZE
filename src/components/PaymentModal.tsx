'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { BankDetails, QuestionnaireAnswers, Reservation } from '@/types';
import { getBankSettings, createReservation } from '@/lib/storage';
import { 
  Copy, 
  Check, 
  UploadCloud, 
  Image as ImageIcon, 
  CheckCircle, 
  X, 
  Sparkles, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    fullName: string;
    phone: string;
    email: string;
    gender: string;
  };
  questionnaire: QuestionnaireAnswers;
  onSuccess: (reservation: Reservation) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  userData,
  questionnaire,
  onSuccess,
}: PaymentModalProps) {
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [step, setStep] = useState<'bank_info' | 'upload_receipt' | 'success'>('bank_info');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdReservation, setCreatedReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    if (isOpen) {
      getBankSettings().then(setBankDetails);
      setStep('bank_info');
      setReceiptFile(null);
      setReceiptPreview('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
      alert('Please upload a picture of your payment receipt before confirming.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newReservation = await createReservation({
        full_name: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        gender: userData.gender,
        questionnaire,
        receipt_url: receiptPreview,
      });

      setCreatedReservation(newReservation);
      setStep('success');

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#60a5fa', '#93c5fd', '#ffffff'],
        });
      } catch {}

      onSuccess(newReservation);
    } catch (err) {
      console.error('Error confirming reservation:', err);
      alert('Something went wrong submitting your reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030612]/92 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg ice-glass-glow rounded-3xl p-6 md:p-8 text-white border border-cyan-500/30 shadow-2xl">
        {/* Close Button */}
        {step !== 'success' && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* STEP 1: BANK DETAILS */}
        {step === 'bank_info' && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-semibold tracking-wider uppercase border border-cyan-400/30">
                Step 1 of 2 • Secure Payment
              </span>
              <h3 className="text-2xl font-black tracking-tight text-white">
                Official Account Details
              </h3>
              <p className="text-xs text-slate-400">
                Transfer the exact reservation amount below to lock in your spot.
              </p>
            </div>

            {bankDetails ? (
              <div className="space-y-3.5 bg-slate-900/60 rounded-2xl p-5 border border-cyan-500/20">
                {/* Bank Name */}
                <div className="flex items-center justify-between py-2 border-b border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">Bank Name</span>
                  <span className="text-sm font-bold text-white">{bankDetails.bank_name}</span>
                </div>

                {/* Account Number (Copiable) */}
                <div className="flex items-center justify-between py-2 border-b border-slate-800">
                  <div>
                    <span className="block text-xs text-slate-400 font-medium">Account Number</span>
                    <span className="text-lg font-mono font-black text-cyan-300 tracking-wider">
                      {bankDetails.account_number}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(bankDetails.account_number, 'account_number')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold border border-cyan-400/30 transition-all"
                  >
                    {copiedField === 'account_number' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
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
                    <span className="block text-xs text-slate-400 font-medium">Amount to Transfer</span>
                    <span className="text-xl font-black text-emerald-400 tracking-tight">
                      {bankDetails.amount}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(bankDetails.amount, 'amount')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-400/30 transition-all"
                  >
                    {copiedField === 'amount' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Amount</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-sm animate-pulse">
                Loading official payment details...
              </div>
            )}

            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Please include your name (<strong className="text-cyan-300">{userData.fullName}</strong>) as payment reference/narration for instant verification.
              </p>
            </div>

            <button
              onClick={() => setStep('upload_receipt')}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-sm tracking-wide uppercase transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
            >
              <span>I Have Sent The Money</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: UPLOAD RECEIPT */}
        {step === 'upload_receipt' && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-semibold tracking-wider uppercase border border-cyan-400/30">
                Step 2 of 2 • Upload Proof
              </span>
              <h3 className="text-2xl font-black tracking-tight text-white">
                Upload Payment Receipt
              </h3>
              <p className="text-xs text-slate-400">
                Upload a clear screenshot or photo of your transfer receipt (.jpg, .jpeg, or .png).
              </p>
            </div>

            {/* Upload Area */}
            <label className="block border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-2xl p-6 text-center cursor-pointer bg-slate-900/50 hover:bg-slate-900/80 transition-all">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />

              {receiptPreview ? (
                <div className="space-y-3">
                  <div className="relative max-h-48 rounded-xl overflow-hidden border border-cyan-500/40 inline-block shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={receiptPreview}
                      alt="Receipt preview"
                      className="max-h-48 object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-cyan-300 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Receipt selected: {receiptFile?.name}</span>
                  </div>
                  <span className="block text-[11px] text-slate-400 underline">Click to change picture</span>
                </div>
              ) : (
                <div className="space-y-3 py-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-400/30">
                    <UploadCloud className="w-7 h-7 animate-bounce" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">
                      Click to browse or drop JPG receipt here
                    </span>
                    <span className="text-xs text-slate-400 block mt-1">
                      Supports JPG, JPEG, PNG (max 5MB)
                    </span>
                  </div>
                </div>
              )}
            </label>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep('bank_info')}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                ← Back to Account Details
              </button>

              <button
                type="button"
                disabled={!receiptPreview || isSubmitting}
                onClick={handleConfirmPayment}
                className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-black text-sm uppercase tracking-wide transition-all ${
                  receiptPreview && !isSubmitting
                    ? 'bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/25 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                {isSubmitting ? (
                  <span>Transmitting Proof...</span>
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

        {/* STEP 3: FINAL SUCCESS POP-UP */}
        {step === 'success' && (
          <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Sparkles className="w-10 h-10 text-slate-950 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider border border-emerald-400/30">
                Reservation Request Received
              </span>
              <h3 className="text-3xl font-black text-white tracking-tight">
                You&apos;re One Step Away From Becoming.
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-slate-200 text-sm leading-relaxed space-y-3">
              <p>
                The DEFREEZE team has received your details and transfer receipt. Our curators will review and verify your payment shortly.
              </p>
              <p className="font-semibold text-cyan-300">
                A confirmation email with secret venue details and event pass will be sent to{' '}
                <span className="underline">{userData.email}</span> as soon as payment is confirmed.
              </p>
              <div className="pt-2 border-t border-slate-800 text-xs italic text-slate-400">
                &ldquo;Come as you are, leave a little lighter.&rdquo;
              </div>
            </div>

            <div className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 uppercase">
              See you at DEFREEZE.
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all border border-slate-600"
            >
              Back to Experience
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
