import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { API_URL } from '../config';

export interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: string;
  probability: number;
}

interface CrmState {
  deals: Deal[];
  isLoading: boolean;
  error: string | null;
  fetchDeals: () => Promise<void>;
  updateDealStage: (dealId: string, newStage: string) => Promise<void>;
  createDeal: (data: Partial<Deal>) => Promise<void>;
  seedDeals: () => Promise<void>;
}

export const useCrmStore = create<CrmState>((set, get) => ({
  deals: [],
  isLoading: false,
  error: null,

  fetchDeals: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${API_URL}/api/crm/deals`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch deals');
      const data = await res.json();
      set({ deals: data });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateDealStage: async (dealId: string, newStage: string) => {
    const previousDeals = get().deals;
    set(state => ({
      deals: state.deals.map(deal => 
        deal.id === dealId ? { ...deal, stage: newStage } : deal
      )
    }));

    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${API_URL}/api/crm/deals/${dealId}/stage`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stage: newStage })
      });
      if (!res.ok) throw new Error('Failed to update deal');
    } catch (err: any) {
      set({ deals: previousDeals, error: err.message });
    }
  },

  createDeal: async (data: Partial<Deal>) => {
    try {
      const token = useAuthStore.getState().token;
      const res = await fetch(`${API_URL}/api/crm/deals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
           title: data.title,
           companyName: data.company,
           value: data.value,
           stage: data.stage
        })
      });
      if (!res.ok) throw new Error('Failed to create deal');
      const newDeal = await res.json();
      set(state => ({ deals: [newDeal, ...state.deals] }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  seedDeals: async () => {
    try {
      const token = useAuthStore.getState().token;
      await fetch(`${API_URL}/api/crm/seed`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      get().fetchDeals();
    } catch (err) {
      console.error(err);
    }
  }
}));
