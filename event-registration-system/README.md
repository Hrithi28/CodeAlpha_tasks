# Event Registration System

![EventConnect](https://img.shields.io/badge/Status-Complete-success.svg) ![Django](https://img.shields.io/badge/Backend-Django_REST_Framework-092E20.svg?logo=django) ![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791.svg?logo=postgresql) ![Vanilla_JS](https://img.shields.io/badge/Frontend-Vanilla_JS/CSS/HTML-F7DF1E.svg?logo=javascript)

## Overview

A full-stack, comprehensive Event Registration System that enables event organizers to manage events and allows users to seamlessly discover, register for, and track their upcoming bookings. The system consists of a robust Application Programming Interface (API) built with **Django REST Framework (DRF)**, backed by a **PostgreSQL** database, and a beautifully designed, responsive graphical user interface constructed via **Vanilla HTML, CSS, and JavaScript**.

---

## ✨ Features

### 🔐 User & Authentication System
*   **Account Creation:** Secure, standardized user registration flows.
*   **Token-Based Authentication:** Employs DRF `TokenAuthentication` for secure logins seamlessly wired into the browser's `localStorage`.
*   **Personal Dashboard:** A dedicated and private space exclusively for authenticated users to view all of their active and historical event engagements.

### 📅 Event Discovery & Booking Flows
*   **Explore Events:** A premium, glassmorphism-styled homepage highlighting upcoming events.
*   **Event Details:** Dedicated pages showing in-depth descriptions, precise locations, scheduling, and live capacities.
*   **1-Click Registration:** Effortless signup mechanism that updates the backend instantaneously and ensures hard capacity limits are never breached.
*   **Seamless Cancellations:** Direct controls in the user dashboard to revoke registrations.
*   **Organizer Admin Panel:** The powerful Django built-in Admin is fully configured, enabling managers to visually Create, Update, and Delete events smoothly.

---

## 🛠️ Technology Stack

| Architecture Layer | Technology Used |
| :--- | :--- |
| **Backend Framework** | Django, Django REST Framework |
| **Database Engine** | PostgreSQL |
| **Frontend UI** | HTML5, Vanilla JavaScript (ES6+), Vanilla CSS3 |
| **Authentication Strategy** | DRF Token Authentication |

---

## 🚀 Quick Start Guide

Want to run the complete environment on your local machine?

### 1. Database Configuration
Ensure that you have a local PostgreSQL terminal running.
The application currently looks for the default credentials configured in `settings.py`:
*   **Database Name:** `postgres`
*   **Username:** `postgres`
*   **Password:** `Hrithika_28`
*   **Port:** `5432`

### 2. Run the Backend API Server
Open a terminal and navigate to the project directory:

```bash
# Enter the workspace
cd event-registration-system

# Activate your virtual environment (Windows)
.\venv\Scripts\activate

# Ensure your database is up to date
python manage.py migrate

# Start the Django development server
python manage.py runserver
```
*The backend is now actively answering requests at `http://localhost:8000/api/`*

### 3. Run the Frontend 
Open a distinct secondary terminal window, making sure you are in the project folder:

```bash
# Enter the frontend source folder
cd event-registration-system/frontend

# Boot a localized HTTP server
python -m http.server 3000
```
*The website is now visually accessible directly at `http://localhost:3000`*

---

## 🌐 API Endpoints Overview

| Method | Endpoint | Description | Requires Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register/` | Register a new user | ❌ |
| `POST` | `/api/auth/login/` | Obtain an authentication token | ❌ |
| `GET` | `/api/events/` | Retrieve a list of all events | ❌ |
| `GET` | `/api/events/<id>/` | View granular details of a specific event | ❌ |
| `POST` | `/api/events/<id>/register/` | Register the currently logged-in user to an event | ✅ |
| `GET` | `/api/registrations/` | List all registrations specific to the logged-in user | ✅ |
| `DELETE` | `/api/registrations/<id>/` | Revoke a booking by ID | ✅ |
