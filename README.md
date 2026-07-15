# FraudShield AI - Enterprise Payment Risk Intelligence

FraudShield AI is an enterprise-grade payment risk intelligence platform designed for modern fintech architectures. It uses machine learning (XGBoost, Random Forest) to analyze transaction payloads in real-time, assigning risk scores, fraud probabilities, and actionable decisions (APPROVE, REVIEW, BLOCK) in milliseconds.

## Architecture

```text
                GitHub
                   │
        ┌──────────┴──────────┐
        │                     │
     Vercel               Render
   (Next.js UI)       (FastAPI API)
        │                     │
        └──────────┬──────────┘
                   │
              SQLite Database
                   │
           AI Decision Engine
                   │
        Random Forest / XGBoost
                   │
        Fraud Detection Results
```

### Technology Stack
* **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui, Recharts
* **Backend**: FastAPI, Python 3, SQLAlchemy ORM, JWT Authentication
* **Machine Learning**: Scikit-learn, XGBoost, Pandas
* **Database**: SQLite (Configured for easy transition to PostgreSQL/MySQL)
* **Deployment**: Docker, Vercel, Render

---

## Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/FraudShield-AI.git
cd FraudShield-AI
```

### 2. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python seed.py
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup (Next.js)
Open a new terminal.
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Access the application at `http://localhost:3000`.

---

## Environment Variables

Copy `.env.example` to `.env` (or configure these in your PaaS like Vercel/Render).

**Frontend (`frontend/.env.local` or Vercel Settings)**
```env
NEXT_PUBLIC_API_URL=https://your-render-url.onrender.com/api/v1
```

**Backend (`backend/.env` or Render Settings)**
```env
DATABASE_URL=sqlite:///./sql_app.db
JWT_SECRET=your_super_secret_jwt_key
ALLOWED_ORIGINS=https://your-vercel-app-url.vercel.app
```

---

## Deployment Guide (Option A: Vercel + Render)

This project is configured for a zero-cost, serverless-style deployment.

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial Commit"
git branch -M main
git remote add origin https://github.com/<your-username>/FraudShield-AI.git
git push -u origin main
```

### 2. Deploy Backend to Render (Free)
1. Go to [Render.com](https://render.com) and create a **New Web Service**.
2. Connect your GitHub repository.
3. Render will automatically detect the `render.yaml` file and configure the service.
4. Add the Environment Variables:
   - `JWT_SECRET`: (Generate a secure random string)
   - `ALLOWED_ORIGINS`: (Leave blank for now, update after Vercel deployment)
5. Click **Deploy**.

### 3. Deploy Frontend to Vercel (Free)
1. Go to [Vercel.com](https://vercel.com) and **Add New Project**.
2. Import your GitHub repository.
3. Edit the **Root Directory** to be `frontend`.
4. Add the Environment Variable:
   - `NEXT_PUBLIC_API_URL`: (The URL of your deployed Render backend + `/api/v1`)
5. Click **Deploy**.

*After Vercel deploys, copy the Vercel URL and update your `ALLOWED_ORIGINS` variable in Render to secure your API.*

---

## API Documentation

Once the backend is running, FastAPI auto-generates interactive API documentation.
Navigate to:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

**Key Endpoints:**
- `POST /api/v1/payments/process` - Submit a transaction for ML inference.
- `GET /api/v1/dashboard/stats` - Retrieve aggregate analytics.
- `GET /health` - API health check.

---

## GitHub Portfolio Instructions

To make this repository stand out to recruiters:
1. Replace `<your-username>` in this README with your actual GitHub username.
2. Add screenshots of the Dashboard, Merchant Sandbox, and Developer Console to an `/assets` folder and embed them in this README.
3. Add a link to your live Vercel deployment at the top of the repository in the "About" section.
4. Highlight this project as a pinned repository on your GitHub profile.
