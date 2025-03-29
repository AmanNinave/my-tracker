from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from .database import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    password = Column(String)

    blogs = relationship('Blog', back_populates="creator") # Relationship with Blog
    events = relationship("Event", back_populates="creator") # Relationship with Event

class Blog(Base):
    __tablename__ = 'blogs'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    body = Column(String)
    userId = Column(Integer, ForeignKey('users.id'))

    creator = relationship("User", back_populates="blogs")

class EventsBucket(Base):
    __tablename__ = "events_bucket"
    
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False)   # Type of event (e.g., task, meeting)
    schedule = Column(String, nullable=False)   # Scheduled time of event ( e.g., daily, weekly, Monthly)
    category = Column(String, nullable=False)   # Category of event (e.g., work, personal)
    subCategory = Column(String, nullable=True)    # Sub-category of event (e.g., project, family)
    title = Column(String, nullable=False)  # Title of event
    description = Column(String, nullable=False)    # Description of event
    plannedStartTime = Column(DateTime, nullable=False)   # Planned start time of event
    plannedEndTime = Column(DateTime, nullable=True)  # Planned end time of event
    actualStartTime = Column(DateTime, nullable=True) # Actual start time of event
    actualEndTime = Column(DateTime, nullable=True)   # Actual end time of event
    remark = Column(String, nullable=True)  # Additional remarks or notes about the event
    rating = Column(Integer, nullable=True) # Rating for the event (e.g., out of 5 stars)
    breaks = Column(JSON, nullable=True)  # Storing list as JSON       
    subTasks = Column(JSON, nullable=True)  # Storing list as JSON
    status = Column(String, default="pending")  # Default status of event (e.g., pending, completed)

    userId = Column(Integer, ForeignKey("users.id"))  # Foreign key to User

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False)   # Type of event (e.g., task, meeting)
    category = Column(String, nullable=False)   # Category of event (e.g., work, personal)
    subCategory = Column(String, nullable=True)    # Sub-category of event (e.g., project, family)
    title = Column(String, nullable=False)  # Title of event
    description = Column(String, nullable=False)    # Description of event
    plannedStartTime = Column(DateTime, nullable=False)   # Planned start time of event
    plannedEndTime = Column(DateTime, nullable=True)  # Planned end time of event
    actualStartTime = Column(DateTime, nullable=True) # Actual start time of event
    actualEndTime = Column(DateTime, nullable=True)   # Actual end time of event
    remark = Column(String, nullable=True)  # Additional remarks or notes about the event
    rating = Column(Integer, nullable=True) # Rating for the event (e.g., out of 5 stars)
    breaks = Column(JSON, nullable=True)  # Storing list as JSON       
    subTasks = Column(JSON, nullable=True)  # Storing list as JSON
    status = Column(String, default="pending")  # Default status of event (e.g., pending, completed)

    userId = Column(Integer, ForeignKey("users.id"))  # Foreign key to User

    creator = relationship("User", back_populates="events")  # Relationship with User
    eventLogs = relationship("EventLog", back_populates="event")  # Relationship with EventLog

class EventLog(Base):
    __tablename__ = "event_log"

    id = Column(Integer, primary_key=True, index=True)  # Unique identifier for the log entry
    title = Column(String, nullable=False)  # Title of the log entry
    description = Column(String, nullable=True)     # Description of the log entry
    startTime = Column(DateTime, nullable=False)   # Start time of the log entry
    endTime = Column(DateTime, nullable=True)  # End time of the log entry
    duration = Column(Integer, nullable=True)  # Duration of the log entry in minutes


    eventId = Column(Integer, ForeignKey("events.id"))  # Foreign key to Event
    userId = Column(Integer, ForeignKey("users.id"))  # Foreign key to User

    event = relationship("Event", back_populates="eventLogs")  # Relationship with Event

class PendingEvents(Base):  #Need to verify all parameters
    __tablename__ = "pending_events"

    id = Column(Integer, primary_key=True, index=True)  # Unique identifier for the pending event
    type = Column(String, nullable=False)   # Type of event (e.g., task, meeting)
    category = Column(String, nullable=False)   # Category of event (e.g., work, personal)
    subCategory = Column(String, nullable=True)    # Sub-category of event (e.g., project, family)
    title = Column(String, nullable=False)  # Title of event
    description = Column(String, nullable=False)    # Description of event
    plannedStartTime = Column(DateTime, nullable=False)   # Planned start time of event
    plannedEndTime = Column(DateTime, nullable=True)  # Planned end time of event
    actualStartTime = Column(DateTime, nullable=True) # Actual start time of event
    actualEndTime = Column(DateTime, nullable=True)   # Actual end time of event
    remark = Column(String, nullable=True)  # Additional remarks or notes about the event
    rating = Column(Integer, nullable=True) # Rating for the event (e.g., out of 5 stars)
    breaks = Column(JSON, nullable=True)  # Storing list as JSON       
    subTasks = Column(JSON, nullable=True)  # Storing list as JSON
    status = Column(String, default="pending")  # Default status of event (e.g., pending, completed)

    userId = Column(Integer, ForeignKey("users.id"))  # Foreign key to User