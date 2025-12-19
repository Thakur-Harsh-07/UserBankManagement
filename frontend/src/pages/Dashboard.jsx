import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bankApi } from '../services/api';
import toast from 'react-hot-toast';

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
        return (
            <div className="max-w-7xl mx-auto px-5 py-10">
                <div className="text-center py-10 text-lg text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-5 py-10">
            <div className="text-center mb-10">
                <h1 className="text-4xl text-gray-800 mb-2.5">Welcome, {user?.username}!</h1>
                <p className="text-gray-600 text-lg">{user?.email}</p>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5 mb-10">
                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                    <h3 className="text-gray-600 text-base mb-2.5 font-medium">Total Bank Accounts</h3>
                    <p className="text-4xl font-bold text-indigo-500 m-0">{accounts.length}</p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-md text-center">
                    <h3 className="text-gray-600 text-base mb-2.5 font-medium">Role</h3>
                    <p className="text-4xl font-bold text-indigo-500 m-0">{user?.role || 'user'}</p>
                </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap mb-10">
                <button 
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                    onClick={() => navigate('/bank-accounts')}
                >
                    Manage Bank Accounts
                </button>
                <button 
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                    onClick={() => navigate('/profile')}
                >
                    View Profile
                </button>
                {user?.role === 'admin' && (
                    <button 
                        className="px-6 py-3 bg-red-600 text-white rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                        onClick={() => navigate('/admin')}
                    >
                        Admin Panel
                    </button>
                )}
            </div>

            {accounts.length > 0 && (
                <div className="mt-10">
                    <h2 className="mb-5 text-gray-800 text-2xl font-bold">Recent Bank Accounts</h2>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
                        {accounts.slice(0, 3).map((account) => (
                            <div key={account._id} className="bg-white p-5 rounded-lg shadow-md border-l-4 border-indigo-500">
                                <h4 className="m-0 mb-4 text-gray-800 text-xl">{account.bankName}</h4>
                                <p className="my-2 text-gray-600 text-sm"><strong className="text-gray-800">Account:</strong> {account.accountNumber}</p>
                                <p className="my-2 text-gray-600 text-sm"><strong className="text-gray-800">Holder:</strong> {account.accountHolderName}</p>
                                <p className="my-2 text-gray-600 text-sm"><strong className="text-gray-800">Branch:</strong> {account.branchName}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

