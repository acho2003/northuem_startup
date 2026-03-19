// ─── Notifications API ─────────────────────────────────────────────────────────
import { getNotifications, saveNotifications } from './db';
import { mockNotifications } from '../data/mockData';

/**
 * Seed mock notifications if empty.
 */
export function seedNotifications() {
  const existing = getNotifications();
  if (existing.length === 0) {
    saveNotifications([...mockNotifications]);
  }
}

export function apiGetNotifications() {
  return getNotifications();
}

export function apiAddNotification(notification) {
  const notes = getNotifications();
  const n = {
    id: 'n_' + Date.now(),
    time: 'Just now',
    read: false,
    ...notification,
  };
  const updated = [n, ...notes];
  saveNotifications(updated);
  return updated;
}

export function apiMarkAllRead() {
  const notes = getNotifications().map((n) => ({ ...n, read: true }));
  saveNotifications(notes);
  return notes;
}
