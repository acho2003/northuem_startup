import { useState } from 'react';
import { useApp } from '../context/AppContext';
import TaskCard from '../components/TaskCard';
import { locations } from '../data/mockData';
import './HomeScreen.css';

export default function HomeScreen() {
    const { currentUser, availableTasks, isLoading, locationFilter, setLocationFilter, setActiveTab } = useApp();
    const [showFilter, setShowFilter] = useState(false);

    return (
        <div className="screen home-screen">
            <div className="home-header">
                <div>
                    <p className="greeting">Ready to deliver, {currentUser.name.split(' ')[0]}? 👋</p>
                    <h2 className="home-title">Available Deliveries</h2>
                </div>
                <button className="filter-btn" onClick={() => setShowFilter(v => !v)}>
                    ⚙ Filters
                </button>
            </div>

            {showFilter && (
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

            {!currentUser.isOnline ? (
                <div className="offline-state">
                    <div className="offline-icon">📴</div>
                    <h3>You're Offline</h3>
                    <p>Go online from your profile to see available deliveries.</p>
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
                    <p className="task-count">{availableTasks.length} deliveries nearby for {currentUser.vehicle}</p>
                    {availableTasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            )}

            {/* Floating Action Button for Posting New Delivery */}
            <button
                className="fab-add-post"
                onClick={() => setActiveTab('addpost')}
                title="Post new delivery request"
            >
                <span>+</span>
            </button>

        </div>
    );
}
