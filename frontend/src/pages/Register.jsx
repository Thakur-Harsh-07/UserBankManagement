import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user'
    });
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        const result = await signup(
            formData.username,
            formData.email,
            formData.password,
            formData.role
        );
        setLoading(false);
        
        if (result.success) {
            navigate('/login');
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="Enter your username"
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
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                            minLength={6}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirm your password"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="select-input"
                        >
                            <option value="user">User</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="login-link">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

