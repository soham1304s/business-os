import { Search, Bell, Menu } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuthStore();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shrink-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-slate-500 hover:text-slate-900 p-2 -ml-2 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-slate-600 relative p-2 rounded-full hover:bg-slate-50 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block" />

        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <div className="text-sm font-semibold text-slate-900 leading-tight">{user?.firstName} {user?.lastName}</div>
            <div className="text-xs text-slate-500">{user?.email}</div>
          </div>
          <button className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm ring-2 ring-white hover:ring-indigo-100 transition-all">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </button>
        </div>
      </div>
    </header>
  );
}
