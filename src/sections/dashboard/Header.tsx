import { Search, Bell, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  userName?: string;
  userRole?: string;
}

export function Header({ userName = 'Alex Rivera', userRole = 'HR Manager' }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search candidates or jobs..."
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">{userRole}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
              {userName.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
