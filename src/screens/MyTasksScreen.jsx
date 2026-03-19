import { useApp } from '../context/AppContext';
import './MyTasksScreen.css';

const statusConfig = {
    accepted: { label: 'Pending', color: '#f7a440', bg: '#f7a44022' },
    inProgress: { label: 'In Progress', color: '#3b9eff', bg: '#3b9eff22' },
    completed: { label: 'Completed', color: '#43d9ad', bg: '#43d9ad22' },
};

export default function MyTasksScreen() {
    const { myTasks, setSelectedTaskId, setActiveTab } = useApp();

    const handleOpen = (taskId) => {
        setSelectedTaskId(taskId);
        setActiveTab('taskdetail');
    };

    if (myTasks.length === 0) {
        return (
            <div className="screen my-tasks-screen">
                <h2 className="screen-title">My Tasks</h2>
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <p>You haven't accepted any tasks yet.</p>
                    <p className="empty-sub">Browse available tasks from Home.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="screen my-tasks-screen">
            <h2 className="screen-title">My Tasks</h2>
            <p className="task-count">{myTasks.length} task{myTasks.length > 1 ? 's' : ''}</p>
            <div className="task-list">
                {myTasks.map(task => {
                    const s = statusConfig[task.status];
                    return (
                        <div key={task.id} className="my-task-card" onClick={() => handleOpen(task.id)}>
                            <div className="my-task-top">
                                <h3 className="my-task-title">{task.title}</h3>
                                <span className="status-badge" style={{ color: s.color, background: s.bg }}>
                                    {s.label}
                                </span>
                            </div>
                            <p className="my-task-desc">{task.shortDesc}</p>
                            <div className="my-task-meta">
                                <span>📍 {task.location}</span>
                                <span>⏱ {task.estimatedTime}</span>
                                <span className="reward-tag">${task.reward}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
