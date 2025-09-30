"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { Task, TaskFilter } from "../types/task";
import { loadTasks, saveTasks, loadSettings, saveSettings, getTaskStats } from "../utils/storage";
import { getFilteredSortedTasks, createNewTask, updateTask } from "../utils/taskUtils";
import { AnimatePresence, motion } from "framer-motion";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import FilterBar from "../components/FilterBar";
import EmptyState from "../components/EmptyState";

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>({});
  const [settings, setSettings] = useState(loadSettings());
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dragTaskId = useRef<string | null>(null);

  // Load tasks on mount
  useEffect(() => {
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);
    setIsLoading(false);
  }, []);

  // Save tasks when they change
  useEffect(() => {
    if (!isLoading) {
      saveTasks(tasks);
    }
  }, [tasks, isLoading]);

  // Save settings when they change
  useEffect(() => {
    saveSettings(settings);
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Apply dark mode class on mount
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, [settings.darkMode]);

  const stats = getTaskStats(tasks);
  const filteredTasks = getFilteredSortedTasks(tasks, filter);

  // Task operations
  const handleSaveTask = useCallback((taskData: Partial<Task>) => {
    if (editTask) {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === editTask.id ? updateTask(task, taskData) : task
        )
      );
    } else {
      const newTask = createNewTask({
        ...taskData,
        order: tasks.length,
      });
      setTasks(prevTasks => [...prevTasks, newTask]);
    }
    
    setShowForm(false);
    setEditTask(null);
  }, [editTask, tasks.length]);

  const handleEditTask = useCallback((task: Task) => {
    setEditTask(task);
    setShowForm(true);
  }, []);

  const handleDeleteTask = useCallback((id: string) => {
    setTasks(prevTasks => {
      const filtered = prevTasks.filter(task => task.id !== id);
      return filtered.map((task, index) => ({ ...task, order: index }));
    });
  }, []);

  const handleToggleStatus = useCallback((id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === id) {
          const newStatus = task.status === "completed" ? "pending" : "completed";
          return updateTask(task, { status: newStatus });
        }
        return task;
      })
    );
  }, []);

  const handleTagClick = useCallback((tag: string) => {
    setFilter(prevFilter => ({ ...prevFilter, tag }));
  }, []);

  // Drag and drop operations
  const handleDragStart = useCallback((id: string) => {
    dragTaskId.current = id;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, overId: string) => {
    e.preventDefault();
    if (dragTaskId.current && dragTaskId.current !== overId) {
      setTasks(prevTasks => {
        const fromIndex = prevTasks.findIndex(task => task.id === dragTaskId.current);
        const toIndex = prevTasks.findIndex(task => task.id === overId);
        
        if (fromIndex === -1 || toIndex === -1) return prevTasks;
        
        const reordered = [...prevTasks];
        const [movedTask] = reordered.splice(fromIndex, 1);
        reordered.splice(toIndex, 0, movedTask);
        
        return reordered.map((task, index) => ({ ...task, order: index }));
      });
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    dragTaskId.current = null;
  }, []);

  // UI handlers
  const handleAddTask = useCallback(() => {
    setEditTask(null);
    setShowForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditTask(null);
  }, []);

  const handleToggleDarkMode = useCallback(() => {
    setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilter({});
  }, []);

  const hasActiveFilters = Boolean(filter.search || filter.priority || filter.status || filter.tag || filter.sortBy);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black flex items-center justify-center transition-colors duration-500">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-400 dark:border-gray-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-black relative overflow-hidden transition-colors duration-500">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-pattern"></div>
      
      {/* Floating background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gray-200/20 to-transparent dark:from-gray-600/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-gray-300/20 to-transparent dark:from-gray-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-gray-200/30 to-gray-100/30 dark:from-gray-700/20 dark:to-gray-600/20 rounded-full blur-2xl animate-pulse-slow"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header and Filters */}
          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
            onAddTask={handleAddTask}
            darkMode={settings.darkMode}
            onToggleDarkMode={handleToggleDarkMode}
            totalTasks={stats.total}
            completedTasks={stats.completed}
          />

          {/* Quick Stats */}
          {stats.total > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/50 dark:border-gray-600/50">
                <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{stats.total}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</div>
              </div>
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/50 dark:border-gray-600/50">
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stats.completed}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
              </div>
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/50 dark:border-gray-600/50">
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.inProgress}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">In Progress</div>
              </div>
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/50 dark:border-gray-600/50">
                <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{stats.overdue}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Overdue</div>
              </div>
            </motion.div>
          )}

          {/* Task List */}
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <EmptyState
                hasFilters={hasActiveFilters}
                onAddTask={handleAddTask}
                onClearFilters={clearFilters}
              />
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onToggleStatus={handleToggleStatus}
                    onTagClick={handleTagClick}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSave={handleSaveTask}
        editTask={editTask}
      />

      {/* Floating Action Button for Mobile */}
      <motion.button
        onClick={handleAddTask}
        className="fixed bottom-6 right-6 md:hidden w-14 h-14 bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-400 dark:to-gray-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </motion.button>
    </div>
  );
}
