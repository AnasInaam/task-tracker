// Centralized localStorage helpers for tasks
import { Task, TaskStats, TaskPriority, TaskStatus, Subtask } from '../types/task';

const STORAGE_KEY = 'todo-tasks';
const SETTINGS_KEY = 'todo-settings';

export interface AppSettings {
  darkMode: boolean;
  theme: 'purple' | 'blue' | 'green';
  notifications: boolean;
  autoSort: boolean;
}

export function loadTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const tasks = data ? JSON.parse(data) : [];
    
    // Migrate old tasks to new format
    return tasks.map((task: Record<string, unknown>) => ({
      id: task.id as string || crypto.randomUUID(),
      title: task.title as string || 'Untitled',
      description: task.description as string || '',
      dueDate: task.dueDate as string || new Date().toISOString(),
      priority: (task.priority as TaskPriority) || 'medium',
      status: (task.status as TaskStatus) || 'pending',
      tags: (task.tags as string[]) || [],
      order: (task.order as number) || 0,
      createdAt: (task.createdAt as string) || new Date().toISOString(),
      updatedAt: (task.updatedAt as string) || new Date().toISOString(),
      subtasks: (task.subtasks as Subtask[]) || [],
      completedAt: task.completedAt as string | undefined,
      estimatedTime: task.estimatedTime as number | undefined,
      actualTime: task.actualTime as number | undefined,
    }) as Task);
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]) {
  if (typeof window === 'undefined') return;
  
  // Update the updatedAt timestamp for all tasks
  const updatedTasks = tasks.map(task => ({
    ...task,
    updatedAt: new Date().toISOString(),
  }));
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
}

export function loadSettings(): AppSettings {
  if (typeof window === 'undefined') {
    return { darkMode: false, theme: 'purple', notifications: true, autoSort: false };
  }
  
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    const defaultSettings = { 
      darkMode: window.matchMedia("(prefers-color-scheme: dark)").matches, 
      theme: 'purple' as const, 
      notifications: true, 
      autoSort: false 
    };
    
    return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
  } catch {
    return { darkMode: false, theme: 'purple', notifications: true, autoSort: false };
  }
}

export function saveSettings(settings: AppSettings) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getTaskStats(tasks: Task[]): TaskStats {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const stats = tasks.reduce(
    (acc, task) => {
      acc.total++;
      
      if (task.status === 'completed') {
        acc.completed++;
        if (task.completedAt && new Date(task.completedAt) >= today) {
          acc.completedToday++;
        }
      } else if (task.status === 'pending') {
        acc.pending++;
      } else if (task.status === 'in-progress') {
        acc.inProgress++;
      }
      
      // Check if overdue
      if (task.status !== 'completed' && new Date(task.dueDate) < today) {
        acc.overdue++;
      }
      
      return acc;
    },
    {
      total: 0,
      completed: 0,
      pending: 0,
      inProgress: 0,
      overdue: 0,
      completedToday: 0,
    }
  );
  
  return stats;
}

export function exportTasks(tasks: Task[]): string {
  return JSON.stringify(tasks, null, 2);
}

export function importTasks(jsonString: string): Task[] {
  try {
    const imported = JSON.parse(jsonString);
    if (Array.isArray(imported)) {
      return imported.map((task: Record<string, unknown>) => ({
        id: task.id as string || crypto.randomUUID(),
        title: task.title as string || 'Untitled',
        description: task.description as string || '',
        dueDate: task.dueDate as string || new Date().toISOString(),
        priority: (task.priority as TaskPriority) || 'medium',
        status: (task.status as TaskStatus) || 'pending',
        tags: (task.tags as string[]) || [],
        order: (task.order as number) || 0,
        createdAt: (task.createdAt as string) || new Date().toISOString(),
        updatedAt: (task.updatedAt as string) || new Date().toISOString(),
        subtasks: (task.subtasks as Subtask[]) || [],
        completedAt: task.completedAt as string | undefined,
        estimatedTime: task.estimatedTime as number | undefined,
        actualTime: task.actualTime as number | undefined,
      }) as Task);
    }
  } catch {
    throw new Error('Invalid JSON format');
  }
  throw new Error('Data is not an array of tasks');
}
