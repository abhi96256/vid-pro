# VidInsight AI - Multimedia Intelligence Platform

Developed for the **PanScience Innovations SDE-1 Assignment**. This application features a premium AI-driven interface for analyzing documents (PDF) and multimedia (Audio/Video) with intelligent RAG-based chat and temporal navigation.

## 🚀 Live Demo
- **Live App**: [vid-pro-chi.vercel.app](https://vid-pro-chi.vercel.app)
- **Video Walkthrough**: [Link to your video here]

## ✨ Key Features
- **Advanced RAG Engine**: Semantic search on documents and media using FAISS and Groq (Llama 3.3).
- **Multimedia Intelligence**: Automatic transcription of Video/Audio using Groq Whisper-v3.
- **Permanent Cloud Storage**: Integrated with **Cloudinary** for persistent media hosting.
- **File Management**: Full CRUD support—upload and delete files directly from the sidebar.
- **Robust Media Preview**: Intelligent PDF rendering with Cloudinary-powered thumbnails and direct-link fallbacks.
- **Stateless Stability**: Dynamic vector store reconstruction from **Supabase** metadata, ensuring 100% reliability on ephemeral Vercel deployments.
- **Temporal Navigation**: AI-driven timestamp extraction with "Jump to Scene" UI capabilities.
- **Executive Summarization**: Automated generation of concise insights and thematic highlights.
- **Premium UX**: Modern Dark-mode, Glassmorphism UI with Framer Motion animations.

## 🧠 Architecture & RAG Pipeline
1.  **Ingestion**: Files are processed based on type (PDF via PyMuPDF, Video/Audio via Whisper-v3).
2.  **Vectorization**: Text/Transcripts are chunked and vectorized using on-the-fly re-creation logic (Stateless RAG).
3.  **Storage**: Metadata and transcripts reside in **Supabase (Postgres)**, while media is hosted on **Cloudinary**.
4.  **Retrieval**: LangChain & FAISS perform semantic search to provide context to the LLM.
5.  **Generation**: Llama 3.3-70B generates precise answers with timestamp references for media.

## 🛠 Tech Stack
- **Frontend**: React 18, Vite, Framer Motion, Lucide Icons, Glassmorphism CSS.
- **Backend**: FastAPI (Python 3.12), SQLAlchemy, Pydantic.
- **AI/LLM**: Groq Cloud (Llama 3.3-70B, Llama 3.1-8B), LangChain, Whisper-v3.
- **Database**: Supabase (PostgreSQL).
- **Storage**: Cloudinary (Permanent Media Hosting).

## ☁️ Storage Strategy
To bypass Vercel's ephemeral file system limitations, this app uses a hybrid storage approach:
- **Media**: All files are streamed directly to **Cloudinary** for permanent, high-speed hosting.
- **Transcripts**: Stored in a managed Postgres DB to allow vector index re-generation anytime the server restarts.

## ⚙️ Local Setup
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## 🔐 Environment Variables
Required variables for deployment:
- `DATABASE_URL`: Supabase Connection String
- `GROQ_API_KEY`: Groq Cloud API Key
- `CLOUDINARY_CLOUD_NAME`: Cloudinary Name
- `CLOUDINARY_API_KEY`: API Key
- `CLOUDINARY_API_SECRET`: API Secret

---
*Developed with ❤️ by Abhishek Kumar for PanScience Innovations.*
