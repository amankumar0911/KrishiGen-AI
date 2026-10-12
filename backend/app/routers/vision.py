from typing import List, Dict, Any
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.services.ai_service import AIService
from app.schemas import DiseaseAnalysisResponse

router = APIRouter(prefix="/vision", tags=["Crop Disease Vision"])

# Pre-packaged verified educational reference samples for college project demonstration
DEMO_EDUCATIONAL_CASES = [
    {
        "id": "wheat-rust-sample",
        "crop_name": "Wheat (गेहूं)",
        "disease_detected": "Yellow / Stripe Rust (पीला रतुआ)",
        "confidence": "Demo Case Reference (Educational Dataset)",
        "severity": "High (Rapidly spreading in cool moist conditions)",
        "symptoms": [
            "Linear rows of yellow pustules (uredeospores) forming stripes on leaves",
            "Yellow powdery dust easily rubs off onto fingertips or clothes",
            "Severe chlorosis and yellowing of the leaf blade"
        ],
        "immediate_actions": [
            "Spray Propiconazole 25% EC (Tilt) @ 1 ml/L (200 ml in 200 L water per acre)",
            "Halt any supplementary urea/nitrogen top dressing immediately",
            "Mark infected patches and inspect surrounding fields daily"
        ],
        "preventative_measures": [
            "Plant rust-resistant certified varieties (HD-2967, DBW-187, DBW-222)",
            "Avoid late sowing beyond the first week of December in North-West plains",
            "Maintain balanced N:P:K fertilization (120:60:40 kg/ha)"
        ],
        "recommended_treatment": "Chemical: Propiconazole 25 EC or Tebuconazole 250 EC @ 1 ml/L. Repeat once after 12-14 days if cool cloudy weather persists.",
        "is_demo": True,
        "disclaimer": "Educational Reference Sample from ICAR/IARI guidelines. Always confirm diagnosis with your local KVK officer before large-scale spraying.",
        "kvk_contact_advice": "Toll-free Kisan Call Centre: 1800-180-1551. Contact local district Krishi Vigyan Kendra."
    },
    {
        "id": "rice-blast-sample",
        "crop_name": "Rice / Paddy (धान)",
        "disease_detected": "Rice Blast (झुलसा रोग - Magnaporthe oryzae)",
        "confidence": "Demo Case Reference (Educational Dataset)",
        "severity": "Moderate to High",
        "symptoms": [
            "Spindle/eye-shaped lesions on leaves with grayish center and brown/red borders",
            "Lesions coalescing to cause complete drying and burning appearance of foliage",
            "Risk of neck rot if infection reaches the panicle stem"
        ],
        "immediate_actions": [
            "Foliar spray of Tricyclazole 75% WP @ 0.6 g/L water",
            "Drain stagnant standing water from fields and apply fresh shallow irrigation",
            "Withhold urea application until disease progression ceases"
        ],
        "preventative_measures": [
            "Seed treatment with Tricyclazole 75 WP or Carbendazim @ 2 g/kg seed",
            "Optimum plant spacing (20x15 cm) to avoid dense humid microclimates",
            "Destruction of infected stubbles post-harvest"
        ],
        "recommended_treatment": "Foliar spray: Tricyclazole 75 WP (0.6 g/L) or Isoprothiolane 40 EC (1.5 ml/L).",
        "is_demo": True,
        "disclaimer": "Educational Reference Sample. Preliminary diagnosis for academic and field-support learning.",
        "kvk_contact_advice": "Toll-free Kisan Call Centre: 1800-180-1551."
    },
    {
        "id": "tomato-blight-sample",
        "crop_name": "Tomato (टमाटर)",
        "disease_detected": "Early Blight (अगेती झुलसा - Alternaria solani)",
        "confidence": "Demo Case Reference (Educational Dataset)",
        "severity": "Moderate",
        "symptoms": [
            "Dark brown to black spots with concentric rings ('target-board' effect) on older leaves",
            "Yellow chlorotic halo surrounding individual leaf spots",
            "Premature defoliation starting from the lower canopy upward"
        ],
        "immediate_actions": [
            "Prune and safely destroy lower infected leaves touching the soil",
            "Spray Mancozeb 75 WP @ 2.5 g/L or Azoxystrobin + Difenoconazole @ 1 ml/L",
            "Avoid overhead sprinkler watering; irrigate strictly at the base"
        ],
        "preventative_measures": [
            "Practice 2-3 year crop rotation with non-solanaceous crops",
            "Stake plants using bamboo supports to maintain good ventilation",
            "Mulch with straw or black plastic to prevent soil splash onto foliage"
        ],
        "recommended_treatment": "Preventive spray with Mancozeb 75 WP (2.5 g/L). Curative: Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml/L.",
        "is_demo": True,
        "disclaimer": "Educational Reference Sample. Treat as preliminary guidance.",
        "kvk_contact_advice": "Consult your local KVK or nearest agricultural university extension cell."
    }
]

@router.get("/samples")
def get_sample_cases():
    """Retrieve pre-verified educational disease cases for interactive demonstration."""
    return DEMO_EDUCATIONAL_CASES

@router.post("/analyze", response_model=DiseaseAnalysisResponse)
async def analyze_crop_image(file: UploadFile = File(...)):
    """
    Upload a crop or leaf photograph for automated disease analysis.
    Validates file format and size.
    Connects to live Gemini Vision API if key is present,
    or returns honest unconfigured Demo Mode explanation if absent.
    """
    if not file.content_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File content type could not be determined. Please upload a valid image."
        )

    try:
        content = await file.read()
        result = await AIService.analyze_crop_image(
            image_bytes=content,
            filename=file.filename or "uploaded_crop_image.jpg",
            content_type=file.content_type
        )
        return result
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while analyzing image: {str(e)}"
        )

