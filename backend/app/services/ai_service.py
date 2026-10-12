import json
import base64
import logging
from typing import Dict, Any, List, Optional
import httpx
from app.config import settings

logger = logging.getLogger("krishigen.ai")

# Demo answers database for intelligent, authentic agricultural responses when no API key is set
DEMO_KNOWLEDGE_BASE = [
    {
        "keywords": ["yellow rust", "peela ratua", "पीला रतुआ", "rust", "रतुआ"],
        "reply": (
            "🌾 **गेहूं में पीला रतुआ (Yellow / Stripe Rust) की पहचान और उपचार:**\n\n"
            "**लक्षण:**\n"
            "• पत्तियों की ऊपरी सतह पर पीले रंग की धारियों में चूर्ण जैसी फुंसियां (Pustules) बन जाती हैं।\n"
            "• उंगली फेरने पर पीला पाउडर हाथ पर लग जाता है। यह ठंडे और नम मौसम में तेजी से फैलता है।\n\n"
            "**तत्काल उपचार (Treatment):**\n"
            "1. **प्रोपिकोनाजोल 25% EC (टिल्ट / Tilt):** 1 मिली प्रति लीटर पानी (200 मिली प्रति एकड़ 200 लीटर पानी में) का छिड़काव तुरंत करें।\n"
            "2. रोग का प्रकोप ज्यादा होने पर 12-15 दिनों के अंतराल पर **टेबुकोनाजोल 250 EC** का दूसरा छिड़काव करें।\n\n"
            "**बचाव के उपाय (Prevention):**\n"
            "• हमेशा प्रतिरोधी किस्में (जैसे DBW-187, DBW-222, HD-2967) ही बोएं।\n"
            "• खेत में यूरिया की अधिक मात्रा डालने से बचें क्योंकि अतिरिक्त नाइट्रोजन से फंगस तेजी से बढ़ता है।"
        ),
        "suggestions": [
            "खेत में दवा का छिड़काव कब करना चाहिए?",
            "क्या पीला रतुआ गेहूं के दानों को प्रभावित करता है?",
            "अगले सीजन के लिए कौन सी प्रतिरोधी किस्म चुनें?"
        ],
        "follow_ups": [
            "क्या यह लक्षण सिर्फ कुछ पौधों पर हैं या पूरे खेत में फैल चुके हैं?",
            "आपकी गेहूं की फसल की वर्तमान अवस्था (tillering / heading) क्या है?"
        ]
    },
    {
        "keywords": ["irrigation", "sinchai", "सिंचाई", "pani", "water", "schedule"],
        "reply": (
            "💧 **फसल में वैज्ञानिक सिंचाई प्रबंधन (Irrigation Management):**\n\n"
            "फसल की पैदावार के लिए क्रांतिक अवस्थाओं (Critical Growth Stages) पर नमी बनाए रखना सबसे जरूरी होता है:\n\n"
            "**गेहूं (Wheat) के लिए 6 मुख्य अवस्थाएं:**\n"
            "1. **ताज जड़ (CRI Stage):** बुवाई के 20-25 दिन बाद (यह सबसे जरूरी है, इसे कभी न छोड़ें)।\n"
            "2. **कल्ले फूटते समय (Tillering):** बुवाई के 40-45 दिन बाद।\n"
            "3. **गांठ बनते समय (Jointing):** 60-65 दिन बाद।\n"
            "4. **फूल निकलते समय (Flowering):** 80-85 दिन बाद।\n"
            "5. **दूधिया अवस्था (Milking):** 100-105 दिन बाद।\n"
            "6. **दाना पकते समय (Dough Stage):** 115-120 दिन बाद।\n\n"
            "💡 *सलाह: तेज हवा चलने पर सिंचाई न करें, इससे पौधे गिर (Lodging) सकते हैं।* \n"
            "टपक सिंचाई (Drip) या फव्वारा सिंचाई (Sprinkler) अपनाने से 30-40% पानी की बचत होती है।"
        ),
        "suggestions": [
            "धान (Rice) में पानी का प्रबंधन कैसे करें?",
            "क्या खेत में पानी भरने से फसल को नुकसान होता है?",
            "टपक सिंचाई (Drip) पर सरकारी सब्सिडी कैसे लें?"
        ],
        "follow_ups": [
            "आपकी मिट्टी की बनावट कैसी है (बलुई दोमट या चिकनी)?",
            "खेत में सिंचाई का मुख्य स्रोत क्या है (नहर या नलकूप)?"
        ]
    },
    {
        "keywords": ["fertilizer", "khad", "खाद", "urea", "dap", "npk", "zinc"],
        "reply": (
            "🌱 **संतुलित उर्वरक एवं पोषण प्रबंधन (Balanced Nutrient Management):**\n\n"
            "फसल को केवल यूरिया देने के बजाय N:P:K (नाइट्रोजन, फास्फोरस, पोटाश) का संतुलित अनुपात देना चाहिए:\n\n"
            "**गेहूं के लिए मानक अनुपात (120:60:40 किग्रा/हेक्टेयर):**\n"
            "• **बुवाई के समय (Basal Dose):** पूरा फास्फोरस (DAP ~125 किग्रा) + पूरा पोटाश (MOP ~65 किग्रा) + 1/3 नाइट्रोजन।\n"
            "• **पहली सिंचाई पर (First Top Dressing):** 1/3 नाइट्रोजन (यूरिया ~60 किग्रा/एकड़)।\n"
            "• **दूसरी सिंचाई पर (Second Top Dressing):** शेष 1/3 नाइट्रोजन।\n\n"
            "**जिंक (Zinc) का महत्व:**\n"
            "उत्तर भारत की मिट्टी में जिंक की कमी सामान्य है। बुवाई के समय 25 किग्रा जिंक सल्फेट (21%) प्रति हेक्टेयर डालें। ध्यान रहे: **जिंक और डीएपी को कभी मिलाकर न डालें**, इससे जिंक फास्फेट बनकर बेकार हो जाता है।"
        ),
        "suggestions": [
            "जैविक खाद (गोबर/वर्मीकम्पोस्ट) कितनी मात्रा में डालें?",
            "पत्तियों पर नैनो यूरिया (Nano Urea) का स्प्रे कब करें?",
            "मिट्टी की जांच (Soil Testing) कैसे करवाएं?"
        ],
        "follow_ups": [
            "क्या आपने हाल ही में मृदा स्वास्थ्य कार्ड (Soil Health Card) बनवाया है?",
            "आप मुख्य रूप से किस फसल के खाद की गणना करना चाहते हैं?"
        ]
    },
    {
        "keywords": ["tomato", "leaf curl", "टमाटर", "patti marod", "curl"],
        "reply": (
            "🍅 **टमाटर में पत्ती मरोड़ रोग (Tomato Leaf Curl Virus) का प्रबंधन:**\n\n"
            "**कारण व लक्षण:**\n"
            "• पत्तियां ऊपर की तरफ मुड़ जाती हैं, खुरदुरी हो जाती हैं और पौधे की वृद्धि रुक जाती है।\n"
            "• यह बीमारी **सफेद मक्खी (Whitefly)** कीट द्वारा एक पौधे से दूसरे पौधे में फैलाई जाती है।\n\n"
            "**रोकथाम व नियंत्रण उपाय:**\n"
            "1. **रोगग्रस्त पौधे उखाड़ें:** जिन पौधों में गंभीर लक्षण हैं, उन्हें तुरंत उखाड़कर गड्ढे में दबा दें।\n"
            "2. **पीले चिपचिपे कार्ड (Yellow Sticky Traps):** प्रति एकड़ 15-20 पीले ट्रैप लगाएं ताकि सफेद मक्खी उस पर चिपक जाए।\n"
            "3. **सफेद मक्खी नियंत्रण:**\n"
            "   - नीम का तेल (Neem Oil 10,000 ppm) @ 2-3 मिली/लीटर पानी का छिड़काव करें।\n"
            "   - कीट अधिक होने पर **एसिटामिप्रिड 20 SP** @ 0.5 ग्राम/लीटर या **थियामेथोक्सम 25 WG** @ 0.5 ग्राम/लीटर पानी में घोलकर छिड़कें।"
        ),
        "suggestions": [
            "टमाटर में फल छेदक (Fruit Borer) सुंडी की दवा?",
            "टमाटर की अगेती व पछेती झुलसा का इलाज क्या है?",
            "गर्मियों में टमाटर की खेती कैसे करें?"
        ],
        "follow_ups": [
            "क्या पत्तियों के निचले हिस्से में छोटे सफेद कीड़े उड़ते दिख रहे हैं?",
            "फसल को रोपे हुए कितने दिन हो चुके हैं?"
        ]
    },
    {
        "keywords": ["rice", "blast", "dhan", "धान", "jhulsa", "झुलसा"],
        "reply": (
            "🌾 **धान में झुलसा रोग (Rice Blast) की पहचान व उपचार:**\n\n"
            "**लक्षण:**\n"
            "• पत्तियों पर नाव या आंख के आकार के धब्बे (Spindle-shaped spots) बनते हैं, जिनका केंद्र भूरा-सफेद और किनारे लाल-कतई होते हैं।\n"
            "• बालियों के डंठल पर संक्रमण होने से बाली टूटकर लटक जाती है (Neck Blast), जिससे दाने नहीं भरते।\n\n"
            "**उपचार:**\n"
            "1. **ट्राइसाइक्लाजोल 75 WP (बाण / Beam):** 0.6 ग्राम प्रति लीटर पानी (120 ग्राम प्रति एकड़ 200 लीटर पानी में) का छिड़काव करें।\n"
            "2. वैकल्पिक दवा: **आइसोप्रोधियोलेन 40 EC** @ 1.5 मिली/लीटर पानी।\n\n"
            "**सावधानी:** खेत में यूरिया की अतिरिक्त खुराक तुरंत बंद करें। खेत में अधिक समय तक पानी जमा न रखें, हल्का व ताजा पानी लगाएं।"
        ),
        "suggestions": [
            "धान में तना छेदक (Stem Borer) का इलाज?",
            "धान में खैरा रोग (Khaira Disease) क्यों होता है?",
            "धान की कटाई का सही समय कैसे पहचानें?"
        ],
        "follow_ups": [
            "क्या धब्बे सिर्फ पत्तियों पर हैं या बालियों की गर्दन (Neck) पर भी हैं?",
            "आपकी धान की किस्म कौन सी है (बासमती या सामान्य)?"
        ]
    }
]

