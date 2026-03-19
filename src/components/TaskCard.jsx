import { useApp } from '../context/AppContext';
import StarRating from './StarRating';
import './TaskCard.css';

const STATUS_CONFIG = {
    available:  { label: 'Open',         color: '#43d9ad' },
    accepted:   { label: 'Runner Found', color: '#f7a440' },
    inProgress: { label: 'In Transit',   color: '#3b9eff' },
    completed:  { label: 'Delivered',    color: '#a78bfa' },
};

export default function TaskCard({ task, showStatus = false }) {
    const { setSelectedTaskId, setActiveTab, acceptTask, activeRole } = useApp();

    const handleView = () => {
        setSelectedTaskId(task.id);
        setActiveTab('taskdetail');
    };

    const handleAccept = (e) => {
        e.stopPropagation();
        acceptTask(task.id);
    };

    const categoryColors = {
        Car: '#6c63ff',
        Bike: '#43d9ad',
        'Truck/Van': '#f7a440',
    };
    const color = categoryColors[task.category] || '#3b9eff';
    const statusInfo = STATUS_CONFIG[task.status] || { label: task.status, color: '#888' };

    return (
        <div className="task-card" onClick={handleView}>
            <div className="task-card-header">
                <div className="task-category-badge" style={{ background: color + '22', color }}>
                    {task.category}
                </div>
                {showStatus ? (
                    <span className="task-status-pill" style={{ color: statusInfo.color, background: statusInfo.color + '22' }}>
                        {statusInfo.label}
                    </span>
                ) : (
                    <span className="task-posted">{task.postedAt}</span>
                )}
            </div>

            <h3 className="task-title">{task.title}</h3>
            <p className="task-desc">{task.shortDesc}</p>

            <div className="task-route">
                <div className="route-point">
                    <span className="route-dot pickup" />
                    <span className="route-text text-truncate">{task.pickup}</span>
                </div>
                <div className="route-line" />
                <div className="route-point">
                    <span className="route-dot dropoff" />
                    <span className="route-text text-truncate">{task.dropoff}</span>
                </div>
            </div>

            <div className="task-meta">
                <span className="task-time">⏱ {task.estimatedTime}</span>
                <span className="task-dist">🗺️ {task.distance}</span>
            </div>

            <div className="task-footer">
                <div className="task-poster-info">
                    <span className="avatar-sm">{task.posterName.split(' ').map(n => n[0]).join('')}</span>
                    <StarRating rating={task.posterRating} size="sm" />
                </div>
                <div className="task-right">
                    <span className="task-reward">BTN {task.reward}</span>
                    {/* Show Accept only for runners viewing available tasks */}
                    {activeRole === 'runner' && task.status === 'available' && (
                        <button className="btn-accept" onClick={handleAccept}>
                            Accept
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
