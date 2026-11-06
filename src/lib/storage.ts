import { BankDetails, Reservation, Organizer, QuestionnaireAnswers, QuestionnaireResponse } from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';

const DEFAULT_BANK_DETAILS: BankDetails = {
  bank_name: 'Guaranty Trust Bank (GTBank)',
  account_number: '0739182390',
  account_name: 'DEFREEZE INITIATIVE',
  amount: '₦15,000',
  total_spots: 25,
};

const INITIAL_LOCAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-demo-1',
    full_name: 'Tobi Adeleke',
    email: 'tobi@example.com',
    phone: '+234 803 123 4567',
    gender: 'Male',
    questionnaire: {
      stuckArea: 'Creative ideas & career transition',
      biggestObstacle: 'Overthinking & self-doubt',
      growthGoal: 'Stop procrastinating and launch my creative agency',
      readinessScore: 9,
    },
    learning_goals: 'Master pitching creative projects with unwavering confidence and build a strong accountability circle.',
    receipt_url: '/images/defreeze-flyer-friends.jpg',
    status: 'confirmed',
    created_at: '2026-11-04T10:00:00.000Z',
    confirmed_at: '2026-11-05T12:00:00.000Z',
  },
  {
    id: 'res-demo-2',
    full_name: 'Amaka Eze',
    email: 'amaka@example.com',
    phone: '+234 802 987 6543',
    gender: 'Female',
    questionnaire: {
      stuckArea: 'Taking the first step into tech leadership',
      biggestObstacle: 'Fear of failure & imposter syndrome',
      growthGoal: 'Build self-confidence and an intentional accountability circle',
      readinessScore: 10,
    },
    learning_goals: 'Learn psychological techniques to speak up without anxiety and lead teams boldly.',
    receipt_url: '/images/defreeze-flyer-ice.jpg',
    status: 'confirmed',
    created_at: '2026-11-05T09:30:00.000Z',
    confirmed_at: '2026-11-05T18:00:00.000Z',
  },
  {
    id: 'res-demo-3',
    full_name: 'David Oladipo',
    email: 'david.o@example.com',
    phone: '+234 814 555 0192',
    gender: 'Male',
    questionnaire: {
      stuckArea: 'Personal discipline & focus',
      biggestObstacle: 'Comparison with peers on social media',
      growthGoal: 'Learn to play, breathe, and trust my own path',
      readinessScore: 8,
    },
    learning_goals: 'Discover how to stop social comparison and build solid daily habits.',
    receipt_url: '/images/defreeze-flyer-friends.jpg',
    status: 'pending',
    created_at: '2026-11-06T14:15:00.000Z',
  },
];

const INITIAL_QUESTIONNAIRE_RESPONSES: QuestionnaireResponse[] = [
  {
    id: 'qr-1',
    stuckArea: 'Creative Projects & Ideas',
    biggestObstacle: 'Overthinking & analysis paralysis',
    growthGoal: 'Launch my design portfolio without second-guessing every choice',
    readinessScore: 9,
    userName: 'Tobi A.',
    userEmail: 'tobi@example.com',
    created_at: '2026-11-04T09:45:00.000Z',
  },
  {
    id: 'qr-2',
    stuckArea: 'Career & Purpose',
    biggestObstacle: 'Fear of failure or being judged',
    growthGoal: 'Transition into tech and speak up in high-stakes meetings',
    readinessScore: 10,
    userName: 'Amaka E.',
    userEmail: 'amaka@example.com',
    created_at: '2026-11-05T09:15:00.000Z',
  },
  {
    id: 'qr-3',
    stuckArea: 'Personal Growth & Habits',
    biggestObstacle: 'Comparing my progress to everyone else',
    growthGoal: 'Build a disciplined morning routine and stop doomscrolling',
    readinessScore: 8,
    userName: 'David O.',
    userEmail: 'david.o@example.com',
    created_at: '2026-11-06T14:00:00.000Z',
  },
  {
    id: 'qr-4',
    stuckArea: 'Taking the First Bold Step',
    biggestObstacle: 'Simply not knowing where or how to begin',
    growthGoal: 'Find clarity, community, and accountability partners who push me forward',
    readinessScore: 9,
    userName: 'Website Visitor',
    created_at: '2026-11-06T16:30:00.000Z',
  },
  {
    id: 'qr-5',
    stuckArea: 'Confidence & Relationships',
    biggestObstacle: 'Fear of failure or being judged',
    growthGoal: 'Stop hiding in social gatherings and make genuine connections',
    readinessScore: 7,
    userName: 'Anonymous Youth',
    created_at: '2026-11-06T17:10:00.000Z',
  },
];

