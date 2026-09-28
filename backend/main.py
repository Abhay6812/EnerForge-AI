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

# Project root
BASE_DIR = Path(__file__).resolve().parent.parent

# Load trained model
model = joblib.load(BASE_DIR / "energy_model.pkl")
threshold = joblib.load(BASE_DIR / "energy_threshold.pkl")


# Input structure
class EnergyInput:
    pass


@app.get("/")
def home():
    return {
        "message": "EnerForge AI Backend is running!",
        "model_status": "Energy AI model loaded successfully"
    }


@app.post("/predict-energy")
def predict_energy(data: dict):

    features = [
        "hour",
        "day",
        "month",
        "day_of_week_num",
        "is_weekend",
        "is_peak_hour",
        "NSM",
        "Lagging_Current_Reactive.Power_kVarh",
        "Leading_Current_Reactive_Power_kVarh",
        "Lagging_Current_Power_Factor",
        "Leading_Current_Power_Factor"
    ]

    input_data = pd.DataFrame([{
        feature: data[feature]
        for feature in features
    }])

    actual_kwh = data["actual_kwh"]

    predicted_kwh = float(model.predict(input_data)[0])

    deviation = actual_kwh - predicted_kwh

    if predicted_kwh != 0:
        deviation_percent = (deviation / predicted_kwh) * 100
    else:
        deviation_percent = 0

    anomaly = deviation > threshold

    if not anomaly:
        severity = "Normal"
        recommendation = "Normal energy consumption."

    elif deviation_percent >= 40:
        severity = "High"
        recommendation = (
            "High energy deviation detected. "
            "Review machine loading, operating schedule and production activity."
        )

    elif deviation_percent >= 20:
        severity = "Medium"
        recommendation = (
            "Medium energy deviation detected. "
            "Inspect machine operating conditions and production activity."
        )

    else:
        severity = "Low"
        recommendation = (
            "Unexpected energy consumption detected. "
            "Inspect machine operating conditions."
        )

    return {
        "actual_kwh": round(actual_kwh, 2),
        "predicted_kwh": round(predicted_kwh, 2),
        "deviation_kwh": round(deviation, 2),
        "deviation_percent": round(deviation_percent, 2),
        "anomaly": bool(anomaly),
        "severity": severity,
        "recommendation": recommendation
    }

# ==============================
# MACHINE HEALTH / PREDICTIVE MAINTENANCE
# ==============================

import joblib
import pandas as pd
from pydantic import BaseModel

# Load Machine Health model
machine_health_model = joblib.load(
    BASE_DIR / "data" / "machine_health_model.pkl"
)

class MachineHealthInput(BaseModel):
    Type: str
    air_temperature: float
    process_temperature: float
    rotational_speed: float
    torque: float
    tool_wear: float


@app.post("/predict-machine-health")
def predict_machine_health(data: MachineHealthInput):

    input_data = pd.DataFrame([{
        "Type": data.Type,
        "Air temperature [K]": data.air_temperature,
        "Process temperature [K]": data.process_temperature,
        "Rotational speed [rpm]": data.rotational_speed,
        "Torque [Nm]": data.torque,
        "Tool wear [min]": data.tool_wear
    }])

    prediction = machine_health_model.predict(input_data)[0]

    probability = machine_health_model.predict_proba(
        input_data
    )[0][1]

    failure_risk = round(float(probability) * 100, 2)

    if failure_risk >= 70:
        status = "Critical"
        recommendation = "Immediate maintenance inspection recommended."

    elif failure_risk >= 40:
        status = "Warning"
        recommendation = "Schedule maintenance inspection soon."

    else:
        status = "Healthy"
        recommendation = "Machine operating within predicted normal range."

    return {
        "machine_failure": int(prediction),
        "failure_risk_percent": failure_risk,
        "status": status,
        "recommendation": recommendation
    }

# ==============================
# PRODUCTION INSIGHT / ENERGY PREDICTION
# ==============================

# Load Production Energy model
production_energy_model = joblib.load(
    BASE_DIR / "data" / "models" / "production_energy_model.pkl"
)


class ProductionEnergyInput(BaseModel):
    spindle_speed: float
    throughput_rate: float
    flow_rate: float
    motor_current: float
    production_volume: float
    cycle_time: float
    torque: float
    vibration: float
    acoustic_level: float
    machine_utilization: float
    resource_utilization: float
    material_feed_rate: float
    feed_pressure: float
    hydraulic_pressure: float
    motor_temperature: float
    bearing_temperature: float
    process_temperature: float
    coolant_temperature: float
    ambient_temperature: float
    humidity: float
    air_pressure: float
    actual_power_consumption: float



