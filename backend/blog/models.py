from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from .database import Base
from sqlalchemy.orm import relationship


class Blog(Base):
    __tablename__ = 'blogs'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    body = Column(String)
    user_id = Column(Integer, ForeignKey('users.id'))

    creator = relationship("User", back_populates="blogs")


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    password = Column(String)

    blogs = relationship('Blog', back_populates="creator") # Relationship with Blog
    events = relationship("Event", back_populates="creator") # Relationship with Event

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False)
    category = Column(String, nullable=False)
    sub_category = Column(String, nullable=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    planned_start_time = Column(DateTime, nullable=False)
    planned_end_time = Column(DateTime, nullable=True)
    actual_start_time = Column(DateTime, nullable=True)
    actual_end_time = Column(DateTime, nullable=True)
    remark = Column(String, nullable=True)
    rating = Column(Integer, nullable=True)
    breaks = Column(JSON, nullable=True)  # Storing list as JSON
    sub_tasks = Column(JSON, nullable=True)  # Storing list as JSON
    status = Column(String, default="pending")

    user_id = Column(Integer, ForeignKey("users.id"))  # Foreign key to User

    creator = relationship("User", back_populates="events")  # Relationship with User
