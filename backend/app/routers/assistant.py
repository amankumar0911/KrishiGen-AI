from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ChatHistory, FarmerProfile
from app.schemas import ChatMessageBase, ChatResponse, ChatHistoryItem
from app.services.ai_service import AIService

router = APIRouter(prefix="/assistant", tags=["Krishi AI Assistant"])

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(
    payload: ChatMessageBase,
    db: Session = Depends(get_db)
):
    """
    Agricultural AI Chat endpoint.
    Automatically enriches prompt with farmer profile if parameters are unspecified.
    """
    farmer = db.query(FarmerProfile).first()
    
    # Auto-fill context from profile if not explicitly passed
    crop_ctx = payload.crop_type or (farmer.primary_crop if farmer else None)
    soil_ctx = payload.soil_type or (farmer.soil_type if farmer else None)
    region_ctx = payload.region or (farmer.state if farmer else None)
    lang_ctx = payload.language or (farmer.preferred_language if farmer else "hi")
    
    # Call AI service (Live or Demo Mode)
    ai_result = await AIService.chat(
        message=payload.message,
        crop_type=crop_ctx,
        growth_stage=payload.growth_stage,
        soil_type=soil_ctx,
        region=region_ctx,
        language=lang_ctx
    )
    
    # Record user message in DB
    user_entry = ChatHistory(
        sender="user",
        message=payload.message,
        language=lang_ctx,
        is_demo=False
    )
    db.add(user_entry)
    
    # Record assistant message in DB
    assistant_entry = ChatHistory(
        sender="assistant",
        message=ai_result["reply"],
        language=lang_ctx,
        is_demo=ai_result["is_demo"]
    )
    db.add(assistant_entry)
    db.commit()
    
    return ChatResponse(
        reply=ai_result["reply"],
        is_demo=ai_result["is_demo"],
        suggestions=ai_result.get("suggestions", []),
        follow_up_questions=ai_result.get("follow_up_questions", []),
        disclaimer=ai_result.get("disclaimer", "")
    )

@router.get("/history", response_model=List[ChatHistoryItem])
def get_chat_history(limit: int = 50, db: Session = Depends(get_db)):
    """Retrieve recent chat history from SQLite database."""
    history = (
        db.query(ChatHistory)
        .order_by(ChatHistory.id.asc())
        .limit(limit)
        .all()
    )
    return history

@router.delete("/history", status_code=status.HTTP_204_NO_CONTENT)
def clear_chat_history(db: Session = Depends(get_db)):
    """Clear past conversation history."""
    db.query(ChatHistory).delete()
    db.commit()
    return None

