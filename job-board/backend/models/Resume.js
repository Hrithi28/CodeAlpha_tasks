import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fileUrl: {
        type: String,
        required: true, // Path or URL to the uploaded PDF/Doc
    },
    skills: {
        type: [String],
    },
    experience: {
        type: String,
    },
}, {
    timestamps: true,
});

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
