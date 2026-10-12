import json
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query

router = APIRouter(prefix="/crops", tags=["Crop Care Guide"])

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "crops.json"

def load_crop_data() -> List[dict]:
    if not DATA_PATH.exists():
        return []
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("")
def get_all_crops():
    """Retrieve full list of crops for the Crop Care Guide."""
    crops = load_crop_data()
    return crops

@router.get("/search")
def search_crops(q: str = Query(..., min_length=1, description="Search term for crop, disease, or pest")):
    """Search crops by name, season, symptoms, or disease name."""
    crops = load_crop_data()
    q_lower = q.lower().strip()
    results = []
    
    for crop in crops:
        matches = False
        # Search crop names & botany
        if (q_lower in crop.get("name_en", "").lower() or 
            q_lower in crop.get("name_hi", "").lower() or 
            q_lower in crop.get("season", "").lower() or
            q_lower in crop.get("category", "").lower()):
            matches = True
            
        # Search diseases
        for disease in crop.get("common_diseases", []):
            if (q_lower in disease.get("name", "").lower() or 
                q_lower in disease.get("symptoms", "").lower() or
                q_lower in disease.get("treatment", "").lower()):
                matches = True
                break
                
        # Search pests
        for pest in crop.get("common_pests", []):
            if (q_lower in pest.get("name", "").lower() or 
                q_lower in pest.get("symptoms", "").lower()):
                matches = True
                break
                
        if matches:
            results.append(crop)
            
    return results

@router.get("/{crop_id}")
def get_crop_by_id(crop_id: str):
    """Retrieve single crop detail by its unique identifier (e.g., 'wheat', 'rice')."""
    crops = load_crop_data()
    for crop in crops:
        if crop.get("id").lower() == crop_id.lower():
            return crop
    raise HTTPException(status_code=404, detail=f"Crop with ID '{crop_id}' not found.")

