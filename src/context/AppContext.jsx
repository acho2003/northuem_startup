import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiDemoLogin, apiLogin, apiSignUp, apiUpdateUser } from '../api/auth';
import {
  apiGetTasks, apiAddTask, apiAcceptTask,
  apiUpdateTaskStatus, apiSubmitRating, apiCancelTask, seedTasks,
} from '../api/tasks';
import {
  apiGetNotifications, apiAddNotification,
  apiMarkAllRead, seedNotifications,
} from '../api/notifications';
import { mockRunners } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [runners] = useState([...mockRunners]);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [locationFilter, setLocationFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [ratingTarget, setRatingTarget] = useState(null);
  const [authError, setAuthError] = useState('');

  // ── Bootstrap from backend ─────────────────────────────────────────────────
  const loadData = useCallback(() => {
    seedTasks();
    seedNotifications();
    setTasks(apiGetTasks());
    setNotifications(apiGetNotifications());
  }, []);

  // ── Auth ───────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setAuthError('');
    try {
      const user = apiLogin({ email, password });
      setCurrentUser(user);
      setIsAuthenticated(true);
      loadData();
      setActiveTab('home');
    } catch (e) {
      setAuthError(e.message);
    }
  }, [loadData]);

  const signUp = useCallback(async ({ name, email, password, vehicle }) => {
    setAuthError('');
    try {
      const user = apiSignUp({ name, email, password, vehicle });
      setCurrentUser(user);
      setIsAuthenticated(true);
      loadData();
      setActiveTab('home');
    } catch (e) {
      setAuthError(e.message);
    }
  }, [loadData]);

  const demoLogin = useCallback(() => {
    setAuthError('');
    const user = apiDemoLogin();
    setCurrentUser(user);
    setIsAuthenticated(true);
    loadData();
    setActiveTab('home');
  }, [loadData]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setTasks([]);
    setNotifications([]);
    setActiveTab('home');
    setAuthError('');
  }, []);

  // ── Role switching (the core new feature) ──────────────────────────────────
  const switchRole = useCallback((role) => {
    const updated = apiUpdateUser({ activeRole: role });
    setCurrentUser(updated);
    setActiveTab('home');
  }, []);

  // ── User toggles ──────────────────────────────────────────────────────────
  const toggleOnline = useCallback(() => {
    if (!currentUser.isOnline) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1500);
    }
    const updated = apiUpdateUser({ isOnline: !currentUser.isOnline });
    setCurrentUser(updated);
  }, [currentUser]);

  // ── Task actions ──────────────────────────────────────────────────────────
  const addPost = useCallback((postData) => {
    const newTask = apiAddTask({
      ...postData,
      posterId: currentUser.id,
      posterName: currentUser.name,
      posterRating: currentUser.rating,
    });
    setTasks(apiGetTasks());
    setActiveTab('home');
    const notes = apiAddNotification({
      type: 'new_task',
      message: `You posted: ${newTask.title}`,
    });
    setNotifications(notes);
  }, [currentUser]);

  const acceptTask = useCallback((taskId) => {
    apiAcceptTask(taskId, currentUser.id);
    setTasks(apiGetTasks());
    // Switch to runner view after accepting
    setActiveTab('mytasks');
    const notes = apiAddNotification({
      type: 'accepted',
      message: `You accepted a delivery! Check My Tasks.`,
    });
    setNotifications(notes);
  }, [currentUser]);

  const updateTaskStatus = useCallback((taskId, status) => {
    apiUpdateTaskStatus(taskId, status);
    setTasks(apiGetTasks());
    if (status === 'completed') {
      setRatingTarget({ taskId });
      const notes = apiAddNotification({
        type: 'completed',
        message: `Delivery completed! Please rate the customer.`,
      });
      setNotifications(notes);
      const updated = apiUpdateUser({ tasksCompleted: (currentUser.tasksCompleted || 0) + 1 });
      setCurrentUser(updated);
    }
  }, [currentUser]);

  const submitRating = useCallback((taskId, rating) => {
    apiSubmitRating(taskId, rating);
    setTasks(apiGetTasks());
    setRatingTarget(null);
  }, []);

  const cancelTask = useCallback((taskId) => {
    apiCancelTask(taskId);
    setTasks(apiGetTasks());
    const notes = apiAddNotification({
      type: 'cancelled',
      message: `Your task was cancelled.`,
    });
    setNotifications(notes);
  }, []);

  // ── Notifications ──────────────────────────────────────────────────────────
  const markAllNotificationsRead = useCallback(() => {
    const notes = apiMarkAllRead();
    setNotifications(notes);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ── Derived data ───────────────────────────────────────────────────────────
  const activeRole = currentUser?.activeRole ?? 'poster';

  const availableTasks = tasks.filter((t) => {
    if (activeRole === 'runner' && !currentUser?.isOnline) return false;
    if (t.status !== 'available') return false;
    if (
      locationFilter !== 'All' &&
      !t.pickup.includes(locationFilter) &&
      !t.dropoff.includes(locationFilter)
    ) return false;
    return true;
  });

  // Poster → tasks the user posted. Runner → tasks the user accepted.
  const myTasks = tasks.filter((t) => {
    if (activeRole === 'poster') return t.posterId === currentUser?.id;
    return (
      ['accepted', 'inProgress', 'completed'].includes(t.status) &&
      t.runnerId === currentUser?.id
    );
  });

  return (
    <AppContext.Provider
      value={{
        // auth
        isAuthenticated, login, signUp, demoLogin, logout, authError, setAuthError,
        // user
        currentUser, toggleOnline, activeRole, switchRole,
        // tasks
        tasks, availableTasks, myTasks,
        addPost, acceptTask, updateTaskStatus, submitRating, cancelTask,
        // notifications
        notifications, unreadCount, markAllNotificationsRead,
        // runners (map)
        runners,
        // navigation
        activeTab, setActiveTab,
        selectedTaskId, setSelectedTaskId,
        locationFilter, setLocationFilter,
        // ui misc
        isLoading,
        ratingTarget, setRatingTarget,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
