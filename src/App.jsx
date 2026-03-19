import { AppProvider, useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import TaskDetailScreen from './screens/TaskDetailScreen';
import MyTasksScreen from './screens/MyTasksScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import LiveTrackingScreen from './screens/LiveTrackingScreen';
import AddPostScreen from './screens/AddPostScreen';
import './index.css';

function AppShell() {
  const { activeTab, currentUser } = useApp();
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen />;
      case 'taskdetail': return <TaskDetailScreen />;
      case 'mytasks': return <MyTasksScreen />;
      case 'notifications': return <NotificationsScreen />;
      case 'profile': return <ProfileScreen />;
      case 'livetrack': return <LiveTrackingScreen />;
      case 'addpost': return <AddPostScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <div className="app-shell">
      <div className="mobile-frame">
        {/* Notch */}
        <div className="mobile-notch">
          <div className="notch-mic" />
          <div className="notch-cam" />
        </div>

        {/* Status bar */}
        <div className="status-bar">
          <span>{timeStr}</span>
          <div className="status-right">
            <span
              style={{
                width: 8, height: 8,
                borderRadius: '50%',
                background: currentUser.isOnline ? '#43d9ad' : '#ff6584',
                display: 'inline-block',
                boxShadow: currentUser.isOnline ? '0 0 6px #43d9ad' : 'none',
              }}
            />
            <span>●●●</span>
            <span>⚡</span>
          </div>
        </div>

        {/* Screen content */}
        <div className="screen-container">
          {renderScreen()}
        </div>

        {/* Bottom nav — hide on taskdetail, livetrack, addpost */}
        {activeTab !== 'taskdetail' && activeTab !== 'livetrack' && activeTab !== 'addpost' && <BottomNav />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
