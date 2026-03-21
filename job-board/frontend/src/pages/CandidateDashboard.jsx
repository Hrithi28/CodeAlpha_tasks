import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CandidateDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        if (!userInfo || userInfo.role !== 'candidate') {
            navigate('/login');
            return;
        }

        const fetchApplications = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get('/api/applications/my', config);
                setApplications(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, [navigate]);

    if (loading) return <div className="text-center py-20 text-xl">Loading your applications...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">My Applications</h1>

            {applications.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500 mb-4 text-lg">You haven't applied to any jobs yet.</p>
                    <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition">
                        Browse Jobs
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 font-semibold text-gray-600">Job Title</th>
                                    <th className="p-4 font-semibold text-gray-600 text-center">Status</th>
                                    <th className="p-4 font-semibold text-gray-600 text-center">Applied On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app) => (
                                    <tr key={app._id} className="border-b border-gray-50 hover:bg-gray-50 transition border-last-none">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900">{app.jobId?.title || 'Unknown Job'}</div>
                                            <div className="text-sm text-gray-500">Resume Link: <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View File</a></div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                        ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    app.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                                                        app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center text-gray-500">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CandidateDashboard;
