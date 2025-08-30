import { create } from 'zustand';

interface DonationState {
  ethAmount: string;
  usdAmount: number | null;
  isLoading: boolean;
  message: string;
  setEthAmount: (amount: string) => void;
  setUsdAmount: (amount: number | null) => void;
  setLoading: (loading: boolean) => void;
  setMessage: (message: string) => void;
  clearMessage: () => void;
  reset: () => void;
}

export const useDonationStore = create<DonationState>((set) => ({
  ethAmount: '',
  usdAmount: null,
  isLoading: false,
  message: '',
  
  setEthAmount: (ethAmount) => set({ ethAmount }),
  setUsdAmount: (usdAmount) => set({ usdAmount }),
  setLoading: (isLoading) => set({ isLoading }),
  setMessage: (message) => set({ message }),
  clearMessage: () => set({ message: '' }),
  
  reset: () => set({ 
    ethAmount: '', 
    usdAmount: null, 
    isLoading: false, 
    message: '' 
  })
}));