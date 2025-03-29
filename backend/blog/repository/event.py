from sqlalchemy.orm import Session
from .. import models, schemas
from fastapi import HTTPException,status

def create(request: schemas.EventCreate, db: Session):
    # if not event.type or not event.planned_start_time or not event.category or not event.title or not event.description:
    #     raise HTTPException(status_code=400, detail="Required fields are missing")

    new_event = models.Event(
        type=request.type,
        plannedStartTime=request.plannedStartTime,
        plannedEndTime=request.plannedEndTime,
        actualStartTime=request.actualStartTime,
        actualEndTime=request.actualEndTime,
        category=request.category,
        subCategory=request.subCategory,
        title=request.title,
        description=request.description,
        remark=request.remark,
        rating=request.rating,
        breaks=request.breaks,
        subTasks=request.subTasks,
        status=request.status,
        userId=1
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return {"success": True}

def update_event(id: int, updates: schemas.EventUpdate, db: Session):
    event = db.query(models.Event).filter(models.Event.id == id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    for key, value in updates.dict(exclude_unset=True).items():
        setattr(event, key, value)

    db.commit()
    return {"success": True}

def delete_event(id: int, db: Session):
    event = db.query(models.Event).filter(models.Event.id == id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    db.delete(event)
    db.commit()
    return {"success": True}

def get_all(db: Session):
    return db.query(models.Event).all()

def get_event(event_id: int, db: Session):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event