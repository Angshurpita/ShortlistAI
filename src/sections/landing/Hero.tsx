import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                NEW: AI-Powered Screening
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Shortlist the best{' '}
              <span className="gradient-text">candidates</span> in{' '}
              <span className="gradient-text">60 seconds</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 max-w-lg">
              Stop manual screening. ShortlistAI uses advanced LLMs to rank your 
              applicants based on skill, experience, and cultural fit in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link to="/login">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  Try for Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="gap-2">
                <Play className="w-4 h-4" />
                See How It Works
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">500+</span> teams hired faster
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Mock Dashboard Header */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 text-center text-xs text-gray-400">
                  ShortlistAI Dashboard
                </div>
              </div>
              
              {/* Mock Dashboard Content */}
              <div className="p-6 space-y-4">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Candidates', value: '42', change: '+12%' },
                    { label: 'Time Saved', value: '6.2h', change: '+15%' },
                    { label: 'Match Rate', value: '94%', change: '+8%' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500">{stat.label}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                        <span className="text-xs text-green-600">{stat.change}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Candidate List */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-500 uppercase">Top Matches</div>
                  {[
                    { name: 'Alex Rivera', role: 'Senior Designer', score: 92, status: 'hire' },
                    { name: 'Jordan Smith', role: 'Product Lead', score: 84, status: 'maybe' },
                    { name: 'Taylor Chen', role: 'UI/UX Designer', score: 71, status: 'reject' },
                  ].map((candidate, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
                        {candidate.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                        <div className="text-xs text-gray-500">{candidate.role}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${candidate.score}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-blue-600">{candidate.score}%</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        candidate.status === 'hire' ? 'bg-green-100 text-green-700' :
                        candidate.status === 'maybe' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {candidate.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
