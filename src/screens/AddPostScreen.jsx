import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './AddPostScreen.css';

export default function AddPostScreen() {
    const { addPost, setActiveTab, currentUser } = useApp();

    const [formData, setFormData] = useState({
        title: '',
        shortDesc: '',
        fullDesc: '',
        pickup: '',
        dropoff: '',
        reward: '',
        category: 'Car',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.pickup || !formData.dropoff || !formData.reward) return;

        // Auto calculate distance/time since it's a mock
        addPost({
            ...formData,
            reward: Number(formData.reward),
            distance: (Math.random() * 8 + 1).toFixed(1) + ' mi',
            estimatedTime: Math.floor(Math.random() * 40 + 10) + ' min',
        });
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="screen add-post-screen">
            <div className="add-header">
                <button className="back-btn" onClick={() => setActiveTab('home')} type="button">← Discard</button>
                <h2 className="screen-title" style={{ marginBottom: 0 }}>New Delivery</h2>
                <div style={{ width: 60 }} /> {/* Spacer */}
            </div>

            <form className="add-post-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>What needs delivering?</label>
                    <input
                        type="text" name="title" required
                        placeholder="e.g. Small Desk, Legal Docs..."
                        value={formData.title} onChange={handleChange}
                    />
                </div>

                <div className="form-route-box">
                    <div className="route-leg-input">
                        <span className="route-icon pickup-icon" />
                        <div className="input-wrap">
                            <label>Pick Up Location</label>
                            <input type="text" name="pickup" required placeholder="Enter pickup address" value={formData.pickup} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="route-connector-input" />
                    <div className="route-leg-input">
                        <span className="route-icon dropoff-icon" />
                        <div className="input-wrap">
                            <label>Drop Off Location</label>
                            <input type="text" name="dropoff" required placeholder="Enter destination address" value={formData.dropoff} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group half">
                        <label>Reward ($)</label>
                        <input type="number" name="reward" required placeholder="0.00" value={formData.reward} onChange={handleChange} />
                    </div>
                    <div className="form-group half">
                        <label>Vehicle Needed</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            <option value="Bike">Bike 🚲</option>
                            <option value="Car">Car 🚗</option>
                            <option value="Truck/Van">Truck / Van 🚚</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Short Description (Optional)</label>
                    <input type="text" name="shortDesc" placeholder="Brief summary for list view" value={formData.shortDesc} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Detailed Instructions (Optional)</label>
                    <textarea
                        name="fullDesc" rows="4"
                        placeholder="Any special handling instructions, door codes, etc."
                        value={formData.fullDesc} onChange={handleChange}
                    ></textarea>
                </div>

                <div className="form-footer">
                    <button type="submit" className="btn-primary btn-full submit-btn">
                        Post Delivery Request
                    </button>
                </div>
            </form>
        </div>
    );
}
