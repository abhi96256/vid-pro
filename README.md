# AI-Powered Document & Multimedia Q&A Web Application

**Developed with ❤️ by Vidya** 

Developed for the SDE-1 Programming Assignment. This application features a premium AI-driven interface for analyzing documents (PDF) and multimedia (Audio/Video) with intelligent RAG-based chat and timestamp-based navigation.

## 🚀 Live Walkthrough
- **Video Demo**: [Link to your video here]

## ✨ Key Features
- **Advanced RAG**: Semantic search on documents and media using FAISS and Groq (Llama 3.3).
- **Multimedia Intelligence**: Automatic transcription of Video/Audio using Groq Whisper-v3.
- **Timestamp Navigation**: AI detects timestamps and provides "Jump to Scene" buttons in chat.
- **Executive Summaries**: Instant highlights and key points for all uploaded files.
- **Premium UX**: Modern Dark-mode, Glassmorphism UI with Framer Motion animations.
- **Full Security**: JWT-based authentication and secure file processing.

## 🛠 Tech Stack
- **Frontend**: React 18, Vite, Framer Motion, Lucide Icons.
- **Backend**: Python 3.10, FastAPI, SQLAlchemy.
- **AI/LLM**: Groq Cloud (Llama 3.3-70B), LangChain, Whisper-v3.
- **Database**: SQLite (Local Dev) / FAISS (Vector Store).
- **DevOps**: Docker, Docker Compose, GitHub Actions.

## 📦 Quick Setup (Docker)
Ensure you have Docker and Docker Compose installed.

1. Clone the repo and add your `.env` in the backend folder:
   ```env
   GROQ_API_KEY=your_groq_key_here
   SECRET_KEY=your_secret_key
   ```

2. Run the entire stack:
   ```bash
   docker-compose up --build
   ```

3. Access the app:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8000`

## 💻 Local Manual Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testing
To run backend tests with coverage:
```bash
cd backend
pytest --cov=.
```

## 📄 API Documentation
Once the backend is running, visit `http://localhost:8000/docs` for the interactive Swagger UI.
