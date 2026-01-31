import { Link } from 'react-router-dom';
import { Sidebar } from '@/sections/dashboard/Sidebar';
import { Header } from '@/sections/dashboard/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, 
  Play, 
  Users, 
  Clock, 
  FolderOpen, 
  TrendingUp,
  MoreVertical,
  CheckCircle2,
  Loader2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useScreenings } from '@/hooks/useScreenings';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from '@/lib/utils';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const { screenings, loading, error } = useScreenings();

  // Calculate real stats from data
  const stats = {
    totalCandidates: screenings.reduce((acc, s) => acc + s.total_candidates, 0),
    timeSaved: screenings.reduce((acc, s) => acc + (s.total_candidates * 8.5), 0),
    activeScreenings: screenings.filter(s => s.status === 'processing' || s.status === 'draft').length,
    totalScreenings: screenings.length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Loader2 className="w-3 h-3 animate-spin" />
            Processing
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <AlertCircle className="w-3 h-3" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <FileText className="w-3 h-3" />
            Draft
          </span>
        );
    }
  };

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-8 overflow-auto">
          {/* Welcome Section */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Good morning, {userName}
              </h1>
              <p className="text-gray-600 mt-1">
                Here's an overview of your screening activity.
              </p>
            </div>
            <Link to="/screening/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Screening
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {loading ? (
              <>
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </>
            ) : (
              <>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-500">Total Candidates Analyzed</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-3xl font-bold text-gray-900">
                            {stats.totalCandidates.toLocaleString()}
                          </span>
                          {stats.totalCandidates > 0 && (
                            <span className="flex items-center text-sm text-green-600">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              New
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-500">Time Saved (hrs)</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-3xl font-bold text-gray-900">
                            {Math.round(stats.timeSaved / 60).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                          <FolderOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-500">Active Screenings</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-3xl font-bold text-gray-900">
                            {stats.activeScreenings}
                          </span>
                          <span className="text-sm text-gray-500">
                            of {stats.totalScreenings} total
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* CTA Card */}
          <Card className="mb-8 bg-gradient-to-br from-slate-900 to-slate-800 border-0">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Ready to find your next top talent?
                  </h2>
                  <p className="text-gray-300 max-w-xl">
                    Upload your candidate resumes or link a job description to begin your AI-powered shortlisting. Get a ranked list in minutes.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Link to="/screening/new">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Start New Screening
                    </Button>
                  </Link>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    <Play className="w-4 h-4 mr-2" />
                    View Demo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Screenings */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Screenings</h2>
              <Link to="/screenings" className="text-sm text-blue-600 hover:underline">
                View All
              </Link>
            </div>

            {loading ? (
              <Card>
                <div className="p-6 space-y-4">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                </div>
              </Card>
            ) : error ? (
              <Card className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load screenings</h3>
                <p className="text-gray-600 mb-4">{error.message}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </Card>
            ) : screenings.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FolderOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No screenings yet</h3>
                <p className="text-gray-600 mb-6">Create your first screening to start analyzing candidates.</p>
                <Link to="/screening/new">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Screening
                  </Button>
                </Link>
              </Card>
            ) : (
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Job Title
                        </th>
                        <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Candidates
                        </th>
                        <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {screenings.slice(0, 5).map((screening) => (
                        <tr key={screening.id} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-medium text-gray-900">{screening.title}</p>
                              <p className="text-sm text-gray-500">
                                {screening.department || 'No department'} • {screening.location || 'No location'}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            {screening.total_candidates > 0 ? (
                              <span className="text-sm text-gray-600">
                                {screening.total_candidates} uploaded
                                {screening.processed_candidates > 0 && (
                                  <span className="text-green-600 ml-1">
                                    ({screening.processed_candidates} processed)
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">Pending upload</span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            {getStatusBadge(screening.status)}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600">
                            {formatDistanceToNow(screening.created_at)}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Link to={`/screening/${screening.id}`}>
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                                  View
                                </Button>
                              </Link>
                              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
