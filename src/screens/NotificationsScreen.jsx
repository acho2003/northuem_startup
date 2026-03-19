import { useApp } from '../context/AppContext';
import './NotificationsScreen.css';

const iconMap = {
    new_task: '🆕',
    completed: '✅',
    accepted: '🤝',
};

export default function NotificationsScreen() {
    const { notifications, markAllNotificationsRead } = useApp();

    return (
        <div className="screen notifications-screen">
            <div className="notif-header">
                <h2 className="screen-title">Notifications</h2>
                <button className="mark-read-btn" onClick={markAllNotificationsRead}>
                    Mark all read
                </button>
            </div>

            {notifications.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🔔</div>
                    <p>No notifications yet.</p>
                </div>
            ) : (
                <div className="notif-list">
                    {notifications.map(n => (
                        <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                            <div className="notif-icon-wrap">
                                <span className="notif-icon">{iconMap[n.type] || '📌'}</span>
                            </div>
                            <div className="notif-body">
                                <p className="notif-message">{n.message}</p>
                                <span className="notif-time">{n.time}</span>
                            </div>
                            {!n.read && <span className="unread-dot" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
