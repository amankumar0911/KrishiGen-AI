import io
import sys
from pathlib import Path

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "live_ai_configured" in data
    assert "database" in data

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "KrishiGen AI" in data["project"]

def test_get_and_update_profile():
    # 1. Get profile
    res_get = client.get("/api/profile")
    assert res_get.status_code == 200
    profile = res_get.json()
    assert "name" in profile
    assert "primary_crop" in profile

    # 2. Update profile
    update_payload = {
        "name": "Kisan Baldev Singh",
        "state": "Punjab (पंजाब)",
        "district": "Ludhiana",
        "primary_crop": "Wheat (गेहूं)",
        "preferred_language": "hi",
        "soil_type": "Alluvial Soil (जलोढ़ मिट्टी)",
        "farm_size_acres": 5.0
    }
    res_put = client.put("/api/profile", json=update_payload)
    assert res_put.status_code == 200
    updated = res_put.json()
    assert updated["name"] == "Kisan Baldev Singh"
    assert updated["district"] == "Ludhiana"
    assert updated["farm_size_acres"] == 5.0

def test_crops_guide_endpoints():
    # 1. Get all crops
    res = client.get("/api/crops")
    assert res.status_code == 200
    crops = res.json()
    assert len(crops) >= 4
    crop_ids = [c["id"] for c in crops]
    assert "wheat" in crop_ids
    assert "rice" in crop_ids
    assert "tomato" in crop_ids
    assert "potato" in crop_ids

    # 2. Get specific crop
    res_wheat = client.get("/api/crops/wheat")
    assert res_wheat.status_code == 200
    wheat = res_wheat.json()
    assert wheat["name_en"] == "Wheat"
    assert len(wheat["irrigation_schedule"]) > 0
    assert len(wheat["common_diseases"]) > 0

    # 3. Search crops
    res_search = client.get("/api/crops/search?q=rust")
    assert res_search.status_code == 200
    results = res_search.json()
    assert len(results) >= 1
    assert any(c["id"] == "wheat" for c in results)

def test_activities_crud_and_stats():
    # 1. Get activities
    res_list = client.get("/api/activities")
    assert res_list.status_code == 200
    activities = res_list.json()
    assert isinstance(activities, list)

    # 2. Create new activity
    new_act = {
        "title": "Neem Oil Spray for Whitefly",
        "crop": "Tomato",
        "category": "Pest Management",
        "activity_date": "2026-10-15",
        "status": "pending",
        "notes": "Spray 5ml/litre Neem oil in evening"
    }
    res_create = client.post("/api/activities", json=new_act)
    assert res_create.status_code == 201
    created = res_create.json()
    act_id = created["id"]
    assert created["title"] == new_act["title"]
    assert created["status"] == "pending"

    # 3. Toggle activity status
    res_toggle = client.patch(f"/api/activities/{act_id}/toggle")
    assert res_toggle.status_code == 200
    toggled = res_toggle.json()
    assert toggled["status"] == "completed"

    # 4. Check stats
    res_stats = client.get("/api/activities/stats")
    assert res_stats.status_code == 200
    stats = res_stats.json()
    assert "total" in stats
    assert "completed" in stats
    assert "category_distribution" in stats

    # 5. Delete activity
    res_delete = client.delete(f"/api/activities/{act_id}")
    assert res_delete.status_code == 204

def test_assistant_chat_and_history():
    # 1. Send farming chat message
    chat_payload = {
        "message": "गेहूं में पीला रतुआ के लक्षण और उपचार क्या हैं?",
        "crop_type": "Wheat (गेहूं)",
        "growth_stage": "Tillering",
        "language": "hi"
    }
    res_chat = client.post("/api/assistant/chat", json=chat_payload)
    assert res_chat.status_code == 200
    chat_data = res_chat.json()
    assert "reply" in chat_data
    assert len(chat_data["reply"]) > 20
    assert "is_demo" in chat_data
    assert "disclaimer" in chat_data

    # 2. Check history
    res_hist = client.get("/api/assistant/history")
    assert res_hist.status_code == 200
    hist = res_hist.json()
    assert len(hist) >= 2  # user message and assistant message

def test_vision_samples_and_upload():
    # 1. Get educational reference samples
    res_samples = client.get("/api/vision/samples")
    assert res_samples.status_code == 200
    samples = res_samples.json()
    assert len(samples) >= 3
    assert any("Rust" in s["disease_detected"] or "Blast" in s["disease_detected"] for s in samples)

    # 2. Upload dummy image to test file validation and analysis pipeline
    dummy_image = io.BytesIO(b"\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00\xFF\xDB\x00C\x00\xFF\xC0\x00\x11\x08\x00\x01\x00\x01\x01\x01\x11\x00\xFF\xC4\x00\x1F\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xFF\xDA\x00\x08\x01\x01\x00\x00?\x00\xbf\x00\xFF\xD9")
    
    response = client.post(
        "/api/vision/analyze",
        files={"file": ("test_leaf.jpg", dummy_image, "image/jpeg")}
    )
    assert response.status_code == 200
    result = response.json()
    assert "crop_name" in result
    assert "symptoms" in result
    assert "immediate_actions" in result
    assert "kvk_contact_advice" in result
