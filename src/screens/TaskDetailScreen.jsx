import { useState } from 'react';
import { useApp } from '../context/AppContext';
import StarRating from '../components/StarRating';
import './TaskDetailScreen.css';

export default function TaskDetailScreen() {
    const { tasks, selectedTaskId, acceptTask, setActiveTab, updateTaskStatus, ratingTarget, submitRating } = useApp();
    const task = tasks.find(t => t.id === selectedTaskId);
    const [hoverRating, setHoverRating] = useState(0);
    const [chosenRating, setChosenRating] = useState(0);
    const [ratingSubmitted, setRatingSubmitted] = useState(false);

    if (!task) return null;

    const isAccepted = ['accepted', 'inProgress', 'completed'].includes(task.status);
    const isCompleted = task.status === 'completed';
    const needsRating = ratingTarget?.taskId === task.id && !ratingSubmitted;

    const handleAccept = () => acceptTask(task.id);
    const handleStatusChange = (status) => updateTaskStatus(task.id, status);

    const handleSubmitRating = () => {
        if (chosenRating === 0) return;
        submitRating(task.id, chosenRating);
        setRatingSubmitted(true);
    };

    const categoryColors = {
        Car: '#6c63ff', Bike: '#43d9ad', 'Truck/Van': '#f7a440',
    };
    const color = categoryColors[task.category] || '#3b9eff';

    return (
        <div className="screen task-detail-screen">
            <div className="detail-header">
                <button className="back-btn" onClick={() => setActiveTab('home')}>← Back</button>
                <span className="detail-category-badge" style={{ background: color + '22', color }}>
                    🚚 {task.category}
                </span>
            </div>

            <div className="detail-hero" style={{ borderColor: color }}>
                <h2 className="detail-title">{task.title}</h2>
                <div className="detail-reward">BTN {task.reward}</div>
            </div>

            <div className="detail-route-card">
                <div className="route-leg">
                    <span className="route-icon pickup-icon" />
                    <div className="route-info">
                        <p className="route-label">Pick Up</p>
                        <p className="route-address">{task.pickup}</p>
                    </div>
                </div>
                <div className="route-connector" />
                <div className="route-leg">
                    <span className="route-icon dropoff-icon" />
                    <div className="route-info">
                        <p className="route-label">Drop Off</p>
                        <p className="route-address">{task.dropoff}</p>
                    </div>
                </div>
            </div>

            <div className="detail-meta-row">
                <div className="detail-meta-item"><span className="meta-icon">⏱</span><span>ETA {task.estimatedTime}</span></div>
                <div className="detail-meta-item"><span className="meta-icon">🗺️</span><span>{task.distance}</span></div>
                <div className="detail-meta-item"><span className="meta-icon">🕐</span><span>{task.postedAt}</span></div>
            </div>

            <div className="detail-section">
                <h4>Description & Instructions</h4>
                <p className="detail-desc">{task.fullDesc}</p>
            </div>

            <div className="detail-section poster-section">
                <h4>Customer</h4>
                <div className="poster-row">
                    <div className="avatar-md" style={{ background: color }}>{task.posterName.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                        <p className="poster-name">{task.posterName}</p>
                        <StarRating rating={task.userRating ?? task.posterRating} size="sm" />
                    </div>
                </div>
            </div>

            {needsRating && (
                <div className="rating-modal-inline">
                    <h4>Rate the Customer</h4>
                    <p>How was your experience delivering for {task.posterName}?</p>
                    <div className="interactive-stars">
                        {[1, 2, 3, 4, 5].map(s => (
                            <span
                                key={s}
                                className={`star-lg ${s <= (hoverRating || chosenRating) ? 'filled' : ''}`}
                                onMouseEnter={() => setHoverRating(s)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setChosenRating(s)}
                            >★</span>
                        ))}
                    </div>
                    <button
                        className={`btn-primary ${chosenRating === 0 ? 'btn-disabled' : ''}`}
                        onClick={handleSubmitRating}
                        disabled={chosenRating === 0}
                    >
                        Submit Rating
                    </button>
                </div>
            )}

            {ratingSubmitted && (
                <div className="rating-success">✅ Rating submitted! Thank you.</div>
            )}

            <div className="detail-actions">
                {!isAccepted && (
                    <button className="btn-primary btn-full" onClick={handleAccept}>
                        Accept Delivery — BTN {task.reward}
                    </button>
                )}
                {task.status === 'accepted' && (
                    <button className="btn-secondary btn-full" onClick={() => handleStatusChange('inProgress')}>
                        I've Picked It Up (In Progress)
                    </button>
                )}
                {task.status === 'inProgress' && (
                    <button className="btn-success btn-full" onClick={() => handleStatusChange('completed')}>
                        Mark Delivered ✓
                    </button>
                )}
                {isCompleted && (
                    <div className="completed-badge">✅ Delivery Completed</div>
                )}
                {isAccepted && !isCompleted && (
                    <button className="btn-secondary btn-full" style={{ marginTop: '10px', background: 'var(--surface2)', borderColor: 'var(--accent)', color: 'var(--text)' }} onClick={() => setActiveTab('livetrack')}>
                        📍 View Live GPS Map
                    </button>
                )}
            </div>
        </div>
    );
}