@app.post("/predict-production-energy")
def predict_production_energy(data: ProductionEnergyInput):

    input_data = pd.DataFrame([{
        "spindle_speed": data.spindle_speed,
        "throughput_rate": data.throughput_rate,
        "flow_rate": data.flow_rate,
        "motor_current": data.motor_current,
        "production_volume": data.production_volume,
        "cycle_time": data.cycle_time,
        "torque": data.torque,
        "vibration": data.vibration,
        "acoustic_level": data.acoustic_level,
        "machine_utilization": data.machine_utilization,
        "resource_utilization": data.resource_utilization,
        "material_feed_rate": data.material_feed_rate,
        "feed_pressure": data.feed_pressure,
        "hydraulic_pressure": data.hydraulic_pressure,
        "motor_temperature": data.motor_temperature,
        "bearing_temperature": data.bearing_temperature,
        "process_temperature": data.process_temperature,
        "coolant_temperature": data.coolant_temperature,
        "ambient_temperature": data.ambient_temperature,
        "humidity": data.humidity,
        "air_pressure": data.air_pressure
    }])

    predicted_power = float(
        production_energy_model.predict(input_data)[0]
    )
    actual_power = data.actual_power_consumption

    deviation = actual_power - predicted_power

    if predicted_power > 0:
        deviation_percent = (deviation / predicted_power) * 100
    else:
        deviation_percent = 0

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
    "recommendation": recommendation
}
# ==============================
# OPTIMIZATION HUB
# ==============================

optimization_features = [
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
    "air_pressure"
]


@app.post("/optimize-production")
def optimize_production(data: ProductionEnergyInput):

    # Convert input into dictionary
    current_data = data.model_dump()

    # ------------------------------
    # Current operating condition
    # ------------------------------

    current_input = pd.DataFrame([{
        feature: current_data[feature]
        for feature in optimization_features
    }])

    current_energy = float(
        production_energy_model.predict(current_input)[0]
    )

    # Best solution starts with current condition
    best_energy = current_energy
    best_settings = current_data.copy()

    # ------------------------------
    # Safe operating ranges
    # ------------------------------

    spindle_values = [
        current_data["spindle_speed"] * 0.95,
        current_data["spindle_speed"] * 0.975,
        current_data["spindle_speed"],
        current_data["spindle_speed"] * 1.025,
        current_data["spindle_speed"] * 1.05
    ]

    flow_values = [
        current_data["flow_rate"] * 0.97,
        current_data["flow_rate"] * 0.985,
        current_data["flow_rate"],
        current_data["flow_rate"] * 1.015,
        current_data["flow_rate"] * 1.03
    ]

    throughput_values = [
        current_data["throughput_rate"] * 0.99,
        current_data["throughput_rate"],
        current_data["throughput_rate"] * 1.01
    ]

    # ------------------------------
    # Optimization search
    # ------------------------------

    for spindle in spindle_values:

        for flow in flow_values:

            for throughput in throughput_values:

                test_data = current_data.copy()

                test_data["spindle_speed"] = spindle
                test_data["flow_rate"] = flow
                test_data["throughput_rate"] = throughput

                test_input = pd.DataFrame([{
                    feature: test_data[feature]
                    for feature in optimization_features
                }])

                predicted_energy = float(
                    production_energy_model.predict(test_input)[0]
                )

                # Production must remain within 1%
                production_change = abs(
                    throughput - current_data["throughput_rate"]
                ) / current_data["throughput_rate"]

                if production_change <= 0.01:

                    if predicted_energy < best_energy:

                        best_energy = predicted_energy
                        best_settings = test_data.copy()

    # ------------------------------
    # Calculate improvement
    # ------------------------------

    energy_reduction = (
        (current_energy - best_energy)
        / current_energy
    ) * 100

    # Prevent negative values
    energy_reduction = max(0, energy_reduction)

    # ------------------------------
    # Generate dynamic recommendation
    # ------------------------------

    recommendations = []

    if best_settings["spindle_speed"] < current_data["spindle_speed"]:
        recommendations.append(
            "Reduce spindle speed within the recommended operating range."
        )

    if best_settings["flow_rate"] < current_data["flow_rate"]:
        recommendations.append(
            "Reduce process flow rate while maintaining production conditions."
        )

    if best_settings["throughput_rate"] != current_data["throughput_rate"]:
        recommendations.append(
            "Maintain throughput close to the current production level."
        )

    if not recommendations:
        recommendations.append(
            "Current operating conditions are already close to the "
            "energy-efficient operating point."
        )

    return {
        "current_energy_kwh": round(current_energy, 2),

        "optimized_energy_kwh": round(
            best_energy, 2
        ),

        "energy_reduction_percent": round(
            energy_reduction, 2
        ),

        "current_spindle_speed": round(
            current_data["spindle_speed"], 2
        ),

        "recommended_spindle_speed": round(
            best_settings["spindle_speed"], 2
        ),

        "current_flow_rate": round(
            current_data["flow_rate"], 2
        ),

        "recommended_flow_rate": round(
            best_settings["flow_rate"], 2
        ),

        "current_throughput": round(
            current_data["throughput_rate"], 2
        ),

        "recommended_throughput": round(
            best_settings["throughput_rate"], 2
        ),

        "production_maintained": True,

        "recommendations": recommendations,

        "message": (
            "Optimization completed using the trained "
            "Production Insight energy model."
        )
    }