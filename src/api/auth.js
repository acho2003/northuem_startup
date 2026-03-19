// ─── Auth API ─────────────────────────────────────────────────────────────────
import { getUser, saveUser, clearUser, dbGet, dbSet } from './db';

const KEYS = {
  ALL_USERS: 'druk_all_users'
};

/**
 * Generate a consistent avatar initials string from a name.
 */
function makeAvatar(name) {
  return name
    .split(' ')
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
}

export const DEMO_USERS = [
  {
      id: 'u_pema',
      name: 'Pema Lhamo',
      email: 'pema@druk.bt',
      _pw: 'demo1234',
      avatar: 'PL',
      vehicle: 'Car 🚗',
      rating: 4.8,
      tasksCompleted: 42,
      isOnline: true,
      activeRole: 'poster',
      reviews: [
        { from: 'Jigme', rating: 5, comment: 'Great customer!' }
      ],
      joinedAt: new Date().toISOString(),
  },
  {
      id: 'u_tenzin',
      name: 'Tenzin Dorji',
      email: 'tenzin@druk.bt',
      _pw: 'demo1234',
      avatar: 'TD',
      vehicle: 'Bike 🚲',
      rating: 4.9,
      tasksCompleted: 156,
      isOnline: true,
      activeRole: 'runner',
      reviews: [
        { from: 'Karma', rating: 5, comment: 'Very fast delivery.' }
      ],
      joinedAt: new Date().toISOString(),
  }
];

/**
 * Simulate sign-up: stores user in localStorage, returns user object.
 */
export function apiSignUp({ name, email, password, vehicle }) {
  const allUsers = dbGet(KEYS.ALL_USERS, []);
  if (allUsers.find((u) => u.email === email)) {
    throw new Error('An account with this email already exists.');
  }

  const user = {
    id: 'u_' + Date.now(),
    name,
    email,
    _pw: password,
    avatar: makeAvatar(name),
    vehicle: vehicle || 'Car 🚗',
    rating: 5.0,
    tasksCompleted: 0,
    isOnline: false,
    activeRole: 'poster',
    reviews: [],
    joinedAt: new Date().toISOString(),
  };

  allUsers.push(user);
  dbSet(KEYS.ALL_USERS, allUsers);
  saveUser(user);
  return user;
}

/**
 * Simulate login: checks stored credentials, returns user object.
 */
export function apiLogin({ email, password }) {
  const allUsers = dbGet(KEYS.ALL_USERS, []);
  const user = allUsers.find((u) => u.email === email && u._pw === password);
  if (!user) throw new Error('Invalid email or password.');
  
  saveUser(user);
  return user;
}

/**
 * Demo fast-login: logs in as a specific concrete user out of our DEMO_USERS.
 */
export function apiDemoLogin(userId) {
  let allUsers = dbGet(KEYS.ALL_USERS, []);
  
  // Ensure our demo users exist in the "database"
  DEMO_USERS.forEach((du) => {
    if (!allUsers.find((u) => u.id === du.id)) {
      allUsers.push(du);
    }
  });
  dbSet(KEYS.ALL_USERS, allUsers);

  const targetUser = allUsers.find((u) => u.id === userId) || DEMO_USERS[0];
  saveUser(targetUser);
  return targetUser;
}

/**
 * Update user fields and persist globally.
 */
export function apiUpdateUser(updates) {
  const user = getUser();
  if (!user) throw new Error('Not logged in.');
  
  const updated = { ...user, ...updates };
  saveUser(updated);
  
  const allUsers = dbGet(KEYS.ALL_USERS, []);
  const index = allUsers.findIndex((u) => u.id === updated.id);
  if (index !== -1) {
    allUsers[index] = updated;
    dbSet(KEYS.ALL_USERS, allUsers);
  }
  
  return updated;
}

/**
 * Logout: just clears the session.
 */
export function apiLogout() {
  clearUser();
}
