
# 🎵 Music Recommender System

A full-stack music recommendation web application that allows users to get personalized music recommendations based on mood, artist, or genre input. The system supports both guest and authenticated users, using FastAPI for the backend and Next.js for the frontend.

---

## 📁 Repository Structure

```
MusicRecommender/
├── apps/
│   ├── frontend/                # Next.js app
│   │   ├── public/              # Static assets (e.g., logo, fonts)
│   │   ├── src/                 # Main app source
│   │   ├── .env.local           # Environment variables (not committed)
│   │   └── package.json         # Frontend dependencies
│   └── backend/                 # FastAPI app
│       ├── authentication/      # Auth handler and JWT utils
│       ├── routers/             # API route handlers
│       ├── models.py            # SQLAlchemy models
│       ├── database.py          # DB engine & session
│       ├── main.py              # FastAPI entrypoint
│       ├── init__db.py           # Initializes DB schema
│       ├── requirements.txt     # Backend dependencies
│       ├── .env                 # Environment variables (not committed)
│       └── tests/               # Pytest-based backend unit tests (testing branch only)                   
└── README.md                    # Project overview
```

---

## ⚙️ Development Setup

### ✅ Prerequisites

- Python 3.9+
- FastAPI 
- Node.js v18+
- Next.js 
- MySQL (locally or via Google Cloud SQL)

---

### 🚀 Backend Setup (FastAPI)

1. **Navigate to backend:**
   ```bash
   cd apps/backend
   ```

2. **Create & activate a virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure `.env`:**
   ```
   OPENAI_API_KEY=your_openai_key
   SPOTIFY_CLIENT_ID=your_spotify_id
   SPOTIFY_CLIENT_SECRET=your_spotify_secret
   MYSQL_USER=root
   MYSQL_PASSWORD=yourpassword
   MYSQL_HOST=localhost
   MYSQL_DATABASE=song_recommender
   SECRET_KEY=yourjwtsecretkey
   ```

5. **Create the database (once):**
   ```bash
   mysql -u root -p
   CREATE DATABASE song_recommender;
   ```

Note: This DB query is only if your making the database as a root user. You may make a new user and assign the database privileges to this newly created database user. 

6. **Initialize DB tables:**
   ```bash
   python init_db.py
   ```

7. **Run the FastAPI server:**
   ```bash
   uvicorn main:app --reload
   ```
   Alternatively: python main.py
   
   Backend API available at: [http://localhost:8000](http://localhost:8000)

---

### 💻 Frontend Setup (Next.js)

1. **Navigate to frontend:**
   ```bash
   cd apps/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

   Frontend accessible at: [http://localhost:3000](http://localhost:3000)

---

## ✅ Features

- User registration and login via JWT
- AI-powered song recommendations (OpenAI GPT-3.5)
- Music data fetched from Spotify API
- Guest users can get recommendations/search without logging in
- Search history and preferences saved for logged-in users
- Fully responsive UI built with Tailwind CSS
- Deezer integration for track previews

---



## ☁️ Deployment

- **Frontend:** [Vercel](https://vercel.com)
- **Backend:** [Render](https://render.com)
- **Database:** [Google Cloud SQL (MySQL)](https://cloud.google.com/sql)

Make sure to set your environment variables in both Render and Vercel accordingly.

---

## 👥 Branching Strategy

- `main` – Production-ready code
- `development` - Staging Branch before deployment
- `feature/backend-api` – Backend development
- `feature/frontend-ui` – Frontend development

---

## 🧩 Technologies Used

| Layer     | Tech Stack                            |
|-----------|----------------------------------------|
| Frontend  | Next.js, React, Tailwind CSS           |
| Backend   | FastAPI, SQLAlchemy, Uvicorn           |
| Database  | MySQL (Google Cloud SQL)               |
| AI Engine | OpenAI GPT-3.5                         |
| Music API | Spotify API (with token-based access)  |
| DevOps    | Render, Vercel Deployment Pipeline, GitHub Deployment    |

---
