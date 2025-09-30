"use client";
import { motion } from "framer-motion";
import { Task } from "../types/task";
import { useState } from "react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onTagClick: (tag: string) => void;
  onDragStart: (id: string) => void;
  onDragOver: (e: React.DragEvent, overId: string) => void;
  onDragEnd: () => void;
}

const priorityColors = {
  low: "border-gray-300 bg-gray-50/80 dark:bg-gray-850/30",
  medium: "border-gray-400 bg-gray-100/80 dark:bg-gray-800/30",
  high: "border-gray-600 bg-gray-200/80 dark:bg-gray-700/30",
};

const statusColors = {
  pending: "bg-gray-100/80 text-gray-700 dark:bg-gray-800/80 dark:text-gray-300",
  "in-progress": "bg-gray-200/80 text-gray-800 dark:bg-gray-700/80 dark:text-gray-200",
  completed: "bg-gray-300/80 text-gray-800 dark:bg-gray-600/80 dark:text-gray-200",
};

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
  onTagClick,
  onDragStart,
  onDragOver,
  onDragEnd,
}: TaskCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(task.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "completed";
  const isToday = new Date(task.dueDate).toDateString() === new Date().toDateString();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      draggable
      onDragStart={() => onDragStart(task.id)}
      onDragOver={(e) => onDragOver(e, task.id)}
      onDragEnd={onDragEnd}
      className={`
        group relative rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-grab active:cursor-grabbing
        border-l-4 ${priorityColors[task.priority]}
        ${task.status === "completed" ? "opacity-70" : ""}
        ${isOverdue ? "ring-2 ring-rose-300 dark:ring-rose-600" : ""}
        backdrop-blur-sm border border-white/50 dark:border-gray-600/30 bg-white/70 dark:bg-gray-800/70
      `}
    >
      {/* Overdue indicator */}
      {isOverdue && (
        <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
          Overdue
        </div>
      )}

      {/* Today indicator */}
      {isToday && !isOverdue && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
          Today
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="flex-shrink-0 mt-1">
          <input
            type="checkbox"
            checked={task.status === "completed"}
            onChange={() => onToggleStatus(task.id)}
            className="w-5 h-5 rounded accent-gray-600 cursor-pointer"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Priority */}
          <div className="flex items-center gap-2 mb-2">
            <h3
              className={`font-semibold text-lg ${
                task.status === "completed" ? "line-through text-gray-500" : ""
              } truncate`}
            >
              {task.title}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full capitalize ${statusColors[task.status]}`}>
              {task.status.replace("-", " ")}
            </span>
          </div>

          {/* Description */}
          {task.description && (
            <p
              className={`text-sm text-gray-600 dark:text-gray-400 mb-3 ${
                isExpanded ? "" : "line-clamp-2"
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Due Date and Priority */}
          <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
            <span
              className={`px-2 py-1 rounded ${
                isOverdue
                  ? "bg-rose-100/80 text-rose-700 dark:bg-rose-900/80 dark:text-rose-300"
                  : isToday
                  ? "bg-blue-100/80 text-blue-700 dark:bg-blue-900/80 dark:text-blue-300"
                  : "bg-gray-100/80 text-gray-700 dark:bg-gray-800/80 dark:text-gray-300"
              }`}
            >
              📅 {new Date(task.dueDate).toLocaleDateString()}
            </span>
            <span
              className={`px-2 py-1 rounded capitalize ${
                task.priority === "high"
                  ? "bg-gray-600/80 text-white dark:bg-gray-400/80 dark:text-black"
                  : task.priority === "medium"
                  ? "bg-gray-400/80 text-white dark:bg-gray-500/80 dark:text-white"
                  : "bg-gray-200/80 text-gray-800 dark:bg-gray-700/80 dark:text-gray-200"
              }`}
            >
              {task.priority === "high" ? "🔥" : task.priority === "medium" ? "⚡" : "🌱"} {task.priority}
            </span>
          </div>

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  onClick={() => onTagClick(tag)}
                  className="text-xs bg-gray-100/80 text-gray-700 dark:bg-gray-700/80 dark:text-gray-300 px-2 py-1 rounded-full cursor-pointer hover:bg-gray-200/80 dark:hover:bg-gray-600/80 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Expand/Collapse button for long descriptions */}
          {task.description && task.description.length > 100 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-gray-600 dark:text-gray-400 hover:underline mb-2"
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            title="Edit task"
          >
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className={`p-2 rounded-lg transition-colors ${
              showDeleteConfirm
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
            }`}
            title={showDeleteConfirm ? "Click again to confirm" : "Delete task"}
          >
            <svg className={`w-4 h-4 ${showDeleteConfirm ? "text-white" : "text-red-600 dark:text-red-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}