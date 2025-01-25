export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  project_id: string;
  user_id: string;
  order_index: number;
  due_date: string | null;
  priority: 'low' | 'medium' | 'high';
  labels: string[];
  created_at: string;
  updated_at: string;
} 