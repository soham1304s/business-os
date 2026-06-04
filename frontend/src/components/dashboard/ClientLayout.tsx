import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Briefcase, FileText, Settings, LogOut, Bell, Search, User, LayoutDashboard, Users, Megaphone, Target, Bot, Shield, Menu, X } from 'lucide-react';
import { AiChatBox } from '../ui/AiChatBox';

const NAV_ITEMS = [
  { icon: LayoutDashboard, name: 'Command Center', path: '/client' },
  { icon: Users, name: 'HR Services', path: '/client/hr' },
  { icon: Users, name: 'Recruitment', path: '/client/recruitment' },
  { icon: Megaphone, name: 'Digital Marketing', path: '/client/marketing' },
  { icon: Target, name: 'CRM & Sales', path: '/client/crm' },
  { icon: Shield, name: 'Finance & Compliance', path: '/client/finance' },
  { icon: Bot, name: 'AI Automation', path: '/client/automation' },
  { icon: Briefcase, name: 'My Projects', path: '/client/projects' },
  { icon: FileText, name: 'Invoices', path: '/client/invoices' },
];

export function ClientLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex">
      
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-[100dvh] w-64 bg-slate-900 text-slate-300 flex flex-col transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
          <span className="text-xl font-extrabold text-white tracking-tight">Client Portal</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white p-2 -mr-2 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar py-6 px-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/client'}
              onClick={() => {
                if (window.innerWidth < 768) setIsMobileMenuOpen(false);
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-600 text-white' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-1 shrink-0">
          <NavLink
            to="/client/settings"
            onClick={() => { if (window.innerWidth < 768) setIsMobileMenuOpen(false); }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                isActive 
                  ? 'bg-slate-800 text-white' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Settings className="w-5 h-5" />
            Settings
          </NavLink>
          <button
            onClick={() => {
              navigate('/');
              setTimeout(() => logout(), 0);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium hover:bg-red-900/50 hover:text-red-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-slate-500 hover:text-slate-900 p-2 -ml-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative w-full max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0 border border-indigo-200">
              {user?.firstName?.[0] || <User className="w-4 h-4" />}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 relative">
          <Outlet />
        </main>
      </div>
      <AiChatBox />
    </div>
  );
}
