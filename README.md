# KrishiGen AI — Smart Farming Assistant for Indian Farmers
*(A Practical B.Tech CSE AI/ML Capstone Project)*

---

## 1. Project Overview & Problem Statement

Agriculture is the lifeblood of the Indian economy, engaging over 50% of the country's workforce. Despite this, smallholder and marginal farmers face recurring obstacles:
- **Language and Technological Barriers:** Most modern agritech tools are tailored for commercial farms, published in technical English, and filled with complex graphs.
- **Sudden Crop Disease Outbreaks:** Diseases like *Yellow Rust in Wheat*, *Blast in Rice*, and *Early/Late Blight in Tomato and Potato* spread rapidly during cool, damp weather, destroying 20–40% of yields if unchecked.
- **Inappropriate Chemical Usage:** Lack of immediate expert advice leads to either excessive chemical spraying or applying the wrong pesticide at incorrect growth stages.
- **Disconnected Task Planning:** Farmers need an intuitive way to track critical irrigation periods (e.g., Crown Root Initiation stage) and fertilization top-dressings.

**KrishiGen AI** is an accessible, practical full-stack web application designed to solve these exact problems. It provides:
1. **Multilingual AI Assistance** in Hindi, English, and Hinglish.
2. **Crop Disease Image Analysis** with plant pathology guidance and safety warnings.
3. **Scientific Crop Care Guides** for major Indian staple crops.
4. **Farming Activity Planner** with SQLite persistent storage and category analytics.
5. **Farmer Profile Management** that tailors all advice to the farmer's state, soil type, and primary crop.

---

## 2. Technology Stack

| Layer | Technologies Used | Description / Purpose |
|---|---|---|
| **Frontend** | React 18, Vite | High-performance responsive single-page application |
| **Styling** | Tailwind CSS v4 | Earthy, calm agricultural aesthetic (forest greens, warm off-white) |
| **Icons** | Lucide React | Clean, lightweight, consistent agricultural iconography |
| **Charts** | Recharts | Meaningful activity distribution and completion analytics |
| **Backend** | Python 3.11+, FastAPI | Modular REST API with Pydantic v2 schemas and validation |
| **Database** | SQLite + SQLAlchemy 2.0 | Zero-configuration local database persisting profiles, activities, and chats |
| **AI Integration** | Google Gemini API / Vision API | Multi-turn chat and visual leaf analysis with server-side key security |
| **Fallback Engine** | Curated Knowledge Base | Graceful, transparent **Demo Mode** with verified ICAR/KVK reference data |

---

## 3. Key Features

### A. Farmer Dashboard
- **Contextual Welcome Banner:** Personalized greeting in the farmer's preferred language with their primary crop, district, and state.
- **Dynamic Seasonal Detection:** Automatically detects whether it is currently **Rabi (Winter)**, **Kharif (Monsoon)**, or **Zaid (Summer)** season, providing season-appropriate advice.
- **Quick Action Cards:** One-click shortcuts to AI Chat, Disease Scanning, Crop Guide, and Planner.
- **Recent Activities:** Live task view from SQLite with instant completion toggle buttons.

### B. Krishi AI Assistant
- **Multilingual Support:** Converses naturally in Hindi (हिन्दी), English, or Hinglish.
- **Agricultural Context Filters:** Automatically incorporates the farmer's crop, growth stage, soil type, and region into prompts.
- **Actionable Advice:** Explains identification, immediate treatments, organic/chemical dosages, and precautions in clean bulleted sections.
- **Clarification Questions:** Follows up gently if vital details (symptoms, plant age) are omitted.
- **Chat Persistence:** All queries and replies are saved locally in SQLite and can be cleared at any time.

