import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/sections/dashboard/Sidebar';
import { Header } from '@/sections/dashboard/Header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Upload, 
  X, 
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useScreenings } from '@/hooks/useScreenings';
import { supabase } from '@/lib/supabase';
import { formatFileSize } from '@/lib/utils';

interface ResumeFile {
  id: string;
  name: string;
  size: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string;
  path?: string;
  url?: string;
}

export default function NewScreeningPage() {
  const navigate = useNavigate();
  const { createScreening } = useScreenings();
  
  // Form state
  const [title, setTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  
  // Upload state
  const [uploadedFiles, setUploadedFiles] = useState<ResumeFile[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxFiles = 50;
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: ResumeFile[] = [];
    
    for (const file of Array.from(files)) {
      if (file.type !== 'application/pdf') {
        toast.error(`${file.name} is not a PDF file`);
        continue;
      }
      
      if (file.size > maxFileSize) {
        toast.error(`${file.name} exceeds 10MB limit`);
        continue;
      }

      if (uploadedFiles.length + newFiles.length >= maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`);
        break;
      }

      const fileId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      newFiles.push({
        id: fileId,
        name: file.name,
        size: file.size,
        status: 'pending',
        progress: 0,
      });
    }

    if (newFiles.length === 0) return;

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Upload files to Supabase Storage
    for (const fileData of newFiles) {
      await uploadFile(fileData, files);
    }
  };

  const uploadFile = async (fileData: ResumeFile, fileList: FileList) => {
    const file = Array.from(fileList).find(f => f.name === fileData.name);
    if (!file) return;

    setUploadedFiles((prev) =>
      prev.map((f) =>
        f.id === fileData.id ? { ...f, status: 'uploading' } : f
      )
    );

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // For now, we'll store files temporarily without a screening ID
      // They'll be associated after screening creation
      const filePath = `temp/${user.id}/${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileData.id
            ? { ...f, status: 'completed', progress: 100, path: filePath, url: publicUrl }
            : f
        )
      );

      toast.success(`${file.name} uploaded successfully`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileData.id
            ? { ...f, status: 'error', error: errorMessage }
            : f
        )
      );
      toast.error(`Failed to upload ${fileData.name}: ${errorMessage}`);
    }
  };

  const removeFile = async (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file?.path) {
      try {
        await supabase.storage.from('resumes').remove([file.path]);
      } catch (err) {
        console.error('Error removing file:', err);
      }
    }
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleCreateScreening = async () => {
    // Validation
    if (!title.trim()) {
      toast.error('Please enter a job title');
      return;
    }

    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    setIsCreating(true);

    try {
      // Create screening
      const screening = await createScreening({
        title: title.trim(),
        job_description: jobDescription.trim(),
        department: department.trim() || undefined,
        location: location.trim() || undefined,
      });

      // Move uploaded files to proper location and create candidates
      const completedFiles = uploadedFiles.filter(f => f.status === 'completed' && f.path);
      
      for (const file of completedFiles) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user || !file.path) continue;

          // Move file from temp to proper location
          const newPath = `${user.id}/${screening.id}/${Date.now()}_${file.name}`;
          
          const { error: moveError } = await supabase.storage
            .from('resumes')
            .move(file.path, newPath);

          if (moveError) throw moveError;

          const { data: { publicUrl } } = supabase.storage
            .from('resumes')
            .getPublicUrl(newPath);

          // Create candidate record
          await supabase.from('candidates').insert({
            screening_id: screening.id,
            name: file.name.replace('.pdf', ''),
            resume_url: publicUrl,
            resume_filename: file.name,
            status: 'new',
          } as any);
        } catch (err) {
          console.error('Error processing file:', err);
        }
      }

      toast.success('Screening created successfully!');
      
      // Navigate to the screening page
      navigate(`/screening/${screening.id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create screening';
      toast.error(errorMessage);
      setIsCreating(false);
    }
  };

  const completedCount = uploadedFiles.filter(f => f.status === 'completed').length;
  const uploadingCount = uploadedFiles.filter(f => f.status === 'uploading').length;
  const errorCount = uploadedFiles.filter(f => f.status === 'error').length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-8 overflow-auto">
          {/* Page Header */}
          <div className="max-w-4xl mx-auto mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              New Screening Workflow
            </h1>
            <p className="text-gray-600">
              Follow the steps below to generate your AI-powered candidate shortlist.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-6 py-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Job Description</p>
                  <p className="text-sm text-blue-600">Step 1: Enter details</p>
                </div>
              </div>
              <div className="flex-1 h-px bg-gray-200" />
              <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Upload Resumes</p>
                  <p className="text-sm text-gray-500">Step 2: Add PDF files</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Step 1: Job Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">1</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Define the Role</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Product Designer"
                    className="mt-2"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Design Team"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. San Francisco or Remote"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="jobDescription">Job Description *</Label>
                  <p className="text-sm text-gray-500 mt-1 mb-2">
                    Paste the full job description. Our AI analyzes this to identify key requirements.
                  </p>
                  <Textarea
                    id="jobDescription"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer... We are looking for someone with 5+ years of React experience..."
                    className="min-h-[200px] resize-none"
                    maxLength={5000}
                  />
                  <div className="flex justify-end mt-2">
                    <span className="text-sm text-gray-400">
                      {jobDescription.length} / 5000 characters
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Upload Resumes */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">2</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Upload Resumes</h2>
              </div>

              {/* Info Banner */}
              <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 rounded-lg px-4 py-3 mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Maximum 50 PDF resumes per screening session.</span>
              </div>

              {/* Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-lg font-medium text-gray-900 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  PDF files only (Max. 10MB each)
                </p>
              </div>

              {/* File List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {uploadingCount > 0 ? (
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      ) : errorCount > 0 ? (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                      <span className="font-medium text-gray-900">
                        {completedCount} of {uploadedFiles.length} uploaded
                        {uploadingCount > 0 && ` (${uploadingCount} uploading...)`}
                        {errorCount > 0 && ` (${errorCount} failed)`}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {Math.round((uploadedFiles.length / maxFiles) * 100)}% of limit used
                    </span>
                  </div>

                  <Progress 
                    value={(uploadedFiles.filter(f => f.status === 'completed').length / maxFiles) * 100} 
                    className="mb-4"
                  />

                  <div className="grid sm:grid-cols-2 gap-3">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          file.status === 'error' ? 'bg-red-100' : 
                          file.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          {file.status === 'error' ? (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          ) : file.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                          {file.status === 'uploading' && (
                            <div className="w-full h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full transition-all"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                          )}
                          {file.status === 'error' && file.error && (
                            <p className="text-xs text-red-500 mt-1">{file.error}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          disabled={file.status === 'uploading'}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 px-8"
                onClick={handleCreateScreening}
                disabled={isCreating || uploadingCount > 0}
              >
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Create Screening
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>

            {/* Help Links */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500 pb-8">
              <a href="#" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <HelpCircle className="w-4 h-4" />
                How it works
              </a>
              <a href="#" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Lightbulb className="w-4 h-4" />
                Best practices for JD
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