const INITIAL_ORGANIZERS: Organizer[] = [
  {
    id: 'org-1',
    name: 'Ifeoluwa',
    role: 'Founder & Lead Curator',
    bio: 'Dedicated to designing safe, electric spaces for ambitious young minds to break through self-imposed limits, shed comparison, and step boldly into action.',
    image_url: '/images/defreeze-logo.png',
    instagram: 'https://instagram.com',
    twitter: 'https://x.com',
    linkedin: 'https://linkedin.com',
    whatsapp: '+2348000000000',
    created_at: '2026-11-01T12:00:00.000Z',
  },
  {
    id: 'org-2',
    name: 'DEFREEZE Experience Team',
    role: 'Game Mechanics & Community Lead',
    bio: 'Pioneering physical interactive simulations and group challenges that strip away facades, spark deep brotherhood and sisterhood, and build accountability.',
    image_url: '/images/defreeze-flyer-friends.jpg',
    instagram: 'https://instagram.com',
    twitter: 'https://x.com',
    created_at: '2026-11-02T12:00:00.000Z',
  },
];

const STORAGE_KEYS = {
  BANK: 'defreeze_bank_settings',
  RESERVATIONS: 'defreeze_reservations',
  ORGANIZERS: 'defreeze_organizers',
  QUESTIONNAIRES: 'defreeze_all_questionnaires',
};

// ==========================================
// BANK SETTINGS
// ==========================================

export async function getBankSettings(): Promise<BankDetails> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('id', 'default')
        .single();
      if (!error && data) {
        return {
          bank_name: data.bank_name,
          account_number: data.account_number,
          account_name: data.account_name,
          amount: data.amount,
          total_spots: data.total_spots ?? 25,
        };
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local storage', err);
    }
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(STORAGE_KEYS.BANK);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
  }

  return DEFAULT_BANK_DETAILS;
}

export async function updateBankSettings(settings: BankDetails): Promise<boolean> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.BANK, JSON.stringify(settings));
    window.dispatchEvent(new Event('defreeze_bank_updated'));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          id: 'default',
          bank_name: settings.bank_name,
          account_number: settings.account_number,
          account_name: settings.account_name,
          amount: settings.amount,
          total_spots: settings.total_spots,
          updated_at: new Date().toISOString(),
        });
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase updateBankSettings error:', err);
    }
  }

  return true;
}

// ==========================================
// RESERVATIONS & LEARNING GOALS
// ==========================================

export async function getReservations(): Promise<Reservation[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data as Reservation[];
      }
    } catch (err) {
      console.warn('Supabase getReservations error, falling back', err);
    }
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    } else {
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(INITIAL_LOCAL_RESERVATIONS));
      return INITIAL_LOCAL_RESERVATIONS;
    }
  }

  return INITIAL_LOCAL_RESERVATIONS;
}

export async function createReservation(
  reservation: Omit<Reservation, 'id' | 'created_at' | 'status'>
): Promise<Reservation> {
  const newRecord: Reservation = {
    ...reservation,
    id: 'res-' + Math.random().toString(36).substring(2, 9),
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const all = await getReservations();
    const updated = [newRecord, ...all];
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(updated));
    window.dispatchEvent(new Event('defreeze_reservations_updated'));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert({
          full_name: newRecord.full_name,
          phone: newRecord.phone,
          email: newRecord.email,
          gender: newRecord.gender,
          questionnaire: newRecord.questionnaire,
          learning_goals: newRecord.learning_goals,
          receipt_url: newRecord.receipt_url,
          status: 'pending',
        })
        .select()
        .single();
      if (!error && data) {
        return data as Reservation;
      }
    } catch (err) {
      console.error('Supabase createReservation error:', err);
    }
  }

  return newRecord;
}

export async function updateReservationLearningGoals(id: string, learningGoals: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    const all = await getReservations();
    const updated = all.map((r) =>
      r.id === id ? { ...r, learning_goals: learningGoals } : r
    );
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(updated));
    window.dispatchEvent(new Event('defreeze_reservations_updated'));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ learning_goals: learningGoals })
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase updateReservationLearningGoals error:', err);
    }
  }

  return true;
}

export async function confirmReservationPayment(id: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    const all = await getReservations();
    const updated = all.map((r) =>
      r.id === id ? { ...r, status: 'confirmed' as const, confirmed_at: new Date().toISOString() } : r
    );
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(updated));
    window.dispatchEvent(new Event('defreeze_reservations_updated'));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({
          status: 'confirmed',
          confirmed_at: new Date().toISOString(),
        })
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase confirmReservationPayment error:', err);
    }
  }

  return true;
}

export async function getSpotsRemaining(): Promise<{ remaining: number; total: number; confirmedCount: number }> {
  const [bankSettings, reservations] = await Promise.all([
    getBankSettings(),
    getReservations(),
  ]);

  const confirmedCount = reservations.filter((r) => r.status === 'confirmed').length;
  const total = bankSettings.total_spots || 25;
  const remaining = Math.max(0, total - confirmedCount);

  return { remaining, total, confirmedCount };
}

