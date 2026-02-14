import os
import math
import requests
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# -------------------------------
# Initialize App
# -------------------------------

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Dev only
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Load Gemini
# -------------------------------

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

# -------------------------------
# Schemas
# -------------------------------

class LocationRequest(BaseModel):
    latitude: float
    longitude: float

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

# -------------------------------
# Utility: Haversine Distance
# -------------------------------

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km

    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)

    a = (
        math.sin(dLat / 2) ** 2 +
        math.cos(math.radians(lat1)) *
        math.cos(math.radians(lat2)) *
        math.sin(dLon / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

# -------------------------------
# Nearest Hospital Endpoint
# -------------------------------

@app.post("/nearest-hospital")
def nearest_hospital(location: LocationRequest):

    overpass_url = "https://overpass-api.de/api/interpreter"

    query = f"""
    [out:json];
    node
      ["amenity"="hospital"]
      (around:5000,{location.latitude},{location.longitude});
    out;
    """

    response = requests.post(overpass_url, data=query)
    data = response.json()

    if not data.get("elements"):
        return {"name": "No hospital found nearby", "distance": 0}

    nearest = None
    min_distance = float("inf")

    for hospital in data["elements"]:
        dist = haversine(
            location.latitude,
            location.longitude,
            hospital["lat"],
            hospital["lon"]
        )

        if dist < min_distance:
            min_distance = dist
            nearest = hospital

    return {
        "name": nearest.get("tags", {}).get("name", "Unnamed Hospital"),
        "distance": round(min_distance, 2),
        "latitude": nearest["lat"],
        "longitude": nearest["lon"],
        "maps_url": f"https://www.google.com/maps/dir/?api=1&destination={nearest['lat']},{nearest['lon']}&travelmode=driving"
    }

# -------------------------------
# Gemini Chat Endpoint
# -------------------------------

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):

    prompt = f"""
    Answer using:

    - Very short bullet points
    - Maximum 5 points
    - Each point 1 sentence only
    - No paragraphs
    - No introduction or conclusion
    - Direct answer only

    Question:
    {request.message}
    """

    response = model.generate_content(prompt)

    return {"response": response.text}