import { useApp } from '../context/AppContext';
import StarRating from '../components/StarRating';
import './ProfileScreen.css';

export default function ProfileScreen() {
    const { currentUser, toggleOnline, myTasks, logout, activeRole, switchRole } = useApp();
    const completedCount = myTasks.filter(t => t.status === 'completed').length;

    const isPoster = activeRole === 'poster';

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

            {/* ── Role Switch ─────────────────────────────────────── */}
            <div className="role-switch-card">
                <p className="role-switch-label">Current Mode</p>
                <div className="role-switch-toggle">
                    <button
                        className={`role-switch-btn ${isPoster ? 'active poster-active' : ''}`}
                        onClick={() => switchRole('poster')}
                    >
                        <span className="role-switch-icon">📦</span>
                        <span className="role-switch-name">Poster</span>
                        <span className="role-switch-sub">Post tasks</span>
                    </button>
                    <div className="role-switch-divider" />
                    <button
                        className={`role-switch-btn ${!isPoster ? 'active runner-active' : ''}`}
                        onClick={() => switchRole('runner')}
                    >
                        <span className="role-switch-icon">🏃</span>
                        <span className="role-switch-name">Runner</span>
                        <span className="role-switch-sub">Accept & deliver</span>
                    </button>
                </div>
                <p className="role-switch-hint">
                    Switched to <strong>{isPoster ? 'Poster' : 'Runner'}</strong> mode — Home & nav adapt automatically.
                </p>
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

            {/* Online toggle only meaningful for runner mode */}
            {!isPoster && (
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
            )}

            <div className="profile-section">
                <h3 className="section-heading">Reviews</h3>
                {currentUser.reviews.length === 0 ? (
                    <p style={{ color: 'var(--text-sub)', fontSize: 13 }}>No reviews yet.</p>
                ) : (
                    currentUser.reviews.map((r, i) => (
                        <div key={i} className="review-item">
                            <div className="review-top">
                                <span className="review-from">{r.from}</span>
                                <StarRating rating={r.rating} size="sm" />
                            </div>
                            <p className="review-comment">"{r.comment}"</p>
                        </div>
                    ))
                )}
            </div>

            <div style={{ paddingBottom: '30px' }}>
                <button
                    className="btn-secondary btn-full"
                    style={{ color: 'var(--danger)', borderColor: 'rgba(255,101,132,0.3)' }}
                    onClick={logout}
                >
                    Log Out
                </button>
            </div>
        </div>
    );
}