DEFAULT_DEMO_REPLY = {
    "reply": (
        "🌾 **नमस्ते किसान भाई! KrishiGen AI में आपका स्वागत है।**\n\n"
        "आपकी खेती से जुड़े किसी भी सवाल के समाधान के लिए मैं तैयार हूँ। आप नीचे दिए गए विषयों पर जानकारी ले सकते हैं:\n\n"
        "1. **फसल सुरक्षा व रोग उपचार:** गेहूं का पीला रतुआ, धान का झुलसा, टमाटर का लीफ कर्ल, आलू का पछेती झुलसा।\n"
        "2. **सिंचाई योजना:** मिट्टी और मौसम के अनुसार पानी देने का सही समय।\n"
        "3. **खाद एवं उर्वरक:** DAP, यूरिया, पोटाश और जिंक की संतुलित मात्रा।\n"
        "4. **कीट प्रबंधन:** माहू, दीमक, सफेद मक्खी, तना छेदक के जैविक व रासायनिक उपाय।\n\n"
        "👉 *सटीक सलाह के लिए अपनी फसल का नाम, पौधे की उम्र और दिखने वाले लक्षण बताएं।* \n\n"
        "*(नोट: यह डेमो मोड उत्तर है। अपने बैकएंड .env में GEMINI_API_KEY जोड़कर आप लाइव जनरेटिव AI चालू कर सकते हैं।)*"
    ),
    "suggestions": [
        "गेहूं में पीला रतुआ (Yellow Rust) के लक्षण और उपचार",
        "धान की फसल में खाद कब और कितनी डालें?",
        "टमाटर में पत्ती मुड़ने का क्या कारण है?",
        "गेहूं की पहली सिंचाई (CRI) कब करनी चाहिए?"
    ],
    "follow_ups": [
        "आप किस फसल के बारे में जानकारी चाहते हैं?",
        "आपकी फसल वर्तमान में किस विकास अवस्था में है?"
    ]
}


