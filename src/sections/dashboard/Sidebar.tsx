import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  CreditCard, 
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useScreenings } from '@/hooks/useScreenings';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'New Screening', href: '/screening/new', icon: PlusCircle },
  { name: 'Past Screenings', href: '/screenings', icon: History },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { signOut, user, profile } = useAuth();
  const { screenings } = useScreenings();

  const totalCandidates = screenings.reduce((acc, s) => acc + s.total_candidates, 0);
  const planLimit = 2000; // TODO: Get from user's subscription
  const usagePercent = Math.min((totalCandidates / planLimit) * 100, 100);

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          </div>
          <div>
            <span className="text-lg font-semibold text-gray-900">ShortlistAI</span>
            <p className="text-xs text-gray-500">AI Recruiter Pro</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className={cn('w-5 h-5', isActive ? 'text-blue-600' : 'text-gray-400')} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Usage Stats */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase mb-2">Usage</p>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-600">
            {totalCandidates.toLocaleString()} / {planLimit.toLocaleString()} candidates
          </p>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
            <p className="text-xs text-gray-500 truncate">{userEmail}</p>
          </div>
          <button 
            onClick={signOut}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
