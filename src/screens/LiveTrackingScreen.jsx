import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import './LiveTrackingScreen.css';

export default function LiveTrackingScreen() {
    const { tasks, selectedTaskId, setActiveTab } = useApp();
    const task = tasks.find(t => t.id === selectedTaskId);

    // Simulated navigation progress (0 to 100%)
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate real-time GPS movement towards the destination
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return p + 0.5; // smoother, slower map movement
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!task) return null;

    // We map the 0-100% progress to coordinates along our fake SVG route.
    // The route is an "S" curve.
    // SVG viewBox is 0 0 1000 1000, we'll estimate coordinates manually or just use standard CSS path motion

    const estimatedMinsLeft = Math.max(1, Math.round(15 - (progress / 100) * 15));
    const estimatedMilesLeft = Math.max(0.1, (2.5 - (progress / 100) * 2.5)).toFixed(1);

    // A Google Maps iframe mapped to Thimphu, Bhutan.
    const mapIframeUrl = "https://maps.google.com/maps?q=Thimphu,+Bhutan&t=m&z=15&ie=UTF8&iwloc=&output=embed";

    return (
        <div className="screen live-tracking-screen">

            {/* Background Map Layer */}
            <div className="gmap-bg-wrapper">
                <iframe
                    className="gmap-iframe"
                    title="Google Map"
                    src={mapIframeUrl}
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                />
                {/* Dark mode filter overlay for the iframe */}
                <div className="gmap-overlay-layer">
                    {/* We draw a fake SVG route line over the map to simulate navigation */}
                    <svg className="route-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path
                            d="M 20,90 Q 20,50 50,50 T 80,20"
                            className="route-path-bg"
                        />
                        <path
                            d="M 20,90 Q 20,50 50,50 T 80,20"
                            className="route-path-active"
                        />
                    </svg>

                    {/* Destination Pin */}
                    <div className="gmaps-pin dest-pin" style={{ left: '80%', top: '20%' }}>
                        📍
                    </div>

                    {/* Current Location Cursor (Blue Arrow / Dot) moving along the path */}
                    {/* Using approximate positions for the quadratic/cubic curve */}
                    {/* For simplicity in CSS without SVG SMIL, we'll interpolate manually roughly */}
                    <div className="navigation-cursor" style={{
                        left: `${20 + (progress / 100) * 60}%`,
                        top: `${90 - (progress / 100) * 70}%`,
                        transform: `translate(-50%, -50%) rotate(${45 - (progress / 100) * 45}deg)`
                    }}>
                        <div className="nav-arrow" />
                        <div className="nav-cone" />
                    </div>
                </div>
            </div>

            {/* Top Floating Instruction Panel (Google Maps Style) */}
            <div className="maps-top-panel">
                <div className="direction-icon">⬆️</div>
                <div className="direction-text">
                    <span className="dist-next">800 ft</span>
                    <span className="street-next">Head north toward {task.dropoff.split(',')[0]}</span>
                </div>
            </div>

            {/* Bottom Floating ETA Panel (Google Maps Style) */}
            <div className="maps-bottom-panel">
                <div className="eta-header">
                    <span className="eta-time-val">{estimatedMinsLeft} min</span>
                    <span className="eta-arrival-val">({estimatedMilesLeft} mi)</span>
                </div>
                <div className="eta-sub">
                    <span className="sub-text" style={{ color: '#43d9ad' }}>Fastest route, usual traffic</span>
                </div>

                <div className="maps-action-row">
                    <button className="btn-maps-exit" onClick={() => setActiveTab('taskdetail')}>
                        ✖ Exit
                    </button>
                    <div className="maps-details-btn">
                        <div className="pull-bar" />
                        <span style={{ fontSize: 13, fontWeight: 600 }}>Delivery Details</span>
                    </div>
                    <button className="btn-maps-recenter">
                        🧭
                    </button>
                </div>
            </div>

        </div>
    );
}
