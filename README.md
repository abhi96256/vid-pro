# VidInsight AI: Powered Document & Multimedia Q&A
**Developed with ❤️ by Vidya** 

Developed for the SDE-1 Programming Assignment. This application features a premium AI-driven interface for analyzing documents (PDF) and multimedia (Audio/Video) with intelligent RAG-based chat and timestamp-based navigation.

## 🚀 Live Demo
- **Live App**: [vid-pro-chi.vercel.app](https://vid-pro-chi.vercel.app)
- **Video Walkthrough**: [Link to your video here]

## ✨ Key Features
- **Advanced RAG**: Semantic search on documents and media using FAISS and Groq (Llama 3.3).
- **Multimedia Intelligence**: Automatic transcription of Video/Audio using Groq Whisper-v3.
- **Permanent Cloud Storage**: Integrated with **Cloudinary** for persistent media hosting.
- **Stateless Stability**: Re-creates vector stores on-the-fly from **Supabase** data, ensuring 100% reliability on Vercel.
- **Timestamp Navigation**: AI detects timestamps and provides "Jump to Scene" buttons in chat.
- **Executive Summaries**: Instant highlights and key points for all uploaded files.
- **Premium UX**: Modern Dark-mode, Glassmorphism UI with Framer Motion animations.

## 🛠 Pro Tech Stack
- **Frontend**: React 18, Vite, Framer Motion, Lucide Icons, Glassmorphism CSS.
- **Backend**: FastAPI (Python 3.12), Pydantic.
- **AI/LLM**: Groq Cloud (Llama 3.3-70B, Llama 3.1-8B), LangChain, Whisper-v3.
- **Database**: **Supabase (PostgreSQL)** for permanent records.
- **Storage**: **Cloudinary** for permanent media storage.
- **Deployment**: **Vercel** (Experimental Services Monorepo).

## 📦 Environment Setup
To run this project, add a `.env` file in the `backend` folder:
```env
DATABASE_URL=postgresql://postgres:[PASS]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
GROQ_API_KEY=your_key
CLOUDINARY_CLOUD_NAME=dpopbcumz
CLOUDINARY_API_KEY=391939812487991
CLOUDINARY_API_SECRET=your_secret
```

## 💻 Local Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📄 API Documentation
Visit `/_/backend/docs` on the live app or `http://localhost:8000/docs` locally for the interactive Swagger UI.
