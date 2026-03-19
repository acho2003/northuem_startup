// ─── localStorage-based "database" ───────────────────────────────────────────
// Key names
const KEYS = {
  USER: 'druk_user',
  TASKS: 'druk_tasks',
  NOTIFICATIONS: 'druk_notifications',
};

// --------------- Generic helpers ---------------
export function dbGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function dbSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function dbRemove(key) {
  localStorage.removeItem(key);
}

// --------------- Typed helpers ---------------
export function getUser() {
  return dbGet(KEYS.USER, null);
}

export function saveUser(user) {
  dbSet(KEYS.USER, user);
}

export function clearUser() {
  dbRemove(KEYS.USER);
}

export function getTasks() {
  return dbGet(KEYS.TASKS, []);
}

export function saveTasks(tasks) {
  dbSet(KEYS.TASKS, tasks);
}

export function getNotifications() {
  return dbGet(KEYS.NOTIFICATIONS, []);
}

export function saveNotifications(notifications) {
  dbSet(KEYS.NOTIFICATIONS, notifications);
}

export { KEYS };
