class AuthStore {
  state = {
    user: null,
    token: null,
    isAuthenticated: false
  };
  subscribers = /* @__PURE__ */ new Set();
  constructor() {
    if (typeof window !== "undefined") {
      this.loadFromStorage();
    }
  }
  loadFromStorage() {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.state = { user, token, isAuthenticated: true };
      } catch {
        this.clear();
      }
    }
  }
  notify() {
    this.subscribers.forEach((fn) => fn(this.state));
  }
  subscribe(fn) {
    this.subscribers.add(fn);
    fn(this.state);
    return () => this.subscribers.delete(fn);
  }
  getState() {
    return this.state;
  }
  login(user, token) {
    this.state = { user, token, isAuthenticated: true };
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    this.notify();
  }
  logout() {
    this.clear();
    this.notify();
    window.location.href = "/";
  }
  clear() {
    this.state = { user: null, token: null, isAuthenticated: false };
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}
new AuthStore();
