# Music Recommender System

A music recommender system built with Next.js for the frontend and FastAPI for the backend. This application helps users discover new music based on their current mood and preferences.

## Repository Structure

```
MusicRecommender/
├── apps/
│   ├── frontend/                  # Next.js app
│   │   ├── public/                # Static assets
│   │   ├── src/                   # Application source code
│   │   └── package.json           # Frontend dependencies
│   ├── backend/                   # FastAPI app
│   |   │   ├── authentication/  
|   |   |   |   ├──auth_handler.py #authentication services         
│   |   │   ├── routers/           # API endpoints
|   |   |   |   ├──auth.py
|   |   |   |   ├──recommend.py
|   |   |   |   ├──spotify.py
|   |   |   |   ├──user.py
│   |   │   ├── database.py         
│   |   │   ├── models.py      
│   |   │   └── schemas.py       # Pydantic schemas
│   |   └── requirements.txt     # Python dependencies
|   └── main.py                  # Entry Point for FAST API
├── packages/                    # Shared code/libraries
├── package.json                 # Root-level dependencies
└── turbo.json                   # Turborepo configuration
```

## Development Setup

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- MySQL

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd apps/backend
   ```

2. Create and activate a virtual environment:
   ```
   # Create virtual environment
   python -m venv venv

   # Activate on Windows
   venv\Scripts\activate

   # Activate on macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```
   uvicorn main:app --reload
   ```
   The API should be available at http://localhost:8000 (unless the port is not busy)

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd apps/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```
   The application will be available at http://localhost:3000   (unless the port is not busy)

## Branching Strategy

- `main` - Production code
- `feature/backend-api` - Backend feature development
- `feature/frontend-ui` - Frontend feature development

## Technologies

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: FastAPI, SQLAlchemy
- **Database**: MySQL
- **Integrations**: OpenAI API for mood analysis, Spotify/Apple Music API for music data
