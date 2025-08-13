# 🚀 SAA Jr. Backend Developer Task - Job Portal API

A comprehensive job portal backend application built with Node.js, Express, TypeScript, and MongoDB. This application provides a complete job management system with role-based access control, payment integration, and file upload capabilities.

## 👨‍💻 Developer Information

**Name:** Saurav Sarkar  
**Email:** sarkar15-4285@diu.edu.bd  
**Phone:** +880 1518643073  
**GitHub:** [https://github.com/saurav11sarkar/SAA_jr_backend_task_submit.git](https://github.com/saurav11sarkar/SAA_jr_backend_task_submit.git)  
**Live Demo:** [https://jr-backend-saa-task-submission.vercel.app](https://jr-backend-saa-task-submission.vercel.app)

## 🌟 Features

- **Multi-Role Authentication System** (Admin, Employee/Recruiter, Job Seeker)
- **Job Management** (Create, Read, Update, Delete jobs)
- **Application Management** (Apply for jobs, track applications)
- **Payment Integration** (SSLCommerz for premium features)
- **File Upload** (CV/Resume upload with Cloudinary)
- **Admin Dashboard** (User management and analytics)
- **JWT-based Authentication** with refresh tokens
- **Input Validation** using Zod
- **Error Handling** with global error middleware

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **File Storage:** Cloudinary
- **Payment Gateway:** SSLCommerz
- **Validation:** Zod
- **Security:** bcryptjs for password hashing

## 🗄️ Database Schema

The application uses a well-structured MongoDB database with four main collections. For detailed database schema and relationships, see the [Entity Relationship Diagram (ERD)](./ERD.md).

### Main Entities:

- **User** - Manages all user accounts (Admin, Employee, Job Seeker)
- **Employee** - Job postings created by recruiters
- **JobSeeker** - Job applications submitted by candidates
- **Invoice** - Payment records for premium features

## 🏗️ Project Structure

```
src/
├── app/
│   ├── config/          # Configuration files
│   ├── error/           # Error handling
│   ├── helper/          # Helper utilities
│   ├── interface/       # TypeScript interfaces
│   ├── middlewares/     # Custom middlewares
│   ├── modules/         # Feature modules
│   │   ├── admin/       # Admin management
│   │   ├── auth/        # Authentication
│   │   ├── employee/    # Employee/Recruiter features
│   │   ├── jobSeeker/   # Job seeker features
│   │   ├── user/        # User management
│   │   └── invoice/     # Payment invoices
│   ├── router/          # Route definitions
│   └── utils/           # Utility functions
├── app.ts               # Express app configuration
└── server.ts            # Server entry point
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Cloudinary account (for file uploads)
- SSLCommerz account (for payments)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/saurav11sarkar/SAA_jr_backend_task_submit.git
   cd SAA_jr_backend_task_submit
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   # Application Environment
   NODE_ENV="development"
   PORT=5000

   # Database Configuration
   DB_URL="mongodb+srv://<username>:<password>@cluster0.8ypyrzv.mongodb.net/<database-name>"

   # Security & Authentication
   ROUND=10
   JWT_ACCESS_SCRET="your_jwt_access_secret_here"
   JWT_REFRESH_SCRET="your_jwt_refresh_secret_here"
   JWT_ACCESS_EXPIRE="60m"
   JWT_REFRESH_EXPIRE="30d"

   # Cloudinary Configuration
   CLOUDINARY_CLOUDE_NAME="your_cloudinary_cloud_name"
   CLOUDINARY_API_KEY="your_cloudinary_api_key"
   CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

   # Payment Gateway (SSLCommerz)
   STORE_ID="your_sslcommerz_store_id"
   STORE_PASSWORD="your_sslcommerz_store_password"
   IS_LIVE=false

   # Application URLs
   BASE_URL="http://localhost:5000"
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔐 User Roles & Permissions

### Admin

- **Default Credentials:**
  - Email: `admin@gmail.com`
  - Password: `123456`
- **Permissions:**
  - Manage all users (CRUD operations)
  - View all jobs and applications
  - Access analytics dashboard
  - Moderate job postings

### Employee/Recruiter

- **Permissions:**
  - Create and manage job postings
  - View and manage job applications
  - Update application status (accept/reject)
  - View applicant profiles and CVs

### Job Seeker

- **Permissions:**
  - Browse available jobs
  - Apply for jobs with CV upload
  - Track application status
  - Make payments for premium features

## 📚 API Endpoints

### Base URL

- **Development:** `http://localhost:5000/api/v1`
- **Production:** `https://jr-backend-saa-task-submission.vercel.app/api/v1`

### Authentication Endpoints

```
POST   /auth/login              # User login
POST   /auth/refresh-token      # Refresh JWT token
```

### User Management

```
POST   /user/employee           # Register as employee/recruiter
POST   /user/job-seeker         # Register as job seeker
(authenticated)
GET    /user/profile            # Get user profile

(authenticated)
GET    /user/                # Get user by ID
PUT    /user/               # Update user by ID
DELETE /user/               # Delete user by ID
```

### Admin Endpoints

```
# User Management
POST   /admin/                  # Create user (any role)
GET    /admin/                  # Get all users
GET    /admin/:id               # Get single user
PUT    /admin/:id               # Update user
DELETE /admin/:id               # Delete user

# Job Management
GET    /admin/all-job           # Get all jobs
GET    /admin/all-job/:id       # Get single job
PUT    /admin/all-job/:id       # Update job
DELETE /admin/all-job/:id       # Delete job

# Job Seeker Management
GET    /admin/all-job-seeker    # Get all job seekers
GET    /admin/all-job-seeker/:id # Get single job seeker
PUT    /admin/all-job-seeker/:id # Update job seeker
DELETE /admin/all-job-seeker/:id # Delete job seeker

# Analytics
GET    /admin/analytics         # Get platform analytics
```

### Employee/Recruiter Endpoints

```
POST   /employee/create-job     # Create new job posting
GET    /employee/               # Get own job postings
GET    /employee/:id            # Get single job posting
PUT    /employee/:id            # Update job posting
DELETE /employee/:id            # Delete job posting

# Application Management
PATCH  /employee/:employeeJobId/applicants/:jobseekerapplicantId
                                # Update applicant status (accept/reject)
```

### Job Seeker Endpoints

```
GET    /job-seeker/jobs         # Browse all available jobs
POST   /job-seeker/apply        # Apply for a job (with CV upload)
GET    /job-seeker/applications # View own applications

# Payment Endpoints
GET    /job-seeker/payment/success/:invoiceId  # Payment success callback
GET    /job-seeker/payment/fail/:invoiceId     # Payment failure callback
```

## 💳 Payment Flow

The application integrates SSLCommerz for payment processing:

1. **Payment Initiation:** Job seekers can purchase premium features
2. **Payment Gateway:** Redirects to SSLCommerz payment page
3. **Payment Verification:** Server validates payment with SSLCommerz
4. **Success/Failure Handling:** Appropriate callbacks update payment status
5. **Invoice Management:** Payment records are stored for tracking

### Payment Endpoints

- Success URL: `/job-seeker/payment/success/:invoiceId`
- Failure URL: `/job-seeker/payment/fail/:invoiceId`

## 🔒 Authentication & Security

- **JWT Tokens:** Access and refresh token implementation
- **Password Hashing:** bcryptjs with configurable rounds
- **Role-based Access Control:** Middleware-based permission system
- **Input Validation:** Zod schema validation for all endpoints
- **CORS Configuration:** Configurable cross-origin resource sharing
- **Cookie Support:** Secure cookie handling for tokens

## 📁 File Upload

- **Storage:** Cloudinary integration for CV/resume uploads
- **Supported Formats:** PDF, DOC, DOCX
- **Security:** File type validation and size limits
- **Access Control:** Only authenticated job seekers can upload

## 🔧 Development

### Available Scripts

```bash
npm run dev     # Start development server with hot reload
npm run build   # Build TypeScript to JavaScript
npm test        # Run tests (placeholder)
```

### Code Structure

- **Modular Architecture:** Feature-based module organization
- **TypeScript:** Full type safety and modern JavaScript features
- **Middleware Pattern:** Reusable authentication and validation
- **Error Handling:** Centralized error management
- **Configuration Management:** Environment-based configuration

## 🚀 Deployment

The application is deployed on Vercel with the following configuration:

### Vercel Configuration (`vercel.json`)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ]
}
```

### Environment Variables

Ensure all environment variables are configured in your deployment platform:

- Database connection string
- JWT secrets
- Cloudinary credentials
- SSLCommerz credentials
- Base URL for callbacks

## 📊 API Testing

Import the Postman collection (`Backend_SAA_Task.postman_collection.json`) to test all endpoints:

1. Import the collection into Postman
2. Set up environment variables
3. Test authentication flow
4. Test role-based endpoints
5. Verify file upload functionality
6. Test payment integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 📞 Support

For any questions or support, please contact:

- **Email:** sarkar15-4285@diu.edu.bd
- **Phone:** +880 1518643073
- **GitHub Issues:** [Create an issue](https://github.com/saurav11sarkar/SAA_jr_backend_task_submit/issues)

---

**Made with ❤️ by Saurav Sarkar**
