import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd

def get_allowed_origins():
    configured = os.getenv(
        "BACKEND_CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,https://enerforge-ai.vercel.app",
    )
    origins = [origin.strip() for origin in configured.split(",") if origin.strip()]
    return origins

app = FastAPI(title="EnerForge AI Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent

# Safe model loading
try:
    model = joblib.load(BASE_DIR / "energy_model.pkl")
    print("Loaded energy_model:", model)

    threshold = joblib.load(BASE_DIR / "energy_threshold.pkl")
    print("Loaded energy_threshold:", threshold)

except Exception as e:
    model, threshold = None, None
    print(f"Warning: Could not load energy models → {e}")

try:
    machine_health_model = joblib.load(BASE_DIR / "data" / "machine_health_model.pkl")
    print("Loaded machine_health_model:", machine_health_model)

except Exception as e:
    machine_health_model = None
    print(f"Warning: Could not load machine health model → {e}")

try:
    production_energy_model = joblib.load(BASE_DIR / "data" / "models" / "production_energy_model.pkl")
    print("Loaded production_energy_model:", production_energy_model)

except Exception as e:
    production_energy_model = None
    print(f"Warning: Could not load production energy model → {e}")


@app.get("/")
def root():
    return {
        "status": "online",
        "message": "EnerForge AI Backend is running"
    }


@app.get("/health")
def health():
    return {
        "backend": "online",
        "energy_model": model is not None,
        "machine_health_model": machine_health_model is not None,
        "production_energy_model": production_energy_model is not None
    }


@app.post("/predict-energy")
def predict_energy(data: dict):

    if model is None:
        return {
            "error": "Energy model is not loaded"
        }

    input_data = pd.DataFrame([data])

    prediction = model.predict(input_data)[0]

    actual = float(data.get("actual_kwh", 0))
    predicted = float(prediction)

    deviation = actual - predicted

    if threshold is not None:
        threshold_value = float(threshold)
    else:
        threshold_value = 0

    if deviation > threshold_value:
        severity = "High"
    elif deviation > 0:
        severity = "Medium"
    else:
        severity = "Normal"

    deviation_percent = (
        (deviation / predicted) * 100
        if predicted != 0
        else 0
    )

    return {
        "actual_kwh": round(actual, 2),
        "predicted_kwh": round(predicted, 2),
        "deviation_kwh": round(deviation, 2),
        "deviation_percent": round(deviation_percent, 2),
        "severity": severity,
        "recommendation": (
            "Investigate abnormal energy consumption."
            if severity != "Normal"
            else "Energy consumption is within expected range."
        )
    }


@app.post("/predict-machine-health")
def predict_machine_health(data: dict):

    if machine_health_model is None:
        return {
            "error": "Machine health model is not loaded"
        }

    input_data = pd.DataFrame([data])

    prediction = machine_health_model.predict(input_data)[0]

    if hasattr(machine_health_model, "predict_proba"):
        probability = machine_health_model.predict_proba(input_data)[0][1]
    else:
        probability = 0

    return {
        "machine_failure": int(prediction),
        "failure_probability": round(float(probability) * 100, 2),
        "status": (
            "Critical"
            if prediction == 1
            else "Healthy"
        )
    }