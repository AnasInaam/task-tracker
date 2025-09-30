"use client";
import { TaskPriority, TaskStatus } from "../types/task";

interface FilterBarProps {
  filter: {
    search?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
    tag?: string;
    sortBy?: string;
  };
  onFilterChange: (filter: any) => void;
  onAddTask: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  totalTasks: number;
  completedTasks: number;
}

const priorities: TaskPriority[] = ["low", "medium", "high"];
const statuses: TaskStatus[] = ["pending", "in-progress", "completed"];

export default function FilterBar({
  filter,
  onFilterChange,
  onAddTask,
  darkMode,
  onToggleDarkMode,
  totalTasks,
  completedTasks,
}: FilterBarProps) {
  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = filter.search || filter.priority || filter.status || filter.tag || filter.sortBy;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            📝 My Tasks
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-gray-600 dark:text-gray-400">
              {completedTasks} of {totalTasks} completed
            </p>
            {totalTasks > 0 && (
              <div className="flex-1 max-w-xs">
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-400 dark:to-gray-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleDarkMode}
            className="p-3 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-600/60 hover:bg-white/90 dark:hover:bg-gray-600/90 transition-all duration-300 shadow-sm"
            title="Toggle dark mode"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>
          
          <button
            onClick={onAddTask}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-400 dark:to-gray-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-600/50 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="sm:col-span-2">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200/60 dark:border-gray-600/60 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="Search tasks..."
                value={filter.search || ""}
                onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
              />
            </div>
          </div>

          {/* Priority Filter */}
          <select
            className="px-4 py-3 rounded-xl border border-gray-200/60 dark:border-gray-600/60 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition-all backdrop-blur-sm"
            value={filter.priority || ""}
            onChange={(e) => onFilterChange({ ...filter, priority: e.target.value || undefined })}
          >
            <option value="">All Priorities</option>
            {priorities.map(priority => (
              <option key={priority} value={priority}>
                {priority === "high" ? "🔥 High" : priority === "medium" ? "⚡ Medium" : "🌱 Low"}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="px-4 py-3 rounded-xl border border-gray-200/60 dark:border-gray-600/60 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition-all backdrop-blur-sm"
            value={filter.status || ""}
            onChange={(e) => onFilterChange({ ...filter, status: e.target.value || undefined })}
          >
            <option value="">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.replace("-", " ").toUpperCase()}
              </option>
            ))}
          </select>

          {/* Tag Filter */}
          <input
            type="text"
            className="px-4 py-3 rounded-xl border border-gray-200/60 dark:border-gray-600/60 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition-all backdrop-blur-sm"
            placeholder="Filter by tag..."
            value={filter.tag || ""}
            onChange={(e) => onFilterChange({ ...filter, tag: e.target.value })}
          />

          {/* Sort By */}
          <select
            className="px-4 py-3 rounded-xl border border-gray-200/60 dark:border-gray-600/60 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition-all backdrop-blur-sm"
            value={filter.sortBy || ""}
            onChange={(e) => onFilterChange({ ...filter, sortBy: e.target.value || undefined })}
          >
            <option value="">Sort: Custom</option>
            <option value="dueDate">📅 Due Date</option>
            <option value="priority">🔥 Priority</option>
            <option value="status">📊 Status</option>
            <option value="title">📝 Title</option>
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}