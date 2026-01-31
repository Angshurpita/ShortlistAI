import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative px-8 py-16 lg:px-16 lg:py-20 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Ready to hire your next star?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              Join 500+ teams who have reclaimed 20+ hours a week from manual resume screening.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/login">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 px-8"
              >
                <Calendar className="mr-2 w-4 h-4" />
                Book a Demo
              </Button>
            </div>

            <p className="text-sm text-gray-400 mt-6">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
