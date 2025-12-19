import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bankApi } from '../services/api';
import toast from 'react-hot-toast';

const BankAccounts = () => {
    const { token, isAuthenticated } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [formData, setFormData] = useState({
        bankName: '',
        accountNumber: '',
        accountHolderName: '',
        ifscCode: '',
        branchName: ''
    });

    useEffect(() => {
        if (isAuthenticated) {
            fetchAccounts();
        }
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAccount) {
                await bankApi.updateAccount(token, editingAccount._id, formData);
                toast.success('Bank account updated successfully!');
            } else {
                await bankApi.addAccount(token, formData);
                toast.success('Bank account added successfully!');
            }
            resetForm();
            fetchAccounts();
        } catch (error) {
            const message = error.response?.data?.message || 'Operation failed';
            toast.error(message);
        }
    };

    const handleEdit = (account) => {
        setEditingAccount(account);
        setFormData({
            bankName: account.bankName || '',
            accountNumber: account.accountNumber || '',
            accountHolderName: account.accountHolderName || '',
            ifscCode: account.ifscCode || '',
            branchName: account.branchName || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this bank account?')) {
            return;
        }
        try {
            await bankApi.deleteAccount(token, id);
            toast.success('Bank account deleted successfully!');
            fetchAccounts();
        } catch (error) {
            const message = error.response?.data?.message || 'Delete failed';
            toast.error(message);
        }
    };

    const resetForm = () => {
        setFormData({
            bankName: '',
            accountNumber: '',
            accountHolderName: '',
            ifscCode: '',
            branchName: ''
        });
        setEditingAccount(null);
        setShowForm(false);
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
            <div className="flex justify-between items-center mb-8 flex-col md:flex-row gap-5 md:gap-0">
                <h1 className="text-gray-800 text-3xl font-bold">Bank Accounts</h1>
                <button 
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : 'Add New Account'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-8 rounded-xl shadow-md mb-8">
                    <h2 className="mb-5 text-gray-800 text-2xl font-bold">{editingAccount ? 'Edit Account' : 'Add New Account'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div className="mb-5">
                                <label htmlFor="bankName" className="block mb-2 text-gray-700 font-medium">Bank Name</label>
                                <input
                                    type="text"
                                    id="bankName"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-indigo-500 box-border"
                                />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="accountNumber" className="block mb-2 text-gray-700 font-medium">Account Number</label>
                                <input
                                    type="text"
                                    id="accountNumber"
                                    name="accountNumber"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-indigo-500 box-border"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                            <div className="mb-5">
                                <label htmlFor="accountHolderName" className="block mb-2 text-gray-700 font-medium">Account Holder Name</label>
                                <input
                                    type="text"
                                    id="accountHolderName"
                                    name="accountHolderName"
                                    value={formData.accountHolderName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-indigo-500 box-border"
                                />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="ifscCode" className="block mb-2 text-gray-700 font-medium">IFSC Code</label>
                                <input
                                    type="text"
                                    id="ifscCode"
                                    name="ifscCode"
                                    value={formData.ifscCode}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-indigo-500 box-border"
                                />
                            </div>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="branchName" className="block mb-2 text-gray-700 font-medium">Branch Name</label>
                            <input
                                type="text"
                                id="branchName"
                                name="branchName"
                                value={formData.branchName}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-indigo-500 box-border"
                            />
                        </div>
                        <div className="flex gap-2.5 mt-5">
                            <button 
                                type="submit" 
                                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                {editingAccount ? 'Update' : 'Add'} Account
                            </button>
                            {editingAccount && (
                                <button 
                                    type="button" 
                                    className="px-6 py-3 bg-gray-600 text-white rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            <div className="mt-8">
                {accounts.length === 0 ? (
                    <div className="text-center py-16 px-5 bg-white rounded-xl shadow-md">
                        <p className="text-gray-600 text-lg">No bank accounts found. Add your first account!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5">
                        {accounts.map((account) => (
                            <div 
                                key={account._id} 
                                className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-300">
                                    <h3 className="m-0 text-gray-800 text-xl font-bold">{account.bankName}</h3>
                                    <div className="flex gap-2.5">
                                        <button
                                            className="px-3 py-1.5 bg-indigo-500 text-white rounded-md text-sm font-medium cursor-pointer transition-transform duration-200 hover:scale-105"
                                            onClick={() => handleEdit(account)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm font-medium cursor-pointer transition-transform duration-200 hover:scale-105"
                                            onClick={() => handleDelete(account._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="my-2.5 text-gray-600 text-sm"><strong className="text-gray-800">Account Number:</strong> {account.accountNumber}</p>
                                    <p className="my-2.5 text-gray-600 text-sm"><strong className="text-gray-800">Holder Name:</strong> {account.accountHolderName}</p>
                                    <p className="my-2.5 text-gray-600 text-sm"><strong className="text-gray-800">IFSC Code:</strong> {account.ifscCode}</p>
                                    <p className="my-2.5 text-gray-600 text-sm"><strong className="text-gray-800">Branch:</strong> {account.branchName}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BankAccounts;

