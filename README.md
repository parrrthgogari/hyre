<div align="center">
  <h1>HYRE</h1>
  <p><strong>AI-Powered Job Portal & Interview Preparation Platform</strong></p>
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
    <img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django"/>
    <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite"/>
    <img src="https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini"/>
  </p>
  <p>
    <a href="#about">About</a> •
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#api-reference">API Reference</a> •
    <a href="#roadmap">Roadmap</a>
  </p>
  <br/>
  <p><em>Built for <strong>Recursion 7.0 Hackathon</strong></em></p>
</div>

---

## About

HYRE is an AI-powered job portal designed to bridge the gap between candidates and their target roles. It helps users prepare for interviews with real-time AI feedback, identifies skill gaps based on their chosen role, and recommends curated learning resources — all powered by **Google Gemini 1.5 Flash**.

---

## Features

- **Mock Interview** — Generates 5 role-specific interview questions tailored to the target position
- **Answer Evaluation** — Scores each answer with actionable feedback and improvement suggestions
- **Final Review** — Comprehensive performance report after completing all 5 questions
- **Skill Gap Analysis** — Compares current skills against role requirements
- **Course Recommendations** — Suggests 3 real courses from Coursera, NPTEL, or Udemy for identified skill gaps

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Django + Django REST Framework |
| AI Engine | Google Gemini 1.5 Flash |
| Database | SQLite |
| CORS | django-cors-headers |

---

## Project Structure

```
djob/
├── backend/
│   ├── venv/                    # Python virtual environment
│   ├── .env                     # GEMINI_API_KEY (not committed)
│   └── core/
│       ├── manage.py
│       ├── core/
│       │   ├── settings.py
│       │   └── urls.py
│       └── api/
│           ├── views.py         # Gemini-powered API logic
│           └── urls.py          # Route definitions
└── frontend/
    └── src/
        └── App.jsx              # Main React component
```

---

## Getting Started

### Prerequisites

- [Python 3.8+](https://www.python.org/downloads/)
- [Node.js 16+](https://nodejs.org/)
- A Google Gemini API Key — [available free at AI Studio](https://aistudio.google.com/app/apikey)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hyre.git
cd hyre
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux

# Install dependencies
pip install django djangorestframework django-cors-headers python-dotenv requests
```

Create a `.env` file inside the `backend/` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Run migrations and start the server:

```bash
cd core
python manage.py migrate
python manage.py runserver
```

Backend runs at `http://127.0.0.1:8000`

### 3. Frontend Setup

Open a new terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### 4. Usage

1. Open `http://localhost:5173` in your browser
2. Enter a job role (e.g. `backend developer`)
3. Click **Generate Questions** to receive 5 AI-generated interview questions
4. Answer each question and receive a score with detailed feedback
5. Click **Get Skill Gap** to see missing skills for your target role
6. Click **Get Courses** to receive personalized learning recommendations

> Note: Both the backend and frontend servers must be running simultaneously in separate terminal windows.

---

## API Reference

**Base URL:** `http://127.0.0.1:8000/api/`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/mock-interview/` | Generate 5 interview questions for a role |
| `POST` | `/evaluate/` | Score a single answer with feedback |
| `POST` | `/final-review/` | Get full performance report after all 5 answers |
| `POST` | `/skill-gap/` | Match user skills against role requirements |
| `POST` | `/courses/` | Recommend 3 courses for identified skill gaps |

### Supported Roles

```
frontend developer    backend developer    data scientist
ml engineer           fullstack developer
```

---

## Known Limitations

- Skill gap analysis uses a hardcoded skills dictionary, not AI-based
- User skills are currently hardcoded as `["html", "css"]` — resume parsing is in progress
- No authentication yet; JWT integration is planned
- SQLite is used for development; production database is not configured

---

## Roadmap

- [ ] Resume upload and PDF parsing with `pdfplumber`
- [ ] CV vs. Job Description matching using TF-IDF cosine similarity
- [ ] JWT authentication
- [ ] Database models — Job, Application, Company, User
- [ ] Recruiter dashboard with candidate benchmarking
- [ ] Job Description quality scorer
- [ ] Full HYRE UI with polished SaaS design

---

## License

Built for **Recursion 7.0 Hackathon**. All rights reserved.
