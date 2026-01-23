/*import type { User } from '../types/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

type Subscriber = (state: AuthState) => void;

class AuthStore {
  private state: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
  };
  private subscribers: Set<Subscriber> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private loadFromStorage(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        this.state = { user, token, isAuthenticated: true };
      } catch {
        this.clear();
      }
    }
  }

  private notify(): void {
    this.subscribers.forEach((fn) => fn(this.state));
  }

  subscribe(fn: Subscriber): () => void {
    this.subscribers.add(fn);
    fn(this.state);
    return () => this.subscribers.delete(fn);
  }

  getState(): AuthState {
    return this.state;
  }

  login(user: User, token: string): void {
    this.state = { user, token, isAuthenticated: true };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.notify();
  }

  logout(): void {
    this.clear();
    this.notify();
    window.location.href = '/';
  }

  private clear(): void {
    this.state = { user: null, token: null, isAuthenticated: false };
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

export const authStore = new AuthStore();
*/