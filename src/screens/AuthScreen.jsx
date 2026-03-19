import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './AuthScreen.css';

const VEHICLES = ['Car 🚗', 'Bike 🚲', 'Truck / Van 🚚'];

export default function AuthScreen() {
    const { login, signUp, demoLogin, authError, setAuthError } = useApp();
    const [isLogin, setIsLogin] = useState(true);

    // Login fields
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPw, setLoginPw] = useState('');

    // Sign-up fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [vehicle, setVehicle] = useState(VEHICLES[0]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const clearError = () => setAuthError('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await login(loginEmail, loginPw);
        setIsSubmitting(false);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await signUp({ name, email, password: pw, vehicle });
        setIsSubmitting(false);
    };

    return (
        <div className="auth-shell">
            <div className="auth-card">
                <div className="auth-logo">📦</div>
                <h2 className="auth-title">Druk Deliveries</h2>
                <p className="auth-subtitle">
                    {isLogin ? 'Welcome back! Log in to continue.' : 'Create your account — be a Poster or Runner!'}
                </p>

                {/* Error message */}
                {authError && (
                    <div className="auth-error" onClick={clearError}>
                        ⚠️ {authError}
                    </div>
                )}

                {/* Tab switcher */}
                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${isLogin ? 'active' : ''}`}
                        onClick={() => { setIsLogin(true); clearError(); }}
                    >
                        Log In
                    </button>
                    <button
                        className={`auth-tab ${!isLogin ? 'active' : ''}`}
                        onClick={() => { setIsLogin(false); clearError(); }}
                    >
                        Sign Up
                    </button>
                </div>

                {isLogin ? (
                    <>
                        <form className="auth-form" onSubmit={handleLogin}>
                            <div className="auth-field">
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={loginEmail}
                                    onChange={e => setLoginEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="auth-field">
                                <label>Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={loginPw}
                                    onChange={e => setLoginPw(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="auth-btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Logging in…' : 'Log In'}
                            </button>
                        </form>

                        <div className="auth-divider"><span>or</span></div>

                        <div className="auth-demo-box">
                            <p className="demo-label">⚡ Quick Demo Access</p>
                            <button className="auth-btn-demo" onClick={demoLogin}>
                                Continue as <strong>Demo User</strong>
                            </button>
                        </div>
                    </>
                ) : (
                    <form className="auth-form" onSubmit={handleSignUp}>
                        <div className="auth-field">
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="Tshering Tobgay"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Create a password"
                                value={pw}
                                onChange={e => setPw(e.target.value)}
                                minLength={6}
                                required
                            />
                        </div>
                        <div className="auth-field">
                            <label>Your Vehicle</label>
                            <div className="vehicle-selector">
                                {VEHICLES.map(v => (
                                    <button
                                        key={v}
                                        type="button"
                                        className={`vehicle-btn ${vehicle === v ? 'active' : ''}`}
                                        onClick={() => setVehicle(v)}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <p className="auth-note">
                            🔄 You can switch between <strong>Poster</strong> and <strong>Runner</strong> any time from your Profile.
                        </p>
                        <button type="submit" className="auth-btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating account…' : 'Create Account'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
