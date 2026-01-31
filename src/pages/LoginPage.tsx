import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Mail, Shield, Lock, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { signInWithOtp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    const { error } = await signInWithOtp(email);
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      setEmailSent(true);
      toast.success('Magic link sent! Check your email.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
              </div>
              <span className="text-xl font-semibold text-gray-900">ShortlistAI</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Company</span>
              <Button variant="outline" size="sm">
                Request access
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {emailSent ? 'Check your email' : 'Welcome back'}
            </h1>
            <p className="text-gray-600 mt-2">
              {emailSent 
                ? `We've sent a secure login link to ${email}` 
                : 'Enter your work email to receive a secure login link.'}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Send Magic Link
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">
                  Click the link in your email to sign in instantly. 
                  No password required.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setEmailSent(false)}
                >
                  Use a different email
                </Button>
              </div>
            )}

            {/* Security Info */}
            <div className="pt-6 border-t border-gray-100 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>No password required</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Lock className="w-5 h-5 text-blue-600" />
                <span>Enterprise-grade security & privacy</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Need help?{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Contact Support
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            © 2024 ShortlistAI. All rights reserved. Built for modern talent teams.
          </p>
        </div>
      </footer>
    </div>
  );
}
