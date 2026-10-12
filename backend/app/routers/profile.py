from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import FarmerProfile
from app.schemas import FarmerProfileResponse, FarmerProfileUpdate

router = APIRouter(prefix="/profile", tags=["Farmer Profile"])

def get_or_create_default_profile(db: Session) -> FarmerProfile:
    profile = db.query(FarmerProfile).first()
    if not profile:
        profile = FarmerProfile(
            name="Ramesh Kumar (रमेश कुमार)",
            state="Uttar Pradesh (उत्तर प्रदेश)",
            district="Varanasi (वाराणसी)",
            preferred_language="hi",
            primary_crop="Wheat (गेहूं)",
            soil_type="Alluvial Soil (जलोढ़ मिट्टी)",
            farm_size_acres=3.5
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.get("", response_model=FarmerProfileResponse)
def get_profile(db: Session = Depends(get_db)):
    """Retrieve the farmer profile, creating defaults if empty."""
    return get_or_create_default_profile(db)

@router.put("", response_model=FarmerProfileResponse)
def update_profile(data: FarmerProfileUpdate, db: Session = Depends(get_db)):
    """Update farmer preferences and farm characteristics."""
    profile = get_or_create_default_profile(db)
    
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None:
            setattr(profile, field, value)
            
    db.commit()
    db.refresh(profile)
    return profile

