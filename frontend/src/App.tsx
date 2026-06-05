import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { AdminLogin } from './pages/AdminLogin';
import { Register } from './pages/Register';
import { useAuthStore } from './store/authStore';

import { DashboardLayout } from './components/dashboard/DashboardLayout';

import { CrmDashboard } from './pages/dashboard/CrmDashboard';

import { FinanceDashboard } from './pages/dashboard/FinanceDashboard';
import { ClientLayout } from './components/dashboard/ClientLayout';
import { ClientDashboard } from './pages/client/ClientDashboard';
import { ClientProjects } from './pages/client/ClientProjects';
import { ClientHrRecruitmentCenter } from './pages/client/ClientHrRecruitmentCenter';
import { ClientMarketingCenter } from './pages/client/ClientMarketingCenter';
import { ClientCrmCenter } from './pages/client/ClientCrmCenter';
import { ClientFinanceCenter } from './pages/client/ClientFinanceCenter';
import { ClientAiAutomation } from './pages/client/ClientAutomationCenter';
import { ClientInvoices } from './pages/client/ClientInvoices';
import { ClientSettings } from './pages/client/ClientSettings';

import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { MarketingDashboard } from './pages/dashboard/MarketingDashboard';
import { HrRecruitmentDashboard } from './pages/dashboard/HrRecruitmentDashboard';
import { ProjectsDashboard } from './pages/dashboard/ProjectsDashboard';
import { AiDashboard } from './pages/dashboard/AiDashboard';
import { AnalyticsDashboard } from './pages/dashboard/AnalyticsDashboard';
import { ComplianceDashboard } from './pages/dashboard/ComplianceDashboard';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  if (allowedRoles && user?.role && !allowedRoles.includes(user.role.name)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

import { GlobalLoader } from './components/ui/GlobalLoader';
import { ToastProvider } from './components/ui/ToastProvider';

function App() {
  return (
    <BrowserRouter>
      <GlobalLoader />
      <ToastProvider />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin/Team Dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="crm" element={<CrmDashboard />} />
          <Route path="hr-recruitment" element={<HrRecruitmentDashboard />} />
          <Route path="finance" element={<FinanceDashboard />} />
          <Route path="marketing" element={<MarketingDashboard />} />
          <Route path="projects" element={<ProjectsDashboard />} />
          <Route path="ai" element={<AiDashboard />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="compliance" element={<ComplianceDashboard />} />
        </Route>

        {/* Client Portal */}
        <Route path="/client" element={
          <ProtectedRoute>
            <ClientLayout />
          </ProtectedRoute>
        }>
          <Route index element={<ClientDashboard />} />
          <Route path="hr-recruitment" element={<ClientHrRecruitmentCenter />} />
          <Route path="marketing" element={<ClientMarketingCenter />} />
          <Route path="crm" element={<ClientCrmCenter />} />
          <Route path="finance" element={<ClientFinanceCenter />} />
          <Route path="automation" element={<ClientAiAutomation />} />
          <Route path="projects" element={<ClientProjects />} />
          <Route path="invoices" element={<ClientInvoices />} />
          <Route path="settings" element={<ClientSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
