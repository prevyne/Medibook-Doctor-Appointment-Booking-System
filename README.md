# MediBook: A MERN Stack Doctor Appointment Booking System

MediBook is a full-stack web application designed to streamline the process of booking and managing medical appointments. It features distinct roles for patients, doctors, and administrators, each with a dedicated dashboard and functionalities. This project is built with the MERN stack (MongoDB, Express.js, React, Node.js) and features a modern, responsive user interface built with Material-UI.

## Features

### General
* **Role-Based Authentication:** Secure user registration and login system using JSON Web Tokens (JWT).
* **Role-Based Access Control:** Users are directed to different dashboards (Patient, Doctor, Admin) based on their role.
* **Responsive Design:** The UI is fully responsive and built with a mobile-first approach using Material-UI.

### Patient Features
* **Register & Login:** Patients can create their own accounts.
* **View Doctors:** Browse a list of available doctors and their specialties.
* **Book Appointments:** Select a doctor and book an appointment for a specific date and time.
* **Dashboard:** View a list of all their upcoming and past appointments.
* **Cancel Appointments:** Patients can cancel their 'Scheduled' appointments.

### Doctor Features
* **Dashboard:** View a schedule of all their appointments, sorted by date.
* **Approve Appointments:** Doctors can approve newly scheduled appointments, changing their status from 'Scheduled' to 'Approved'.
* **View Patient Details:** See the name and email of the patient for each appointment.

### Admin Features
* **Admin Dashboard:** A central dashboard to manage all users in the system.
* **View All Users:** See a comprehensive list of all registered patients, doctors, and other admins.
* **Change User Roles:** Promote users from 'patient' to 'doctor'.
* **Terminate Accounts:** Admins have the ability to delete user accounts. Deleting a user also removes all appointments associated with them.

## 🛠️ Tech Stack

* **Frontend:**
    * React.js
    * Material-UI (MUI) for component styling
    * React Router for navigation
    * Axios for API requests
    * jwt-decode for parsing JWTs

* **Backend:**
    * Node.js
    * Express.js
    * MongoDB with Mongoose for database management
    * JSON Web Tokens (JWT) for authentication
    * bcrypt.js for password hashing

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

* Node.js and npm (Node Package Manager)
* MongoDB (You can use a local installation or a free cloud-based service like MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-folder>
    ```

2.  **Setup the Backend:**
    * Navigate to the backend directory: `cd backend`
    * Install dependencies: `npm install`
    * Create a `.env` file in the `backend` directory and add the following environment variables:
        ```env
        MONGO_URI=your_mongodb_connection_string
        JWT_SECRET=your_super_secret_key_for_jwt
        ```
    * Populate the database with sample data (doctors and an admin user):
        ```bash
        npm run data:import
        ```
    * Start the backend server:
        ```bash
        npm start
        ```
    The backend will be running on `http://localhost:5000`.

3.  **Setup the Frontend:**
    * Open a new terminal and navigate to the frontend directory: `cd client`
    * Install dependencies: `npm install`
    * Start the frontend development server:
        ```bash
        npm run dev
        ```
    The frontend will be running on `http://localhost:5173` (or another port if 5173 is busy).

## Available Roles & Credentials

You can use the following pre-seeded accounts to test the application.

### Admin
* **Email:** `admin@medibook.com`
* **Password:** `adminpassword`

### Doctor
A doctor account is pre-seeded. To log in as a doctor, first log in as the **Admin**, change the role of one of the pre-seeded users (like Dr. John Doe) to 'doctor', and then log in with their credentials.
* **Email:** `john.doe@medibook.com`
* **Password:** `password123`

### Patient
You can register a new account through the UI, or you can log in as the Admin and change the role of a user to 'patient'.

## API Endpoints

### Auth Routes
* `POST /api/auth/register` - Register a new user.
* `POST /api/auth/login` - Login a user.

### Admin Routes
* `GET /api/admin/users` - Get all users.
* `PUT /api/admin/users/:id/role` - Update a user's role.
* `DELETE /api/admin/users/:id` - Delete a user.

### Doctor Routes
* `GET /api/doctors` - Get all users with the 'doctor' role.
* `GET /api/doctors/:id` - Get a single doctor's details.

### Appointment Routes
* `POST /api/appointments` - Create a new appointment.
* `GET /api/appointments/myappointments` - Get all appointments for a logged-in patient.
* `GET /api/appointments/doctor/schedule` - Get all appointments for a logged-in doctor.
* `PUT /api/appointments/:id/approve` - Approve an appointment (doctor only).
* `PUT /api/appointments/:id/cancel` - Cancel an appointment (patient only).

### Live Site
VERCEL: https://medibook-doctor-appointment-booking.vercel.app/