from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime
from app.database import Base

class FarmerProfile(Base):
    __tablename__ = "farmer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), default="Ramesh Kumar", nullable=False)
    state = Column(String(100), default="Uttar Pradesh", nullable=False)
    district = Column(String(100), default="Varanasi", nullable=True)
    preferred_language = Column(String(10), default="hi", nullable=False)  # 'hi', 'en', 'hi-en'
    primary_crop = Column(String(100), default="Wheat (गेहूं)", nullable=False)
    soil_type = Column(String(100), default="Alluvial Soil (जलोढ़ मिट्टी)", nullable=False)
    farm_size_acres = Column(Float, default=2.5, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class FarmingActivity(Base):
    __tablename__ = "farming_activities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    crop = Column(String(100), nullable=False)
    category = Column(String(100), default="General", nullable=False)  # Sowing, Irrigation, Fertilizer, Pest Control, Harvesting, Weeding
    activity_date = Column(String(20), nullable=False)  # YYYY-MM-DD
    status = Column(String(20), default="pending", nullable=False)  # 'pending', 'completed'
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    sender = Column(String(20), nullable=False)  # 'user', 'assistant'
    message = Column(Text, nullable=False)
    language = Column(String(10), default="hi")
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

