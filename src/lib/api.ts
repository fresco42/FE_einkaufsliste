import type {
  User,
  LoginResponse,
  List,
  Item,
  ApiResponse,
  CreateUserRequest,
  LoginRequest,
  CreateListRequest,
  UpdateListRequest,
  CreateItemRequest,
  UpdateItemRequest,
} from '../types/api';

const API_URL = import.meta.env.PUBLIC_API_URL || 'https://mt241037-10957.node.ustp.cloud';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: {
          message: data.message || 'Ein Fehler ist aufgetreten',
          status: response.status,
        },
      };
    }

    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: {
        message: 'Netzwerkfehler - Server nicht erreichbar',
        status: 0,
      },
    };
  }
}

export const userApi = {
  register(data: CreateUserRequest): Promise<ApiResponse<{ username: string; message: string }>> {
    return request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return request('/login/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getById(id: number): Promise<ApiResponse<User>> {
    return request(`/users/${id}`);
  },

  getAll(): Promise<ApiResponse<User[]>> {
    return request('/users');
  },

  delete(id: number): Promise<ApiResponse<{ message: string }>> {
    return request(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

export const listApi = {
  create(data: CreateListRequest): Promise<ApiResponse<List & { message: string }>> {
    return request('/lists', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getByUserId(userId: number): Promise<ApiResponse<List[]>> {
    return request(`/lists/user/${userId}`);
  },

  getById(id: number): Promise<ApiResponse<List>> {
    return request(`/lists/${id}`);
  },

  update(id: number, data: UpdateListRequest): Promise<ApiResponse<{ message: string }>> {
    return request(`/lists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(id: number): Promise<ApiResponse<{ message: string }>> {
    return request(`/lists/${id}`, {
      method: 'DELETE',
    });
  },
};

export const itemApi = {
  create(data: CreateItemRequest): Promise<ApiResponse<Item & { message: string }>> {
    return request('/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getByListId(listId: number): Promise<ApiResponse<Item[]>> {
    return request(`/items/list/${listId}`);
  },

  getById(id: number): Promise<ApiResponse<Item>> {
    return request(`/items/${id}`);
  },

  update(id: number, data: UpdateItemRequest): Promise<ApiResponse<{ message: string }>> {
    return request(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(id: number): Promise<ApiResponse<{ message: string }>> {
    return request(`/items/${id}`, {
      method: 'DELETE',
    });
  },
};
