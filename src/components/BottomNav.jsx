import { useApp } from '../context/AppContext';
import './BottomNav.css';

const ALL_TABS = [
    { id: 'home',          label: 'Home',     icon: '🏠', roles: ['runner'] },
    { id: 'tasksmap',      label: 'Map',      icon: '🗺️', roles: ['runner'] },
    { id: 'runnersmap',    label: 'Runners',  icon: '📍', roles: ['poster'] },
    { id: 'mytasks',       label: 'My Tasks', icon: '📋', roles: ['poster', 'runner'] },
    { id: 'notifications', label: 'Alerts',   icon: '🔔', roles: ['poster', 'runner'] },
    { id: 'profile',       label: 'Profile',  icon: '👤', roles: ['poster', 'runner'] },
];

export default function BottomNav() {
    const { activeTab, setActiveTab, unreadCount, activeRole } = useApp();

    const visibleTabs = ALL_TABS.filter(t => t.roles.includes(activeRole));

    return (
        <nav className="bottom-nav">
            {visibleTabs.map(tab => (
                <button
                    key={tab.id}
                    className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    <span className="nav-icon">
                        {tab.icon}
                        {tab.id === 'notifications' && unreadCount > 0 && (
                            <span className="badge">{unreadCount}</span>
                        )}
                    </span>
                    <span className="nav-label">{tab.label}</span>
                </button>
            ))}
        </nav>
    );
}
