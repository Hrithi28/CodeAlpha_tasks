import Job from '../models/Job.js';

// @desc    Fetch all jobs (with optional search/filter)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    const keyword = req.query.keyword
        ? {
            title: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const location = req.query.location
        ? {
            location: {
                $regex: req.query.location,
                $options: 'i',
            },
        }
        : {};

    const jobs = await Job.find({ ...keyword, ...location, status: 'active' }).populate('employerId', 'name');
    res.json(jobs);
};

// @desc    Fetch single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    const job = await Job.findById(req.params.id).populate('employerId', 'name');

    if (job) {
        res.json(job);
    } else {
        res.status(404).json({ message: 'Job not found' });
    }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Employer
const createJob = async (req, res) => {
    const { title, description, location, salary, requirements } = req.body;

    const job = new Job({
        title,
        description,
        location,
        salary,
        requirements,
        employerId: req.user._id,
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Employer
const updateJob = async (req, res) => {
    const { title, description, location, salary, requirements, status } = req.body;

    const job = await Job.findById(req.params.id);

    if (job) {
        if (job.employerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to edit this job' });
        }

        job.title = title || job.title;
        job.description = description || job.description;
        job.location = location || job.location;
        job.salary = salary || job.salary;
        job.requirements = requirements || job.requirements;
        job.status = status || job.status;

        const updatedJob = await job.save();
        res.json(updatedJob);
    } else {
        res.status(404).json({ message: 'Job not found' });
    }
};

export { getJobs, getJobById, createJob, updateJob };
