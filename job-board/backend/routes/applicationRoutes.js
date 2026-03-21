import express from 'express';
import { applyForJob, getJobApplications, getMyApplications, updateApplicationStatus } from '../controllers/applicationController.js';
import { protect, employer } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, applyForJob);
router.route('/my').get(protect, getMyApplications);
router.route('/employer/:jobId').get(protect, employer, getJobApplications);
router.route('/:id/status').put(protect, employer, updateApplicationStatus);

export default router;
