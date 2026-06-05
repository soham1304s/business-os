import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { API_URL } from '../config';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string | null;
  designation: string | null;
  salary: number | null;
  status: string;
  joiningDate: string;
}

export interface HrAnalytics {
  totalEmployees: number;
  onLeave: number;
  monthlyPayroll: number;
}

export interface HrRequest {
  id: string;
  serviceType: string;
  budget: number | null;
  timeline: string | null;
  priority: string;
  notes: string | null;
  status: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    company?: {
      name: string;
    } | null;
  };
}

interface HrState {
  employees: Employee[];
  hrRequests: HrRequest[];
  analytics: HrAnalytics | null;
  isLoading: boolean;
  error: string | null;
  fetchEmployees: () => Promise<void>;
  fetchHrRequests: () => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  createEmployee: (data: Partial<Employee>) => Promise<void>;
  updateRequestStatus: (id: string, status: string) => Promise<void>;
  seedHrData: () => Promise<void>;
}

export const useHrStore = create<HrState>((set, get) => ({
  employees: [],
  hrRequests: [],
  analytics: null,
  isLoading: false,
  error: null,

  fetchEmployees: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${API_URL}/api/hr/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch employees');
      const data = await res.json();
      set({ employees: data });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchHrRequests: async () => {
    try {
      const token = useAuthStore.getState().token;
      // Filter strictly for HR Services and Recruitment
      const res = await fetch(`${API_URL}/api/service-requests?type=HR Management,Recruitment`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch HR requests');
      const data = await res.json();
      if (Array.isArray(data)) {
        set({ hrRequests: data });
      } else {
        set({ hrRequests: [] });
      }
    } catch (err: any) {
      console.error(err);
      set({ hrRequests: [] });
    }
  },

  updateRequestStatus: async (id: string, status: string) => {
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${API_URL}/api/service-requests/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      get().fetchHrRequests(); // Refresh list after update
    } catch (err) {
      console.error(err);
    }
  },

  fetchAnalytics: async () => {
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${API_URL}/api/hr/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch HR analytics');
      const data = await res.json();
      set({ analytics: data });
    } catch (err: any) {
      console.error(err);
    }
  },

  createEmployee: async (data: Partial<Employee>) => {
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${API_URL}/api/hr/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create employee');
      
      // Refresh data
      get().fetchEmployees();
      get().fetchAnalytics();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  seedHrData: async () => {
    try {
      const token = useAuthStore.getState().token;
      await fetch(`${API_URL}/api/hr/seed`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      get().fetchEmployees();
      get().fetchAnalytics();
    } catch (err) {
      console.error(err);
    }
  }
}));
