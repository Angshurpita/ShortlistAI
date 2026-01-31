// User Types
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  company: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

// Screening Types
export type ScreeningStatus = 'draft' | 'processing' | 'completed' | 'failed';

export interface Screening {
  id: string;
  user_id: string;
  title: string;
  job_description: string;
  department: string | null;
  location: string | null;
  status: ScreeningStatus;
  total_candidates: number;
  processed_candidates: number;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

// Candidate Types
export type CandidateStatus = 'new' | 'processing' | 'hire' | 'maybe' | 'reject';

export interface Candidate {
  id: string;
  screening_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  score: number | null;
  summary: string | null;
  strengths: string[] | null;
  concerns: string[] | null;
  status: CandidateStatus;
  resume_url: string | null;
  resume_filename: string | null;
  created_at: string;
  updated_at: string;
}

// Resume Upload Types
export interface ResumeUpload {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  candidateId?: string;
}

// AI Analysis Types
export interface AIAnalysisResult {
  name: string;
  score: number;
  summary: string;
  strengths: string[];
  concerns: string[];
  status: 'hire' | 'maybe' | 'reject';
}

// Dashboard Stats
export interface DashboardStats {
  totalCandidatesAnalyzed: number;
  totalTimeSaved: number;
  activeScreenings: number;
  totalScreenings: number;
}

// Pricing Plans
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  description: string;
  features: string[];
  highlighted: boolean;
  resumeLimit: number;
  userSeats: number;
}
