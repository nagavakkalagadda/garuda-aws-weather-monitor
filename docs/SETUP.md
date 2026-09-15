# GARUDA // Installation & Deployment Guide

Welcome to **GARUDA: AWS // Intelligent Weather Monitor**. This guide will get your application up and running within minutes on Windows or Linux.

---

## Prerequisites

- **Node.js**: v18.0.0 or higher (`node -v`)
- **Python** (Optional for ML microservice): v3.10 or higher (`python --version`)
- **Web Browser**: Chrome, Edge, Firefox, or Safari

---

## Quick Start (Beginner Friendly)

### 1. Launch the Backend API
Open a terminal in the project root:
```bash
cd backend
npm install
npm start
```
*The API gateway will start on **http://localhost:5000**.*

---

### 2. Launch the Frontend Interface
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
*Open your browser and navigate to **http://localhost:3000**.*

---

### 3. (Optional) Launch the Python ML Microservice
The backend contains an embedded high-precision mirror of the ML anomaly detection engine, so the system works 100% out of the box without Python. If you wish to run the standalone Python FastAPI ML service:
```bash
cd ml
pip install -r requirements.txt
python app.py
```
*The Python ML service will start on **http://localhost:8000** and the backend will automatically route ML requests to it.*

---

## One-Click Launch Script (Windows)

We have provided a one-click launcher script in the project root:
```cmd
start.bat
```
Double-clicking `start.bat` will automatically open the backend and frontend in synchronized terminal windows!

---

## Environment Variables Configuration

Create or edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
ML_API_URL=http://127.0.0.1:8000/detect
WEATHER_API_PROVIDER=open-meteo
WEATHER_API_KEY=
WEATHER_API_URL=
DATABASE_URL=postgresql://garuda_user:garuda_pass@localhost:5432/garuda_db
```

### Weather Provider Configuration:
- **Open-Meteo (Default)**: Requires **NO API key** and has no rate limits or credit card requirements. Provides real-time worldwide telemetry, 7-day forecast, air quality, and global geocoding out of the box.
- **Demo Mode**: If you are offline or testing specific failure modes, toggle the **DEMO DATA** button in the dashboard header or query with `mode=demo`.

---

## Database Setup (PostgreSQL)

The application is database-ready. To initialize the PostgreSQL database:
```bash
psql -U postgres -d postgres -c "CREATE DATABASE garuda_db;"
psql -U postgres -d garuda_db -f database/schema/schema.sql
psql -U postgres -d garuda_db -f database/schema/seed.sql
```

---

## Production Deployment Options

### Option 1: Unified Single-Port Node Server (Recommended)
Build the frontend and run the production server. A single port (5000) hosts both the compiled 3D UI and the REST API:
```bash
# Windows One-Click:
deploy.bat

# Or Manual:
cd frontend && npm.cmd run build
cd ../backend && npm.cmd start
```
*Navigate to **http://localhost:5000**.*

---

### Option 2: Docker / Docker Compose
Deploy as an isolated containerized stack with PostgreSQL:
```bash
# Build & Run Container
docker compose up -d --build
```
*Runs on **http://localhost:5000** with PostgreSQL on port 5432.*

---

### Option 3: Cloud Deployment (Render.com / Railway / Vercel)
- **Render**: Connect your Git repository and select `render.yaml` (automatically configures build and start commands).
- **Vercel**: Run `vercel` (uses `vercel.json` to deploy frontend to CDN and backend to serverless functions).
- **AWS / DigitalOcean / Azure**: Deploy using the provided `Dockerfile`.

