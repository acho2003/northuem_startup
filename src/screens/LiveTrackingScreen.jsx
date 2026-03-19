import { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { startLocationSim } from '../api/location';
import './LiveTrackingScreen.css';

const DIRECTIONS = [
    'Head north toward the pickup point',
    'Turn right onto Norzin Lam',
    'Continue straight for 600 m',
    'Slight left onto Chorten Lam',
    'Turn left toward Changlam Square',
    'Destination ahead on the right',
];

export default function LiveTrackingScreen() {
    const { tasks, selectedTaskId, setActiveTab } = useApp();
    const task = tasks.find(t => t.id === selectedTaskId);

    const [markerPos, setMarkerPos] = useState({ top: 40, left: 50 });
    const [progress, setProgress] = useState(0);
    const [arrived, setArrived] = useState(false);
    const [dirIndex, setDirIndex] = useState(0);
    const stopRef = useRef(null);

    useEffect(() => {
        stopRef.current = startLocationSim(({ top, left, progress: p, waypointIndex }) => {
            setMarkerPos({ top, left });
            setProgress(p);
            setDirIndex(Math.min(waypointIndex, DIRECTIONS.length - 1));
            if (p >= 100) setArrived(true);
        }, 1200);
        return () => stopRef.current?.();
    }, []);

    if (!task) return null;

    const eta = Math.max(1, Math.round(15 - (progress / 100) * 15));

    return (
        <div className="screen live-tracking-screen">

            {/* ── Fake Map ── */}
            <div className="gmap-bg-wrapper">
                {/* SVG city grid background */}
                <svg className="city-grid-svg" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice">
                    {/* Horizontal streets */}
                    {[80, 160, 240, 320, 420, 510, 600].map(y => (
                        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                    ))}
                    {/* Vertical streets */}
                    {[60, 130, 200, 270, 340].map(x => (
                        <line key={x} x1={x} y1="0" x2={x} y2="700" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                    ))}
                    {/* Diagonal main road */}
                    <path
                        d="M 60,650 Q 150,400 200,300 T 340,80"
                        fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="10"
                    />
                    {/* Route highlight */}
                    <path
                        d="M 50,680 C 80,550 120,440 200,300 T 340,80"
                        fill="none"
                        stroke="#6c63ff"
                        strokeWidth="4"
                        strokeDasharray="8 5"
                        opacity="0.7"
                    />
                </svg>

                {/* Destination pin */}
                <div className="gmaps-pin dest-pin" style={{ left: '84%', top: '10%' }}>
                    📍
                </div>

                {/* Pickup pin */}
                <div className="gmaps-pin pickup-pin" style={{ left: '14%', top: '88%' }}>
                    🟢
                </div>

                {/* Live marker */}
                <div
                    className={`live-marker ${arrived ? 'arrived' : ''}`}
                    style={{
                        left: `${markerPos.left}%`,
                        top: `${markerPos.top}%`,
                    }}
                >
                    <div className="live-marker-dot" />
                    <div className="live-marker-ring" />
                </div>
            </div>

            {/* ── Top direction panel ── */}
            <div className="maps-top-panel">
                <div className="direction-icon">{arrived ? '✅' : '⬆️'}</div>
                <div className="direction-text">
                    <span className="dist-next">{arrived ? '0 m' : `${Math.round((1 - progress / 100) * 2500)} m`}</span>
                    <span className="street-next">
                        {arrived ? '🎉 You have arrived at the destination!' : DIRECTIONS[dirIndex]}
                    </span>
                </div>
            </div>

            {/* ── Progress bar ── */}
            <div className="live-progress-bar">
                <div className="live-progress-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* ── Bottom panel ── */}
            <div className="maps-bottom-panel">
                <div className="eta-header">
                    <span className="eta-time-val">{arrived ? 'Arrived!' : `${eta} min`}</span>
                    <span className="eta-arrival-val">
                        {arrived ? 'Delivery point reached' : `${((1 - progress / 100) * 2.5).toFixed(1)} km left`}
                    </span>
                </div>
                <div className="eta-sub">
                    <span className="sub-text" style={{ color: '#43d9ad' }}>
                        {arrived ? 'Please hand over the package.' : 'Live simulation · Thimphu, Bhutan'}
                    </span>
                </div>

                <div className="maps-action-row">
                    <button className="btn-maps-exit" onClick={() => setActiveTab('taskdetail')}>
                        ✖ Exit
                    </button>
                    <div className="maps-details-btn">
                        <div className="pull-bar" />
                        <span style={{ fontSize: 13, fontWeight: 600 }}>
                            {task.title}
                        </span>
                    </div>
                    <button className="btn-maps-recenter" onClick={() => {}}>
                        🧭
                    </button>
                </div>
            </div>
        </div>
    );
}
