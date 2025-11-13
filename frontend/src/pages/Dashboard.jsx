import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bankApi } from '../services/api';
import toast from 'react-hot-toast';
import './Dashboard.css';

const Dashboard = () => {
    const { user, token, isAuthenticated } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchAccounts();
    }, [isAuthenticated, token]);

    const fetchAccounts = async () => {
        try {
            const response = await bankApi.getAccounts(token);
            setAccounts(response.data);
        } catch (error) {
            toast.error('Failed to fetch bank accounts');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="dashboard-container"><div className="loading">Loading...</div></div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Welcome, {user?.username}!</h1>
                <p className="user-email">{user?.email}</p>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>Total Bank Accounts</h3>
                    <p className="stat-number">{accounts.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Role</h3>
                    <p className="stat-number">{user?.role || 'user'}</p>
                </div>
            </div>

            <div className="dashboard-actions">
                <button 
                    className="btn-primary"
                    onClick={() => navigate('/bank-accounts')}
                >
                    Manage Bank Accounts
                </button>
                <button 
                    className="btn-secondary"
                    onClick={() => navigate('/profile')}
                >
                    View Profile
                </button>
                {user?.role === 'admin' && (
                    <button 
                        className="btn-admin"
                        onClick={() => navigate('/admin')}
                    >
                        Admin Panel
                    </button>
                )}
            </div>

            {accounts.length > 0 && (
                <div className="recent-accounts">
                    <h2>Recent Bank Accounts</h2>
                    <div className="accounts-grid">
                        {accounts.slice(0, 3).map((account) => (
                            <div key={account._id} className="account-card">
                                <h4>{account.bankName}</h4>
                                <p><strong>Account:</strong> {account.accountNumber}</p>
                                <p><strong>Holder:</strong> {account.accountHolderName}</p>
                                <p><strong>Branch:</strong> {account.branchName}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

