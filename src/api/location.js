// ─── Fake Live Location API ───────────────────────────────────────────────────
// Simulates GPS movement by cycling through pre-defined waypoints.

// Thimphu city approximate bounding box (top/left % values for our map coords)
const ROUTE_WAYPOINTS = [
  { top: 40, left: 50 },
  { top: 38, left: 48 },
  { top: 35, left: 45 },
  { top: 32, left: 43 },
  { top: 30, left: 46 },
  { top: 28, left: 50 },
  { top: 26, left: 54 },
  { top: 28, left: 58 },
  { top: 31, left: 61 },
  { top: 34, left: 63 },
  { top: 37, left: 60 },
  { top: 39, left: 57 },
  { top: 40, left: 54 },
];

let _pos = 0;

/**
 * Start a live location simulation.
 * Calls `onUpdate({ top, left, progress })` every `intervalMs` ms.
 * Returns a cleanup function to stop the simulation.
 */
export function startLocationSim(onUpdate, intervalMs = 1200) {
  _pos = 0;
  const total = ROUTE_WAYPOINTS.length;

  const tick = () => {
    const waypoint = ROUTE_WAYPOINTS[_pos % total];
    // Add tiny noise so it feels real
    const noise = () => (Math.random() - 0.5) * 1.2;
    onUpdate({
      top: waypoint.top + noise(),
      left: waypoint.left + noise(),
      progress: Math.round((_pos / (total - 1)) * 100),
      waypointIndex: _pos,
    });
    _pos += 1;
  };

  tick(); // fire immediately
  const id = setInterval(tick, intervalMs);
  return () => clearInterval(id);
}

/**
 * Get the final (destination) position.
 */
export function getDestination() {
  return ROUTE_WAYPOINTS[ROUTE_WAYPOINTS.length - 1];
}
