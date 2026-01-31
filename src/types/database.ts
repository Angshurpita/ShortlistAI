export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      screenings: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          job_description: string;
          department: string | null;
          location: string | null;
          status: 'draft' | 'processing' | 'completed' | 'failed';
          total_candidates: number;
          processed_candidates: number;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          job_description: string;
          department?: string | null;
          location?: string | null;
          status?: 'draft' | 'processing' | 'completed' | 'failed';
          total_candidates?: number;
          processed_candidates?: number;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          job_description?: string;
          department?: string | null;
          location?: string | null;
          status?: 'draft' | 'processing' | 'completed' | 'failed';
          total_candidates?: number;
          processed_candidates?: number;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
      };
      candidates: {
        Row: {
          id: string;
          screening_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          score: number | null;
          summary: string | null;
          strengths: string[] | null;
          concerns: string[] | null;
          status: 'new' | 'processing' | 'hire' | 'maybe' | 'reject';
          resume_url: string | null;
          resume_filename: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          screening_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          score?: number | null;
          summary?: string | null;
          strengths?: string[] | null;
          concerns?: string[] | null;
          status?: 'new' | 'processing' | 'hire' | 'maybe' | 'reject';
          resume_url?: string | null;
          resume_filename?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          screening_id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          score?: number | null;
          summary?: string | null;
          strengths?: string[] | null;
          concerns?: string[] | null;
          status?: 'new' | 'processing' | 'hire' | 'maybe' | 'reject';
          resume_url?: string | null;
          resume_filename?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          company: string | null;
          role: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          company?: string | null;
          role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          company?: string | null;
          role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
