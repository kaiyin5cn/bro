import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string;
  notification: string;
  notificationType: 'success' | 'error';
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setNotification: (message: string, type: 'success' | 'error') => void;
  clearNotification: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,
  loading: false,
  error: '',
  notification: '',
  notificationType: 'success',
  
  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isLoggedIn: true, error: '', notification: 'Login successful', notificationType: 'success' });
    setTimeout(() => set({ notification: '' }), 3000);
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isLoggedIn: false, error: '', notification: 'Logged out successfully', notificationType: 'success' });
    setTimeout(() => set({ notification: '' }), 3000);
  },
  
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setNotification: (notification, notificationType) => set({ notification, notificationType }),
  clearNotification: () => set({ notification: '' }),
  
  initializeAuth: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      const user = JSON.parse(userStr);
      set({ user, token, isLoggedIn: true });
    }
  }
}));