import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bankApi } from '../services/api';
import toast from 'react-hot-toast';
import './BankAccounts.css';

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
        return <div className="bank-accounts-container"><div className="loading">Loading...</div></div>;
    }

    return (
        <div className="bank-accounts-container">
            <div className="bank-accounts-header">
                <h1>Bank Accounts</h1>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Add New Account'}
                </button>
            </div>

            {showForm && (
                <div className="account-form-card">
                    <h2>{editingAccount ? 'Edit Account' : 'Add New Account'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="bankName">Bank Name</label>
                                <input
                                    type="text"
                                    id="bankName"
                                    name="bankName"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="accountNumber">Account Number</label>
                                <input
                                    type="text"
                                    id="accountNumber"
                                    name="accountNumber"
                                    value={formData.accountNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="accountHolderName">Account Holder Name</label>
                                <input
                                    type="text"
                                    id="accountHolderName"
                                    name="accountHolderName"
                                    value={formData.accountHolderName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="ifscCode">IFSC Code</label>
                                <input
                                    type="text"
                                    id="ifscCode"
                                    name="ifscCode"
                                    value={formData.ifscCode}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="branchName">Branch Name</label>
                            <input
                                type="text"
                                id="branchName"
                                name="branchName"
                                value={formData.branchName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {editingAccount ? 'Update' : 'Add'} Account
                            </button>
                            {editingAccount && (
                                <button type="button" className="btn-secondary" onClick={resetForm}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            <div className="accounts-list">
                {accounts.length === 0 ? (
                    <div className="empty-state">
                        <p>No bank accounts found. Add your first account!</p>
                    </div>
                ) : (
                    <div className="accounts-grid">
                        {accounts.map((account) => (
                            <div key={account._id} className="account-card">
                                <div className="account-header">
                                    <h3>{account.bankName}</h3>
                                    <div className="account-actions">
                                        <button
                                            className="btn-edit"
                                            onClick={() => handleEdit(account)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(account._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <div className="account-details">
                                    <p><strong>Account Number:</strong> {account.accountNumber}</p>
                                    <p><strong>Holder Name:</strong> {account.accountHolderName}</p>
                                    <p><strong>IFSC Code:</strong> {account.ifscCode}</p>
                                    <p><strong>Branch:</strong> {account.branchName}</p>
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

