# Job Board Platform

A full-stack Job Board Platform that connects job seekers and recruiters through a centralized recruitment system. The platform allows recruiters to post job opportunities, manage applications, and review candidate resumes, while job seekers can browse jobs, apply for positions, and track their applications.

---

## Project Overview

The Job Board Platform was built to simplify the hiring process by providing a seamless interface for both recruiters and applicants. The application supports user authentication, job management, application tracking, and resume uploads through a secure and scalable architecture.

The project follows a modern full-stack architecture using React for the frontend, Node.js and Express.js for the backend, and MongoDB for data storage.

---

## Features

### Authentication & User Management

* User registration and login
* Secure JWT-based authentication
* Protected routes and authorization
* Recruiter and applicant role management

### Job Management

* Create job postings
* Edit and update job listings
* Delete job postings
* View available jobs
* Search and browse opportunities

### Application Management

* Apply for jobs
* Track submitted applications
* Recruiters can review applications
* Candidate application status management

### Resume Management

* Upload resumes
* Store candidate documents
* Associate resumes with applications
* Secure file handling

### Dashboard Functionality

* Recruiter dashboard
* Applicant dashboard
* Job statistics and management
* Application tracking interface

### API Integration

* RESTful API architecture
* Structured request handling
* Error handling and validation
* Secure data exchange between frontend and backend

---

## Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* HTML5
* CSS3

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JSON Web Tokens (JWT)

### Tools & Technologies

* Git
* GitHub
* Postman
* REST APIs

---

## Architecture

### Frontend Layer

Responsible for:

* User Interface
* Authentication Screens
* Job Listings
* Application Forms
* Dashboard Views

### Backend Layer

Responsible for:

* Business Logic
* Authentication
* Authorization
* API Endpoints
* File Upload Handling

### Database Layer

Stores:

* Users
* Jobs
* Applications
* Resumes

### Project Structure

```bash
job-board/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── components/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── uploads/
│
└── README.md
```


## Setup Instructions

### Clone the Repository

```bash
git clone https://github.com/Hrithi28/CodeAlpha_tasks.git
```

### Navigate to Project

```bash
cd CodeAlpha_tasks/job-board
```

---

### Backend Setup

Navigate to backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start backend server:

```bash
npm start
```

or

```bash
node server.js
```

---

### Frontend Setup

Navigate to frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Jobs

```http
GET /api/jobs
POST /api/jobs
PUT /api/jobs/:id
DELETE /api/jobs/:id
```

### Applications

```http
GET /api/applications
POST /api/applications
```

### Resume Upload

```http
POST /api/resume/upload
```

---

## My Contributions

* Designed and developed the full-stack architecture.
* Implemented authentication and authorization using JWT.
* Built REST APIs for jobs, users, and applications.
* Designed MongoDB schemas and database relationships.
* Developed recruiter and applicant workflows.
* Implemented resume upload functionality.
* Integrated frontend and backend systems.
* Tested APIs using Postman and validated user workflows.

---

## Future Improvements

* Email notifications
* Advanced job filtering
* Resume parsing using AI
* Company profiles
* Interview scheduling
* Real-time notifications
* Admin analytics dashboard

---

## License

This project is developed for educational and portfolio purposes.
