import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private/Candidate
const applyForJob = async (req, res) => {
    const { jobId, resumeUrl, coverLetter } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
        return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ jobId, candidateId: req.user._id });
    if (existingApplication) {
        return res.status(400).json({ message: 'Already applied for this job' });
    }

    const application = new Application({
        jobId,
        candidateId: req.user._id,
        resumeUrl,
        coverLetter,
    });

    const createdApplication = await application.save();
    res.status(201).json(createdApplication);
};

// @desc    Get applications for a job (Employer only)
// @route   GET /api/applications/employer/:jobId
// @access  Private/Employer
const getJobApplications = async (req, res) => {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
        return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employerId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to view applications for this job' });
    }

    const applications = await Application.find({ jobId: req.params.jobId }).populate('candidateId', 'name email');
    res.json(applications);
};

// @desc    Get candidate's own applications
// @route   GET /api/applications/my
// @access  Private/Candidate
const getMyApplications = async (req, res) => {
    const applications = await Application.find({ candidateId: req.user._id }).populate('jobId', 'title employerId');
    res.json(applications);
};

// @desc    Update application status (Employer only)
// @route   PUT /api/applications/:id/status
// @access  Private/Employer
const updateApplicationStatus = async (req, res) => {
    const { status } = req.body;

    const application = await Application.findById(req.params.id).populate('jobId');

    if (!application) {
        return res.status(404).json({ message: 'Application not found' });
    }

    if (application.jobId.employerId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    const updatedApplication = await application.save();
    res.json(updatedApplication);
};

export { applyForJob, getJobApplications, getMyApplications, updateApplicationStatus };
