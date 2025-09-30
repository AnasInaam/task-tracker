import { Task, TaskFilter, TaskPriority, TaskStatus } from '../types/task';

export function getFilteredSortedTasks(tasks: Task[], filter: TaskFilter) {
  let filtered = [...tasks];

  // Apply filters
  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    filtered = filtered.filter(task => 
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  if (filter.priority) {
    filtered = filtered.filter(task => task.priority === filter.priority);
  }

  if (filter.status) {
    filtered = filtered.filter(task => task.status === filter.status);
  }

  if (filter.tag) {
    filtered = filtered.filter(task => 
      task.tags.some(tag => tag.toLowerCase().includes(filter.tag!.toLowerCase()))
    );
  }

  if (filter.overdue) {
    const today = new Date();
    filtered = filtered.filter(task => 
      task.status !== 'completed' && new Date(task.dueDate) < today
    );
  }

  if (filter.today) {
    const today = new Date().toDateString();
    filtered = filtered.filter(task => 
      new Date(task.dueDate).toDateString() === today
    );
  }

  // Apply sorting
  if (filter.sortBy) {
    const priorities: TaskPriority[] = ['low', 'medium', 'high'];
    const statuses: TaskStatus[] = ['pending', 'in-progress', 'completed'];

    filtered.sort((a, b) => {
      switch (filter.sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          return priorities.indexOf(b.priority) - priorities.indexOf(a.priority);
        case 'status':
          return statuses.indexOf(a.status) - statuses.indexOf(b.status);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return a.order - b.order;
      }
    });
  } else {
    // Default sort by order
    filtered.sort((a, b) => a.order - b.order);
  }

  return filtered;
}

export function isTaskOverdue(task: Task): boolean {
  if (task.status === 'completed') return false;
  return new Date(task.dueDate) < new Date(new Date().toDateString());
}

export function isTaskToday(task: Task): boolean {
  return new Date(task.dueDate).toDateString() === new Date().toDateString();
}

export function formatDueDate(dueDate: string): string {
  const date = new Date(dueDate);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else if (date < today) {
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays > 1 ? 's' : ''} overdue`;
  } else {
    return date.toLocaleDateString();
  }
}

export function getPriorityIcon(priority: TaskPriority): string {
  switch (priority) {
    case 'high':
      return '🔥';
    case 'medium':
      return '⚡';
    case 'low':
      return '🌱';
    default:
      return '📝';
  }
}

export function getStatusIcon(status: TaskStatus): string {
  switch (status) {
    case 'completed':
      return '✅';
    case 'in-progress':
      return '🔄';
    case 'pending':
      return '⏳';
    default:
      return '📝';
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function validateTask(task: Partial<Task>): string[] {
  const errors: string[] = [];

  if (!task.title?.trim()) {
    errors.push('Title is required');
  }

  if (!task.dueDate) {
    errors.push('Due date is required');
  } else if (new Date(task.dueDate) < new Date(new Date().toDateString())) {
    errors.push('Due date cannot be in the past');
  }

  return errors;
}

export function createNewTask(data: Partial<Task>): Task {
  const now = new Date().toISOString();
  
  return {
    id: data.id || generateId(),
    title: data.title || '',
    description: data.description || '',
    dueDate: data.dueDate || '',
    priority: data.priority || 'medium',
    status: data.status || 'pending',
    tags: data.tags || [],
    order: data.order || 0,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
    subtasks: data.subtasks || [],
    estimatedTime: data.estimatedTime,
    actualTime: data.actualTime,
    completedAt: data.completedAt,
  };
}

export function updateTask(existingTask: Task, updates: Partial<Task>): Task {
  const updatedTask = {
    ...existingTask,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Handle status change to completed
  if (updates.status === 'completed' && existingTask.status !== 'completed') {
    updatedTask.completedAt = new Date().toISOString();
  } else if (updates.status !== 'completed') {
    delete updatedTask.completedAt;
  }

  return updatedTask;
}