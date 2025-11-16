import axios from 'axios';
const API_BASE_URL = 'https://userbankmanagement.onrender.com/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Auth Api
export const authApi = {
    signup: async (data) => {
        return await api.post('/auth/register', data);
    },
    login: async (data) => {
        return await api.post('/auth/login', data);
    },
    getProfile: async (token) => {
        return await api.get('/auth/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
   
};

// Bank Api
export const bankApi = {
    getAccounts: async (token) => {
        return await api.get('/bank/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
    getAccountById: async (token, id) => {
        return await api.get(`/bank/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
    addAccount: async (token, data) => {
        return await api.post('/bank/addBank', data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
    updateAccount: async (token, id, data) => {
        return await api.put(`/bank/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
    deleteAccount: async (token, id) => {
        return await api.delete(`/bank/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
};

// Admin Api
export const adminApi = {
    getAllUsers: async (token) => {
        return await api.get('/admin/users', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
    getAllBankAccounts: async (token) => {
        return await api.get('/admin/bank-accounts', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }
};

