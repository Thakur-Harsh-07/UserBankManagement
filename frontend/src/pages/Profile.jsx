import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
    const { user, logout } = useAuth();

    if (!user) {
        return <div className="profile-container"><div className="loading">Loading...</div></div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>Profile</h2>
                <div className="profile-info">
                    <div className="form-group">
                        <label>Username</label>
                        <div className="profile-value">{user.username || 'N/A'}</div>
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <div className="profile-value">{user.email || 'N/A'}</div>
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <div className="profile-value">{user.role || 'user'}</div>
                    </div>
                </div>
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

