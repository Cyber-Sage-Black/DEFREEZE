'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  getBankSettings, 
  updateBankSettings, 
  getReservations, 
  confirmReservationPayment, 
  getSpotsRemaining 
} from '@/lib/storage';
import { BankDetails, Reservation } from '@/types';
import { 
  ShieldCheck, 
  Lock, 
  Save, 
  CheckCircle, 
  Eye, 
  X, 
  Users, 
  DollarSign, 
  Clock, 
  Download, 
  Search, 
  ArrowLeft,
  Snowflake,
  ExternalLink,
  MessageCircle,
  AlertTriangle
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Admin Data State
  const [bankSettings, setBankSettings] = useState<BankDetails>({
    bank_name: '',
    account_number: '',
    account_name: '',
    amount: '',
    total_spots: 25,
  });
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [spotsData, setSpotsData] = useState({ remaining: 25, total: 25, confirmedCount: 0 });
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<Reservation | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Check existing session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('defreeze_admin_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Fetch data
  const loadData = async () => {
    const [settings, resList, spots] = await Promise.all([
      getBankSettings(),
      getReservations(),
      getSpotsRemaining(),
    ]);
    setBankSettings(settings);
    setReservations(resList);
    setSpotsData(spots);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctCode = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || 'defreeze2026';
    if (passcode.trim() === correctCode) {
      setIsAuthenticated(true);
      sessionStorage.setItem('defreeze_admin_auth', 'true');
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect admin passcode. Please try again.');
    }
  };

  const handleSaveBankSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBankSettings(bankSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    const spots = await getSpotsRemaining();
    setSpotsData(spots);
  };

  const handleConfirmPayment = async (id: string, name: string) => {
    if (confirm(`Confirm payment for ${name}? This will count towards the 25 attendee limit.`)) {
      await confirmReservationPayment(id);
      await loadData();
    }
  };

  const exportCSV = () => {
    if (!reservations.length) return;
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Gender', 'Status', 'Stuck Area', 'Readiness', 'Created At'];
    const rows = reservations.map((r) => [
      r.id,
      `"${r.full_name}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      r.gender,
      r.status,
      `"${r.questionnaire?.stuckArea || ''}"`,
      r.questionnaire?.readinessScore || '',
      r.created_at,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `defreeze-attendees-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter reservations
  const filteredReservations = reservations.filter((r) => {
    const matchesFilter = filter === 'all' ? true : r.status === filter;
    const matchesSearch = 
      r.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#030612] text-white">
        <div className="w-full max-w-md ice-glass-glow rounded-3xl p-8 border border-cyan-500/30 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-400/40 shadow-lg shadow-cyan-500/20">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">
              DEFREEZE Admin Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Enter authorized administrator passcode to manage reservations &amp; bank accounts.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin Passcode (default: defreeze2026)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-center text-sm focus:outline-none focus:border-cyan-400 transition-colors"
            />

            {errorMsg && (
              <p className="text-xs text-red-400 font-semibold">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 hover:scale-[1.01]"
            >
              Unlock Dashboard
            </button>
          </form>

          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to DEFREEZE website</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040713] text-slate-200 pb-20">
      {/* Top Header */}
      <header className="border-b border-cyan-500/20 ice-glass sticky top-0 z-30 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative rounded-full overflow-hidden border-2 border-cyan-400/60 shadow-lg shadow-cyan-500/20">
              <Image src="/images/defreeze-logo.png" alt="DEFREEZE Logo" fill className="object-cover" />
            </div>
            <div>
              <span className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                DEFREEZE <span className="text-xs text-cyan-400 font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">Admin Control</span>
              </span>
              <p className="text-[11px] text-slate-400">Review receipts, manage bank details &amp; track 25-spot countdown</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-cyan-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Website</span>
            </Link>
            <button
              onClick={() => {
                sessionStorage.removeItem('defreeze_admin_auth');
                setIsAuthenticated(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-800/40 text-xs text-red-300 hover:bg-red-900/50 transition-colors"
            >
              Lock / Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl ice-glass border border-cyan-500/20 space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-400" />
              Remaining Spots
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-cyan-300 font-mono">{spotsData.remaining}</span>
              <span className="text-xs text-slate-400">of {spotsData.total} Total</span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400"
                style={{ width: `${((spotsData.total - spotsData.remaining) / spotsData.total) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl ice-glass border border-cyan-500/20 space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Confirmed Attendees
            </span>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              {spotsData.confirmedCount}
            </div>
            <span className="text-[11px] text-slate-400">Payment verified &amp; approved</span>
          </div>

          <div className="p-5 rounded-2xl ice-glass border border-cyan-500/20 space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              Pending Payment Review
            </span>
            <div className="text-3xl font-black text-amber-400 font-mono">
              {reservations.filter((r) => r.status === 'pending').length}
            </div>
            <span className="text-[11px] text-slate-400">Awaiting receipt verification</span>
          </div>

          <div className="p-5 rounded-2xl ice-glass border border-cyan-500/20 space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-cyan-400" />
              Configured Ticket Price
            </span>
            <div className="text-2xl font-black text-white font-mono">
              {bankSettings.amount || '₦15,000'}
            </div>
            <span className="text-[11px] text-slate-400">Editable below in realtime</span>
          </div>
        </div>

        {/* SECTION: EDITABLE BANK DETAILS */}
        <section className="p-6 sm:p-8 rounded-3xl ice-glass-glow border border-cyan-500/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                Live Checkout Configuration
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Bank Details &amp; Spot Limit Manager
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Changes saved here reflect immediately on the user-facing payment pop-up.
              </p>
            </div>

            {saveSuccess && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/40 animate-pulse">
                <CheckCircle className="w-4 h-4" />
                <span>Bank Details Updated Successfully!</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSaveBankSettings} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Bank Name
              </label>
              <input
                type="text"
                required
                value={bankSettings.bank_name}
                onChange={(e) => setBankSettings({ ...bankSettings, bank_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Account Number
              </label>
              <input
                type="text"
                required
                value={bankSettings.account_number}
                onChange={(e) => setBankSettings({ ...bankSettings, account_number: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Account Name
              </label>
              <input
                type="text"
                required
                value={bankSettings.account_name}
                onChange={(e) => setBankSettings({ ...bankSettings, account_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Amount (Copiable)
              </label>
              <input
                type="text"
                required
                value={bankSettings.amount}
                onChange={(e) => setBankSettings({ ...bankSettings, amount: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-300 font-mono text-xs focus:outline-none focus:border-cyan-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Capacity Capped At
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={bankSettings.total_spots}
                  onChange={(e) => setBankSettings({ ...bankSettings, total_spots: parseInt(e.target.value) || 25 })}
                  className="w-24 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 font-bold text-center"
                />
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* SECTION: RESERVATIONS REVIEW TABLE */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Attendee Reservations &amp; Receipts
              </h2>
              <p className="text-xs text-slate-400">
                Click &quot;Payment Confirmed&quot; on verified submissions to decrement the 25-spot countdown.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Filter tabs */}
              <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'all' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}
                >
                  All ({reservations.length})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400'}`}
                >
                  Pending ({reservations.filter((r) => r.status === 'pending').length})
                </button>
                <button
                  onClick={() => setFilter('confirmed')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400'}`}
                >
                  Confirmed ({reservations.filter((r) => r.status === 'confirmed').length})
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search attendee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-44"
                />
              </div>

              {/* Export */}
              <button
                onClick={exportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="ice-glass rounded-3xl border border-cyan-500/20 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Attendee</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Gender</th>
                    <th className="py-3.5 px-4">Mindset Check-in</th>
                    <th className="py-3.5 px-4">Receipt Proof</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-500">
                        No reservations found matching current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((res) => (
                      <tr key={res.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-4 px-4 font-semibold text-white">
                          <div className="flex flex-col">
                            <span>{res.full_name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {res.created_at ? res.created_at.slice(0, 10) : ''}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-slate-300">{res.email}</span>
                            <a
                              href={`https://wa.me/${res.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:underline"
                            >
                              <MessageCircle className="w-3 h-3 text-emerald-400" />
                              <span>{res.phone}</span>
                            </a>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-slate-300">{res.gender}</td>

                        <td className="py-4 px-4">
                          {res.questionnaire ? (
                            <button
                              onClick={() => setSelectedQuestionnaire(res)}
                              className="text-left group"
                            >
                              <span className="block text-cyan-300 group-hover:underline font-medium">
                                {res.questionnaire.stuckArea || 'View Answers'}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                Readiness: {res.questionnaire.readinessScore || 'N/A'}/10 • Click for details
                              </span>
                            </button>
                          ) : (
                            <span className="text-slate-500 italic">None</span>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          {res.receipt_url ? (
                            <button
                              onClick={() => setSelectedReceipt(res.receipt_url)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Receipt</span>
                            </button>
                          ) : (
                            <span className="text-slate-500 italic">No receipt</span>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          {res.status === 'confirmed' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 text-[11px]">
                              <CheckCircle className="w-3 h-3" />
                              <span>Confirmed</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 text-[11px]">
                              <Clock className="w-3 h-3" />
                              <span>Pending Review</span>
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4 text-right">
                          {res.status !== 'confirmed' ? (
                            <button
                              onClick={() => handleConfirmPayment(res.id, res.full_name)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Payment Confirmed</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-mono">Spot Allocated</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL: FULL RESOLUTION RECEIPT VIEWER */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-2xl max-h-[90vh] bg-slate-950 p-4 rounded-3xl border border-cyan-500/30 overflow-hidden flex flex-col items-center">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-white mb-3">Payment Receipt Proof</h3>
            <div className="overflow-auto max-h-[75vh] rounded-xl border border-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedReceipt}
                alt="Receipt Full Preview"
                className="max-w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: QUESTIONNAIRE DETAILS */}
      {selectedQuestionnaire && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-lg w-full ice-glass-glow rounded-3xl p-6 border border-cyan-500/30 text-white space-y-4">
            <button
              onClick={() => setSelectedQuestionnaire(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Mindset Check-in: {selectedQuestionnaire.full_name}</span>
            </h3>

            <div className="space-y-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs leading-relaxed">
              <div>
                <span className="text-slate-400 block font-semibold">1. Area that feels frozen:</span>
                <span className="text-cyan-300 font-medium">{selectedQuestionnaire.questionnaire?.stuckArea || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">2. Biggest obstacle:</span>
                <span className="text-slate-200">{selectedQuestionnaire.questionnaire?.biggestObstacle || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">3. What they hope to unlock/experience:</span>
                <p className="text-white italic mt-0.5 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  &ldquo;{selectedQuestionnaire.questionnaire?.growthGoal || 'No response provided'}&rdquo;
                </p>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">4. Comfort zone readiness score:</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">
                  {selectedQuestionnaire.questionnaire?.readinessScore || 'N/A'} / 10
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedQuestionnaire(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-semibold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
