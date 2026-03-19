import { useState } from 'react';
import { useApp } from '../context/AppContext';
import TaskCard from '../components/TaskCard';
import { locations } from '../data/mockData';
import './HomeScreen.css';

export default function HomeScreen() {
    const {
        currentUser, activeRole, availableTasks, myTasks,
        isLoading, locationFilter, setLocationFilter, setActiveTab,
    } = useApp();
    const [showFilter, setShowFilter] = useState(false);

    const isRunner = activeRole === 'runner';
    const firstName = currentUser?.name?.split(' ')[0] ?? 'there';

    // Poster: show their posted tasks on home screen
    const posterPostedTasks = myTasks; // derived from their posterId

    return (
        <div className="screen home-screen">
            <div className="home-header">
                <div>
                    <p className="greeting">
                        {isRunner ? `Ready to deliver, ${firstName}? 🏃` : `Hello, ${firstName}! 👋`}
                    </p>
                    <h2 className="home-title">
                        {isRunner ? 'Available Deliveries' : 'My Posted Tasks'}
                    </h2>
                </div>
                {isRunner && (
                    <button className="filter-btn" onClick={() => setShowFilter(v => !v)}>
                        ⚙ Filters
                    </button>
                )}
            </div>

            {/* Role mode indicator */}
            <div className={`mode-pill ${isRunner ? 'runner-pill' : 'poster-pill'}`}>
                {isRunner ? '🏃 Runner Mode — accepting deliveries' : '📦 Poster Mode — managing your posts'}
            </div>

            {/* Filter panel (runner only) */}
            {isRunner && showFilter && (
                <div className="filter-panel">
                    <p className="filter-label">📍 Filter by Area</p>
                    <div className="filter-chips">
                        {locations.map(loc => (
                            <button
                                key={loc}
                                className={`chip ${locationFilter === loc ? 'chip-active' : ''}`}
                                onClick={() => { setLocationFilter(loc); setShowFilter(false); }}
                            >
                                {loc}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Runner content ── */}
            {isRunner && (
                !currentUser?.isOnline ? (
                    <div className="offline-state">
                        <div className="offline-icon">📴</div>
                        <h3>You're Offline</h3>
                        <p>Go online from your Profile to see available deliveries.</p>
                    </div>
                ) : isLoading ? (
                    <div className="loading-state">
                        <div className="spinner" />
                        <p className="loading-text">Finding nearby deliveries<span className="dots" /></p>
                    </div>
                ) : availableTasks.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <p>No deliveries found{locationFilter !== 'All' ? ` in ${locationFilter}` : ''}</p>
                    </div>
                ) : (
                    <div className="task-list">
                        <p className="task-count">{availableTasks.length} deliveries nearby</p>
                        {availableTasks.map(task => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                )
            )}

            {/* ── Poster content ── */}
            {!isRunner && (
                posterPostedTasks.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <h3>No posts yet</h3>
                        <p>Tap the + button below to post your first delivery request.</p>
                    </div>
                ) : (
                    <div className="task-list">
                        <p className="task-count">{posterPostedTasks.length} active post{posterPostedTasks.length > 1 ? 's' : ''}</p>
                        {posterPostedTasks.map(task => (
                            <TaskCard key={task.id} task={task} showStatus />
                        ))}
                    </div>
                )
            )}

            {/* FAB for poster */}
            {!isRunner && (
                <button
                    className="fab-add-post"
                    onClick={() => setActiveTab('addpost')}
                    title="Post new delivery request"
                >
                    <span>+</span>
                </button>
            )}
        </div>
    );
}
