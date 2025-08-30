import { create } from 'zustand';

interface UrlState {
  url: string;
  shortenedUrl: string;
  loading: boolean;
  error: string;
  processedUrls: Set<string>;
  setUrl: (url: string) => void;
  setShortenedUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  addProcessedUrl: (url: string) => void;
  clearError: () => void;
  reset: () => void;
}

export const useUrlStore = create<UrlState>((set, get) => ({
  url: '',
  shortenedUrl: '',
  loading: false,
  error: '',
  processedUrls: new Set(),
  
  setUrl: (url) => set({ url }),
  setShortenedUrl: (shortenedUrl) => set({ shortenedUrl }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: '' }),
  
  addProcessedUrl: (url) => {
    const { processedUrls } = get();
    const newSet = new Set(processedUrls);
    newSet.add(url);
    set({ processedUrls: newSet });
  },
  
  reset: () => set({ 
    url: '', 
    shortenedUrl: '', 
    loading: false, 
    error: '', 
    processedUrls: new Set() 
  })
}));