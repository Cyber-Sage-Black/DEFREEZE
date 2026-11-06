import { BankDetails, Reservation, Organizer, QuestionnaireAnswers, QuestionnaireResponse } from '@/types';

const DEFAULT_BANK_DETAILS: BankDetails = {
  bank_name: 'Guaranty Trust Bank (GTBank)',
  account_number: '0739182390',
  account_name: 'DEFREEZE INITIATIVE',
  amount: '₦15,000',
  total_spots: 25,
};

const STORAGE_KEYS = {
  BANK: 'defreeze_bank_settings',
  RESERVATIONS: 'defreeze_reservations',
  ORGANIZERS: 'defreeze_organizers',
  QUESTIONNAIRES: 'defreeze_all_questionnaires',
};

// ==========================================
// BANK SETTINGS & CAPACITY
// ==========================================

export async function getBankSettings(): Promise<BankDetails> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/settings', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(STORAGE_KEYS.BANK, JSON.stringify(data));
        return data;
      }
    } catch {}

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

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
    } catch {}
  }

  return true;
}

// ==========================================
// RESERVATIONS (SYNCED WITH `registrations` TABLE)
// ==========================================

export async function getReservations(): Promise<Reservation[]> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/reservations', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {
      console.warn('Fallback to local reservations cache:', e);
    }

    const cached = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
  }

  return [];
}

export async function createReservation(
  reservation: Omit<Reservation, 'id' | 'created_at' | 'status'>
): Promise<Reservation> {
  let createdRecord: Reservation = {
    ...reservation,
    id: 'res-' + Math.random().toString(36).substring(2, 9),
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservation),
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.reservation) {
          createdRecord = {
            ...createdRecord,
            id: resData.reservation.id || createdRecord.id,
            created_at: resData.reservation.created_at || createdRecord.created_at,
          };
        }
      }
    } catch (e) {
      console.error('API createReservation error:', e);
    }

    // Save locally
    const cached = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    const existing: Reservation[] = cached ? JSON.parse(cached) : [];
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify([createdRecord, ...existing]));
    window.dispatchEvent(new Event('defreeze_reservations_updated'));
  }

  return createdRecord;
}

export async function updateReservationLearningGoals(id: string, learningGoals: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      await fetch('/api/reservations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, learning_goals: learningGoals }),
      });
    } catch {}

    const cached = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (cached) {
      try {
        const existing: Reservation[] = JSON.parse(cached);
        const updated = existing.map((r) =>
          r.id === id ? { ...r, learning_goals: learningGoals } : r
        );
        localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(updated));
        window.dispatchEvent(new Event('defreeze_reservations_updated'));
      } catch {}
    }
  }

  return true;
}

export async function confirmReservationPayment(id: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        console.warn('API confirmReservationPayment returned status', res.status);
      }
    } catch (err) {
      console.error('API confirmReservationPayment failed:', err);
    }

    const cached = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (cached) {
      try {
        const existing: Reservation[] = JSON.parse(cached);
        const updated = existing.map((r) =>
          r.id === id
            ? { ...r, status: 'confirmed' as const, confirmed_at: new Date().toISOString() }
            : r
        );
        localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(updated));
        window.dispatchEvent(new Event('defreeze_reservations_updated'));
      } catch {}
    }
  }

  return true;
}

export async function getSpotsRemaining(): Promise<{ remaining: number; total: number; confirmedCount: number }> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/spots', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        return {
          remaining: data.remaining ?? 25,
          total: data.total ?? 25,
          confirmedCount: data.confirmedCount ?? 0,
        };
      }
    } catch {}
  }

  const reservations = await getReservations();
  const confirmedCount = reservations.filter((r) => r.status === 'confirmed').length;
  const total = 25;
  const remaining = Math.max(0, total - confirmedCount);

  return { remaining, total, confirmedCount };
}

// ==========================================
// COLLATED YOUTH QUESTIONNAIRE & TOPIC SUGGESTIONS
// ==========================================

