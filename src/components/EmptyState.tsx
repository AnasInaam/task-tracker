"use client";
import { motion } from "framer-motion";

interface EmptyStateProps {
  hasFilters: boolean;
  onAddTask: () => void;
  onClearFilters: () => void;
}

export default function EmptyState({ hasFilters, onAddTask, onClearFilters }: EmptyStateProps) {
  if (hasFilters) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="mb-6">
          <div className="mx-auto w-24 h-24 bg-gray-100/80 dark:bg-gray-800/80 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No tasks match your filters
          </h3>
          <p className="text-gray-500 dark:text-gray-500 mb-6">
            Try adjusting your search criteria or clear the filters to see all tasks.
          </p>
          <button
            onClick={onClearFilters}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="mb-8">
        <div className="mx-auto w-32 h-32 bg-gradient-to-br from-gray-100/50 to-gray-200/50 dark:from-gray-800/30 dark:to-gray-700/30 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
          <svg className="w-16 h-16 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
          Welcome to your Task Manager! 🎉
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Start organizing your life by creating your first task. Set priorities, due dates, and track your progress.
        </p>
        
        <button
          onClick={onAddTask}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold text-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Your First Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/30 dark:border-gray-600/20">
          <div className="w-12 h-12 bg-gray-100/80 dark:bg-gray-700/80 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Organize Tasks</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create, edit, and organize your tasks with priorities, due dates, and custom tags.
          </p>
        </div>

        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/30 dark:border-gray-600/20">
          <div className="w-12 h-12 bg-gray-100/80 dark:bg-gray-700/80 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
            </svg>
          </div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Track Progress</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Monitor your productivity with visual progress tracking and completion statistics.
          </p>
        </div>

        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/30 dark:border-gray-600/20">
          <div className="w-12 h-12 bg-gray-100/80 dark:bg-gray-700/80 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          </div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Stay Organized</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Filter, search, and sort your tasks to stay focused on what matters most.
          </p>
        </div>
      </div>
    </motion.div>
  );
}