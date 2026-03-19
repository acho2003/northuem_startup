import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './AuthScreen.css';

export default function AuthScreen() {
    const { login } = useApp();
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState('poster'); // 'poster' or 'runner'

    const handleDemoLogin = (r) => {
        login(r);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        login(role); // simple mock signup/login
    };

    return (
        <div className="auth-shell">
            <div className="auth-card">
                <div className="auth-logo">📦</div>
                <h2 className="auth-title">Druk Deliveries</h2>
                <p className="auth-subtitle">
                    {isLogin ? 'Log in to continue' : 'Create a new account'}
                </p>

                {/* Demo Fast Login Buttons */}
                {isLogin ? (
                    <div className="auth-demo-box">
                        <p className="demo-label">Quick Demo Access</p>
                        <button className="auth-btn-demo" onClick={() => handleDemoLogin('poster')}>
                            Test as <strong>Poster</strong> (Customer)
                        </button>
                        <button className="auth-btn-demo" onClick={() => handleDemoLogin('runner')}>
                            Test as <strong>Runner</strong> (Driver)
                        </button>
                    </div>
                ) : (
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <input type="text" placeholder="Full Name" required />
                        <input type="email" placeholder="Email Address" required />
                        <input type="password" placeholder="Create Password" required />

                        <div className="role-selector">
                            <p>I want to:</p>
                            <div className="role-options">
                                <button
                                    type="button"
                                    className={`role-btn ${role === 'poster' ? 'active' : ''}`}
                                    onClick={() => setRole('poster')}
                                >
                                    Send Packages
                                </button>
                                <button
                                    type="button"
                                    className={`role-btn ${role === 'runner' ? 'active' : ''}`}
                                    onClick={() => setRole('runner')}
                                >
                                    Deliver Packages
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="auth-btn-primary">
                            Sign Up
                        </button>
                    </form>
                )}

                <div className="auth-footer">
                    {isLogin ? (
                        <p>New to the app? <span onClick={() => setIsLogin(false)}>Sign up</span></p>
                    ) : (
                        <p>Already have an account? <span onClick={() => setIsLogin(true)}>Log in</span></p>
                    )}
                </div>
            </div>
        </div>
    );
}
