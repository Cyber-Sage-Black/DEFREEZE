export interface QuestionnaireAnswers {
  stuckArea: string;
  biggestObstacle: string;
  growthGoal: string;
  readinessScore: number;
}

export interface Reservation {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  gender: string;
  questionnaire: QuestionnaireAnswers;
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
