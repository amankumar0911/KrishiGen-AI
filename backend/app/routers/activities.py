from typing import List, Optional
from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import FarmingActivity
from app.schemas import (
    FarmingActivityCreate,
    FarmingActivityUpdate,
    FarmingActivityResponse
)

router = APIRouter(prefix="/activities", tags=["Farming Planner"])

# Initial sample activities for first run
DEFAULT_SAMPLE_ACTIVITIES = [
    {
        "title": "First Irrigation at CRI Stage (ताज जड़ अवस्था पर पहली सिंचाई)",
        "crop": "Wheat",
        "category": "Irrigation",
        "activity_date": date.today().strftime("%Y-%m-%d"),
        "status": "pending",
        "notes": "Crown Root Initiation stage (21 days after sowing). Apply light irrigation without waterlogging."
    },
    {
        "title": "Top dressing with Urea (यूरिया की पहली टॉप ड्रेसिंग)",
        "crop": "Wheat",
        "category": "Fertilizer",
        "activity_date": date.today().strftime("%Y-%m-%d"),
        "status": "pending",
        "notes": "Broadcast urea @ 30 kg/acre immediately following the first irrigation."
    },
    {
        "title": "Yellow Sticky Traps Installation (पीले चिपचिपे कार्ड लगाना)",
        "crop": "Tomato",
        "category": "Pest Management",
        "activity_date": date.today().strftime("%Y-%m-%d"),
        "status": "completed",
        "notes": "Placed 15 yellow sticky traps per acre to control whiteflies and vectors."
    },
    {
        "title": "Soil Moisture Check & Earthing-up (मिट्टी चढ़ाना)",
        "crop": "Potato",
        "category": "Weeding & Tillage",
        "activity_date": date.today().strftime("%Y-%m-%d"),
        "status": "completed",
        "notes": "Cover exposed tubers with fine soil to prevent solanine greening."
    }
]

def seed_sample_activities_if_empty(db: Session):
    count = db.query(FarmingActivity).count()
    if count == 0:
        for item in DEFAULT_SAMPLE_ACTIVITIES:
            act = FarmingActivity(
                title=item["title"],
                crop=item["crop"],
                category=item["category"],
                activity_date=item["activity_date"],
                status=item["status"],
                notes=item["notes"]
            )
            db.add(act)
        db.commit()

@router.get("", response_model=List[FarmingActivityResponse])
def get_activities(
    crop: Optional[str] = Query(None, description="Filter by crop name"),
    status: Optional[str] = Query(None, description="Filter by status (pending/completed)"),
    db: Session = Depends(get_db)
):
    """Retrieve list of farming activities with optional filtering."""
    seed_sample_activities_if_empty(db)
    query = db.query(FarmingActivity)
    if crop:
        query = query.filter(FarmingActivity.crop.ilike(f"%{crop}%"))
    if status:
        query = query.filter(FarmingActivity.status == status)
    
    return query.order_by(FarmingActivity.activity_date.asc(), FarmingActivity.id.desc()).all()

@router.get("/stats")
def get_activity_stats(db: Session = Depends(get_db)):
    """Summary statistics for charts and dashboard cards."""
    seed_sample_activities_if_empty(db)
    total = db.query(FarmingActivity).count()
    completed = db.query(FarmingActivity).filter(FarmingActivity.status == "completed").count()
    pending = total - completed
    
    # Category distribution for Recharts
    category_counts = (
        db.query(FarmingActivity.category, func.count(FarmingActivity.id))
        .group_by(FarmingActivity.category)
        .all()
    )
    categories = [{"name": cat or "General", "count": count} for cat, count in category_counts]

    # Crop distribution
    crop_counts = (
        db.query(FarmingActivity.crop, func.count(FarmingActivity.id))
        .group_by(FarmingActivity.crop)
        .all()
    )
    crops = [{"crop": crp or "Other", "count": count} for crp, count in crop_counts]

    return {
        "total": total,
        "completed": completed,
        "pending": pending,
        "completion_rate": round((completed / total * 100), 1) if total > 0 else 0,
        "category_distribution": categories,
        "crop_distribution": crops
    }

@router.post("", response_model=FarmingActivityResponse, status_code=status.HTTP_201_CREATED)
def create_activity(activity: FarmingActivityCreate, db: Session = Depends(get_db)):
    """Create a new farming planner activity."""
    db_activity = FarmingActivity(
        title=activity.title.strip(),
        crop=activity.crop.strip(),
        category=activity.category.strip(),
        activity_date=activity.activity_date.strip(),
        status=activity.status.strip(),
        notes=activity.notes.strip() if activity.notes else ""
    )
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

@router.put("/{activity_id}", response_model=FarmingActivityResponse)
def update_activity(
    activity_id: int,
    data: FarmingActivityUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing activity."""
    activity = db.query(FarmingActivity).filter(FarmingActivity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    update_data = data.model_dump(exclude_unset=True)
    for key, val in update_data.items():
        if val is not None:
            setattr(activity, key, val)
            
    db.commit()
    db.refresh(activity)
    return activity

@router.patch("/{activity_id}/toggle", response_model=FarmingActivityResponse)
def toggle_activity_status(activity_id: int, db: Session = Depends(get_db)):
    """Toggle activity status between pending and completed."""
    activity = db.query(FarmingActivity).filter(FarmingActivity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    activity.status = "completed" if activity.status == "pending" else "pending"
    db.commit()
    db.refresh(activity)
    return activity

@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_activity(activity_id: int, db: Session = Depends(get_db)):
    """Delete a farming activity."""
    activity = db.query(FarmingActivity).filter(FarmingActivity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    db.delete(activity)
    db.commit()
    return None

