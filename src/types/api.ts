export interface User {
  id: number;
  username: string;
  created_at: string;
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