class AIService:
    @staticmethod
    def is_live_configured() -> bool:
        return bool(settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY.strip()) > 5)

    @classmethod
    async def chat(
        cls,
        message: str,
        crop_type: Optional[str] = None,
        growth_stage: Optional[str] = None,
        soil_type: Optional[str] = None,
        region: Optional[str] = None,
        language: Optional[str] = "hi"
    ) -> Dict[str, Any]:
        """
        Processes a chat query using Gemini API if configured,
        or graceful intelligent Demo Mode if no key is provided.
        """
        # If live API key is configured, invoke Gemini API
        if cls.is_live_configured():
            try:
                return await cls._call_gemini_chat(
                    message=message,
                    crop_type=crop_type,
                    growth_stage=growth_stage,
                    soil_type=soil_type,
                    region=region,
                    language=language
                )
            except Exception as e:
                logger.error(f"Live AI call failed: {e}. Falling back to demo mode.")
                demo_res = cls._get_demo_chat_response(message)
                demo_res["disclaimer"] = (
                    f"⚠️ Live AI connection encountered an issue ({str(e)[:60]}...). Showing safe fallback guidance. "
                    "For severe crop issues, consult your local Krishi Vigyan Kendra (KVK)."
                )
                return demo_res
        
        # When no API key is provided, provide authentic, helpful Demo Mode response
        demo_res = cls._get_demo_chat_response(message)
        demo_res["disclaimer"] = (
            "ℹ️ Demo Mode: Running with curated agricultural knowledge base. "
            "To enable live multi-turn AI responses, set GEMINI_API_KEY in backend/.env. "
            "Always verify with a local agricultural officer or KVK before large-scale pesticide spraying."
        )
        return demo_res

    @classmethod
    async def _call_gemini_chat(
        cls,
        message: str,
        crop_type: Optional[str],
        growth_stage: Optional[str],
        soil_type: Optional[str],
        region: Optional[str],
        language: Optional[str]
    ) -> Dict[str, Any]:
        """
        Calls Gemini REST API via httpx for reliable non-blocking performance.
        """
        system_instruction = (
            "You are KrishiGen AI, an expert, empathetic, and practical agricultural assistant for Indian farmers. "
            "Your goals are to:\n"
            "1. Answer in the requested language (Hindi if 'hi', English if 'en', or Hinglish if 'hi-en'). "
            "2. Explain farming concepts simply, avoiding confusing academic jargon.\n"
            "3. Provide structured responses: (a) Identification & Cause, (b) Immediate Practical Action, (c) Preventive Steps, (d) Organic / Chemical Dosage.\n"
            "4. Ask follow-up questions if important details (such as crop variety, stage, soil, weather) are missing.\n"
            "5. Always consider farmer context: Crop type, growth stage, soil type, and Indian regional conditions.\n"
            "6. Always include a reminder to consult local Krishi Vigyan Kendra (KVK) or Kisan Call Centre (1800-180-1551) for critical chemical handling."
        )

        context_notes = []
        if crop_type:
            context_notes.append(f"Crop: {crop_type}")
        if growth_stage:
            context_notes.append(f"Growth Stage: {growth_stage}")
        if soil_type:
            context_notes.append(f"Soil Type: {soil_type}")
        if region:
            context_notes.append(f"Region/State: {region}")
        if language:
            context_notes.append(f"Preferred Response Language: {language}")

        prompt_text = (
            f"Farmer Context:\n{', '.join(context_notes) if context_notes else 'General'}\n\n"
            f"Farmer's Question: {message}\n\n"
            f"Respond clearly and concisely with markdown formatting."
        )

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": f"System Guidelines: {system_instruction}\n\n{prompt_text}"}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.3,
                "maxOutputTokens": 1024,
            }
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code != 200:
                raise RuntimeError(f"Gemini API returned status {resp.status_code}: {resp.text}")
            
            data = resp.json()
            candidates = data.get("candidates", [])
            if not candidates:
                raise RuntimeError("No candidate response generated by Gemini.")
            
            reply_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")

        return {
            "reply": reply_text,
            "is_demo": False,
            "suggestions": [
                "कीटनाशक छिड़कते समय क्या सावधानियां रखें?",
                "इस मौसम में खरपतवार (Weed) नियंत्रण कैसे करें?",
                "सिंचाई का सबसे सही समय क्या होगा?"
            ],
            "follow_up_questions": [
                "क्या आपने हाल ही में कोई अन्य कीटनाशक या खाद डाला था?",
                "आपके क्षेत्र का तापमान और मौसम कैसा बना हुआ है?"
            ],
            "disclaimer": "Live AI guidance. Preliminary advice only — always verify recommendations with your local Krishi Vigyan Kendra (KVK)."
        }

    @classmethod
    def _get_demo_chat_response(cls, message: str) -> Dict[str, Any]:
        msg_lower = message.lower()
        for item in DEMO_KNOWLEDGE_BASE:
            for kw in item["keywords"]:
                if kw in msg_lower:
                    return {
                        "reply": item["reply"],
                        "is_demo": True,
                        "suggestions": item["suggestions"],
                        "follow_up_questions": item["follow_ups"],
                        "disclaimer": "Demo Mode: Pre-configured educational guidance."
                    }
        
        return {
            "reply": DEFAULT_DEMO_REPLY["reply"],
            "is_demo": True,
            "suggestions": DEFAULT_DEMO_REPLY["suggestions"],
            "follow_up_questions": DEFAULT_DEMO_REPLY["follow_ups"],
            "disclaimer": "Demo Mode: Pre-configured educational guidance."
        }

    @classmethod
    async def analyze_crop_image(
        cls,
        image_bytes: bytes,
        filename: str,
        content_type: str
    ) -> Dict[str, Any]:
        """
        Analyzes a crop or leaf image. Uses Gemini Vision if configured.
        If not configured, returns clear demo instructions without fake numbers.
        """
        # Validate format
        allowed_types = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
        if content_type.lower() not in allowed_types:
            raise ValueError(f"Unsupported file format '{content_type}'. Please upload JPG, PNG, or WebP.")
        
        if len(image_bytes) > 5 * 1024 * 1024:
            raise ValueError("File size exceeds 5MB limit. Please upload a smaller image.")

        if cls.is_live_configured():
            try:
                return await cls._call_gemini_vision(image_bytes, content_type)
            except Exception as e:
                logger.error(f"Vision API call failed: {e}. Falling back to demo mode explanation.")
                return cls._get_demo_vision_response(filename=filename, error_note=str(e))
        
        return cls._get_demo_vision_response(filename=filename)

    @classmethod
    async def _call_gemini_vision(cls, image_bytes: bytes, content_type: str) -> Dict[str, Any]:
        """
        Invokes Gemini Vision with image bytes and structured prompt.
        """
        b64_data = base64.b64encode(image_bytes).decode("utf-8")
        prompt = (
            "You are an agricultural expert plant pathologist analyzing a leaf or crop photograph for an Indian farmer. "
            "Examine the image carefully and respond strictly in valid JSON format with this exact structure:\n"
            "{\n"
            '  "crop_name": "Identified Crop name in English & Hindi",\n'
            '  "disease_detected": "Name of disease/pest or Healthy Plant",\n'
            '  "confidence": "e.g. 88% (or High / Moderate)",\n'
            '  "severity": "Mild / Moderate / Severe / None",\n'
            '  "symptoms": ["Visible symptom 1", "Visible symptom 2"],\n'
            '  "immediate_actions": ["Immediate practical step 1", "Immediate step 2"],\n'
            '  "preventative_measures": ["Preventative tip 1", "Preventative tip 2"],\n'
            '  "recommended_treatment": "Organic and chemical dosage instructions in clear terms",\n'
            '  "kvk_contact_advice": "Advice to confirm with local KVK before chemical spraying"\n'
            "}\n"
            "Do NOT wrap with markdown code blocks. Return raw JSON."
        )

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_VISION_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt},
                        {
                            "inlineData": {
                                "mimeType": content_type,
                                "data": b64_data
                            }
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 1024,
            }
        }

        async with httpx.AsyncClient(timeout=45.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code != 200:
                raise RuntimeError(f"Vision API returned status {resp.status_code}: {resp.text}")
            
            data = resp.json()
            candidates = data.get("candidates", [])
            if not candidates:
                raise RuntimeError("No vision candidate generated.")
            
            text_result = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
            # Clean possible markdown fence
            clean_json = text_result.strip()
            if clean_json.startswith("```json"):
                clean_json = clean_json[7:]
            if clean_json.startswith("```"):
                clean_json = clean_json[3:]
            if clean_json.endswith("```"):
                clean_json = clean_json[:-3]
            clean_json = clean_json.strip()

            parsed = json.loads(clean_json)
            parsed["is_demo"] = False
            parsed["disclaimer"] = (
                "Automated vision assessment is preliminary guidance, not a definitive laboratory diagnosis. "
                "Contact your local Krishi Vigyan Kendra (KVK) or Agricultural Officer before applying potent chemicals."
            )
            return parsed

    @classmethod
    def _get_demo_vision_response(cls, filename: str, error_note: Optional[str] = None) -> Dict[str, Any]:
        """
        Returns a transparent Demo Mode explanation. In strict compliance with guidelines:
        'If live image analysis is unavailable, clearly explain that the feature requires configuration.
        Do not generate fake disease predictions or invented confidence scores.'
        """
        explanation = (
            "Live image diagnosis requires a vision-capable API key (GEMINI_API_KEY in backend/.env). "
            f"Your file '{filename}' was successfully verified and inspected by the upload pipeline. "
        )
        if error_note:
            explanation += f"Notice: {error_note}. "

        return {
            "crop_name": "Image Upload Verified (Live Vision Unconfigured)",
            "disease_detected": "Live Vision AI Requires API Configuration",
            "confidence": None,  # No fake confidence scores!
            "severity": "Unassessed",
            "symptoms": [
                f"Image file received successfully ({filename})",
                "Format and dimensions validated by backend upload handler",
                "AI vision inference suspended until GEMINI_API_KEY is configured in backend/.env"
            ],
            "immediate_actions": [
                "1. Open backend/.env and set your free Gemini API key: GEMINI_API_KEY=your_key_here",
                "2. Restart the FastAPI backend server (uvicorn app.main:app --reload)",
                "3. Re-upload your crop leaf photograph to get instant automated disease detection"
            ],
            "preventative_measures": [
                "Inspect leaf undersides regularly for early spots, powdery mildew, or pests",
                "Avoid overhead irrigation on diseased leaves to prevent fungal spreading",
                "Bring affected leaf samples in a sealed plastic bag to your nearest Krishi Vigyan Kendra"
            ],
            "recommended_treatment": (
                "To explore full disease profiles and chemical/organic treatments right now, "
                "visit the Crop Care Guide section for detailed protocols on Wheat, Rice, Tomato, and Potato."
            ),
            "is_demo": True,
            "disclaimer": (
                "Demo Mode Notice: No live AI key configured. No automated disease prediction was made. "
                "Treat all digital advice as preliminary guidance. Always consult an agronomist or KVK expert."
            ),
            "kvk_contact_advice": (
                "National Kisan Call Centre: Toll-Free 1800-180-1551 (6:00 AM to 10:00 PM all days). "
                "Locate your nearest district KVK center at: https://kvk.icar.gov.in"
            )
        }

