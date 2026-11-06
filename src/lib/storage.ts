import { BankDetails, Reservation } from '@/types';
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
    receipt_url: '/images/defreeze-flyer-friends.jpg',
    status: 'pending',
    created_at: '2026-11-06T14:15:00.000Z',
  },
];

const STORAGE_KEYS = {
  BANK: 'defreeze_bank_settings',
  RESERVATIONS: 'defreeze_reservations',
};

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
