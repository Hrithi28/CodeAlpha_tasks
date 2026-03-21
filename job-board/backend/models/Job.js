import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    employerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
    },
    requirements: {
        type: [String],
    },
    status: {
        type: String,
        enum: ['active', 'closed'],
        default: 'active',
    },
}, {
    timestamps: true,
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
