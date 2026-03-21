import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const [jobs, setJobs] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/jobs?keyword=${keyword}&location=${location}`);
            setJobs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
        // eslint-disable-next-line
    }, []);

    const submitHandler = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    return (
        <div>
            <div className="bg-blue-600 text-white rounded-3xl p-12 text-center mb-12 shadow-lg">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Find Your Dream Job Today</h1>
                <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">Discover thousands of job opportunities with top employers around the world.</p>
                <form onSubmit={submitHandler} className="flex flex-col md:flex-row gap-4 justify-center max-w-3xl mx-auto">
                    <select
                        className="px-6 py-4 rounded-xl text-gray-800 w-full md:w-1/2 focus:outline-none focus:ring-4 focus:ring-blue-300 transition shadow-sm bg-white"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="Software Engineer">Software Engineer</option>
                        <option value="Frontend Developer">Frontend Developer</option>
                        <option value="Full Stack Engineer">Full Stack Engineer</option>
                        <option value="Data Scientist">Data Scientist</option>
                        <option value="Product Manager">Product Manager</option>
                        <option value="UX Designer">UX Designer</option>
                    </select>
                    <select
                        className="px-6 py-4 rounded-xl text-gray-800 w-full md:w-1/3 focus:outline-none focus:ring-4 focus:ring-blue-300 transition shadow-sm bg-white"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    >
                        <option value="">All Locations</option>
                        <option value="Bangalore">Bangalore, India</option>
                        <option value="Mumbai">Mumbai, India</option>
                        <option value="Delhi">Delhi, India</option>
                        <option value="Hyderabad">Hyderabad, India</option>
                        <option value="Pune">Pune, India</option>
                        <option value="Chennai">Chennai, India</option>
                        <option value="Remote">Remote</option>
                    </select>
                    <button type="submit" className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-md">
                        Search
                    </button>
                </form>
            </div>

            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Latest Opportunities</h2>
                {loading ? (
                    <div className="text-center py-12 text-gray-500 text-xl font-medium">Loading jobs...</div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 text-xl bg-white rounded-2xl shadow-sm border border-gray-100">No jobs found matching your criteria.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <div key={job._id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition border border-gray-100 flex flex-col h-full group">
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">{job.title}</h3>
                                    <p className="text-gray-500 mb-4 font-medium">{job.employerId?.name || 'Company Name'}</p>
                                    <div className="flex items-center text-sm text-gray-600 mb-2 bg-gray-50 p-2 rounded-lg inline-block">
                                        📍 {job.location}
                                    </div>
                                    <div className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">{job.description}</div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                                        {job.salary ? `$${job.salary}` : 'Salary Undisclosed'}
                                    </span>
                                    <Link to={`/jobs/${job._id}`} className="text-blue-600 font-semibold hover:underline">
                                        View Details &rarr;
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
