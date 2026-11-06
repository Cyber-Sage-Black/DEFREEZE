export interface QuestionnaireAnswers {
  stuckArea: string;
  biggestObstacle: string;
  growthGoal: string;
  readinessScore: number;
}

export interface QuestionnaireResponse {
  id: string;
  stuckArea: string;
  biggestObstacle: string;
  growthGoal: string;
  readinessScore: number;
  userName?: string;
  userEmail?: string;
  created_at: string;
}

export interface Reservation {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  gender: string;
  questionnaire: QuestionnaireAnswers;
  learning_goals?: string;
  receipt_url: string;
  status: 'pending' | 'confirmed' | 'declined';
  created_at: string;
  confirmed_at?: string;
}

export interface BankDetails {
  bank_name: string;
  account_number: string;
  account_name: string;
  amount: string;
  total_spots: number;
}

export interface Organizer {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image_url: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  whatsapp?: string;
  created_at?: string;
}
