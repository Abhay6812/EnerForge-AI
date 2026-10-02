import os
import shutil
from pathlib import Path
from urllib.parse import quote
from urllib.request import urlopen
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
energy_model_path = BASE_DIR / "energy_model.pkl"
energy_threshold_path = BASE_DIR / "energy_threshold.pkl"
machine_health_model_path = BASE_DIR / "data" / "machine_health_model.pkl"
production_energy_model_path = BASE_DIR / "data" / "models" / "production_energy_model.pkl"
MODEL_CACHE_DIR = Path(os.getenv("MODEL_CACHE_DIR", "/tmp/enerforge-models"))
LFS_MEDIA_BASE_URL = os.getenv(
    "MODEL_LFS_BASE_URL",
    "https://media.githubusercontent.com/media/Abhay6812/EnerForge-AI/main",
)


def load_model(path: Path):
    with path.open("rb") as model_file:
        is_lfs_pointer = model_file.read(128).startswith(
            b"version https://git-lfs.github.com/spec/v1"
        )

    if not is_lfs_pointer:
        return joblib.load(path)

    relative_path = path.relative_to(BASE_DIR).as_posix()
    cached_path = MODEL_CACHE_DIR / relative_path
    cached_path.parent.mkdir(parents=True, exist_ok=True)

    if not cached_path.is_file():
        download_path = cached_path.with_name(cached_path.name + ".download")
        download_url = f"{LFS_MEDIA_BASE_URL}/{quote(relative_path, safe='/')}"
        with urlopen(download_url, timeout=120) as response:
            with download_path.open("wb") as downloaded_model:
                shutil.copyfileobj(response, downloaded_model)
        download_path.replace(cached_path)

    return joblib.load(cached_path)

# Safe model loading
try:
    model = load_model(energy_model_path)
    print("Loaded energy_model:", model)

    threshold = load_model(energy_threshold_path)
    print("Loaded energy_threshold:", threshold)

except Exception as e:
    model, threshold = None, None
    print(
        f"Warning: Could not load energy models from {energy_model_path} "
        f"and {energy_threshold_path}: {type(e).__name__} {e!r}",
        flush=True,
    )

try:
    machine_health_model = load_model(machine_health_model_path)
    print("Loaded machine_health_model:", machine_health_model)

except Exception as e:
    machine_health_model = None
    print(
        f"Warning: Could not load machine health model from {machine_health_model_path}: "
        f"{type(e).__name__} {e!r}",
        flush=True,
    )

try:
    production_energy_model = load_model(production_energy_model_path)
    print("Loaded production_energy_model:", production_energy_model)

except Exception as e:
    production_energy_model = None
    print(
        f"Warning: Could not load production energy model from {production_energy_model_path}: "
        f"{type(e).__name__} {e!r}",
        flush=True,
    )


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

    input_data = pd.DataFrame([{
        "Type": data["Type"],
        "Air temperature [K]": data["air_temperature"],
        "Process temperature [K]": data["process_temperature"],
        "Rotational speed [rpm]": data["rotational_speed"],
        "Torque [Nm]": data["torque"],
        "Tool wear [min]": data["tool_wear"],
    }])

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


@app.post("/predict-production-energy")
def predict_production_energy(data: dict):
    if production_energy_model is None:
        return {"error": "Production energy model is not loaded"}

    features = [
        "spindle_speed",
        "throughput_rate",
        "flow_rate",
        "motor_current",
        "production_volume",
        "cycle_time",
        "torque",
        "vibration",
        "acoustic_level",
        "machine_utilization",
        "resource_utilization",
        "material_feed_rate",
        "feed_pressure",
        "hydraulic_pressure",
        "motor_temperature",
        "bearing_temperature",
        "process_temperature",
        "coolant_temperature",
        "ambient_temperature",
        "humidity",
        "air_pressure",
    ]
    input_data = pd.DataFrame([{feature: data[feature] for feature in features}])
    predicted_power = float(production_energy_model.predict(input_data)[0])
    actual_power = float(data["actual_power_consumption"])
    deviation = actual_power - predicted_power
    deviation_percent = (deviation / predicted_power) * 100 if predicted_power > 0 else 0

    if deviation_percent >= 15:
        energy_status = "High Energy Waste"
        recommendation = (
            "Energy consumption is significantly above the AI baseline. "
            "Review spindle speed, throughput, machine loading and operating conditions."
        )
    elif deviation_percent >= 5:
        energy_status = "Attention Required"
        recommendation = (
            "Energy consumption is moderately above the AI baseline. "
            "Check machine loading and process operating conditions."
        )
    else:
        energy_status = "Efficient"
        recommendation = (
            "Energy consumption is close to the AI baseline for the current "
            "production conditions."
        )

    return {
        "actual_power_consumption": round(actual_power, 2),
        "predicted_power_consumption": round(predicted_power, 2),
        "deviation_kwh": round(deviation, 2),
        "deviation_percent": round(deviation_percent, 2),
        "energy_status": energy_status,
        "unit": "kWh",
        "recommendation": recommendation,
    }