### C. Crop Disease Image Analysis
- **Photo Upload & Drag-and-Drop:** Accepts JPG, PNG, and WebP leaf photographs up to 5MB with file format and size validation.
- **Live Vision AI:** When configured with a Gemini API key, performs pathology evaluation and identifies symptoms, severity, and treatments.
- **Transparent Demo Mode:** If no API key is provided, the system honestly explains that the live model requires configuration—**no fake numbers or invented confidence scores are generated**.
- **Interactive Reference Samples:** Includes pre-verified case studies (Wheat Yellow Rust, Rice Blast, Tomato Early Blight) for instant demonstration.
- **Safety First:** Prominently highlights that digital advice is preliminary and provides direct access to the **Kisan Call Centre (1800-180-1551)** and local Krishi Vigyan Kendras (KVK).

### D. Crop Care Guide
- In-depth, scientifically validated guides for **Wheat (गेहूं)**, **Rice (धान)**, **Tomato (टमाटर)**, and **Potato (आलू)**.
- **Critical Irrigation Schedule:** Highlights vital stages (e.g., CRI stage for wheat) where moisture deficit causes irreversible yield loss.
- **Balanced Nutrient Management:** Organic FYM guidelines, standard N:P:K ratios, and split top-dressing schedules.
- **Pests & Diseases Catalog:** Diagnostic symptoms, preventive measures, and chemical/organic controls.
- **Editable Local JSON Data:** Stored in `backend/app/data/crops.json` for easy expansion to more crops.

### E. Farming Planner
- **Full CRUD Operations:** Add, view, edit, toggle status (Pending/Completed), and delete farming activities.
- **Category Organization:** Categorize tasks into Sowing, Irrigation, Fertilizer, Pest Control, Weeding, and Harvesting.
- **Data Persistence:** Stored in SQLite so plans remain intact across system restarts.
- **Visual Analytics:** Interactive Recharts bar chart showing category distribution and a completion rate progress tracker.

### F. Farmer Profile & Preferences
- Manage Farmer Name/Nickname, State/Region, District, Preferred Language, Primary Crop, Soil Type, and Farm Size in acres.
- Changes immediately update the Dashboard and provide personalized context to the AI assistant.
- Zero sensitive personal data required.

### G. About the Project
- College capstone context, problem statement, full system architecture, and official agricultural references (ICAR, KVK, PM-KISAN, Soil Health Card).

---

## 4. Project Folder Structure

```
KrishiGen AI/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app initialization, CORS, router mounting
│   │   ├── config.py            # Environment variable configuration (.env)
│   │   ├── database.py          # SQLAlchemy SQLite connection and session management
│   │   ├── models.py            # SQLite database models (Profile, Activity, ChatHistory)
│   │   ├── schemas.py           # Pydantic request and response schemas
│   │   ├── data/
│   │   │   └── crops.json       # Crop guide database for Wheat, Rice, Tomato, Potato
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── ai_service.py    # Gemini Chat & Vision logic + intelligent Demo Mode
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── health.py        # System health & AI connection status endpoint
│   │       ├── profile.py       # Farmer profile GET & PUT endpoints
│   │       ├── activities.py    # Farming Planner CRUD & analytics endpoints
│   │       ├── crops.py         # Crop catalog & search endpoints
│   │       ├── assistant.py     # AI conversation endpoint with context injection
│   │       └── vision.py        # Leaf image analysis & sample cases endpoint
│   ├── tests/
│   │   └── test_api.py          # Pytest automated test suite (7 comprehensive tests)
│   ├── pytest.ini               # Pytest configuration
│   ├── requirements.txt         # Python package dependencies
│   ├── .env.example             # Backend environment template
│   └── krishigen.db             # Local SQLite database (auto-generated)
├── frontend/
│   ├── public/
│   │   └── sprout.svg           # Agricultural brand favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx       # Responsive layout with desktop sidebar & mobile bottom bar
│   │   │   ├── Navbar.jsx       # Header with greeting, seasonal pill, and language toggle
│   │   │   ├── Sidebar.jsx      # Desktop navigation drawer with helpline footer
│   │   │   └── DisclaimerBanner.jsx # KVK safety advisory banner
│   │   ├── context/
│   │   │   └── FarmerContext.jsx# React Context for profile, season, and translations
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Main overview dashboard
│   │   │   ├── Assistant.jsx    # Conversational AI assistant with context filters
│   │   │   ├── DiseaseDetection.jsx # Leaf photograph upload & diagnostic report
│   │   │   ├── CropGuide.jsx    # Scientific crop care guide & search
│   │   │   ├── Planner.jsx      # Farming task planner with Recharts analytics
│   │   │   ├── Profile.jsx      # Farmer profile and soil settings
│   │   │   └── About.jsx        # Project details, architecture, and references
│   │   ├── services/
│   │   │   └── api.js           # Centralized Axios API client
│   │   ├── App.jsx              # Main React root component and tab router
│   │   ├── index.css            # Tailwind directives and warm earthy color theme
│   │   └── main.jsx             # React entry point
│   ├── index.html               # HTML5 entry with metadata and Inter font
│   ├── package.json             # Frontend dependencies and npm scripts
│   ├── postcss.config.js        # PostCSS configuration for Tailwind
│   ├── tailwind.config.js       # Custom earthy green/wheat color palette
│   └── vite.config.js           # Vite development server configuration
├── .env.example                 # Root environment template
├── .gitignore                   # Ignores .env, venv, node_modules, and *.db
└── README.md                    # Complete project documentation
```

