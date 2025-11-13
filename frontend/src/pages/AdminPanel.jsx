import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../services/api';
import toast from 'react-hot-toast';
import './AdminPanel.css';

const AdminPanel = () => {
    const { token, isAdmin } = useAuth();
    const [users, setUsers] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isAdmin) {
            fetchData();
        } else {
            toast.error('Access denied. Admin only.');
        }
    }, [isAdmin, token]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersResponse, accountsResponse] = await Promise.all([
                adminApi.getAllUsers(token),
                adminApi.getAllBankAccounts(token)
            ]);
            setUsers(usersResponse.data);
            setBankAccounts(accountsResponse.data);
        } catch (error) {
            toast.error('Failed to fetch admin data');
        } finally {
            setLoading(false);
        }
    };

    // Filter users based on search term
    const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) return users;
        
        const term = searchTerm.toLowerCase();
        return users.filter(user => 
            user.username?.toLowerCase().includes(term) ||
            user.email?.toLowerCase().includes(term) ||
            user.role?.toLowerCase().includes(term) ||
            user._id?.toLowerCase().includes(term)
        );
    }, [users, searchTerm]);

    // Filter bank accounts based on search term
    const filteredBankAccounts = useMemo(() => {
        if (!searchTerm.trim()) return bankAccounts;
        
        const term = searchTerm.toLowerCase();
        return bankAccounts.filter(account => 
            account.bankName?.toLowerCase().includes(term) ||
            account.accountNumber?.toLowerCase().includes(term) ||
            account.accountHolderName?.toLowerCase().includes(term) ||
            account.ifscCode?.toLowerCase().includes(term) ||
            account.branchName?.toLowerCase().includes(term) ||
            account.user?.toString().toLowerCase().includes(term)
        );
    }, [bankAccounts, searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    if (!isAdmin) {
        return (
            <div className="admin-panel-container">
                <div className="access-denied">
                    <h2>Access Denied</h2>
                    <p>You need admin privileges to access this page.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className="admin-panel-container"><div className="loading">Loading...</div></div>;
    }

    return (
        <div className="admin-panel-container">
            <div className="admin-header">
                <h1>Admin Panel</h1>
                <button className="btn-refresh" onClick={fetchData}>
                    Refresh Data
                </button>
            </div>

            <div className="admin-tabs">
                <button
                    className={`tab ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Users ({users.length})
                </button>
                <button
                    className={`tab ${activeTab === 'accounts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('accounts')}
                >
                    Bank Accounts ({bankAccounts.length})
                </button>
            </div>

            <div className="search-filter-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder={
                            activeTab === 'users' 
                                ? 'Search by username, email, role, or user ID...'
                                : 'Search by bank name, IFSC, account number, holder name, or branch...'
                        }
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button 
                            className="btn-clear-search"
                            onClick={handleClearSearch}
                            title="Clear search"
                        >
                            ✕
                        </button>
                    )}
                </div>
                {searchTerm && (
                    <div className="search-results-info">
                        Showing {activeTab === 'users' ? filteredUsers.length : filteredBankAccounts.length} of{' '}
                        {activeTab === 'users' ? users.length : bankAccounts.length} results
                    </div>
                )}
            </div>

            <div className="admin-content">
                {activeTab === 'users' && (
                    <div className="users-table">
                        <h2>All Users</h2>
                        {filteredUsers.length === 0 ? (
                            <div className="empty-state">
                                {searchTerm ? 'No users found matching your search' : 'No users found'}
                            </div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>User ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id}>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`role-badge ${user.role}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="user-id">{user._id}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === 'accounts' && (
                    <div className="accounts-table">
                        <h2>All Bank Accounts</h2>
                        {filteredBankAccounts.length === 0 ? (
                            <div className="empty-state">
                                {searchTerm ? 'No bank accounts found matching your search' : 'No bank accounts found'}
                            </div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Bank Name</th>
                                        <th>Account Number</th>
                                        <th>Holder Name</th>
                                        <th>IFSC Code</th>
                                        <th>Branch</th>
                                        <th>User ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBankAccounts.map((account) => (
                                        <tr key={account._id}>
                                            <td>{account.bankName}</td>
                                            <td>{account.accountNumber}</td>
                                            <td>{account.accountHolderName}</td>
                                            <td>{account.ifscCode}</td>
                                            <td>{account.branchName}</td>
                                            <td className="user-id">{account.user}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;

