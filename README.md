<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-check.svg" width="80" alt="FraudShield AI Logo" />
  <h1 align="center">FraudShield AI v4.0</h1>
  <p align="center">
    <strong>Enterprise-Grade Payment Fraud Prevention & AI Decision Engine</strong>
  </p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi" alt="FastAPI" />
    <img src="https://img.shields.io/badge/Scikit--Learn-1.3-F7931E?style=for-the-badge&logo=scikit-learn" alt="Scikit-Learn" />
    <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql" alt="MySQL" />
  </p>
</div>

---

## 📖 Project Overview

**FraudShield AI** is an enterprise-class payment fraud detection and transaction intelligence platform. Built using modern Full-Stack Development, Machine Learning, Business Intelligence, and Enterprise Software Engineering practices, this platform analyzes transactions in real-time, blocks fraudulent activity, and provides human-readable AI explanations for every decision.

Developed as a comprehensive MCA Final Year Project, it serves as a portfolio-ready demonstration of full-stack engineering, DevOps, and applied AI.

## ✨ Enterprise Features

- 🧠 **AI Decision Engine:** Real-time transaction scoring using XGBoost and Random Forest models.
- 🔍 **Rule-Based Explainability:** Human-readable reasoning for every AI decision.
- 🎨 **Premium UI/UX:** Stunning, glassmorphic Next.js frontend with Framer Motion animations.
- 📊 **360° Profiles:** Deep-dive intelligence into Customer behavior and Merchant risk.
- 🕵️ **Investigation Workspace:** Enterprise tools for fraud analysts to review and freeze accounts.
- 💳 **Payment Simulator:** Animated, real-time simulation of the AI intercepting a live transaction.

## 🏗️ Architecture

```mermaid
flowchart TD
  A[Customer Checkout] -->|Payment Details| B[Next.js Frontend]
  B -->|REST API Request| C[FastAPI Backend]
  C -->|Auth Validation| D[JWT Auth Module]
  C -->|Feature Engineering| E[Data Preprocessing Pipeline]
  E -->|Transaction Vectors| F[Machine Learning Models]
  F -->|Anomaly Score| G[AI Decision Engine]
  G -->|Explainability| H[Rule-Based Reasoner]
  H -->|Final Verdict| I[(MySQL / SQLite Database)]
  I -->|Real-time Updates| J[Fraud Analyst Dashboard]
```

## 🚀 Production Deployment Guide

This repository is strictly configured for modern PaaS deployment.

### 1. Frontend (Vercel)
The Next.js 15 frontend is optimized for **Vercel**.
1. Create a [Vercel](https://vercel.com) account.
2. Connect this GitHub repository.
3. Vercel will automatically detect the Next.js framework.
4. Set the `NEXT_PUBLIC_API_URL` environment variable to your backend URL (e.g., `https://fraudshield-api.onrender.com`).
5. Click **Deploy**.

### 2. Backend (Render)
The FastAPI backend is configured for **Render** via the included `render.yaml`.
1. Create a [Render](https://render.com) account.
2. Go to Dashboard -> **Blueprints** -> New Blueprint Instance.
3. Connect this GitHub repository.
4. Render will read `render.yaml` and automatically deploy the web service.

### 3. Database (Railway / PlanetScale)
By default, the backend uses `SQLite` for zero-config local development. For production:
1. Provision a MySQL database on [Railway](https://railway.app).
2. Get the connection string (`mysql+pymysql://user:pass@host:port/db`).
3. Add it as the `DATABASE_URL` environment variable in your Render dashboard.

## 💻 Local Development

A convenient batch script is provided for Windows users.

```bash
# Clone the repository
git clone https://github.com/your-username/fraudshield-ai.git
cd fraudshield-ai

# Start the servers (Requires Node.js 20+ and Python 3.11+)
.\start.bat
```
- Frontend: `http://localhost:3000`
- Backend API Docs: `http://localhost:8000/docs`

## 🛡️ License
MIT License.
