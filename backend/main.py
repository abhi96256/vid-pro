from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
import uuid
from datetime import timedelta

import models, schemas, database, auth, ai_processor
from database import engine, get_db
import cloudinary
import cloudinary.uploader

# Cloudinary Configuration
cloudinary.config( 
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME", "dpopbcumz"), 
  api_key = os.getenv("CLOUDINARY_API_KEY", "391939812487991"), 
  api_secret = os.getenv("CLOUDINARY_API_SECRET", "-qxGczK25KlfsRh5K9jpzBFL0nc"),
  secure = True
)

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Document & Multimedia Q&A API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "/tmp/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Static Files for media playback
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- AUTH ---

@app.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except auth.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# --- FILES ---

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    file_id = str(uuid.uuid4())
    ext = file.filename.split(".")[-1]
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}.{ext}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 2. Upload to Cloudinary
    try:
        # Use 'raw' for PDF to preserve extension, 'video' for mp4/audio
        resource_type = "raw" if ext.lower() == "pdf" else "auto"
        upload_result = cloudinary.uploader.upload(file_path, resource_type=resource_type)
        cloudinary_url = upload_result.get("secure_url")
    except Exception as e:
        print(f"Cloudinary upload error: {str(e)}")
        raise HTTPException(status_code=500, detail="Cloud storage upload failed")

    file_type = "pdf" if ext.lower() == "pdf" else "audio" if ext.lower() in ["mp3", "wav"] else "video"
    
    content = ""
    metadata = {}
    
    if file_type == "pdf":
        content = ai_processor.extract_text_from_pdf(file_path)
    else:
        transcript_data = ai_processor.transcribe_audio_video(file_path)
        content = transcript_data.text
        metadata = {"segments": transcript_data.segments} # Whisper segments for timestamps

    summary = ai_processor.summarize_content(content[:5000]) # Limit content for summary
    
    # Create record with Cloudinary URL
    db_file = models.FileRecord(
        filename=file.filename,
        file_path=cloudinary_url, # Now storing full Cloudinary URL
        file_type=file_type,
        summary=summary,
        transcription=content,
        metadata_json=metadata,
        owner_id=current_user.id
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    
    # Index for RAG
    ai_processor.process_file_content(db_file.id, content, file_type)
    
    return db_file

@app.get("/files", response_model=List[schemas.FileRecord])
def list_files(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.FileRecord).filter(models.FileRecord.owner_id == current_user.id).all()

# --- CHAT ---

@app.post("/chat/{file_id}")
def chat_with_file(
    file_id: int,
    message: schemas.ChatMessageCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    file_record = db.query(models.FileRecord).filter(models.FileRecord.id == file_id, models.FileRecord.owner_id == current_user.id).first()
    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Save user message
    user_msg = models.ChatMessage(content=message.content, role="user", file_id=file_id)
    db.add(user_msg)
    
    # Get AI answer (with fallback content)
    answer = ai_processor.get_answer(file_id, message.content, file_record.transcription)
    
    # Save assistant message
    assistant_msg = models.ChatMessage(content=answer, role="assistant", file_id=file_id)
    db.add(assistant_msg)
    
    db.commit()
    db.refresh(assistant_msg)
    
    return assistant_msg

@app.get("/chat/{file_id}/history", response_model=List[schemas.ChatMessage])
def get_chat_history(file_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.ChatMessage).filter(models.ChatMessage.file_id == file_id).all()
