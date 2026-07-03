# ResumeIQ - AI-Powered Resume Analyzer & ATS Optimizer

ResumeIQ is a professional web application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS). By leveraging the Google Gemini API, the platform parses resumes, evaluates them against target job descriptions, scores compatibility, reveals skill gaps, and generates tailored cover letters and career path roadmaps.

---

## 🚀 Key Features

* **Real-time Match Scoring**: Compiles an ATS match percentage (0-100%) by comparing resume text against job requirements.
* **Server-Sent Events (SSE) Streaming**: Delivers live, backend-driven progress updates (parsing, extraction, cross-referencing, scoring) during analysis.
* **Dynamic Skill Cloud**: Renders interactive matched (emerald) and missing (amber) skills parsed directly from job requirements.
* **Interactive Recommendations**: A checklist of actionable advice (formatting, credentials, bullet-point revisions) that users can review and action.
* **Career Path Forecasting**: Generates detailed career progression roadmaps based on candidate background.
* **Saved Jobs Tracker**: Bookmarks recommended job openings and tracks application status (Saved, Applied, Interviewing, Offer, Rejected).
* **SMTP Password Recovery**: Supports password recovery emails with pre-built setup integrations for Resend, SendGrid, and AWS SES.
* **Payment Simulator**: Features a mock checkout fallback for local runs, ready to be connected to Stripe in production.

---

## 🛠️ Technology Stack

### Backend
* **FastAPI**: Asynchronous, high-performance web framework.
* **SQLModel**: Combined Pydantic & SQLAlchemy ORM for database schemas.
* **google-genai**: Google's modern, standard Generative AI SDK for Gemini models.
* **SQLite / PostgreSQL**: Dynamic database engine that swaps SQLite (local runs) with PostgreSQL (production) automatically.

### Frontend
* **React 18 + TypeScript**: Highly structured UI architecture.
* **Vite**: Rapid asset compilation and hot reloading.
* **Framer Motion**: Smooth dashboard transitions and micro-animations.
* **Lucide React**: Clean vector icon suite.

---

## 📂 Project Structure

```text
ai-resume-analyzer/
├── backend/               # FastAPI Application
│   ├── app/
│   │   ├── models/        # Database models & schemas
│   │   ├── routes/        # Router controllers (auth, analyzer, settings, etc.)
│   │   ├── services/      # Business logic (Gemini API, Stripe, SMTP, parsing)
│   │   ├── db.py          # SQLModel engine initializer
│   │   └── main.py        # FastAPI entry point
│   ├── tests/             # Pytest unit testing suite
│   ├── requirements.txt   # Python dependencies
│   └── migrate_to_postgres.py # Data migration script
├── frontend/              # React Application
│   ├── src/
│   │   ├── components/    # Reusable UI widgets
│   │   ├── pages/         # Dashboard views
│   │   └── utils/         # API client & helpers
│   ├── package.json       # Node package manager configurations
│   └── vite.config.ts     # Vite configuration
└── README.md              # Root documentation
```

---

## ⚙️ Local Development Setup

### 1. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On MacOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment template and configure keys inside `.env`:
   ```bash
   # Add your GEMINI_API_KEY, JWT_SECRET_KEY, and SMTP credentials.
   # Set DATABASE_URL=sqlite:///resume_analyzer.db for local runs.
   ```
5. Run the FastAPI development server:
   ```bash
   python -m uvicorn app.main:app --reload
   ```
   *The API will be available at `http://127.0.0.1:8000` (Swagger docs at `/docs`).*

### 2. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install node packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will launch at `http://localhost:5173`.*

---

## 🌐 Production Deployment

For complete, detailed instructions on live hosting, refer to the **[Production Deployment & Launch Plan](file:///C:/Users/pathu/.gemini/antigravity-ide/brain/09f08acb-9513-4adf-97c1-1fef8ff439cf/production_deployment_plan.md)**:

1. **Database**: Provision a managed **PostgreSQL** instance (e.g. Neon or Render) and configure `DATABASE_URL` in the environment.
2. **Backend**: Host on a containerized service (Render or Railway) using `gunicorn` in the root directory `backend/`.
3. **Frontend**: Host on a CDN (Vercel or Netlify) pointing to the root directory `frontend/`, and configure the environment variable `VITE_API_BASE_URL` to point to your live API.
4. **Data Migration**: Run `migrate_to_postgres.py` from your local machine to migrate SQLite records to your PostgreSQL production instance.
