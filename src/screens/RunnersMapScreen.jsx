import { useState } from 'react';
import { useApp } from '../context/AppContext';
import StarRating from '../components/StarRating';
import './RunnersMapScreen.css';

export default function RunnersMapScreen() {
    const { runners, setActiveTab, setNotifications } = useApp();
    const [selectedRunner, setSelectedRunner] = useState(null);
    const [requestState, setRequestState] = useState('idle'); // idle | requesting | accepted

    // Thimphu map iframe
    const mapIframeUrl = "https://maps.google.com/maps?q=Thimphu,+Bhutan&t=m&z=14&ie=UTF8&iwloc=&output=embed";

    const handleSelectRunner = (r) => {
        setSelectedRunner(r);
        setRequestState('idle');
    };

    const handleRequest = () => {
        setRequestState('requesting');

        // Simulate runner accepting the request after 2.5 seconds
        setTimeout(() => {
            setRequestState('accepted');
            setNotifications(prev => [
                { id: 'n_' + Date.now(), type: 'accepted', message: `${selectedRunner.name} accepted your delivery request!`, time: 'Just now', read: false },
                ...prev
            ]);
        }, 2500);
    };

    const handleStartTracking = () => {
        // Navigate to live tracking
        setActiveTab('livetrack');
    };

    return (
        <div className="screen runners-map-screen">
            <div className="rn-map-layer">
                <iframe
                    className="rn-gmap-iframe"
                    title="Google Map Thimphu"
                    src={mapIframeUrl}
                    frameBorder="0"
                    scrolling="no"
                />
                <div className="rn-overlay">
                    {runners.map(runner => (
                        <div
                            key={runner.id}
                            className={`rn-marker ${selectedRunner?.id === runner.id ? 'active' : ''}`}
                            style={{ top: runner.pos.top, left: runner.pos.left }}
                            onClick={() => handleSelectRunner(runner)}
                        >
                            <div className="rn-marker-pulse" />
                            <div className="rn-marker-dot">
                                <span className="rn-marker-icon">{runner.vehicle.includes('Bike') ? '🚲' : runner.vehicle.includes('Car') ? '🚗' : '🚚'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rn-top-bar">
                <h3>Find Runners in Thimphu</h3>
                <p>{runners.length} runners nearby</p>
            </div>

            {/* Bottom Sheet for Selected Runner */}
            {selectedRunner && (
                <div className="rn-bottom-sheet">
                    <div className="rn-drag-handle" onClick={() => setSelectedRunner(null)} />

                    <div className="rn-sheet-header">
                        <div className="rn-avatar">{selectedRunner.avatar}</div>
                        <div className="rn-info">
                            <h4>{selectedRunner.name}</h4>
                            <div className="rn-rating-row">
                                <StarRating rating={selectedRunner.rating} size="sm" />
                                <span className="rn-rating-text">({selectedRunner.tasksCompleted} deliveries)</span>
                            </div>
                        </div>
                        <div className="rn-vehicle-tag">{selectedRunner.vehicle}</div>
                    </div>

                    <div className="rn-sheet-body">
                        {requestState === 'idle' && (
                            <>
                                <p className="rn-pricing-text">Estimated Rate: <strong>Nu. 150 - 300</strong></p>
                                <button className="btn-primary btn-full rn-btn" onClick={handleRequest}>
                                    Request {selectedRunner.name.split(' ')[0]}
                                </button>
                            </>
                        )}

                        {requestState === 'requesting' && (
                            <div className="rn-loading-state">
                                <div className="spinner" />
                                <p>Sending request to {selectedRunner.name.split(' ')[0]}...</p>
                            </div>
                        )}

                        {requestState === 'accepted' && (
                            <div className="rn-success-state">
                                <div className="rn-success-icon">✅</div>
                                <h4>Request Accepted!</h4>
                                <p>{selectedRunner.name} is heading to the pickup location.</p>
                                <button className="btn-success btn-full rn-btn" onClick={handleStartTracking}>
                                    Open Live Tracking
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