// ==========================================
// COLLATED YOUTH QUESTIONNAIRE RESPONSES
// ==========================================

export async function submitQuestionnaireResponse(
  answers: QuestionnaireAnswers,
  userName?: string,
  userEmail?: string
): Promise<QuestionnaireResponse> {
  const record: QuestionnaireResponse = {
    id: 'qr-' + Math.random().toString(36).substring(2, 9),
    ...answers,
    userName,
    userEmail,
    created_at: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const all = await getQuestionnaireResponses();
    const updated = [record, ...all];
    localStorage.setItem(STORAGE_KEYS.QUESTIONNAIRES, JSON.stringify(updated));
    window.dispatchEvent(new Event('defreeze_questionnaires_updated'));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('questionnaire_responses')
        .insert({
          stuck_area: answers.stuckArea,
          biggest_obstacle: answers.biggestObstacle,
          growth_goal: answers.growthGoal,
          readiness_score: answers.readinessScore,
          user_name: userName,
          user_email: userEmail,
        })
        .select()
        .single();
      if (!error && data) {
        return {
          id: data.id,
          stuckArea: data.stuck_area,
          biggestObstacle: data.biggest_obstacle,
          growthGoal: data.growth_goal,
          readinessScore: data.readiness_score,
          userName: data.user_name,
          userEmail: data.user_email,
          created_at: data.created_at,
        };
      }
    } catch (err) {
      console.error('Supabase submitQuestionnaireResponse error:', err);
    }
  }

  return record;
}

export async function getQuestionnaireResponses(): Promise<QuestionnaireResponse[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          stuckArea: d.stuck_area,
          biggestObstacle: d.biggest_obstacle,
          growthGoal: d.growth_goal,
          readinessScore: d.readiness_score,
          userName: d.user_name,
          userEmail: d.user_email,
          created_at: d.created_at,
        }));
      }
    } catch (err) {
      console.warn('Supabase getQuestionnaireResponses fallback:', err);
    }
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(STORAGE_KEYS.QUESTIONNAIRES);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    } else {
      localStorage.setItem(STORAGE_KEYS.QUESTIONNAIRES, JSON.stringify(INITIAL_QUESTIONNAIRE_RESPONSES));
      return INITIAL_QUESTIONNAIRE_RESPONSES;
    }
  }

  return INITIAL_QUESTIONNAIRE_RESPONSES;
}

// ==========================================
// ORGANIZERS & TEAM PROFILES
// ==========================================

export async function getOrganizers(): Promise<Organizer[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('organizers')
        .select('*')
        .order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        return data as Organizer[];
      }
    } catch (err) {
      console.warn('Supabase getOrganizers fallback:', err);
    }
  }

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(STORAGE_KEYS.ORGANIZERS);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    } else {
      localStorage.setItem(STORAGE_KEYS.ORGANIZERS, JSON.stringify(INITIAL_ORGANIZERS));
      return INITIAL_ORGANIZERS;
    }
  }

  return INITIAL_ORGANIZERS;
}

export async function saveOrganizer(organizer: Organizer): Promise<Organizer> {
  const isNew = !organizer.id || organizer.id.startsWith('new-');
  const record: Organizer = {
    ...organizer,
    id: isNew ? 'org-' + Math.random().toString(36).substring(2, 9) : organizer.id,
    created_at: organizer.created_at || new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const all = await getOrganizers();
    const existingIndex = all.findIndex((o) => o.id === record.id);
    let updated: Organizer[];
    if (existingIndex >= 0) {
      updated = [...all];
      updated[existingIndex] = record;
    } else {
      updated = [...all, record];
    }
    localStorage.setItem(STORAGE_KEYS.ORGANIZERS, JSON.stringify(updated));
    window.dispatchEvent(new Event('defreeze_organizers_updated'));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('organizers')
        .upsert({
          id: record.id.startsWith('org-') ? undefined : record.id,
          name: record.name,
          role: record.role,
          bio: record.bio,
          image_url: record.image_url,
          instagram: record.instagram,
          twitter: record.twitter,
          linkedin: record.linkedin,
          whatsapp: record.whatsapp,
        })
        .select()
        .single();
      if (!error && data) {
        return data as Organizer;
      }
    } catch (err) {
      console.error('Supabase saveOrganizer error:', err);
    }
  }

  return record;
}

export async function deleteOrganizer(id: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    const all = await getOrganizers();
    const updated = all.filter((o) => o.id !== id);
    localStorage.setItem(STORAGE_KEYS.ORGANIZERS, JSON.stringify(updated));
    window.dispatchEvent(new Event('defreeze_organizers_updated'));
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('organizers')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Supabase deleteOrganizer error:', err);
    }
  }

  return true;
}
