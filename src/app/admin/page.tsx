'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  getBankSettings, 
  updateBankSettings, 
  getReservations, 
  confirmReservationPayment, 
  getSpotsRemaining,
  getOrganizers,
  saveOrganizer,
  deleteOrganizer,
  getQuestionnaireResponses
} from '@/lib/storage';
import { BankDetails, Reservation, Organizer, QuestionnaireResponse } from '@/types';
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
  Plus,
  Trash2,
  Edit,
  UploadCloud,
  Brain,
  Sparkles,
  Target,
  RefreshCw
} from 'lucide-react';

const EMPTY_ORGANIZER: Organizer = {
  id: '',
  name: '',
  role: '',
  bio: '',
  image_url: '/images/defreeze-logo.png',
  instagram: '',
  twitter: '',
  linkedin: '',
  whatsapp: '',
};

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
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [youthResponses, setYouthResponses] = useState<QuestionnaireResponse[]>([]);
  const [spotsData, setSpotsData] = useState({ remaining: 25, total: 25, confirmedCount: 0 });
  
  // Filter & Search
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [surveySearch, setSurveySearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<Reservation | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [lastSynced, setLastSynced] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Active view tab in admin: 'reservations' | 'youth_insights' | 'organizers' | 'bank'
  const [activeTab, setActiveTab] = useState<'reservations' | 'youth_insights' | 'organizers' | 'bank'>('reservations');

  // Organizer Modal Form State
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [orgForm, setOrgForm] = useState<Organizer>(EMPTY_ORGANIZER);
  const [orgImagePreview, setOrgImagePreview] = useState<string>('');
  const [orgSaveSuccess, setOrgSaveSuccess] = useState(false);

  // Check existing session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('defreeze_admin_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Fetch data from Supabase
  const loadData = async (silent = false) => {
    if (!silent) setIsSyncing(true);
    try {
      const [settings, resList, spots, orgList, questList] = await Promise.all([
        getBankSettings(),
        getReservations(),
        getSpotsRemaining(),
        getOrganizers(),
        getQuestionnaireResponses(),
      ]);
      setBankSettings(settings);
      setReservations(resList);
      setSpotsData(spots);
      setOrganizers(orgList);
      setYouthResponses(questList);
      setLastSynced(new Date().toLocaleTimeString());
    } finally {
      if (!silent) setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();

      // 10-second active poll interval to keep Supabase tables continuously synchronized
      const pollInterval = setInterval(() => {
        loadData(true);
      }, 10000);

      return () => clearInterval(pollInterval);
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

  // Organizer Management
  const handleOpenNewOrganizer = () => {
    setOrgForm({
      ...EMPTY_ORGANIZER,
      id: 'new-' + Date.now(),
    });
    setOrgImagePreview('/images/defreeze-logo.png');
    setShowOrgModal(true);
  };

  const handleEditOrganizer = (org: Organizer) => {
    setOrgForm(org);
    setOrgImagePreview(org.image_url || '/images/defreeze-logo.png');
    setShowOrgModal(true);
  };

  const handleDeleteOrganizer = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}'s profile from the website?`)) {
      await deleteOrganizer(id);
      await loadData();
    }
  };

  const handleOrgPictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setOrgImagePreview(base64);
        setOrgForm((prev) => ({ ...prev, image_url: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveOrganizerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgForm.name || !orgForm.role) {
      alert('Name and Role are required.');
      return;
    }
    await saveOrganizer({
      ...orgForm,
      image_url: orgImagePreview || orgForm.image_url || '/images/defreeze-logo.png',
    });
    setOrgSaveSuccess(true);
    setTimeout(() => {
      setOrgSaveSuccess(false);
      setShowOrgModal(false);
    }, 1200);
    await loadData();
  };

  // CSV Exports
  const exportReservationsCSV = () => {
    if (!reservations.length) return;
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Gender', 'Status', 'Stuck Area', 'Readiness', 'Learning Goals', 'Created At'];
    const rows = reservations.map((r) => [
      r.id,
      `"${r.full_name}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      r.gender,
      r.status,
      `"${r.questionnaire?.stuckArea || ''}"`,
      r.questionnaire?.readinessScore || '',
      `"${(r.learning_goals || '').replace(/"/g, '""')}"`,
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

  const exportYouthSurveyCSV = () => {
    if (!youthResponses.length) return;
    const headers = ['ID', 'Respondent', 'Email', 'Stuck Area', 'Biggest Obstacle', 'Growth Goal / Vision', 'Readiness Score', 'Date'];
    const rows = youthResponses.map((q) => [
      q.id,
      `"${q.userName || 'Anonymous'}"`,
      `"${q.userEmail || 'N/A'}"`,
      `"${q.stuckArea}"`,
      `"${q.biggestObstacle}"`,
      `"${(q.growthGoal || '').replace(/"/g, '""')}"`,
      q.readinessScore,
      q.created_at,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `defreeze-youth-insights-${new Date().toISOString().slice(0, 10)}.csv`);
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
      r.phone.includes(searchQuery) ||
      (r.learning_goals && r.learning_goals.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Filter youth responses
  const filteredYouthResponses = youthResponses.filter((q) => {
    const qStr = (q.stuckArea + ' ' + q.biggestObstacle + ' ' + (q.growthGoal || '') + ' ' + (q.userName || '')).toLowerCase();
    return qStr.includes(surveySearch.toLowerCase());
  });

  // Insights Calculations
  const avgReadiness = youthResponses.length
    ? (youthResponses.reduce((acc, curr) => acc + (curr.readinessScore || 0), 0) / youthResponses.length).toFixed(1)
    : '0';

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#030612] text-white">
        <div className="w-full max-w-md ice-glass-glow rounded-3xl p-8 border border-cyan-500/30 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-cyan-400/60 p-1 bg-slate-900 shadow-lg shadow-cyan-500/20">
            <Image src="/images/defreeze-logo.png" alt="DEFREEZE Logo" width={64} height={64} className="rounded-full object-cover" />
          </div>

          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">
              DEFREEZE Admin Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Enter authorized administrator passcode to manage reservations, youth insights &amp; team.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Admin Passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-center text-sm focus:outline-none focus:border-cyan-400 transition-colors"
            />

            {errorMsg && (
              <p className="text-xs text-red-400 font-semibold">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 hover:scale-[1.01] cursor-pointer"
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
              <p className="text-[11px] text-slate-400">Review receipts, collate youth questions, manage team profiles &amp; bank details</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live 10-Second Supabase Sync Status Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full ice-glass border border-emerald-500/40 text-emerald-400 text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Supabase Live Sync (10s)</span>
              {lastSynced && <span className="text-slate-400">• {lastSynced}</span>}
            </div>

            {/* Manual Sync Now Button */}
            <button
              onClick={() => loadData(false)}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/70 border border-cyan-700/60 text-xs text-cyan-300 hover:bg-cyan-900/80 transition-colors cursor-pointer disabled:opacity-50"
              title="Force instant sync with Supabase tables"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>

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
              className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-800/40 text-xs text-red-300 hover:bg-red-900/50 transition-colors cursor-pointer"
            >
              Lock / Sign Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'reservations'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Reservations &amp; Receipts ({reservations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('youth_insights')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'youth_insights'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Youth Mindset Insights ({youthResponses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('organizers')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'organizers'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Organizers Team ({organizers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bank')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'bank'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Bank &amp; Capacity</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Metric Cards Banner */}
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
              <Brain className="w-4 h-4 text-cyan-400" />
              Collated Youth Surveys
            </span>
            <div className="text-3xl font-black text-cyan-300 font-mono">
              {youthResponses.length}
            </div>
            <span className="text-[11px] text-slate-400">Avg Readiness: {avgReadiness}/10</span>
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
        </div>

        {/* VIEW 1: RESERVATIONS REVIEW TABLE */}
        {activeTab === 'reservations' && (
          <section className="space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  Attendee Reservations, Learning Goals &amp; Receipts
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
                    placeholder="Search attendee or goals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48"
                  />
                </div>

                {/* Export */}
                <button
                  onClick={exportReservationsCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Attendees</span>
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
                      <th className="py-3.5 px-4">Mindset Check-in &amp; Goals</th>
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
                            <button
                              onClick={() => setSelectedQuestionnaire(res)}
                              className="text-left group block"
                            >
                              <span className="block text-cyan-300 group-hover:underline font-medium">
                                {res.questionnaire?.stuckArea || 'View Answers'}
                              </span>
                              {res.learning_goals ? (
                                <span className="block text-[11px] text-emerald-300 font-semibold line-clamp-1 mt-0.5">
                                  Goal: &ldquo;{res.learning_goals}&rdquo;
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-500">
                                  Readiness: {res.questionnaire?.readinessScore || 'N/A'}/10 • Click for details
                                </span>
                              )}
                            </button>
                          </td>

                          <td className="py-4 px-4">
                            {res.receipt_url ? (
                              <button
                                onClick={() => setSelectedReceipt(res.receipt_url)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-colors cursor-pointer"
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
        )}

        {/* VIEW 2: COLLATED YOUTH MINDSET INSIGHTS */}
        {activeTab === 'youth_insights' && (
          <section className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                  Youth Intelligence &amp; Mindset Survey
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  Collated Responses from New Visitors
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time data from young people taking the landing questionnaire — uncovering their frozen areas, obstacles, and ambitions.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search responses..."
                    value={surveySearch}
                    onChange={(e) => setSurveySearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-44"
                  />
                </div>

                <button
                  onClick={exportYouthSurveyCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Survey CSV</span>
                </button>
              </div>
            </div>

            {/* Quick Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl ice-glass border border-cyan-500/20 space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Total Survey Responses</span>
                <div className="text-2xl font-black text-white font-mono">{youthResponses.length}</div>
                <span className="text-[10px] text-cyan-300">Logged from landing visitors</span>
              </div>
              <div className="p-4 rounded-2xl ice-glass border border-cyan-500/20 space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Average Readiness Score</span>
                <div className="text-2xl font-black text-emerald-400 font-mono">{avgReadiness} / 10</div>
                <span className="text-[10px] text-slate-400">High desire to step out of comfort zone</span>
              </div>
              <div className="p-4 rounded-2xl ice-glass border border-cyan-500/20 space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Top Reported Obstacle</span>
                <div className="text-sm font-bold text-cyan-200 line-clamp-1">Overthinking &amp; Analysis Paralysis</div>
                <span className="text-[10px] text-slate-400">Followed by fear of failure</span>
              </div>
            </div>

            {/* Collated Responses Table */}
            <div className="ice-glass rounded-3xl border border-cyan-500/20 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Visitor</th>
                      <th className="py-3.5 px-4">Area That Feels Frozen</th>
                      <th className="py-3.5 px-4">Biggest Obstacle</th>
                      <th className="py-3.5 px-4">Breakthrough Goal / Vision</th>
                      <th className="py-3.5 px-4 text-center">Readiness</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredYouthResponses.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-slate-500">
                          No survey responses match your query.
                        </td>
                      </tr>
                    ) : (
                      filteredYouthResponses.map((qr) => (
                        <tr key={qr.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3.5 px-4 text-slate-500 font-mono whitespace-nowrap">
                            {qr.created_at ? qr.created_at.slice(0, 10) : ''}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-white">
                            <div>{qr.userName || 'Visitor'}</div>
                            {qr.userEmail && <span className="text-[10px] text-slate-400">{qr.userEmail}</span>}
                          </td>
                          <td className="py-3.5 px-4 text-cyan-300 font-medium">
                            {qr.stuckArea}
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">
                            {qr.biggestObstacle}
                          </td>
                          <td className="py-3.5 px-4 text-slate-200 italic max-w-xs">
                            &ldquo;{qr.growthGoal || 'No goal written'}&rdquo;
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold font-mono">
                              {qr.readinessScore}/10
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* VIEW 3: ORGANIZERS & TEAM PROFILES MANAGEMENT */}
        {activeTab === 'organizers' && (
          <section className="p-6 sm:p-8 rounded-3xl ice-glass-glow border border-cyan-500/30 space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                  Team &amp; Organizers
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  About The Organizers Profiles
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Add, edit, or remove team profiles, upload headshots directly, and attach social media accounts.
                </p>
              </div>

              <button
                onClick={handleOpenNewOrganizer}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-cyan-500/25 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Organizer Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {organizers.map((org) => (
                <div
                  key={org.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-cyan-400/50 bg-slate-950 flex-shrink-0">
                        <Image
                          src={org.image_url || '/images/defreeze-logo.png'}
                          alt={org.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">{org.name}</h4>
                        <p className="text-xs text-cyan-300 font-medium">{org.role}</p>
                      </div>
                    </div>

                    {org.bio && (
                      <p className="text-xs text-slate-400 line-clamp-2 italic">
                        &ldquo;{org.bio}&rdquo;
                      </p>
                    )}

                    {/* Social tags */}
                    <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-400 font-mono">
                      {org.instagram && <span className="px-2 py-0.5 rounded bg-slate-800">IG: {org.instagram.replace('https://instagram.com/', '@')}</span>}
                      {org.twitter && <span className="px-2 py-0.5 rounded bg-slate-800">X: {org.twitter.replace('https://x.com/', '@')}</span>}
                      {org.whatsapp && <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400">WA: {org.whatsapp}</span>}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => handleEditOrganizer(org)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteOrganizer(org.id, org.name)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-xs text-red-300 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* VIEW 4: EDITABLE BANK DETAILS */}
        {activeTab === 'bank' && (
          <section className="p-6 sm:p-8 rounded-3xl ice-glass-glow border border-cyan-500/30 space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                  Live Checkout Configuration
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  Bank Details &amp; Spot Limit Manager
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Changes saved here reflect immediately on the user-facing payment page.
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
        )}
      </main>

      {/* MODAL: ORGANIZER PROFILE EDITOR / CREATOR */}
      {showOrgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="relative max-w-xl w-full ice-glass-glow rounded-3xl p-6 sm:p-8 border border-cyan-500/30 text-white space-y-6 my-auto">
            <button
              onClick={() => setShowOrgModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                Organizer Profile
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                {orgForm.name ? `Edit: ${orgForm.name}` : 'Add New Organizer'}
              </h3>
            </div>

            <form onSubmit={handleSaveOrganizerSubmit} className="space-y-4">
              {/* Picture Upload directly from computer */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Profile Picture (Upload Image File)
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-cyan-400/60 bg-slate-900 flex-shrink-0 shadow-md">
                    <Image
                      src={orgImagePreview || '/images/defreeze-logo.png'}
                      alt="Organizer Preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <label className="flex-1 border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-2xl p-4 text-center cursor-pointer bg-slate-900/60 hover:bg-slate-900/90 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleOrgPictureUpload}
                      className="hidden"
                    />
                    <UploadCloud className="w-6 h-6 text-cyan-400 mx-auto mb-1 animate-bounce" />
                    <span className="text-xs font-bold text-white block">
                      Click to choose photo from computer
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      JPG, PNG, WebP supported
                    </span>
                  </label>
                </div>
              </div>

              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ifeoluwa"
                    value={orgForm.name}
                    onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Role / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Founder & Lead Curator"
                    value={orgForm.role}
                    onChange={(e) => setOrgForm({ ...orgForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Short Bio &amp; Vision
                </label>
                <textarea
                  rows={3}
                  placeholder="Share a short quote or vision about their mission for DEFREEZE..."
                  value={orgForm.bio || ''}
                  onChange={(e) => setOrgForm({ ...orgForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Social Media Inputs */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Social Links &amp; Contact
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 mb-0.5 block">Instagram (URL or handle)</span>
                    <input
                      type="text"
                      placeholder="e.g. https://instagram.com/yourname"
                      value={orgForm.instagram || ''}
                      onChange={(e) => setOrgForm({ ...orgForm, instagram: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 mb-0.5 block">X / Twitter</span>
                    <input
                      type="text"
                      placeholder="e.g. https://x.com/yourname"
                      value={orgForm.twitter || ''}
                      onChange={(e) => setOrgForm({ ...orgForm, twitter: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 mb-0.5 block">LinkedIn</span>
                    <input
                      type="text"
                      placeholder="e.g. https://linkedin.com/in/yourname"
                      value={orgForm.linkedin || ''}
                      onChange={(e) => setOrgForm({ ...orgForm, linkedin: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 mb-0.5 block">WhatsApp Phone</span>
                    <input
                      type="tel"
                      placeholder="e.g. +2348012345678"
                      value={orgForm.whatsapp || ''}
                      onChange={(e) => setOrgForm({ ...orgForm, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>

              {orgSaveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-2 border border-emerald-500/40">
                  <CheckCircle className="w-4 h-4" />
                  <span>Organizer saved successfully!</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowOrgModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-cyan-500/25 cursor-pointer"
                >
                  Save Organizer Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: FULL RESOLUTION RECEIPT VIEWER */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-2xl max-h-[90vh] bg-slate-950 p-4 rounded-3xl border border-cyan-500/30 overflow-hidden flex flex-col items-center">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
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

      {/* MODAL: QUESTIONNAIRE & LEARNING GOALS DETAILS */}
      {selectedQuestionnaire && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-lg w-full ice-glass-glow rounded-3xl p-6 border border-cyan-500/30 text-white space-y-4">
            <button
              onClick={() => setSelectedQuestionnaire(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Attendee Profile: {selectedQuestionnaire.full_name}</span>
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
                <span className="text-slate-400 block font-semibold">3. Desired breakthrough:</span>
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
              <div className="pt-2 border-t border-slate-800">
                <span className="text-cyan-400 block font-bold flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>5. Program Expectations / What they want to learn:</span>
                </span>
                <p className="text-white font-medium mt-1 bg-cyan-950/40 p-3 rounded-xl border border-cyan-500/30">
                  {selectedQuestionnaire.learning_goals ? (
                    `“${selectedQuestionnaire.learning_goals}”`
                  ) : (
                    <span className="text-slate-500 italic">No specific learning goals submitted yet.</span>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedQuestionnaire(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-semibold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
