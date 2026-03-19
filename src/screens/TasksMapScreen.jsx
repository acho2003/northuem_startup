import { useState } from 'react';
import { useApp } from '../context/AppContext';
import StarRating from '../components/StarRating';
import './RunnersMapScreen.css'; // We'll reuse the exact same map styles to save codebase size!

export default function TasksMapScreen() {
    const { availableTasks, setActiveTab, setSelectedTaskId, acceptTask } = useApp();
    const [selectedTask, setSelectedTask] = useState(null);

    // Thimphu map iframe
    const mapIframeUrl = "https://maps.google.com/maps?q=Thimphu,+Bhutan&t=m&z=14&ie=UTF8&iwloc=&output=embed";

    const handleSelectTask = (t) => {
        setSelectedTask(t);
    };

    const handleAccept = () => {
        acceptTask(selectedTask.id);
    };

    const categoryColors = {
        Car: '#6c63ff', Bike: '#43d9ad', 'Truck/Van': '#f7a440',
    };

    return (
        <div className="screen runners-map-screen">
            <div className="rn-map-layer">
                <iframe
                    className="rn-gmap-iframe"
                    title="Google Map Thimphu Tasks"
                    src={mapIframeUrl}
                    frameBorder="0"
                    scrolling="no"
                />
                <div className="rn-overlay">
                    {availableTasks.map(task => {
                        const color = categoryColors[task.category] || '#3b9eff';
                        return (
                            <div
                                key={task.id}
                                className={`rn-marker ${selectedTask?.id === task.id ? 'active' : ''}`}
                                style={{ top: task.pos?.top || '50%', left: task.pos?.left || '50%' }}
                                onClick={() => handleSelectTask(task)}
                            >
                                <div className="rn-marker-pulse" style={{ background: `${color}44` }} />
                                <div className="rn-marker-dot" style={{ borderColor: color }}>
                                    <span className="rn-marker-icon">📦</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="rn-top-bar">
                <h3>Available Deliveries Near You</h3>
                <p>{availableTasks.length} active posts in Thimphu</p>
            </div>

            {/* Bottom Sheet for Selected Task */}
            {selectedTask && (
                <div className="rn-bottom-sheet">
                    <div className="rn-drag-handle" onClick={() => setSelectedTask(null)} />

                    <div className="rn-sheet-header" style={{ alignItems: 'flex-start' }}>
                        <div className="rn-info">
                            <h4 style={{ fontSize: '20px' }}>{selectedTask.title}</h4>
                            <p style={{ fontSize: '14px', color: 'var(--text-sub)', marginBottom: '8px' }}>{selectedTask.shortDesc}</p>
                            <div className="rn-rating-row">
                                <span className="rn-rating-text" style={{ fontWeight: 700 }}>From: {selectedTask.posterName}</span>
                                <StarRating rating={selectedTask.posterRating} size="sm" />
                            </div>
                        </div>
                        <div className="rn-vehicle-tag" style={{ background: `${categoryColors[selectedTask.category]}22`, color: categoryColors[selectedTask.category], border: 'none' }}>
                            {selectedTask.category}
                        </div>
                    </div>

                    <div className="rn-sheet-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div>
                                <p style={{ fontSize: '11px', color: 'var(--text-sub)' }}>DISTANCE</p>
                                <p style={{ fontWeight: 800 }}>{selectedTask.distance}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '11px', color: 'var(--text-sub)' }}>REWARD</p>
                                <p style={{ fontWeight: 900, color: 'var(--success)', fontSize: '18px' }}>BTN {selectedTask.reward}</p>
                            </div>
                        </div>

                        <button className="btn-primary btn-full rn-btn" onClick={handleAccept}>
                            Accept Delivery
                        </button>
                        <button
                            className="btn-secondary btn-full"
                            style={{ marginTop: '8px', border: 'none', background: 'transparent', color: 'var(--text-sub)' }}
                            onClick={() => {
                                setSelectedTaskId(selectedTask.id);
                                setActiveTab('taskdetail');
                            }}
                        >
                            View Full Details
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
