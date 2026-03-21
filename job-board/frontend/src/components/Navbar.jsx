import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow relative z-10">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-primary tracking-tight">
                    JobBoard<span className="text-blue-600">.</span>
                </Link>
                <div className="flex items-center space-x-4">
                    {userInfo ? (
                        <>
                            <span className="text-gray-600">Hello, {userInfo.name}</span>
                            {userInfo.role === 'employer' && (
                                <Link to="/dashboard/employer" className="text-gray-600 hover:text-blue-600 transition">
                                    Employer Dashboard
                                </Link>
                            )}
                            {userInfo.role === 'candidate' && (
                                <Link to="/dashboard/candidate" className="text-gray-600 hover:text-blue-600 transition">
                                    My Dashboard
                                </Link>
                            )}
                            <button
                                onClick={logoutHandler}
                                className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-sm transition"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
