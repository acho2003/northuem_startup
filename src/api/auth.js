// ─── Auth API ─────────────────────────────────────────────────────────────────
import { getUser, saveUser, clearUser } from './db';

/**
 * Generate a consistent avatar initials string from a name.
 */
function makeAvatar(name) {
  return name
    .split(' ')
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * Simulate sign-up: stores user in localStorage, returns user object.
 * One user can be both poster & runner — role is toggled at runtime.
 */
export function apiSignUp({ name, email, password, vehicle }) {
  // Check if email is already taken
  const existing = getUser();
  if (existing && existing.email === email) {
    throw new Error('An account with this email already exists. Please log in.');
  }

  const user = {
    id: 'u_' + Date.now(),
    name,
    email,
    // NOTE: never store plain passwords in production — this is a demo
    _pw: password,
    avatar: makeAvatar(name),
    vehicle: vehicle || 'Car 🚗',
    rating: 5.0,
    tasksCompleted: 0,
    isOnline: false,
    activeRole: 'poster', // default role when first joining
    reviews: [],
    joinedAt: new Date().toISOString(),
  };

  saveUser(user);
  return user;
}

/**
 * Simulate login: checks stored credentials, returns user object.
 */
export function apiLogin({ email, password }) {
  const user = getUser();
  if (!user) throw new Error('No account found. Please sign up first.');
  if (user.email !== email) throw new Error('Invalid email or password.');
  if (user._pw !== password) throw new Error('Invalid email or password.');
  return user;
}

/**
 * Demo fast-login: bypass auth check.
 */
export function apiDemoLogin() {
  let user = getUser();
  if (!user) {
    // Create a demo account on the fly
    user = {
      id: 'u_demo',
      name: 'Demo User',
      email: 'demo@druk.bt',
      _pw: 'demo1234',
      avatar: 'DU',
      vehicle: 'Car 🚗',
      rating: 4.7,
      tasksCompleted: 12,
      isOnline: true,
      activeRole: 'poster',
      reviews: [
        { from: 'Kinley', rating: 5, comment: 'Very reliable and fast!' },
        { from: 'Pema', rating: 4, comment: 'Good communication.' },
      ],
      joinedAt: new Date().toISOString(),
    };
    saveUser(user);
  }
  return user;
}

/**
 * Update user fields and persist.
 */
export function apiUpdateUser(updates) {
  const user = getUser();
  if (!user) throw new Error('Not logged in.');
  const updated = { ...user, ...updates };
  saveUser(updated);
  return updated;
}

/**
 * Logout: clears session (but keeps user data).
 */
export function apiLogout() {
  // We keep the user record (password/email) so they can log back in.
  // We don't call clearUser() — we just signal logged-out in app state.
}
