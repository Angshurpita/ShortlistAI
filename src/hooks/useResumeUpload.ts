import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { ResumeUpload } from '@/types';

export function useResumeUpload(screeningId: string | undefined) {
  const { user } = useAuth();
  const [uploads, setUploads] = useState<ResumeUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = useCallback(async (files: FileList) => {
    if (!user?.id || !screeningId) {
      throw new Error('User not authenticated or no screening ID');
    }

    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const newUploads: ResumeUpload[] = [];

    // Validate and prepare uploads
    for (const file of Array.from(files)) {
      if (file.type !== 'application/pdf') {
        throw new Error(`${file.name} is not a PDF file`);
      }

      if (file.size > maxFileSize) {
        throw new Error(`${file.name} exceeds 10MB limit`);
      }

      const upload: ResumeUpload = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        file,
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'pending',
      };

      newUploads.push(upload);
    }

    setUploads((prev) => [...prev, ...newUploads]);
    setIsUploading(true);

    // Upload each file
    const uploadPromises = newUploads.map(async (upload) => {
      try {
        setUploads((prev) =>
          prev.map((u) =>
            u.id === upload.id ? { ...u, status: 'uploading' } : u
          )
        );

        const filePath = `${user.id}/${screeningId}/${Date.now()}_${upload.file.name}`;

        const { error } = await supabase.storage
          .from('resumes')
          .upload(filePath, upload.file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('resumes')
          .getPublicUrl(filePath);

        // Update upload status
        setUploads((prev) =>
          prev.map((u) =>
            u.id === upload.id
              ? { ...u, status: 'completed', progress: 100 }
              : u
          )
        );

        return {
          id: upload.id,
          path: filePath,
          url: publicUrl,
          filename: upload.file.name,
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Upload failed';
        setUploads((prev) =>
          prev.map((u) =>
            u.id === upload.id
              ? { ...u, status: 'error', error: errorMessage }
              : u
          )
        );
        throw err;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      setIsUploading(false);
      return results;
    } catch (err) {
      setIsUploading(false);
      throw err;
    }
  }, [user?.id, screeningId]);

  const removeUpload = useCallback((uploadId: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== uploadId));
  }, []);

  const clearCompleted = useCallback(() => {
    setUploads((prev) => prev.filter((u) => u.status !== 'completed'));
  }, []);

  return {
    uploads,
    isUploading,
    uploadFiles,
    removeUpload,
    clearCompleted,
  };
}