---

## 5. Prerequisites

Before running the application, make sure you have the following installed on Windows:
1. **Python 3.10 or higher** (Python 3.11 recommended). Verify with:
   ```powershell
   python --version
   ```
2. **Node.js (v18 or higher)** and npm. Verify with:
   ```powershell
   node --version
   npm --version
   ```

---

## 6. Installation & Run Commands (Windows PowerShell)

Follow these exact steps to set up and run the project locally.

### Step 1: Open Windows PowerShell
Navigate to the project root directory:
```powershell
cd "c:\Users\ASUS\Desktop\KrishiGen AI"
```

### Step 2: Set Up the Backend
1. Open a PowerShell terminal and move to the `backend` folder:
   ```powershell
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```
   *(Note: If PowerShell displays an Execution Policy warning, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` once).*

3. Install backend dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

4. Create your local environment file:
   ```powershell
   Copy-Item .env.example .env
   ```

5. Run automated backend tests to verify everything is working:
   ```powershell
   pytest -v tests
   ```

6. Start the FastAPI backend server:
   ```powershell
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   The backend will be running at: `http://127.0.0.1:8000`  
   Interactive API documentation (Swagger UI) is available at: `http://127.0.0.1:8000/docs`

---

### Step 3: Set Up the Frontend
1. Open a **second** PowerShell window and navigate to the `frontend` folder:
   ```powershell
   cd "c:\Users\ASUS\Desktop\KrishiGen AI\frontend"
   ```

2. Install frontend dependencies:
   ```powershell
   npm install
   ```

3. Start the Vite development server:
   ```powershell
   npm run dev
   ```

4. Open your web browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 7. How to Configure an AI API Key

KrishiGen AI is configured to use the Google Gemini API (`gemini-1.5-flash` for chat and vision analysis).

1. Get a free API key from **Google AI Studio**:  
   👉 [https://aistudio.google.com/](https://aistudio.google.com/)
2. Open the file `backend/.env` in any text editor:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-flash
   GEMINI_VISION_MODEL=gemini-1.5-flash
   ```
3. Save the file and restart the FastAPI backend server.
4. Refresh your browser. The top navigation bar will now display a green **"Live AI Active"** badge!

> **Security Guarantee:** The API key is stored only on your backend server and read via environment variables. It is **never** sent to the client browser or included in frontend JavaScript bundles.

---

## 8. How to Use Demo Mode (No API Key Required)

If you do not have an API key or prefer to run the application offline, KrishiGen AI automatically runs in **Demo Mode**:
- **Automatic Detection:** The backend detects that `GEMINI_API_KEY` is empty and activates the rule-based agricultural knowledge base.
- **Visible Badge:** The top navigation bar and chat bubble clearly display an amber **"Demo Mode"** badge so evaluators and users know live AI is unconfigured.
- **Interactive Chat Queries:** You can ask about:
  - *"गेहूं में पीला रतुआ (Yellow Rust) के लक्षण और उपचार"*
  - *"सिंचाई की सही अवस्थाएं (CRI stage)"*
  - *"DAP और यूरिया खाद की संतुलित मात्रा"*
  - *"टमाटर में पत्ती मरोड़ रोग (Leaf Curl Virus)"*
  - *"धान में झुलसा रोग (Rice Blast)"*
- **Interactive Disease Reference Cases:** On the Disease Analysis page, click any of the educational reference cards (*Wheat Stripe Rust*, *Rice Blast*, *Tomato Early Blight*) to inspect full symptoms, chemical treatments, and safety advisories without needing an image.

---

## 9. Beginner-Friendly Explanation of Main Files

- `backend/app/main.py`: The entry point for the Python server. It configures Cross-Origin Resource Sharing (CORS) so the React frontend can safely talk to the backend, creates SQLite tables automatically, and registers all API routes.
- `backend/app/services/ai_service.py`: The brain of the AI assistant. It checks if an API key exists; if yes, it securely calls the Gemini REST API via `httpx`. If not, it returns helpful pre-configured answers from the Indian farming knowledge base.
- `backend/app/models.py`: Defines the database tables for the farmer's profile, planned farming activities, and chat history using SQLAlchemy.
- `backend/app/data/crops.json`: A local JSON file containing research-backed agricultural data for Wheat, Rice, Tomato, and Potato. Any developer can add more crops simply by appending a new JSON object here.
- `frontend/src/context/FarmerContext.jsx`: A React Context provider that stores the farmer's state, selected language, and computes the current Indian farming season (Kharif, Rabi, Zaid) based on the calendar month.
- `frontend/src/services/api.js`: A clean Axios service layer that centralizes all HTTP requests between React and FastAPI.
- `frontend/src/pages/Dashboard.jsx`: The home page showing personalized greetings, seasonal advisories, quick tools, and saved activities.
- `frontend/src/pages/DiseaseDetection.jsx`: The leaf photo inspection page featuring drag-and-drop upload, image preview, validation, and diagnostic reports.

---

## 10. Known Limitations & Future Improvements

### Current Limitations:
1. **Vision Inference Scope:** Vision diagnosis depends on high-quality photographs with adequate lighting. Extremely blurry images or multi-leaf panoramas may yield ambiguous diagnoses.
2. **Offline Mode:** The application requires an internet connection when utilizing the live Gemini API; in rural areas with poor connectivity, it relies on Demo Mode.
3. **Language Coverage:** Currently optimized for Hindi, English, and Hinglish. Regional languages like Punjabi, Marathi, Telugu, and Bengali are not yet fully localized.

### Future Roadmap:
- **Speech-to-Speech Voice Notes:** Enabling voice input via Web Speech API or Whisper so farmers with limited literacy can speak their questions.
- **IoT Soil Sensor Integration:** Connecting low-cost Arduino/ESP32 NPK and moisture sensors to update the farming planner automatically.
- **Satellite Weather Alerts:** Integrating Indian Meteorological Department (IMD) / OpenWeather API for real-time district-level frost and thunderstorm warnings.
- **Regional Dialect Expansion:** Adding local dialects (Bhojpuri, Maithili, Haryanvi, Malwi).

---

## 11. Academic Integrity & Project Summary

This project was built from scratch as a practical **B.Tech Computer Science & Engineering (AI/ML)** capstone project. It showcases:
- Full-stack web architecture (FastAPI + React).
- Secure prompt engineering and API key handling.
- Defensive programming with automatic fallback mechanisms.
- Practical problem solving for Indian agriculture.

© 2026 KrishiGen AI. All agricultural references aligned with ICAR and KVK extension guidelines.

