from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class BlogBase(BaseModel):
    title: str
    body: str

class Blog(BlogBase):
    class Config():
        orm_mode = True

class User(BaseModel):
    name:str
    email:str
    password:str

class ShowUser(BaseModel):
    name:str
    email:str
    blogs : List[Blog] =[]
    class Config():
        orm_mode = True

class ShowBlog(BaseModel):
    title: str
    body:str
    creator: ShowUser

    class Config():
        orm_mode = True


class Login(BaseModel):
    username: str
    password:str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


# Base Event Schema (Common fields for Event)
class EventBase(BaseModel):
    type: str
    category: str
    subCategory: Optional[str] = None
    title: str
    description: str
    plannedStartTime: datetime
    plannedEndTime: Optional[datetime] = None
    actualStartTime: Optional[datetime] = None
    actualEndTime: Optional[datetime] = None
    remark: Optional[str] = None
    rating: Optional[int] = None
    breaks: Optional[List[str]] = []
    subTasks: Optional[List[str]] = []
    status: Optional[str] = "pending"  # Default status

# Schema for Creating an Event (Extends EventBase)
class EventCreate(EventBase):
    pass
    class Config():
            orm_mode = True

# Schema for Updating an Event (Allows Partial Updates)
class EventUpdate(BaseModel):
    type: Optional[str] = None
    category: Optional[str] = None
    subCategory: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    plannedStartTime: Optional[datetime] = None
    plannedEndTime: Optional[datetime] = None
    actualStartTime: Optional[datetime] = None
    actualEndTime: Optional[datetime] = None
    remark: Optional[str] = None
    rating: Optional[int] = None
    breaks: Optional[List[str]] = None
    subTasks: Optional[List[str]] = None
    status: Optional[str] = None

# Schema for Returning Event Details
class EventResponse(EventBase):
    id: int

    class Config:
        orm_mode = True  # Allows compatibility with SQLAlchemy ORM


class Event(EventBase):
    id: int

    class Config:
        orm_mode = True
        from_attributes = True