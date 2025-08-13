# Visual ERD - Job Portal Database Schema

```mermaid
erDiagram
    User {
        ObjectId _id PK "Primary Key"
        string name "Full Name"
        string email UK "Unique Email"
        string password "Hashed Password"
        enum role "admin|employee|jobSeeker"
        string company "Required for employees"
        datetime createdAt "Auto-generated"
        datetime updatedAt "Auto-generated"
    }

    Employee {
        ObjectId _id PK "Primary Key"
        string title "Job Title"
        text description "Job Description"
        array requirements "Job Requirements"
        string companyName "Company Name"
        string location "Job Location"
        object salaryRange "Min/Max Salary"
        enum jobType "full-time|part-time|contract|internship|remote"
        enum status "active|inactive"
        date applicationDeadline "Application Deadline"
        ObjectId user FK "Creator (Employee User)"
        array applicants "Array of JobSeeker IDs"
        datetime createdAt "Auto-generated"
        datetime updatedAt "Auto-generated"
    }

    JobSeeker {
        ObjectId _id PK "Primary Key"
        ObjectId employeejobId FK "Job Applied For"
        ObjectId userId FK "Applicant User"
        string cvUrl "CV/Resume URL"
        enum status "pending|accepted|rejected"
        ObjectId invoice FK "Payment Invoice"
        boolean paymentStatus "Payment Completed"
        datetime createdAt "Auto-generated"
        datetime updatedAt "Auto-generated"
    }

    Invoice {
        ObjectId _id PK "Primary Key"
        ObjectId user FK "User Making Payment"
        number amount "Payment Amount"
        string description "Payment Description"
        enum status "pending|paid|failed"
        date paymentDate "Payment Completion Date"
        datetime createdAt "Auto-generated"
        datetime updatedAt "Auto-generated"
    }

    %% Relationships with cardinality
    User ||--o{ Employee : "creates (1:N)"
    User ||--o{ JobSeeker : "applies (1:N)"
    User ||--o{ Invoice : "pays (1:N)"
    Employee ||--o{ JobSeeker : "receives_applications (1:N)"
    Invoice ||--o| JobSeeker : "payment_for (1:1)"
```

## Relationship Details

### User → Employee (One-to-Many)

- **Description:** One employee user can create multiple job postings
- **Foreign Key:** `Employee.user` references `User._id`
- **Business Rule:** Only users with role "employee" can create job postings

### User → JobSeeker (One-to-Many)

- **Description:** One job seeker user can submit multiple job applications
- **Foreign Key:** `JobSeeker.userId` references `User._id`
- **Business Rule:** Only users with role "jobSeeker" can apply for jobs

### User → Invoice (One-to-Many)

- **Description:** One user can have multiple payment invoices
- **Foreign Key:** `Invoice.user` references `User._id`
- **Business Rule:** Invoices track payments for premium features

### Employee → JobSeeker (One-to-Many)

- **Description:** One job posting can receive multiple applications
- **Foreign Key:** `JobSeeker.employeejobId` references `Employee._id`
- **Additional:** `Employee.applicants` array also tracks this relationship

### Invoice → JobSeeker (One-to-One, Optional)

- **Description:** One invoice can be associated with one job application
- **Foreign Key:** `JobSeeker.invoice` references `Invoice._id`
- **Business Rule:** Optional payment for premium application features
