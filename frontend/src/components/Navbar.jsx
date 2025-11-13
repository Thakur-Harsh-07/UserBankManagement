import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { isAuthenticated, user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-brand">
                    Bank Management
                </Link>
                <div className="navbar-links">
                    <Link to="/dashboard" className="nav-link">
                        Dashboard
                    </Link>
                    <Link to="/bank-accounts" className="nav-link">
                        Bank Accounts
                    </Link>
                    <Link to="/profile" className="nav-link">
                        Profile
                    </Link>
                    {isAdmin && (
                        <Link to="/admin" className="nav-link admin-link">
                            Admin Panel
                        </Link>
                    )}
                    <div className="user-info">
                        <span className="username">{user?.username}</span>
                        <button className="btn-logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

