"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Task, TaskPriority, TaskStatus } from "../types/task";
import { useState, useEffect } from "react";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  editTask?: Task | null;
}

const priorities: TaskPriority[] = ["low", "medium", "high"];
const statuses: TaskStatus[] = ["pending", "in-progress", "completed"];

export default function TaskForm({ isOpen, onClose, onSave, editTask }: TaskFormProps) {
  const [form, setForm] = useState<Partial<Task>>({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "pending",
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editTask) {
      setForm(editTask);
    } else {
      setForm({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        status: "pending",
        tags: [],
      });
    }
    setTagInput("");
    setErrors({});
  }, [editTask, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!form.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else if (new Date(form.dueDate) < new Date(new Date().toDateString())) {
      newErrors.dueDate = "Due date cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(form);
      onClose();
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags?.includes(tagInput.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.target === e.currentTarget) {
      e.preventDefault();
      addTag();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200/50 dark:border-gray-600/30"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {editTask ? "Edit Task" : "Create New Task"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={form.title || ""}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.title ? "border-rose-500" : "border-gray-200/50 dark:border-gray-600/30"
                } bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition-colors backdrop-blur-sm`}
                placeholder="Enter task title..."
              />
              {errors.title && <p className="text-rose-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={form.description || ""}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-200/50 dark:border-gray-600/30 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition-colors resize-none backdrop-blur-sm"
                placeholder="Enter task description..."
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                value={form.dueDate ? form.dueDate.slice(0, 10) : ""}
                onChange={(e) => setForm(prev => ({ ...prev, dueDate: e.target.value }))}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.dueDate ? "border-rose-500" : "border-gray-200/50 dark:border-gray-600/30"
                } bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition-colors backdrop-blur-sm`}
              />
              {errors.dueDate && <p className="text-rose-500 text-sm mt-1">{errors.dueDate}</p>}
            </div>

            {/* Priority and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={form.priority || "medium"}
                  onChange={(e) => setForm(prev => ({ ...prev, priority: e.target.value as TaskPriority }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200/50 dark:border-gray-600/30 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition-colors backdrop-blur-sm"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>
                      {priority === "high" ? "🔥 High" : priority === "medium" ? "⚡ Medium" : "🌱 Low"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={form.status || "pending"}
                  onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as TaskStatus }))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200/50 dark:border-gray-600/30 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition-colors backdrop-blur-sm"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status.replace("-", " ").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200/50 dark:border-gray-600/30 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent transition-colors backdrop-blur-sm"
                  placeholder="Add a tag..."
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Add
                </button>
              </div>
              {form.tags && form.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-gray-100/80 text-gray-700 dark:bg-gray-700/80 dark:text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-medium shadow-md"
              >
                {editTask ? "Update Task" : "Create Task"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-200/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300/80 dark:hover:bg-gray-600/80 transition-colors font-medium backdrop-blur-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}