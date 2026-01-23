export interface User {
  id: number;
  username: string;
  created_at: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface List {
  id: number;
  name: string;
  user_id: number;
  created_at: string;
}

export interface Item {
  id: number;
  name: string;
  quantity: number;
  checked: boolean;
  list_id: number;
  created_at: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };

export interface CreateUserRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CreateListRequest {
  name: string;
  user_id: number;
}

export interface UpdateListRequest {
  name: string;
}

export interface CreateItemRequest {
  name: string;
  quantity?: number;
  list_id: number;
}

export interface UpdateItemRequest {
  name?: string;
  quantity?: number;
  checked?: boolean;
}
