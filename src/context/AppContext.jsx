import { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, mockTasks, mockNotifications, mockRunners } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // We initialize to a fast default, but on fast-login we swap these
    const [currentUser, setCurrentUser] = useState({ ...mockUsers[0] });

    const [tasks, setTasks] = useState(mockTasks.map(t => ({ ...t })));
    const [notifications, setNotifications] = useState([...mockNotifications]);
    const [runners, setRunners] = useState([...mockRunners]);
    const [activeTab, setActiveTab] = useState('home');
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [locationFilter, setLocationFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(false);
    const [ratingTarget, setRatingTarget] = useState(null);

    const login = (role) => {
        // Select the demo user based on role
        const mockUser = role === 'runner'
            ? mockUsers.find(u => u.role === 'runner')
            : mockUsers.find(u => u.role === 'poster');

        // In case no mock user matched, default to the first
        setCurrentUser(mockUser ? { ...mockUser } : { ...mockUsers[0] });
        setIsAuthenticated(true);
        setActiveTab('home');
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    const toggleOnline = () => {
        if (!currentUser.isOnline) {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 1500);
        }
        setCurrentUser(u => ({ ...u, isOnline: !u.isOnline }));
    };

    const addPost = (postData) => {
        const newTask = {
            ...postData,
            id: 't_' + Date.now(),
            posterId: currentUser.id,
            posterName: currentUser.name,
            posterRating: currentUser.rating,
            status: 'available',
            postedAt: 'Just now',
        };
        setTasks(prev => [newTask, ...prev]);
        setActiveTab('home');
        setNotifications(prev => [
            { id: 'n_' + Date.now(), type: 'new_task', message: `You successfully posted: ${newTask.title}`, time: 'Just now', read: false },
            ...prev
        ]);
    };

    const acceptTask = (taskId) => {
        setTasks(prev =>
            prev.map(t => t.id === taskId ? { ...t, status: 'accepted', runnerId: currentUser.id } : t)
        );
        setActiveTab('mytasks');
        setNotifications(prev => [
            { id: 'n_' + Date.now(), type: 'accepted', message: `You accepted a delivery! It's now in your task list.`, time: 'Just now', read: false },
            ...prev,
        ]);
    };

    const updateTaskStatus = (taskId, status) => {
        setTasks(prev =>
            prev.map(t => t.id === taskId ? { ...t, status } : t)
        );
        if (status === 'completed') {
            setRatingTarget({ taskId });
            setNotifications(prev => [
                { id: 'n_' + Date.now(), type: 'completed', message: `Delivery marked as Completed. Please rate the customer.`, time: 'Just now', read: false },
                ...prev,
            ]);
            setCurrentUser(u => ({ ...u, tasksCompleted: u.tasksCompleted + 1 }));
        }
    };

    const submitRating = (taskId, rating) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, userRating: rating } : t));
        setRatingTarget(null);
    };

    const markAllNotificationsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const availableTasks = tasks.filter(t => {
        if (!currentUser.isOnline && currentUser.role === 'runner') return false;
        if (t.status !== 'available') return false;
        if (locationFilter !== 'All' && !t.pickup.includes(locationFilter) && !t.dropoff.includes(locationFilter)) return false;
        return true;
    });

    // Posters see tasks they'posted'. Runners see 'accepted' tasks.
    const myTasks = tasks.filter(t => {
        if (currentUser.role === 'poster') {
            return t.posterId === currentUser.id;
        } else {
            return ['accepted', 'inProgress', 'completed'].includes(t.status) && t.runnerId === currentUser.id;
        }
    });

    return (
        <AppContext.Provider value={{
            isAuthenticated, login, logout,
            currentUser, toggleOnline,
            tasks, availableTasks, myTasks,
            notifications, unreadCount, markAllNotificationsRead, setNotifications,
            runners,
            activeTab, setActiveTab,
            selectedTaskId, setSelectedTaskId,
            locationFilter, setLocationFilter,
            isLoading,
            acceptTask, updateTaskStatus, addPost,
            ratingTarget, setRatingTarget, submitRating,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
