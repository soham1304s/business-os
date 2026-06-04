import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, Megaphone, Bot, Settings, LogOut, Target, DollarSign, LineChart, Shield, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const NAV_ITEMS = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'HR Team', path: '/dashboard/hr', icon: Users },
  { name: 'Recruitment', path: '/dashboard/recruitment', icon: Users },
  { name: 'Marketing', path: '/dashboard/marketing', icon: Megaphone },
  { name: 'CRM', path: '/dashboard/crm', icon: Target },
  { name: 'Finance', path: '/dashboard/finance', icon: DollarSign },
  { name: 'Projects', path: '/dashboard/projects', icon: Briefcase },
  { name: 'AI Agents', path: '/dashboard/ai', icon: Bot },
  { name: 'Analytics', path: '/dashboard/analytics', icon: LineChart },
  { name: 'Compliance', path: '/dashboard/compliance', icon: Shield },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-[100dvh] w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 shrink-0 bg-white">
          <span className="text-xl font-extrabold text-indigo-600 tracking-tight">BusinessOS</span>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-600 p-2 -mr-2 rounded-lg hover:bg-slate-50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar py-6 px-4 space-y-1 bg-white">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={() => {
                // Close sidebar on mobile when a link is clicked
                if (window.innerWidth < 768) {
                  onClose();
                }
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon className={`w-5 h-5 ${location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard') ? 'text-indigo-600' : 'text-slate-400'}`} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 space-y-1 shrink-0 bg-white">
          <NavLink
            to="/dashboard/settings"
            onClick={() => { if (window.innerWidth < 768) onClose(); }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                isActive 
                  ? 'bg-slate-100 text-slate-900' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Settings className="w-5 h-5 text-slate-400" />
            Settings
          </NavLink>
          <button
            onClick={() => {
              navigate('/');
              setTimeout(() => logout(), 0);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5 text-slate-400" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
