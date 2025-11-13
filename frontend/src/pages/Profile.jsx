import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
    const { user, updateProfile, logout } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate that fields are not empty
        if (!formData.username.trim() || !formData.email.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        // Check if there are actual changes
        if (formData.username === user.username && formData.email === user.email) {
            toast.error('No changes detected');
            setIsEditing(false);
            return;
        }

        setLoading(true);
        const result = await updateProfile(formData.username.trim(), formData.email.trim());
        setLoading(false);
        if (result.success) {
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            username: user?.username || '',
            email: user?.email || ''
        });
        setIsEditing(false);
    };

    if (!user) {
        return <div className="profile-container"><div className="loading">Loading...</div></div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <input
                            type="text"
                            value={user.role || 'user'}
                            disabled
                            className="disabled-input"
                        />
                    </div>
                    <div className="form-actions">
                        {isEditing ? (
                            <>
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button type="button" className="btn-secondary" onClick={handleCancel}>
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button type="button" className="btn-primary" onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </button>
                        )}
                    </div>
                </form>
                <div className="logout-section">
                    <button className="btn-logout" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;

