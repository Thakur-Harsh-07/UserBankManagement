import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, logout } = useAuth();

    if (!user) {
        return (
            <div className="min-h-screen flex justify-center items-center px-5 py-10 bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="text-center py-10 text-lg text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex justify-center items-center px-5 py-10 bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-lg">
                <h2 className="text-center mb-8 text-gray-800 text-3xl font-bold">Profile</h2>
                <div className="mb-5">
                    <div className="mb-5">
                        <label className="block mb-2 text-gray-700 font-medium">Username</label>
                        <div className="w-full px-3 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg text-base text-gray-800 box-border min-h-[44px] flex items-center">
                            {user.username || 'N/A'}
                        </div>
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-gray-700 font-medium">Email</label>
                        <div className="w-full px-3 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg text-base text-gray-800 box-border min-h-[44px] flex items-center">
                            {user.email || 'N/A'}
                        </div>
                    </div>
                    <div className="mb-5">
                        <label className="block mb-2 text-gray-700 font-medium">Role</label>
                        <div className="w-full px-3 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg text-base text-gray-800 box-border min-h-[44px] flex items-center">
                            {user.role || 'user'}
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-300">
                    <button 
                        className="w-full py-3 bg-red-600 text-white rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;

