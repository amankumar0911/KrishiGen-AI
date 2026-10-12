from fastapi import APIRouter
from app.config import settings
from app.services.ai_service import AIService

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("")
def health_check():
    return {
        "status": "healthy",
        "app_name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "live_ai_configured": AIService.is_live_configured(),
        "ai_model": settings.GEMINI_MODEL if AIService.is_live_configured() else "Demo Mode (Rule & Knowledge Base)",
        "database": "SQLite Connected"
    }

