from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

class FileBase(BaseModel):
    filename: str
    file_type: str

class FileCreate(FileBase):
    file_path: str

class FileRecord(FileBase):
    id: int
    summary: Optional[str] = None
    transcription: Optional[str] = None
    metadata_json: Optional[Any] = None
    created_at: datetime
    class Config:
        from_attributes = True

class ChatMessageBase(BaseModel):
    content: str
    role: str

class ChatMessageCreate(ChatMessageBase):
    file_id: int

class ChatMessage(ChatMessageBase):
    id: int
    timestamp: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
