import type { User } from '../types/api';

function createAuthStore() {
  // Reaktiver State - wird automatisch getrackt
  let user = $state<User | null>(null);
  let token = $state<string | null>(null);

  // Beim Start aus localStorage laden
  if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (storedToken && userStr) {
      try {
        user = JSON.parse(userStr);
        token = storedToken;
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }

  return {
    // Getter für reaktiven Zugriff in Komponenten
    get user() { return user; },
    get token() { return token; },
    get isAuthenticated() { return !!token && !!user; },

    login(newUser: User, newToken: string) {
      user = newUser;
      token = newToken;
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
    },

    logout() {
      user = null;
      token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  };
}

export const auth = createAuthStore();
