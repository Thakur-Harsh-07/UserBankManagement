import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
        <nav className="bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md sticky top-0 z-[1000]">
            <div className="max-w-[1400px] mx-auto px-5 flex justify-between items-center h-[70px] flex-col md:flex-row md:h-[70px] py-4 md:py-0">
                <Link to="/dashboard" className="text-2xl font-bold text-white no-underline transition-opacity duration-300 hover:opacity-80">
                    Bank Management
                </Link>
                <div className="flex items-center gap-8 flex-wrap mt-2.5 md:mt-0">
                    <Link to="/dashboard" className="text-white no-underline font-medium text-base transition-opacity duration-300 py-2 hover:opacity-80 hover:border-b-2 hover:border-white">
                        Dashboard
                    </Link>
                    <Link to="/bank-accounts" className="text-white no-underline font-medium text-base transition-opacity duration-300 py-2 hover:opacity-80 hover:border-b-2 hover:border-white">
                        Bank Accounts
                    </Link>
                    <Link to="/profile" className="text-white no-underline font-medium text-base transition-opacity duration-300 py-2 hover:opacity-80 hover:border-b-2 hover:border-white">
                        Profile
                    </Link>
                    {isAdmin && (
                        <Link to="/admin" className="text-white no-underline font-medium text-base transition-opacity duration-300 py-2 px-4 bg-white/20 rounded-md hover:opacity-80">
                            Admin Panel
                        </Link>
                    )}
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start mt-2.5 md:mt-0 pt-2.5 md:pt-0 border-t border-white/20 md:border-t-0">
                        <span className="text-white font-medium text-sm">{user?.username}</span>
                        <button 
                            className="py-2 px-4 bg-white/20 text-white border border-white/30 rounded-md text-sm font-medium cursor-pointer transition-colors duration-300 hover:bg-white/30"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

