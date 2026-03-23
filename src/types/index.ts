export interface Kanban {
  id: number;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Column {
  id: number;
  kanban_id: number;
  title: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  column_id: number;
  title: string;
  description?: string;
  order: number;
  created_at: string;
  updated_at: string;
}
