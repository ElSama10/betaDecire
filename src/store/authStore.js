import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // { username: string, role: 'admin' | 'viewer' }
      login: (username, password) => {
        if (username === 'admin' && password === 'admin123') {
          set({ user: { username, role: 'admin' } });
          return true;
        }
        if (username === 'visualizador' && password === 'vis123') {
          set({ user: { username, role: 'viewer' } });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null }),
    }),
    {
      name: 'dicere-auth',
    }
  )
);

export default useAuthStore;
