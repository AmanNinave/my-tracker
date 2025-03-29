from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import schemas, database
from ..repository import event
from typing import List

router = APIRouter(
    prefix="/events",
    tags=["Events"]
)

get_db = database.get_db

@router.post("/", status_code=status.HTTP_201_CREATED,)
def create(request: schemas.EventCreate, db: Session = Depends(get_db)):
    return event.create(request, db)

@router.put("/{id}", status_code=status.HTTP_202_ACCEPTED)
def update_event(id: int, updates: schemas.EventUpdate, db: Session = Depends(get_db)):
    return event.update_event(id, updates, db)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(id: int, db: Session = Depends(get_db)):
    return event.delete_event(id, db)

@router.get("/", response_model=List[schemas.Event])
def get_all_events(db: Session = Depends(get_db)):
    return event.get_all(db)

# Get a specific event by ID
@router.get("/{event_id}", response_model=schemas.Event)
def get_event(event_id: int, db: Session = Depends(get_db)):
    return event.get_event(event_id, db)