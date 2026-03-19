import { useApp } from '../context/AppContext';
import StarRating from '../components/StarRating';
import './ProfileScreen.css';

export default function ProfileScreen() {
    const { currentUser, toggleOnline, myTasks } = useApp();
    const completedCount = myTasks.filter(t => t.status === 'completed').length;

    return (
        <div className="screen profile-screen">
            <div className="profile-hero">
                <div className="profile-avatar">{currentUser.avatar}</div>
                <h2 className="profile-name">{currentUser.name}</h2>
                <StarRating rating={currentUser.rating} size="md" />
                <div className={`online-badge ${currentUser.isOnline ? 'online' : 'offline'}`}>
                    <span className="status-dot" />
                    {currentUser.isOnline ? 'Online' : 'Offline'}
                </div>
            </div>

            <div className="profile-stats">
                <div className="stat-card">
                    <div className="stat-value">{currentUser.tasksCompleted + completedCount}</div>
                    <div className="stat-label">Completed</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{currentUser.rating}</div>
                    <div className="stat-label">Rating</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{myTasks.length}</div>
                    <div className="stat-label">My Tasks</div>
                </div>
            </div>

            <div className="profile-section">
                <h3 className="section-heading">Availability</h3>
                <div className="toggle-row">
                    <div>
                        <p className="toggle-title">Online Status</p>
                        <p className="toggle-sub">
                            {currentUser.isOnline
                                ? 'You are visible to task posters.'
                                : 'Go online to see & accept tasks.'}
                        </p>
                    </div>
                    <button
                        className={`toggle-switch ${currentUser.isOnline ? 'active' : ''}`}
                        onClick={toggleOnline}
                    >
                        <span className="toggle-thumb" />
                    </button>
                </div>
            </div>

            <div className="profile-section">
                <h3 className="section-heading">Reviews</h3>
                {currentUser.reviews.map((r, i) => (
                    <div key={i} className="review-item">
                        <div className="review-top">
                            <span className="review-from">{r.from}</span>
                            <StarRating rating={r.rating} size="sm" />
                        </div>
                        <p className="review-comment">"{r.comment}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
