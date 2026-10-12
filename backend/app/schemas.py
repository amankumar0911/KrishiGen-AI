from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

# --- Farmer Profile Schemas ---
class FarmerProfileBase(BaseModel):
    name: str = Field(default="Ramesh Kumar", description="Farmer name or nickname")
    state: str = Field(default="Uttar Pradesh", description="State or region")
    district: Optional[str] = Field(default="Varanasi", description="District")
    preferred_language: str = Field(default="hi", description="Preferred language: hi, en, hi-en")
    primary_crop: str = Field(default="Wheat (गेहूं)", description="Primary crop cultivated")
    soil_type: str = Field(default="Alluvial Soil (जलोढ़ मिट्टी)", description="Soil type")
    farm_size_acres: Optional[float] = Field(default=2.5, description="Farm size in acres")

class FarmerProfileCreate(FarmerProfileBase):
    pass

class FarmerProfileUpdate(BaseModel):
    name: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    preferred_language: Optional[str] = None
    primary_crop: Optional[str] = None
    soil_type: Optional[str] = None
    farm_size_acres: Optional[float] = None

class FarmerProfileResponse(FarmerProfileBase):
    id: int
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# --- Farming Activity Schemas ---
class FarmingActivityBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=200, description="Activity title")
    crop: str = Field(..., description="Crop name")
    category: str = Field(default="General", description="Activity category (Sowing, Irrigation, Fertilizer, etc.)")
    activity_date: str = Field(..., description="Target date in YYYY-MM-DD")
    status: str = Field(default="pending", description="Status: pending or completed")
    notes: Optional[str] = Field(default="", description="Additional notes or instructions")

class FarmingActivityCreate(FarmingActivityBase):
    pass

class FarmingActivityUpdate(BaseModel):
    title: Optional[str] = None
    crop: Optional[str] = None
    category: Optional[str] = None
    activity_date: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class FarmingActivityResponse(FarmingActivityBase):
    id: int
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

# --- AI Assistant Schemas ---
class ChatMessageBase(BaseModel):
    message: str = Field(..., min_length=1, description="User's query")
    crop_type: Optional[str] = Field(default=None, description="Optional crop context")
    growth_stage: Optional[str] = Field(default=None, description="Growth stage (e.g., vegetative, flowering)")
    soil_type: Optional[str] = Field(default=None, description="Soil type context")
    region: Optional[str] = Field(default=None, description="State / Region context")
    language: Optional[str] = Field(default="hi", description="Preferred response language (hi, en, hi-en)")

class ChatResponse(BaseModel):
    reply: str
    is_demo: bool
    suggestions: List[str] = []
    follow_up_questions: List[str] = []
    disclaimer: str

class ChatHistoryItem(BaseModel):
    id: int
    sender: str
    message: str
    language: Optional[str]
    is_demo: bool
    created_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)

# --- Disease Vision Schemas ---
class DiseaseAnalysisResponse(BaseModel):
    crop_name: str
    disease_detected: str
    confidence: Optional[str] = None
    severity: str
    symptoms: List[str]
    immediate_actions: List[str]
    preventative_measures: List[str]
    recommended_treatment: str
    is_demo: bool
    disclaimer: str
    kvk_contact_advice: str
