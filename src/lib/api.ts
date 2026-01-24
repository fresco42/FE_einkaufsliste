import type { User, List, Item } from '../types/api';

const API_URL = import.meta.env.PUBLIC_API_URL || 'https://mt241037-10957.node.ustp.cloud';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

type ApiResponse<T> = { success: true; data: T } | { success: false; error: { message: string; status: number } };

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) return { success: false, error: { message: data.message || 'Fehler', status: res.status } };
    return { success: true, data };
  } catch {
    return { success: false, error: { message: 'Server nicht erreichbar', status: 0 } };
  }
}

export const userApi = {
  register: (data: { username: string; password: string }) =>
    request<{ username: string }>('/users', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { username: string; password: string }) =>
    request<{ token: string; user: User }>('/login/', { method: 'POST', body: JSON.stringify(data) }),
};

export const listApi = {
  create: (data: { name: string; user_id: number }) =>
    request<List>('/lists', { method: 'POST', body: JSON.stringify(data) }),
  getByUserId: (userId: number) => request<List[]>(`/lists/user/${userId}`),
  getById: (id: number) => request<List>(`/lists/${id}`),
  update: (id: number, data: { name: string }) =>
    request<{ message: string }>(`/lists/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<{ message: string }>(`/lists/${id}`, { method: 'DELETE' }),
};

export const itemApi = {
  create: (data: { name: string; quantity?: number; list_id: number }) =>
    request<Item>('/items', { method: 'POST', body: JSON.stringify(data) }),
  getByListId: (listId: number) => request<Item[]>(`/items/list/${listId}`),
  update: (id: number, data: { name?: string; quantity?: number; checked?: boolean }) =>
    request<{ message: string }>(`/items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => request<{ message: string }>(`/items/${id}`, { method: 'DELETE' }),
};
