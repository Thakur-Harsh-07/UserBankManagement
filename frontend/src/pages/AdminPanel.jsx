import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../services/api';
import toast from 'react-hot-toast';

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
            <div className="max-w-7xl mx-auto px-5 py-10">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
                    <p className="text-gray-600">You need admin privileges to access this page.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-5 py-10">
                <div className="text-center py-10 text-lg text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-5 py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Admin Panel</h1>
                <button 
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                    onClick={fetchData}
                >
                    Refresh Data
                </button>
            </div>

            <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button
                    className={`px-6 py-3 font-medium transition-colors ${
                        activeTab === 'users' 
                            ? 'text-indigo-600 border-b-2 border-indigo-600' 
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveTab('users')}
                >
                    Users ({users.length})
                </button>
                <button
                    className={`px-6 py-3 font-medium transition-colors ${
                        activeTab === 'accounts' 
                            ? 'text-indigo-600 border-b-2 border-indigo-600' 
                            : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveTab('accounts')}
                >
                    Bank Accounts ({bankAccounts.length})
                </button>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder={
                            activeTab === 'users' 
                                ? 'Search by username, email, role, or user ID...'
                                : 'Search by bank name, IFSC, account number, holder name, or branch...'
                        }
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    {searchTerm && (
                        <button 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl font-bold"
                            onClick={handleClearSearch}
                            title="Clear search"
                        >
                            ✕
                        </button>
                    )}
                </div>
                {searchTerm && (
                    <div className="mt-2 text-sm text-gray-600">
                        Showing {activeTab === 'users' ? filteredUsers.length : filteredBankAccounts.length} of{' '}
                        {activeTab === 'users' ? users.length : bankAccounts.length} results
                    </div>
                )}
            </div>

            <div>
                {activeTab === 'users' && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">All Users</h2>
                        {filteredUsers.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                <p className="text-gray-600 text-lg">
                                    {searchTerm ? 'No users found matching your search' : 'No users found'}
                                </p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Username</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User ID</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredUsers.map((user) => (
                                                <tr key={user._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                            user.role === 'admin' 
                                                                ? 'bg-red-100 text-red-800' 
                                                                : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{user._id}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'accounts' && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">All Bank Accounts</h2>
                        {filteredBankAccounts.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                <p className="text-gray-600 text-lg">
                                    {searchTerm ? 'No bank accounts found matching your search' : 'No bank accounts found'}
                                </p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Bank Name</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Account Number</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Holder Name</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">IFSC Code</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Branch</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User ID</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredBankAccounts.map((account) => (
                                                <tr key={account._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account.bankName}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{account.accountNumber}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{account.accountHolderName}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{account.ifscCode}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{account.branchName}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{account.user}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;

