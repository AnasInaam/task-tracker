export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO string
  priority: TaskPriority;
  status: TaskStatus;
  tags: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  subtasks?: Subtask[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface TaskFilter {
  search?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  tag?: string;
  sortBy?: 'dueDate' | 'priority' | 'status' | 'title' | 'createdAt';
  overdue?: boolean;
  today?: boolean;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  overdue: number;
  completedToday: number;
}
