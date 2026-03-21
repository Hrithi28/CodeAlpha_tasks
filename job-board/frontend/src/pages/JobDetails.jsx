import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [resumeUrl, setResumeUrl] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await axios.get(`/api/jobs/${id}`);
                setJob(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('resume', file);
        setUploading(true);
        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post('/api/upload', formData, config);
            setResumeUrl(data);
        } catch (error) {
            console.error(error);
            setMessage('Error uploading file');
        } finally {
            setUploading(false);
        }
    };

    const submitApplication = async (e) => {
        e.preventDefault();
        if (!userInfo) {
            navigate('/login');
            return;
        }
        if (userInfo.role !== 'candidate') {
            setMessage('Only candidates can apply for jobs.');
            return;
        }
        try {
            setApplying(true);
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.post('/api/applications', { jobId: id, resumeUrl, coverLetter }, config);
            setMessage('Application submitted successfully!');
            setResumeUrl('');
            setCoverLetter('');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error submitting application');
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-2xl font-bold text-gray-500">Loading Job Details...</div>;
    if (!job) return <div className="text-center py-20 text-2xl font-bold text-red-500">Job Not Found</div>;

    return (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{job.title}</h1>
                    <p className="text-xl text-blue-600 font-semibold mb-6">{job.employerId?.name}</p>

                    <div className="flex flex-wrap gap-4 mb-8">
                        <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-medium">📍 {job.location}</span>
                        <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">💰 {job.salary ? `$${job.salary}` : 'Unspecified'}</span>
                        <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-medium">🏷️ {job.status.toUpperCase()}</span>
                    </div>

                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Job Description</h2>
                    <div className="text-gray-600 leading-relaxed mb-8 whitespace-pre-line">{job.description}</div>

                    {job.requirements && job.requirements.length > 0 && (
                        <>
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Requirements</h2>
                            <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-8">
                                {job.requirements.map((req, index) => (
                                    <li key={index}>{req}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>

            <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">Apply for this job</h3>

                    {message && (
                        <div className={`p-4 rounded-lg mb-6 text-sm font-semibold ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message}
                        </div>
                    )}

                    {!userInfo ? (
                        <div className="text-center">
                            <p className="mb-4 text-gray-600">Please log in to apply.</p>
                            <Link to="/login" className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-bold shadow-md hover:bg-blue-700 transition">
                                Login to Apply
                            </Link>
                        </div>
                    ) : userInfo.role === 'employer' ? (
                        <p className="text-gray-500 font-medium text-center">Employers cannot apply for jobs.</p>
                    ) : (
                        <form onSubmit={submitApplication} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2 text-sm">Upload Resume (PDF/DOC)</label>
                                <input
                                    type="file"
                                    onChange={uploadFileHandler}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
                                />
                                {uploading && <p className="text-sm text-blue-500 mt-2 font-medium">Uploading...</p>}
                                {resumeUrl && <p className="text-sm text-green-600 mt-2 font-medium">✓ Resume uploaded ready to submit</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2 text-sm">Cover Letter (Optional)</label>
                                <textarea
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    placeholder="Tell us why you are a great fit..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={applying || !resumeUrl || uploading}
                                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md transition duration-200"
                            >
                                {applying ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
