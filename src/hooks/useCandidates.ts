import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Candidate } from '@/types';

export function useCandidates(screeningId: string | undefined) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCandidates = useCallback(async () => {
    if (!screeningId) {
      setCandidates([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('candidates')
        .select('*')
        .eq('screening_id', screeningId)
        .order('score', { ascending: false });

      if (supabaseError) throw supabaseError;

      setCandidates((data as Candidate[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch candidates'));
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  }, [screeningId]);

  const createCandidate = async (candidateData: {
    name: string;
    email?: string;
    phone?: string;
    resume_url?: string;
    resume_filename?: string;
  }) => {
    if (!screeningId) throw new Error('No screening ID provided');

    const { data, error } = await supabase
      .from('candidates')
      .insert({
        screening_id: screeningId,
        ...candidateData,
        status: 'new',
      })
      .select()
      .single();

    if (error) throw error;

    await fetchCandidates();
    return data as Candidate;
  };

  const updateCandidate = async (id: string, updates: Partial<Candidate>) => {
    const { error } = await supabase
      .from('candidates')
      .update(updates)
      .eq('id', id);

    if (error) throw error;

    await fetchCandidates();
  };

  const updateCandidateStatus = async (id: string, status: Candidate['status']) => {
    return updateCandidate(id, { status });
  };

  const deleteCandidate = async (id: string) => {
    const { error } = await supabase
      .from('candidates')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await fetchCandidates();
  };

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  return {
    candidates,
    loading,
    error,
    refresh: fetchCandidates,
    createCandidate,
    updateCandidate,
    updateCandidateStatus,
    deleteCandidate,
  };
}

export function useCandidate(id: string | undefined) {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCandidate = useCallback(async () => {
    if (!id) {
      setCandidate(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', id)
        .single();

      if (supabaseError) throw supabaseError;

      setCandidate(data as Candidate);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch candidate'));
      console.error('Error fetching candidate:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCandidate();
  }, [fetchCandidate]);

  return {
    candidate,
    loading,
    error,
    refresh: fetchCandidate,
  };
}