export async function submitQuestionnaireResponse(
  answers: QuestionnaireAnswers,
  userName?: string,
  userEmail?: string
): Promise<QuestionnaireResponse> {
  let record: QuestionnaireResponse = {
    id: 'qr-' + Math.random().toString(36).substring(2, 9),
    ...answers,
    userName,
    userEmail,
    created_at: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/youth-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...answers, userName, userEmail }),
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.data) {
          record = { ...record, id: resData.data.id, created_at: resData.data.created_at };
        }
      }
    } catch (e) {
      console.warn('API submitQuestionnaireResponse error:', e);
    }

    const cached = localStorage.getItem(STORAGE_KEYS.QUESTIONNAIRES);
    const existing: QuestionnaireResponse[] = cached ? JSON.parse(cached) : [];
    localStorage.setItem(STORAGE_KEYS.QUESTIONNAIRES, JSON.stringify([record, ...existing]));
    window.dispatchEvent(new Event('defreeze_questionnaires_updated'));
  }

  return record;
}

export async function getQuestionnaireResponses(): Promise<QuestionnaireResponse[]> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/youth-insights', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          localStorage.setItem(STORAGE_KEYS.QUESTIONNAIRES, JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {
      console.warn('API getQuestionnaireResponses error:', e);
    }

    const cached = localStorage.getItem(STORAGE_KEYS.QUESTIONNAIRES);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
  }

  return [];
}

// ==========================================
// ORGANIZERS (SYNCED WITH `organiser_profiles`)
// ==========================================

export async function getOrganizers(): Promise<Organizer[]> {
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/organizers', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem(STORAGE_KEYS.ORGANIZERS, JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {
      console.warn('API getOrganizers error:', e);
    }

    const cached = localStorage.getItem(STORAGE_KEYS.ORGANIZERS);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
  }

  return [
    {
      id: '8d5d2038-6806-45f5-b9fe-9c76d145f8c4',
      name: 'Emmanuel Olusesi Saheed',
      role: 'Founder & Lead Curator',
      bio: 'Dedicated to designing safe, electric spaces for ambitious young minds to break through self-imposed limits, shed comparison, and step boldly into action.',
      image_url: '/images/defreeze-logo.png',
      instagram: 'https://instagram.com',
      twitter: 'https://x.com',
      linkedin: 'https://linkedin.com',
      whatsapp: '+2348143708860',
      created_at: '2026-10-31T02:51:29.353556+00:00',
    },
    {
      id: 'b9b9e441-eb14-40a8-9361-b004662b19e8',
      name: 'Second Organiser',
      role: 'Operations & Game Lead',
      bio: 'Pioneering physical interactive simulations and group challenges that strip away facades, spark deep brotherhood and sisterhood, and build accountability.',
      image_url: '/images/defreeze-flyer-friends.jpg',
      instagram: 'https://instagram.com',
      twitter: 'https://x.com',
      created_at: '2026-10-31T02:51:29.353556+00:00',
    },
  ];
}

export async function saveOrganizer(organizer: Organizer): Promise<Organizer> {
  let record: Organizer = {
    ...organizer,
    id: organizer.id || 'org-' + Math.random().toString(36).substring(2, 9),
    created_at: organizer.created_at || new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/organizers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.organizer) {
          record = resData.organizer;
        }
      }
    } catch (e) {
      console.warn('API saveOrganizer error:', e);
    }

    const cached = localStorage.getItem(STORAGE_KEYS.ORGANIZERS);
    const existing: Organizer[] = cached ? JSON.parse(cached) : [];
    const index = existing.findIndex((o) => o.id === record.id);
    let updated: Organizer[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = record;
    } else {
      updated = [...existing, record];
    }
    localStorage.setItem(STORAGE_KEYS.ORGANIZERS, JSON.stringify(updated));
    window.dispatchEvent(new Event('defreeze_organizers_updated'));
  }

  return record;
}

export async function deleteOrganizer(id: string): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      await fetch(`/api/organizers?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('API deleteOrganizer error:', e);
    }

    const cached = localStorage.getItem(STORAGE_KEYS.ORGANIZERS);
    if (cached) {
      const existing: Organizer[] = JSON.parse(cached);
      const updated = existing.filter((o) => o.id !== id);
      localStorage.setItem(STORAGE_KEYS.ORGANIZERS, JSON.stringify(updated));
    }
    window.dispatchEvent(new Event('defreeze_organizers_updated'));
  }

  return true;
}
