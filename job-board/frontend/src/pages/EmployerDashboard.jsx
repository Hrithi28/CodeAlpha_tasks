import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployerDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // Create Job State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Selected Job Applications
    const [selectedJob, setSelectedJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loadingApps, setLoadingApps] = useState(false);

    useEffect(() => {
        if (!userInfo || userInfo.role !== 'employer') {
            navigate('/login');
            return;
        }

        const fetchMyJobs = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                // We fetch ALL jobs and filter locally for MVP, standard REST API would have a specific route
                // However, a simple addition on backend `/api/jobs/employer/my` is preferred.
                // Let's implement dynamic fallback: fetch all and filter if specific route missing
                const { data } = await axios.get('/api/jobs');
                // We might only get active jobs from /api/jobs. Let's filter by employerId directly.
                // Wait, if /api/jobs doesn't return employerId string but object, we handle it:
                const myJobs = data.filter(job => job.employerId && (job.employerId._id === userInfo._id || job.employerId === userInfo._id));
                setJobs(myJobs);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyJobs();
    }, [navigate]);

    const createJobHandler = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.post('/api/jobs', { title, description, location, salary }, config);
            setJobs([...jobs, data]);
            setShowCreateForm(false);
            setTitle(''); setDescription(''); setLocation(''); setSalary('');
        } catch (error) {
            console.error(error);
            alert('Error creating job');
        }
    };

    const loadApplications = async (jobId) => {
        setLoadingApps(true);
        setSelectedJob(jobId);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get(`/api/applications/employer/${jobId}`, config);
            setApplications(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingApps(false);
        }
    };

    const updateAppStatus = async (appId, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.put(`/api/applications/${appId}/status`, { status }, config);
            // Update local state
            setApplications(applications.map(app => app._id === appId ? { ...app, status } : app));
        } catch (error) {
            console.error(error);
            alert('Error updating status');
        }
    };

    if (loading) return <div className="text-center py-20 text-xl">Loading Dashboard...</div>;

    return (
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Sidebar: My Jobs */}
            <div className="md:w-1/3">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">My Jobs</h2>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition"
                    >
                        {showCreateForm ? 'Cancel' : '+ New Job'}
                    </button>
                </div>

                {showCreateForm && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 transition">
                        <h3 className="font-bold text-gray-800 mb-4">Post a new job</h3>
                        <form onSubmit={createJobHandler} className="space-y-3">
                            <input type="text" placeholder="Job Title" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                            <textarea placeholder="Description" required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" rows="3" />
                            <input type="text" placeholder="Location" required value={location} onChange={(e) => setLocation(e.target.value)} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                            <input type="number" placeholder="Salary (Optional)" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">Publish Job</button>
                        </form>
                    </div>
                )}

                <div className="space-y-4">
                    {jobs.map(job => (
                        <div
                            key={job._id}
                            onClick={() => loadApplications(job._id)}
                            className={`p-4 rounded-xl cursor-pointer transition border ${selectedJob === job._id ? 'border-blue-500 shadow-md bg-blue-50' : 'bg-white border-gray-200 hover:shadow-sm'}`}
                        >
                            <h4 className="font-bold text-gray-900">{job.title}</h4>
                            <p className="text-sm text-gray-500">{job.location} · {job.status}</p>
                        </div>
                    ))}
                    {jobs.length === 0 && !showCreateForm && (
                        <p className="text-gray-500 text-center py-4 bg-white rounded-xl border border-dashed">No jobs posted yet.</p>
                    )}
                </div>
            </div>

            {/* Main Content: Applications */}
            <div className="md:w-2/3">
                {selectedJob ? (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Applications for Selected Job</h2>
                        {loadingApps ? (
                            <p className="text-gray-500 text-center py-8">Loading applications...</p>
                        ) : applications.length === 0 ? (
                            <p className="text-gray-500 text-center py-8 text-lg">No applications received yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {applications.map(app => (
                                    <div key={app._id} className="border p-5 rounded-xl flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-blue-200 transition">
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-900">{app.candidateId?.name}</h4>
                                            <p className="text-gray-600 text-sm mb-2">{app.candidateId?.email}</p>
                                            <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-blue-600 font-medium hover:underline text-sm inline-flex items-center">
                                                📄 View Resume Document
                                            </a>
                                            {app.coverLetter && <p className="mt-2 text-sm text-gray-600 italic border-l-2 border-gray-300 pl-3">"{app.coverLetter}"</p>}
                                        </div>
                                        <div className="flex flex-col items-end gap-2 shrink-0">
                                            <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    app.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                                                        app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'
                                                }`}>
                                                {app.status}
                                            </span>
                                            <select
                                                className="text-sm border rounded bg-gray-50 px-2 py-1 outline-none focus:ring-1 focus:ring-blue-500"
                                                value={app.status}
                                                onChange={(e) => updateAppStatus(app._id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="reviewed">Reviewed</option>
                                                <option value="accepted">Accepted</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-2xl border border-gray-200 h-full flex flex-col items-center justify-center py-20 text-center px-10">
                        <div className="text-5xl mb-4">💼</div>
                        <h3 className="text-2xl font-bold text-gray-400">Select a Job</h3>
                        <p className="text-gray-500 mt-2">Click on a job from the sidebar to view and manage its applications.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployerDashboard;
