import { useApp } from '../context/AppContext';
import './BottomNav.css';

const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'runnersmap', label: 'Runners', icon: '📍' },
    { id: 'mytasks', label: 'My Tasks', icon: '📋' },
    { id: 'notifications', label: 'Alerts', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
];

export default function BottomNav() {
    const { activeTab, setActiveTab, unreadCount } = useApp();

    return (
        <nav className="bottom-nav">
            {tabs.map(tab => (
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
