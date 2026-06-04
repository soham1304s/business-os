import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
