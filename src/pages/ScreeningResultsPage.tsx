import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Sidebar } from '@/sections/dashboard/Sidebar';
import { Header } from '@/sections/dashboard/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Download, 
  Filter,
  ArrowUpDown,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Sparkles,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { useScreening } from '@/hooks/useScreenings';
import { useCandidates } from '@/hooks/useCandidates';
import { toast } from 'sonner';
import type { Candidate } from '@/types';

export default function ScreeningResultsPage() {
  const { id } = useParams<{ id: string }>();
  const { screening, loading: screeningLoading, error: screeningError } = useScreening(id);
  const { candidates, loading: candidatesLoading, updateCandidateStatus } = useCandidates(id);
  
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Select first candidate when loaded
  if (candidates.length > 0 && !selectedCandidate) {
    setSelectedCandidate(candidates[0]);
  }

  const handleAnalyze = async () => {
    if (!id) return;
    
    setIsAnalyzing(true);
    
    try {
      // TODO: Call AI analysis API
      // For now, simulate analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success('Analysis completed!');
    } catch (err) {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStatusChange = async (candidateId: string, status: Candidate['status']) => {
    try {
      await updateCandidateStatus(candidateId, status);
      toast.success(`Candidate marked as ${status}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'hire':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">HIRE</Badge>;
      case 'maybe':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">MAYBE</Badge>;
      case 'reject':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">REJECT</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">ANALYZING</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">NEW</Badge>;
    }
  };

  const processedCandidates = candidates.filter(c => c.score !== null);
  const topMatches = processedCandidates.filter(c => (c.score || 0) >= 85).length;
  const timeSaved = (candidates.length * 8.5).toFixed(1);

  if (screeningLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-8">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-32" />
          </main>
        </div>
      </div>
    );
  }

  if (screeningError || !screening) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Screening not found</h2>
              <p className="text-gray-600 mb-4">The screening you're looking for doesn't exist.</p>
              <Link to="/dashboard">
                <Button>Back to Dashboard</Button>
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-8 overflow-auto">
          {/* Breadcrumb & Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Link to="/dashboard" className="hover:text-gray-900 flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-gray-900">{screening.title}</span>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{screening.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {screening.department && <span>{screening.department}</span>}
                  {screening.location && <span>• {screening.location}</span>}
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 gap-2"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || candidates.length === 0}
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Total Candidates</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-gray-900">{candidates.length}</span>
                <span className="text-sm text-gray-500">
                  ({processedCandidates.length} analyzed)
                </span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Top Matches (&gt;85%)</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-gray-900">{topMatches}</span>
                <span className="text-sm text-gray-500">Candidates</span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Est. Time Saved</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-gray-900">{timeSaved}m</span>
                <span className="text-sm text-gray-500">of manual screening</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Candidate List */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="w-4 h-4" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ArrowUpDown className="w-4 h-4" />
                      Sort by Score
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </Button>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-5">Candidate</div>
                  <div className="col-span-4">Match Score</div>
                  <div className="col-span-3">Status</div>
                </div>

                {/* Candidate Rows */}
                {candidatesLoading ? (
                  <div className="p-4 space-y-4">
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                  </div>
                ) : candidates.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No candidates yet</h3>
                    <p className="text-gray-600 mb-4">
                      Upload resumes and run AI analysis to see candidate rankings.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        onClick={() => setSelectedCandidate(candidate)}
                        className={`grid grid-cols-12 gap-4 px-4 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedCandidate?.id === candidate.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                        }`}
                      >
                        <div className="col-span-5 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium flex-shrink-0">
                            {candidate.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{candidate.name}</p>
                            {candidate.resume_filename && (
                              <p className="text-sm text-gray-500 truncate max-w-[200px]">
                                {candidate.resume_filename}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="col-span-4 flex items-center gap-3">
                          <div className="flex-1 max-w-[120px]">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${candidate.score || 0}%` }}
                              />
                            </div>
                          </div>
                          <span className="font-semibold text-blue-600">
                            {candidate.score ? `${candidate.score}%` : '—'}
                          </span>
                        </div>
                        <div className="col-span-3 flex items-center justify-between">
                          {getStatusBadge(candidate.status)}
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Analysis Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">AI Analysis</h3>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                {selectedCandidate ? (
                  <div className="space-y-6">
                    {/* Candidate Info */}
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-lg">
                        {selectedCandidate.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{selectedCandidate.name}</p>
                        <p className="text-sm text-gray-500">
                          Score: {selectedCandidate.score ? `${selectedCandidate.score}%` : 'Not analyzed'}
                        </p>
                      </div>
                    </div>

                    {/* Summary */}
                    {selectedCandidate.summary && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                          Summary
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {selectedCandidate.summary}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Strengths */}
                    {selectedCandidate.strengths && selectedCandidate.strengths.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <p className="text-sm font-medium text-green-700">Key Strengths</p>
                        </div>
                        <ul className="space-y-2">
                          {selectedCandidate.strengths.map((strength, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="text-green-500 mt-1">•</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Concerns */}
                    {selectedCandidate.concerns && selectedCandidate.concerns.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                          <p className="text-sm font-medium text-orange-600">Gaps / Concerns</p>
                        </div>
                        <ul className="space-y-2">
                          {selectedCandidate.concerns.map((concern, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="text-orange-400 mt-1">•</span>
                              {concern}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* No analysis yet */}
                    {!selectedCandidate.score && (
                      <div className="text-center py-8">
                        <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">
                          Run AI analysis to see detailed insights for this candidate.
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleStatusChange(selectedCandidate.id, 'reject')}
                      >
                        Reject
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleStatusChange(selectedCandidate.id, 'maybe')}
                      >
                        Maybe
                      </Button>
                      <Button 
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleStatusChange(selectedCandidate.id, 'hire')}
                      >
                        Hire
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select a candidate to view AI analysis</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center text-sm text-gray-500">
            AI ranking based on job description: "{screening.title}".{' '}
            <Link to={`/screening/${screening.id}/edit`} className="text-blue-600 hover:underline">
              Edit Job Criteria
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
