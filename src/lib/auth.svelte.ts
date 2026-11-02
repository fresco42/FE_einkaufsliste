import type { User } from '../types/api';

function createAuth() {
  let user = $state<User | null>(null);
  let token = $state<string | null>(null);

  if (typeof window !== 'undefined') {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (t && u) {
      try { user = JSON.parse(u); token = t; } catch { localStorage.clear(); }
    }
  }

  return {
    get user() { return user; },
    get isAuthenticated() { return !!token && !!user; },
    login(u: User, t: string) {
      user = u; token = t;
      localStorage.setItem('token', t);
      localStorage.setItem('user', JSON.stringify(u));
    },
    logout() {
      user = null; token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  };
}
export const auth = createAuth();