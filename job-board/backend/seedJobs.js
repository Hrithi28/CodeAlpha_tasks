import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Job from './models/Job.js';

dotenv.config();
connectDB();

const seedJobs = async () => {
    try {
        let employer = await User.findOne({ role: 'employer' });
        if (!employer) {
            employer = await User.create({
                name: 'Tech Corp India',
                email: 'hr@techcorpindia.com',
                password: 'password123',
                role: 'employer'
            });
        }

        const jobs = [
            {
                title: 'Software Engineer',
                description: 'Join our backend team to build scalable microservices using Node.js and Express.',
                location: 'Bangalore, India',
                salary: 1500000,
                requirements: ['Node.js', 'Express', 'MongoDB'],
                employerId: employer._id
            },
            {
                title: 'Frontend Developer',
                description: 'Create responsive and beautiful user interfaces with React and Tailwind CSS.',
                location: 'Mumbai, India',
                salary: 1200000,
                requirements: ['React', 'Tailwind CSS', 'JavaScript'],
                employerId: employer._id
            },
            {
                title: 'Data Scientist',
                description: 'Help us make sense of our data using machine learning models.',
                location: 'Delhi, India',
                salary: 1800000,
                requirements: ['Python', 'Machine Learning', 'SQL'],
                employerId: employer._id
            },
            {
                title: 'Product Manager',
                description: 'Lead the product lifecycle from ideation to launch.',
                location: 'Hyderabad, India',
                salary: 2000000,
                requirements: ['Agile', 'Product Strategy', 'Communication'],
                employerId: employer._id
            },
            {
                title: 'UX Designer',
                description: 'Design intuitive wireframes and prototypes for our web apps.',
                location: 'Pune, India',
                salary: 1000000,
                requirements: ['Figma', 'UI/UX Design', 'Wireframing'],
                employerId: employer._id
            },
            {
                title: 'Full Stack Engineer',
                description: 'Work across the entire stack to deliver robust enterprise solutions.',
                location: 'Chennai, India',
                salary: 1600000,
                requirements: ['MERN Stack', 'TypeScript', 'Docker'],
                employerId: employer._id
            }
        ];

        await Job.insertMany(jobs);
        console.log('Dummy jobs inserted successfully!');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedJobs();
