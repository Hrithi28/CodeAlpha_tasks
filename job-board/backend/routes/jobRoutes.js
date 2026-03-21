import express from 'express';
import { getJobs, getJobById, createJob, updateJob } from '../controllers/jobController.js';
import { protect, employer } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getJobs).post(protect, employer, createJob);
router.route('/:id').get(getJobById).put(protect, employer, updateJob);

export default router;
