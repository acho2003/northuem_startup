// ─── Tasks API ────────────────────────────────────────────────────────────────
import { getTasks, saveTasks } from './db';
import { mockTasks } from '../data/mockData';

/**
 * Seed tasks from mockData if the db is empty.
 */
export function seedTasks() {
  const existing = getTasks();
  if (existing.length === 0) {
    saveTasks(mockTasks.map((t) => ({ ...t })));
  }
}

/**
 * Return all tasks.
 */
export function apiGetTasks() {
  return getTasks();
}

/**
 * Add a new task.
 */
export function apiAddTask(taskData) {
  const tasks = getTasks();
  const newTask = {
    ...taskData,
    id: 't_' + Date.now(),
    status: 'available',
    postedAt: 'Just now',
    pos: {
      top: Math.round(20 + Math.random() * 55) + '%',
      left: Math.round(20 + Math.random() * 55) + '%',
    },
  };
  saveTasks([newTask, ...tasks]);
  return newTask;
}

/**
 * Accept a task (runner picks it up).
 */
export function apiAcceptTask(taskId, runnerId) {
  const tasks = getTasks();
  const updated = tasks.map((t) =>
    t.id === taskId ? { ...t, status: 'accepted', runnerId } : t
  );
  saveTasks(updated);
  return updated;
}

/**
 * Update the status of a task.
 */
export function apiUpdateTaskStatus(taskId, status) {
  const tasks = getTasks();
  const updated = tasks.map((t) =>
    t.id === taskId ? { ...t, status } : t
  );
  saveTasks(updated);
  return updated;
}

/**
 * Submit a rating for a task.
 */
export function apiSubmitRating(taskId, rating) {
  const tasks = getTasks();
  const updated = tasks.map((t) =>
    t.id === taskId ? { ...t, userRating: rating } : t
  );
  saveTasks(updated);
  return updated;
}

/**
 * Cancel a task posted by the user.
 */
export function apiCancelTask(taskId) {
  const tasks = getTasks();
  const updated = tasks.filter((t) => t.id !== taskId);
  saveTasks(updated);
  return updated;
}
