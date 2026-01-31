import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Screening } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function useScreenings() {
  const { user } = useAuth();
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchScreenings = useCallback(async () => {
    if (!user?.id) {
      setScreenings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('screenings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (supabaseError) throw supabaseError;

      setScreenings((data as Screening[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch screenings'));
      console.error('Error fetching screenings:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createScreening = async (screeningData: {
    title: string;
    job_description: string;
    department?: string;
    location?: string;
  }) => {
    if (!user?.id) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('screenings')
      .insert({
        user_id: user.id,
        ...screeningData,
        status: 'draft',
        total_candidates: 0,
        processed_candidates: 0,
      } as any)
      .select()
      .single();

    if (error) throw error;

    await fetchScreenings();
    return data as Screening;
  };

  const updateScreening = async (id: string, updates: Partial<Screening>) => {
    const { error } = await supabase
      .from('screenings')
      .update(updates as any)
      .eq('id', id);

    if (error) throw error;

    await fetchScreenings();
  };

  const deleteScreening = async (id: string) => {
    const { error } = await supabase
      .from('screenings')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await fetchScreenings();
  };

  useEffect(() => {
    fetchScreenings();
  }, [fetchScreenings]);

  return {
    screenings,
    loading,
    error,
    refresh: fetchScreenings,
    createScreening,
    updateScreening,
    deleteScreening,
  };
}

export function useScreening(id: string | undefined) {
  const [screening, setScreening] = useState<Screening | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchScreening = useCallback(async () => {
    if (!id) {
      setScreening(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('screenings')
        .select('*')
        .eq('id', id)
        .single();

      if (supabaseError) throw supabaseError;

      setScreening(data as Screening);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch screening'));
      console.error('Error fetching screening:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchScreening();
  }, [fetchScreening]);

  return {
    screening,
    loading,
    error,
    refresh: fetchScreening,
  };
}
