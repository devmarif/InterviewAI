# InterviewAI 🤖

> AI-powered interview preparation platform that analyzes your resume, profile, and target job description to generate a personalized interview preparation report.

---

## 📌 About The Project

**InterviewAI** is a Generative AI-powered interview preparation platform designed to help candidates prepare for technical and behavioral interviews.

The application analyzes three key inputs:

- 📄 Candidate Resume
- 👤 Candidate Self Description
- 💼 Target Job Description

Using these inputs, InterviewAI generates a personalized interview report containing a job match score, technical questions, behavioral questions, skill-gap analysis, and a structured preparation plan.

The goal of the project is to help candidates understand their strengths, identify areas for improvement, and prepare more effectively for their target roles.

---

## ✨ Features

### 🔐 User Authentication

- User registration
- User login
- User logout
- Protected routes
- JWT-based authentication
- HTTP-only authentication cookies
- User-specific interview reports

### 📄 Resume Upload

- PDF resume upload
- Resume file validation
- Resume size validation
- In-memory file processing
- PDF text extraction
- Secure resume processing

### 🤖 AI-Powered Interview Analysis

InterviewAI uses Generative AI to analyze the candidate's resume, self-description, and job description.

The AI generates a structured interview report containing:

- Match Score
- Technical Interview Questions
- Behavioral Interview Questions
- Skills Gap Analysis
- Personalized Recommendations
- Interview Preparation Plan

### 📊 Job Match Score

The application generates a score from **0 to 100** representing how closely the candidate's profile matches the requirements of the target job.

### 💻 Technical Interview Questions

The system generates realistic technical interview questions based on the candidate's:

- Skills
- Projects
- Experience
- Technologies
- Resume
- Target job requirements

Each technical question contains:

- Question
- Interviewer's Intention
- Sample Answer

### 🧠 Behavioral Interview Questions

InterviewAI generates behavioral questions based on the candidate's experience and the target role.

Where appropriate, answers are structured using the **STAR method**:

- Situation
- Task
- Action
- Result

### 📚 Skills Gap Analysis

The AI identifies skills that are missing or insufficiently demonstrated compared with the target job requirements.

Each skill gap contains:

- Skill
- Severity
- Reason
- Recommendation

Severity levels:

- 🟢 Low
- 🟡 Medium
- 🔴 High

### 📅 Interview Preparation Plan

The application creates a personalized preparation plan based on the candidate's skill gaps and target job requirements.

The plan contains:

- Preparation day
- Focus area
- Specific tasks
- Recommended preparation activities

### 📋 Interview History

Authenticated users can access their previously generated interview reports.

Users can:

- View previous reports
- Open individual reports
- Review match scores
- Review technical questions
- Review behavioral questions
- Review skill gaps
- Review preparation plans

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Frontend build tool |
| React Router | Application routing |
| Tailwind CSS | UI styling |
| React Hook Form | Form management |
| Axios | API communication |
| Lucide React | Icons |
| React Toastify | Notifications |

## Backend

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| Cookie Parser | Cookie handling |
| CORS | Cross-origin communication |
| Multer | Resume file uploads |

## AI & Data Processing

| Technology | Purpose |
|---|---|
| Google Gemini | Generative AI |
| Zod | AI response validation |
| PDF Parser | Resume text extraction |

---

# 🏗️ Project Architecture

```text
                         ┌──────────────────────┐
                         │       User           │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   React Frontend     │
                         │   + Tailwind CSS     │
                         └──────────┬───────────┘
                                    │
                                    │ Axios API
                                    ▼
                         ┌──────────────────────┐
                         │   Express Backend    │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
             ┌────────────┐  ┌────────────┐  ┌─────────────┐
             │    Auth    │  │ PDF Parser │  │  Gemini AI  │
             │    JWT     │  │   Resume   │  │   Service   │
             └────────────┘  └────────────┘  └──────┬──────┘
                                                     │
                                                     ▼
                                            ┌─────────────────┐
                                            │ Interview Report│
                                            └────────┬────────┘
                                                     │
                                                     ▼
                                            ┌─────────────────┐
                                            │    MongoDB      │
                                            └─────────────────┘
