from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    files = relationship("FileRecord", back_populates="owner")

class FileRecord(Base):
    __tablename__ = "files"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    file_path = Column(String)
    file_type = Column(String) # pdf, audio, video
    summary = Column(Text)
    transcription = Column(Text)
    metadata_json = Column(JSON) # Store timestamps, topics etc.
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="files")
    messages = relationship("ChatMessage", back_populates="file")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    role = Column(String) # user, assistant
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    file_id = Column(Integer, ForeignKey("files.id"))
    file = relationship("FileRecord", back_populates="messages")
