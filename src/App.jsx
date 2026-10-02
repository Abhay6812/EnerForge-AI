import { useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

/* =========================================================
   OVERVIEW
========================================================= */

function Overview() {
  return (
    <>
      <section className="hero">
        <div className="hero-left">
          <div className="hero-symbol">↗</div>
          <div>
            <h2>
              Same production. <span>Less energy.</span>
            </h2>
            <p>
              EnerForge AI monitors energy, machines and production
              to improve factory efficiency.
            </p>
          </div>
        </div>

        <div className="hero-right">
          <label>PLANT PERFORMANCE</label>
          <strong>94%</strong>
          <p>overall efficiency</p>

          <div className="hero-progress">
            <div style={{ width: "94%" }}></div>
          </div>

          <small>
            <b>Plant operating normally</b>
          </small>
        </div>
      </section>

      <section className="kpis">
        <div className="kpi">
          <div className="kpi-icon green">ϟ</div>
          <div>
            <label>ENERGY CONSUMED</label>
            <h2>8,420 <small>kWh</small></h2>
            <p className="green-text">
              ↓ 8.4% <span>vs baseline</span>
            </p>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-icon blue">▥</div>
          <div>
            <label>PRODUCTION OUTPUT</label>
            <h2>5,000 <small>units</small></h2>
            <p className="blue-text">
              ◎ 100% <span>Target achieved</span>
            </p>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-icon green">⚙</div>
          <div>
            <label>MACHINE HEALTH</label>
            <h2>86<small>%</small></h2>
            <p className="green-text">
              3 <span>healthy machines</span>
            </p>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-icon orange">₹</div>
          <div>
            <label>ESTIMATED SAVINGS</label>
            <h2>₹12,450</h2>
            <p className="green-text">
              ↑ ₹2,140 <span>this week</span>
            </p>
          </div>
        </div>
      </section>

      <section className="middle">
        <div className="card chart-card">
          <div className="card-head">
            <div>
              <label>PLANT PERFORMANCE</label>
              <h3>Energy vs Production</h3>
            </div>
          </div>

          <div className="chart-insight">
            <div>✦</div>
            <span>
              <b>AI Insight</b>
              Plant production is on target while energy consumption
              remains below the established baseline.
            </span>
          </div>

          <div className="recommendation-grid">
            <div className="recommendation">
              <div className="rec-icon green">ϟ</div>
              <div>
                <strong>Energy Performance</strong>
                <p>Energy consumption is 8.4% below baseline.</p>
              </div>
            </div>

            <div className="recommendation">
              <div className="rec-icon blue">✓</div>
              <div>
                <strong>Production On Target</strong>
                <p>Current production target is being achieved.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card distribution">
          <div className="card-head">
            <div>
              <label>FACTORY STATUS</label>
              <h3>System Health</h3>
            </div>
          </div>

          <div className="recommendation">
            <div className="rec-icon green">✓</div>
            <div>
              <strong>Energy System</strong>
              <p>Operating normally</p>
            </div>
          </div>

          <div className="recommendation">
            <div className="rec-icon orange">!</div>
            <div>
              <strong>Machine System</strong>
              <p>1 machine requires attention</p>
            </div>
          </div>

          <div className="recommendation">
            <div className="rec-icon blue">✓</div>
            <div>
              <strong>Production</strong>
              <p>Target achieved</p>
            </div>
          </div>
        </div>

        <div className="card machines">
          <div className="card-head">
            <div>
              <label>AI COMMAND CENTER</label>
              <h3>Active Alerts</h3>
            </div>
          </div>

          <div className="machine">
            <div className="machine-icon">!</div>
            <div className="machine-name">
              <strong>Compressor 02</strong>
              <span>Energy deviation detected</span>
            </div>
          </div>

          <div className="machine">
            <div className="machine-icon">✓</div>
            <div className="machine-name">
              <strong>Production</strong>
              <span>Operating on target</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}


/* =========================================================
   ENERGY INTELLIGENCE
   YOUR COMPLETED MODULE
========================================================= */

function EnergyIntelligence() {
  const [energyData, setEnergyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runEnergyAnalysis = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/predict-energy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hour: 21,
          day: 15,
          month: 1,
          day_of_week_num: 2,
          is_weekend: 0,
          is_peak_hour: 0,
          NSM: 75600,
          "Lagging_Current_Reactive.Power_kVarh": 10.5,
          "Leading_Current_Reactive_Power_kVarh": 2.5,
          "Lagging_Current_Power_Factor": 85,
          "Leading_Current_Power_Factor": 90,
          actual_kwh: 47.63,
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      setEnergyData(data);
    } catch (err) {
      console.error("Energy AI Error:", err);

      setError(
        "Unable to connect to Energy AI backend. Make sure FastAPI is running on port 8000."
      );
    }

    setLoading(false);
  };

  const machines = [
    ["Motor Line 01", "Induction Motor", "94%", "Healthy"],
    ["Compressor 02", "Air Compressor", "71%", "Warning"],
    ["Furnace 01", "Industrial Furnace", "91%", "Healthy"],
    ["Motor Line 03", "Induction Motor", "88%", "Healthy"],
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-left">
          <div className="hero-symbol">↗</div>

          <div>
            <h2>
              Same production. <span>Less energy.</span>
            </h2>

            <p>
              EnerForge AI helps you reduce energy consumption
              without compromising production.
            </p>
          </div>
        </div>

        <div className="hero-right">
          <label>SEC IMPROVEMENT</label>

          <strong>15.0%</strong>

          <p>vs. baseline</p>

          <div className="hero-progress">
            <div></div>
          </div>

          <small>
            <b>1.68 kWh/unit</b>
            &nbsp; Current SEC
          </small>
        </div>
      </section>


      <section className="kpis">

        <div className="kpi">
          <div className="kpi-icon green">ϟ</div>

          <div>
            <label>ENERGY CONSUMED</label>

            <h2>
              8,420
              <small>kWh</small>
            </h2>

            <p className="green-text">
              ↓ 8.4%
              <span>vs baseline</span>
            </p>
          </div>
        </div>


        <div className="kpi">
          <div className="kpi-icon blue">▥</div>

          <div>
            <label>PRODUCTION OUTPUT</label>

            <h2>
              5,000
              <small>units</small>
            </h2>

            <p className="blue-text">
              ◎ 100%
              <span>Target Achieved</span>
            </p>
          </div>
        </div>


        <div className="kpi">
          <div className="kpi-icon green">◉</div>

          <div>
            <label>SPECIFIC ENERGY (SEC)</label>

            <h2>
              1.68
              <small>kWh/unit</small>
            </h2>

            <p className="green-text">
              ↓ 15.0%
              <span>improvement</span>
            </p>
          </div>
        </div>


        <div className="kpi">
          <div className="kpi-icon orange">₹</div>

          <div>
            <label>ESTIMATED SAVINGS</label>

            <h2>₹12,450</h2>

            <p className="green-text">
              ↑ ₹2,140
              <span>this week</span>
            </p>
          </div>
        </div>

      </section>


      <section className="middle">

        <div className="card chart-card">

          <div className="card-head">

            <div>
              <label>ENERGY ANALYTICS</label>
              <h3>Consumption Trend</h3>
            </div>

            <div className="legend">
              <span className="line green-line"></span>
              Energy

              <span className="line gray-line"></span>
              Baseline
            </div>

          </div>


          <div className="chart">

            <div className="chart-y">
              <span>500</span>
              <span>400</span>
              <span>300</span>
              <span>200</span>
              <span>100</span>
              <span>0</span>
            </div>


            <div className="chart-main">

              <div className="horizontal h1"></div>
              <div className="horizontal h2"></div>
              <div className="horizontal h3"></div>
              <div className="horizontal h4"></div>
              <div className="horizontal h5"></div>


              <svg
                viewBox="0 0 700 250"
                preserveAspectRatio="none"
              >

                <polyline
                  points="
                  0,190
                  35,180
                  70,160
                  105,145
                  140,130
                  175,145
                  210,170
                  245,155
                  280,140
                  315,95
                  350,100
                  385,115
                  420,135
                  455,125
                  490,85
                  525,95
                  560,110
                  595,105
                  630,75
                  665,95
                  700,65"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                />

                <polyline
                  points="
                  0,175
                  70,160
                  140,165
                  210,155
                  280,160
                  350,145
                  420,150
                  490,135
                  560,140
                  630,125
                  700,120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="8 8"
                  className="baseline"
                />

              </svg>


              <div className="chart-x">
                <span>06:00</span>
                <span>08:00</span>
                <span>10:00</span>
                <span>12:00</span>
                <span>14:00</span>
                <span>16:00</span>
                <span>18:00</span>
              </div>

            </div>

          </div>


          <div className="chart-insight">

            <div>✦</div>

            <span>
              <b>AI Insight</b>
              Energy consumption is{" "}
              <strong>12% lower</strong>
              than baseline while production remains on target.
            </span>

          </div>

        </div>


        <div className="card distribution">

          <div className="card-head">
            <div>
              <label>ENERGY DISTRIBUTION</label>
              <h3>By Equipment</h3>
            </div>
          </div>


          <div className="donut-row">

            <div className="donut">

              <div>
                <strong>8,420</strong>
                <span>kWh</span>
              </div>

            </div>


            <div className="distribution-list">

              <p>
                <i className="dot d1"></i>
                Motors
                <b>34%</b>
              </p>

              <p>
                <i className="dot d2"></i>
                Furnace
                <b>26%</b>
              </p>

              <p>
                <i className="dot d3"></i>
                Compressors
                <b>18%</b>
              </p>

              <p>
                <i className="dot d4"></i>
                Other
                <b>22%</b>
              </p>

            </div>

          </div>


          <button className="green-link">
            View detailed breakdown →
          </button>

        </div>


        <div className="card machines">

          <div className="card-head">

            <div>
              <label>ASSET INTELLIGENCE</label>
              <h3>Top Machine Health</h3>
            </div>

            <button className="green-link">
              View all →
            </button>

          </div>


          {machines.map((machine) => (

            <div
              className="machine"
              key={machine[0]}
            >

              <div className="machine-icon">
                ⚙
              </div>

              <div className="machine-name">

                <strong>{machine[0]}</strong>

                <span>{machine[1]}</span>

              </div>


              <div className="machine-health">

                <div>

                  <b>{machine[2]}</b>

                  <span
                    className={
                      machine[3] === "Warning"
                        ? "warning"
                        : "healthy"
                    }
                  >
                    ● {machine[3]}
                  </span>

                </div>


                <div className="health-bar">

                  <div
                    style={{
                      width: machine[2],
                    }}
                  ></div>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>


      <section className="bottom">

        <div className="card recommendations">

          <div className="card-head">

            <div>
              <label>ENERFORGE AI</label>
              <h3>AI Recommendations</h3>
            </div>

            <button
              className="green-link"
              onClick={runEnergyAnalysis}
              disabled={loading}
              style={{
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                opacity: loading
                  ? 0.6
                  : 1,
                border: "none",
                background: "transparent",
              }}
            >
              {loading
                ? "Analyzing..."
                : "Run AI Analysis →"}
            </button>

          </div>


          {error && (

            <div
              style={{
                marginBottom: "12px",
                padding: "8px 12px",
                borderRadius: "6px",
                background: "#fff1f0",
                color: "#b42318",
                fontSize: "12px",
              }}
            >
              {error}
            </div>

          )}


          {energyData && (

            <div
              style={{
                marginBottom: "15px",
                padding: "13px 15px",
                borderRadius: "8px",
                background: "#f5f8f6",
                border: "1px solid #e2e8e4",
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >

                <strong style={{ fontSize: "13px" }}>
                  Live Energy AI Analysis
                </strong>

                <span
                  style={{
                    padding: "4px 9px",
                    borderRadius: "20px",
                    fontSize: "10px",
                    fontWeight: "700",
                    background:
                      energyData.severity === "High"
                        ? "#fee4e2"
                        : energyData.severity === "Medium"
                        ? "#fff4cc"
                        : "#e8f5ee",
                    color:
                      energyData.severity === "High"
                        ? "#b42318"
                        : energyData.severity === "Medium"
                        ? "#8a5a00"
                        : "#176b4d",
                  }}
                >
                  {energyData.severity}
                </span>

              </div>


              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(3, 1fr)",
                  gap: "15px",
                  marginBottom: "10px",
                }}
              >

                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "10px",
                      color: "#667085",
                    }}
                  >
                    Actual Energy
                  </span>

                  <strong style={{ fontSize: "15px" }}>
                    {energyData.actual_kwh}
                  </strong>

                  <small> kWh</small>
                </div>


                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "10px",
                      color: "#667085",
                    }}
                  >
                    Expected Energy
                  </span>

                  <strong style={{ fontSize: "15px" }}>
                    {energyData.predicted_kwh}
                  </strong>

                  <small> kWh</small>
                </div>


                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "10px",
                      color: "#667085",
                    }}
                  >
                    Deviation
                  </span>

                  <strong
                    style={{
                      fontSize: "15px",
                      color:
                        energyData.anomaly
                          ? "#b42318"
                          : "#176b4d",
                    }}
                  >
                    {energyData.deviation_percent}%
                  </strong>
                </div>

              </div>


              <p
                style={{
                  margin: 0,
                  fontSize: "11px",
                  lineHeight: "1.5",
                  color: "#475467",
                }}
              >
                <b>AI Recommendation:</b>{" "}
                {energyData.recommendation}
              </p>

            </div>

          )}


          <div className="recommendation-grid">

            <div className="recommendation">

              <div className="rec-icon orange">
                !
              </div>

              <div>

                <strong>
                  Compressor 02 High Consumption
                </strong>

                <p>
                  Energy consumption is 12% above
                  its historical baseline.
                </p>

                <button>
                  Investigate →
                </button>

              </div>

            </div>


            <div className="recommendation">

              <div className="rec-icon green">
                ↗
              </div>

              <div>

                <strong>
                  Shift Non-critical Loads
                </strong>

                <p>
                  Moving selected loads to 18:00 can
                  reduce peak electricity cost.
                </p>

                <button>
                  Optimize Now →
                </button>

              </div>

            </div>


            <div className="recommendation">

              <div className="rec-icon blue">
                ✓
              </div>

              <div>

                <strong>
                  Production On Target
                </strong>

                <p>
                  Output is on target while SEC remains
                  below baseline.
                </p>

                <button>
                  View Details →
                </button>

              </div>

            </div>

          </div>

        </div>


        <div className="card sustainability">

          <div className="card-head">

            <div>
              <label>SUSTAINABILITY</label>
              <h3>Snapshot</h3>
            </div>

          </div>


          <div className="sustain-grid">

            <div>

              <span>♧</span>

              <strong>
                7.1
                <small>tCO₂</small>
              </strong>

              <p>Emissions this month</p>

              <b>
                ↓ 13.2% vs baseline
              </b>

            </div>


            <div>

              <span>♧</span>

              <strong>
                1.42
                <small>kg/unit</small>
              </strong>

              <p>CO₂ Intensity</p>

              <b>
                ↓ 11.8% vs baseline
              </b>

            </div>


            <div>

              <span>₹</span>

              <strong>₹68,240</strong>

              <p>Energy Cost</p>

              <small>This month</small>

            </div>

          </div>

        </div>

      </section>
    </>
  );
}


/* =========================================================
   MACHINE HEALTH
========================================================= */

const Health = () => {
  const [formData, setFormData] = useState({
    Type: "L",
    air_temperature: 298.2,
    process_temperature: 308.7,
    rotational_speed: 1408,
    torque: 46.3,
    tool_wear: 3
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const predictHealth = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/predict-machine-health`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        throw new Error("Machine Health API request failed");
      }

      const data = await response.json();
      setResult(data);

    } catch (err) {
      setError(
        "Unable to connect to Machine Health backend. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]:
        name === "Type"
          ? value
          : Number(value)
    });
  };

  return (
    <div className="module-page">

      <div className="module-header">
        <div>
          <h1>Machine Health</h1>
          <p>
            AI-powered predictive maintenance and machine failure detection
          </p>
        </div>

        <div className="module-status">
          ● AI Model Connected
        </div>
      </div>

      {/* Machine Input */}
      <div className="card machine-input-card">

        <h2>Machine Parameters</h2>

        <div className="machine-input-grid">

          <div>
            <label>Machine Type</label>
            <select
              name="Type"
              value={formData.Type}
              onChange={handleChange}
            >
              <option value="L">L - Low</option>
              <option value="M">M - Medium</option>
              <option value="H">H - High</option>
            </select>
          </div>

          <div>
            <label>Air Temperature (K)</label>
            <input
              type="number"
              name="air_temperature"
              value={formData.air_temperature}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Process Temperature (K)</label>
            <input
              type="number"
              name="process_temperature"
              value={formData.process_temperature}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Rotational Speed (rpm)</label>
            <input
              type="number"
              name="rotational_speed"
              value={formData.rotational_speed}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Torque (Nm)</label>
            <input
              type="number"
              name="torque"
              value={formData.torque}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Tool Wear (min)</label>
            <input
              type="number"
              name="tool_wear"
              value={formData.tool_wear}
              onChange={handleChange}
            />
          </div>

        </div>

        <button
          className="primary-btn"
          onClick={predictHealth}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Run Health Analysis"}
        </button>

        {error && (
          <p className="error-message">{error}</p>
        )}

      </div>

      {/* Prediction Result */}
      {result && (
        <div className="machine-result-grid">

          <div className="card health-score-card">
            <span>Failure Risk</span>
            <strong>{result.failure_risk_percent}%</strong>
          </div>

          <div className="card health-status-card">
            <span>Machine Status</span>
            <strong>{result.status}</strong>
          </div>

          <div className="card prediction-card">
            <span>Failure Prediction</span>
            <strong>
              {result.machine_failure === 1
                ? "Failure Risk Detected"
                : "No Failure Predicted"}
            </strong>
          </div>

        </div>
      )}

      {result && (
        <div className="card ai-recommendation">
          <h2>AI Maintenance Recommendation</h2>

          <p>
            {result.recommendation}
          </p>
        </div>
      )}

    </div>
  );
}


/* =========================================================
   PRODUCTION INSIGHT
========================================================= */

function MachineHealth() {
  const [formData, setFormData] = useState({
    Type: "L",
    air_temperature: 298.2,
    process_temperature: 308.7,
    rotational_speed: 1408,
    torque: 46.3,
    tool_wear: 3,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const predictHealth = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/predict-machine-health`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Machine Health AI Error:", err);

      setError(
        err instanceof Error
          ? `Machine Health request failed: ${err.message}`
          : "Machine Health request failed."
      );
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "Type" ? value : Number(value),
    });
  };

  const risk = result?.failure_risk_percent ?? 0;

  const riskColor =
    risk >= 70
      ? "#b42318"
      : risk >= 40
      ? "#a66a00"
      : "#00935f";

  const statusIcon =
    result?.status === "Critical"
      ? "!"
      : result?.status === "Warning"
      ? "!"
      : "✓";

  return (
    <>
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero">

        <div className="hero-left">

          <div className="hero-symbol">
            ⚙
          </div>

          <div>
            <h2>
              Predict failures. <span>Prevent downtime.</span>
            </h2>

            <p>
              EnerForge AI analyzes machine operating conditions
              to identify potential failure risks before breakdown.
            </p>
          </div>

        </div>


        <div className="hero-right">

          <label>AI FAILURE RISK</label>

          <strong>
            {result ? `${risk}%` : "--"}
          </strong>

          <p>
            {result
              ? `${result.status} machine condition`
              : "Run AI analysis"}
          </p>

          <div className="hero-progress">

            <div
              style={{
                width: `${Math.min(risk, 100)}%`,
                background: riskColor,
              }}
            ></div>

          </div>

          <small>
            <b>
              {result
                ? result.machine_failure === 1
                  ? "Potential failure detected"
                  : "Machine operating normally"
                : "AI model ready"}
            </b>
          </small>

        </div>

      </section>


      {/* =====================================================
          MACHINE KPIs
      ===================================================== */}

      <section className="kpis">

        <div className="kpi">

          <div className="kpi-icon green">
            ⚙
          </div>

          <div>

            <label>MACHINE STATUS</label>

            <h2>
              {result ? result.status : "Ready"}
            </h2>

            <p className="green-text">
              ● <span>AI monitored</span>
            </p>

          </div>

        </div>


        <div className="kpi">

          <div
            className="kpi-icon"
            style={{
              background:
                result && risk >= 40
                  ? "#fff4cc"
                  : "#e8f5ee",
              color: riskColor,
            }}
          >
            !
          </div>

          <div>

            <label>FAILURE RISK</label>

            <h2>
              {result ? `${risk}%` : "--"}
            </h2>

            <p
              style={{
                color: riskColor,
              }}
            >
              {result
                ? risk >= 70
                  ? "High risk"
                  : risk >= 40
                  ? "Moderate risk"
                  : "Low risk"
                : "Awaiting analysis"}
            </p>

          </div>

        </div>


        <div className="kpi">

          <div className="kpi-icon blue">
            ↻
          </div>

          <div>

            <label>ROTATIONAL SPEED</label>

            <h2>
              {formData.rotational_speed}
              <small>rpm</small>
            </h2>

            <p className="blue-text">
              Current operating value
            </p>

          </div>

        </div>


        <div className="kpi">

          <div className="kpi-icon orange">
            ◉
          </div>

          <div>

            <label>TOOL WEAR</label>

            <h2>
              {formData.tool_wear}
              <small>min</small>
            </h2>

            <p className="blue-text">
              Current tool wear
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          MAIN MACHINE HEALTH SECTION
      ===================================================== */}

      <section className="middle">

        {/* MACHINE PARAMETERS */}

        <div className="card chart-card">

          <div className="card-head">

            <div>

              <label>MACHINE MONITORING</label>

              <h3>
                Operating Parameters
              </h3>

            </div>

          </div>


          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(2, 1fr)",
              gap: "14px",
              marginTop: "18px",
            }}
          >

            <div className="machine-parameter">

              <label>Machine Type</label>

              <select
                name="Type"
                value={formData.Type}
                onChange={handleChange}
              >
                <option value="L">
                  L — Low
                </option>

                <option value="M">
                  M — Medium
                </option>

                <option value="H">
                  H — High
                </option>

              </select>

            </div>


            <div className="machine-parameter">

              <label>Air Temperature</label>

              <div className="parameter-input">

                <input
                  type="number"
                  name="air_temperature"
                  value={formData.air_temperature}
                  onChange={handleChange}
                />

                <span>K</span>

              </div>

            </div>


            <div className="machine-parameter">

              <label>Process Temperature</label>

              <div className="parameter-input">

                <input
                  type="number"
                  name="process_temperature"
                  value={formData.process_temperature}
                  onChange={handleChange}
                />

                <span>K</span>

              </div>

            </div>


            <div className="machine-parameter">

              <label>Rotational Speed</label>

              <div className="parameter-input">

                <input
                  type="number"
                  name="rotational_speed"
                  value={formData.rotational_speed}
                  onChange={handleChange}
                />

                <span>rpm</span>

              </div>

            </div>


            <div className="machine-parameter">

              <label>Torque</label>

              <div className="parameter-input">

                <input
                  type="number"
                  name="torque"
                  value={formData.torque}
                  onChange={handleChange}
                />

                <span>Nm</span>

              </div>

            </div>


            <div className="machine-parameter">

              <label>Tool Wear</label>

              <div className="parameter-input">

                <input
                  type="number"
                  name="tool_wear"
                  value={formData.tool_wear}
                  onChange={handleChange}
                />

                <span>min</span>

              </div>

            </div>

          </div>


          <button
            className="green-link machine-analysis-btn"
            onClick={predictHealth}
            disabled={loading}
          >
            {loading
              ? "Analyzing machine..."
              : "Run AI Health Analysis →"}
          </button>


          {error && (

            <div className="machine-error">
              {error}
            </div>

          )}

        </div>


        {/* AI RESULT */}

        <div className="card distribution">

          <div className="card-head">

            <div>

              <label>AI PREDICTION</label>

              <h3>
                Machine Condition
              </h3>

            </div>

          </div>


          <div className="machine-ai-result">

            <div
              className="machine-result-icon"
              style={{
                background:
                  result && risk >= 70
                    ? "#fee4e2"
                    : result && risk >= 40
                    ? "#fff4cc"
                    : "#e8f5ee",
                color: riskColor,
              }}
            >
              {result ? statusIcon : "?"}
            </div>


            <div>

              <strong>
                {result
                  ? result.status
                  : "Awaiting Analysis"}
              </strong>

              <p>
                {result
                  ? `${risk}% predicted failure risk`
                  : "Run the AI model to analyze this machine."}
              </p>

            </div>

          </div>


          <div className="machine-risk">

            <div>

              <span>
                Failure probability
              </span>

              <b
                style={{
                  color: riskColor,
                }}
              >
                {result ? `${risk}%` : "--"}
              </b>

            </div>


            <div className="health-bar">

              <div
                style={{
                  width: `${Math.min(risk, 100)}%`,
                  background: riskColor,
                }}
              ></div>

            </div>

          </div>


          <div className="machine-prediction">

            <span>Prediction</span>

            <strong>

              {result
                ? result.machine_failure === 1
                  ? "Failure Risk Detected"
                  : "No Failure Predicted"
                : "Not analyzed"}

            </strong>

          </div>

        </div>


        {/* MODEL INFORMATION */}

        <div className="card machines">

          <div className="card-head">

            <div>

              <label>MODEL INTELLIGENCE</label>

              <h3>
                Predictive Maintenance
              </h3>

            </div>

          </div>


          <div className="machine">

            <div className="machine-icon">
              ✓
            </div>

            <div className="machine-name">

              <strong>
                AI Model
              </strong>

              <span>
                Random Forest
              </span>

            </div>

            <div className="machine-health">

              <b>
                Active
              </b>

            </div>

          </div>


          <div className="machine">

            <div className="machine-icon">
              ⚙
            </div>

            <div className="machine-name">

              <strong>
                Training Data
              </strong>

              <span>
                AI4I 2020 Dataset
              </span>

            </div>

            <div className="machine-health">

              <b>
                10K
              </b>

            </div>

          </div>


          <div className="machine">

            <div className="machine-icon">
              ✓
            </div>

            <div className="machine-name">

              <strong>
                Failure Detection
              </strong>

              <span>
                ML classification
              </span>

            </div>

            <div className="machine-health">

              <b>
                Online
              </b>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          BOTTOM
      ===================================================== */}

      <section className="bottom">

        <div className="card recommendations">

          <div className="card-head">

            <div>

              <label>ENERFORGE AI</label>

              <h3>
                Maintenance Recommendation
              </h3>

            </div>

          </div>


          <div className="recommendation-grid">

            <div className="recommendation">

              <div className="rec-icon green">
                ✓
              </div>

              <div>

                <strong>
                  Machine Operating Normally
                </strong>

                <p>
                  The current operating conditions do not
                  indicate a significant predicted failure risk.
                </p>

              </div>

            </div>


            <div className="recommendation">

              <div className="rec-icon orange">
                !
              </div>

              <div>

                <strong>
                  Monitor Tool Wear
                </strong>

                <p>
                  Tool wear should be monitored because
                  increasing wear can contribute to machine failure.
                </p>

              </div>

            </div>


            <div className="recommendation">

              <div className="rec-icon blue">
                ⚙
              </div>

              <div>

                <strong>
                  Predictive Maintenance
                </strong>

                <p>
                  AI continuously evaluates machine operating
                  conditions to identify potential failure risk.
                </p>

              </div>

            </div>

          </div>


          {result && (

            <div className="ai-live-result">

              <span>
                AI Recommendation
              </span>

              <strong>
                {result.recommendation}
              </strong>

            </div>

          )}

        </div>


        <div className="card sustainability">

          <div className="card-head">

            <div>

              <label>MACHINE HEALTH</label>

              <h3>
                Health Snapshot
              </h3>

            </div>

          </div>


          <div className="sustain-grid">

            <div>

              <span>
                ⚙
              </span>

              <strong>
                {result
                  ? result.status
                  : "--"}
              </strong>

              <p>
                Current status
              </p>

            </div>


            <div>

              <span>
                !
              </span>

              <strong>
                {result
                  ? `${risk}%`
                  : "--"}
              </strong>

              <p>
                Failure risk
              </p>

            </div>


            <div>

              <span>
                ✓
              </span>

              <strong>
                {result
                  ? result.machine_failure === 1
                    ? "Alert"
                    : "Normal"
                  : "--"}
              </strong>

              <p>
                AI prediction
              </p>

            </div>

          </div>

        </div>

      </section>
    </>
  );
}


/* =========================================================
   OPTIMIZATION HUB
========================================================= */

function OptimizationHub() {
  return (
    <>
      <section className="hero">

        <div className="hero-left">

          <div className="hero-symbol">
            ↗
          </div>

          <div>
            <h2>
              Find the waste. <span>Take action.</span>
            </h2>

            <p>
              Optimization Hub converts EnerForge AI insights
              into practical energy-saving actions.
            </p>
          </div>

        </div>

        <div className="hero-right">

          <label>POTENTIAL SAVING</label>

          <strong>₹12,450</strong>

          <p>estimated opportunity</p>

          <div className="hero-progress">
            <div style={{ width: "72%" }}></div>
          </div>

        </div>

      </section>


      <section className="kpis">

        <div className="kpi">
          <div className="kpi-icon green">ϟ</div>

          <div>
            <label>CURRENT ENERGY</label>
            <h2>8,420 <small>kWh</small></h2>

            <p className="green-text">
              ↓ 8.4% <span>vs baseline</span>
            </p>
          </div>
        </div>


        <div className="kpi">
          <div className="kpi-icon blue">↗</div>

          <div>
            <label>OPTIMIZED ENERGY</label>
            <h2>7,760 <small>kWh</small></h2>

            <p className="green-text">
              ↓ 660 <span>kWh opportunity</span>
            </p>
          </div>
        </div>


        <div className="kpi">
          <div className="kpi-icon orange">₹</div>

          <div>
            <label>COST OPPORTUNITY</label>
            <h2>₹5,280</h2>

            <p className="green-text">
              per optimization cycle
            </p>
          </div>
        </div>


        <div className="kpi">
          <div className="kpi-icon green">✓</div>

          <div>
            <label>ACTIVE ACTIONS</label>
            <h2>3</h2>

            <p className="blue-text">
              AI <span>recommendations</span>
            </p>
          </div>
        </div>

      </section>


      <section className="bottom">

        <div className="card recommendations">

          <div className="card-head">

            <div>
              <label>ENERFORGE AI</label>
              <h3>Optimization Opportunities</h3>
            </div>

          </div>


          <div className="recommendation-grid">

            <div className="recommendation">

              <div className="rec-icon green">
                ↗
              </div>

              <div>
                <strong>Shift Non-critical Loads</strong>

                <p>
                  Move selected loads away from the
                  peak electricity period.
                </p>

                <button>
                  Apply Optimization →
                </button>
              </div>

            </div>


            <div className="recommendation">

              <div className="rec-icon orange">
                !
              </div>

              <div>
                <strong>Investigate Compressor 02</strong>

                <p>
                  Abnormal energy and machine-health
                  patterns indicate an optimization opportunity.
                </p>

                <button>
                  Investigate →
                </button>
              </div>

            </div>


            <div className="recommendation">

              <div className="rec-icon blue">
                ✓
              </div>

              <div>
                <strong>Reduce Idle Operation</strong>

                <p>
                  Identify machines operating without
                  productive output.
                </p>

                <button>
                  Analyze Idle Loads →
                </button>
              </div>

            </div>

          </div>

        </div>


        <div className="card sustainability">

          <div className="card-head">
            <div>
              <label>OPTIMIZATION</label>
              <h3>Potential Impact</h3>
            </div>
          </div>

          <div className="sustain-grid">

            <div>
              <span>ϟ</span>
              <strong>660</strong>
              <p>kWh potential saving</p>
            </div>

            <div>
              <span>₹</span>
              <strong>₹5,280</strong>
              <p>cost opportunity</p>
            </div>

            <div>
              <span>✓</span>
              <strong>3</strong>
              <p>recommended actions</p>
            </div>

          </div>

        </div>

      </section>
    </>
  );
}


/* =========================================================
   CARBON TRACKER
========================================================= */

function CarbonTracker() {
  return (
    <>
      <section className="hero">

        <div className="hero-left">

          <div className="hero-symbol">
            ♧
          </div>

          <div>
            <h2>
              Track energy. <span>Measure carbon.</span>
            </h2>

            <p>
              Carbon Tracker converts factory energy consumption
              into measurable environmental impact.
            </p>
          </div>

        </div>

        <div className="hero-right">

          <label>CO₂ REDUCTION</label>

          <strong>13.2%</strong>

          <p>vs. baseline</p>

          <div className="hero-progress">
            <div style={{ width: "76%" }}></div>
          </div>

        </div>

      </section>


      <section className="kpis">

        <div className="kpi">

          <div className="kpi-icon green">
            ♧
          </div>

          <div>
            <label>MONTHLY EMISSIONS</label>

            <h2>
              7.1
              <small>tCO₂</small>
            </h2>

            <p className="green-text">
              ↓ 13.2% <span>vs baseline</span>
            </p>
          </div>

        </div>


        <div className="kpi">

          <div className="kpi-icon blue">
            ◉
          </div>

          <div>
            <label>CO₂ INTENSITY</label>

            <h2>
              1.42
              <small>kg/unit</small>
            </h2>

            <p className="green-text">
              ↓ 11.8% <span>improvement</span>
            </p>
          </div>

        </div>


        <div className="kpi">

          <div className="kpi-icon green">
            ϟ
          </div>

          <div>
            <label>ENERGY SAVED</label>

            <h2>
              660
              <small>kWh</small>
            </h2>

            <p className="green-text">
              This period
            </p>
          </div>

        </div>


        <div className="kpi">

          <div className="kpi-icon orange">
            ₹
          </div>

          <div>
            <label>ENERGY COST</label>

            <h2>₹68,240</h2>

            <p className="blue-text">
              <span>This month</span>
            </p>
          </div>

        </div>

      </section>


      <section className="middle">

        <div className="card chart-card">

          <div className="card-head">

            <div>
              <label>CARBON ANALYTICS</label>
              <h3>Emission Performance</h3>
            </div>

          </div>

          <div className="chart-insight">

            <div>♧</div>

            <span>
              <b>AI Insight</b>
              Lower energy consumption is contributing to
              a measurable reduction in plant carbon intensity.
            </span>

          </div>


          <div className="recommendation-grid">

            <div className="recommendation">

              <div className="rec-icon green">
                ↓
              </div>

              <div>
                <strong>13.2% Lower Emissions</strong>

                <p>
                  Monthly emissions are below the established
                  baseline.
                </p>
              </div>

            </div>


            <div className="recommendation">

              <div className="rec-icon blue">
                ◉
              </div>

              <div>
                <strong>Lower CO₂ Intensity</strong>

                <p>
                  Each production unit requires less carbon
                  than the baseline.
                </p>
              </div>

            </div>

          </div>

        </div>


        <div className="card distribution">

          <div className="card-head">

            <div>
              <label>ENVIRONMENTAL IMPACT</label>
              <h3>Current Status</h3>
            </div>

          </div>

          <div className="recommendation">

            <div className="rec-icon green">
              ✓
            </div>

            <div>
              <strong>Energy Efficiency Improving</strong>

              <p>
                Reduced energy consumption is lowering
                associated emissions.
              </p>
            </div>

          </div>

          <div className="recommendation">

            <div className="rec-icon green">
              ↓
            </div>

            <div>
              <strong>Carbon Intensity Reduced</strong>

              <p>
                CO₂ per production unit has decreased.
              </p>
            </div>

          </div>

        </div>


        <div className="card machines">

          <div className="card-head">

            <div>
              <label>CARBON SNAPSHOT</label>
              <h3>Monthly Impact</h3>
            </div>

          </div>

          <div className="machine">

            <div className="machine-icon">
              ♧
            </div>

            <div className="machine-name">
              <strong>Emissions</strong>
              <span>Current month</span>
            </div>

            <div className="machine-health">
              <b>7.1 tCO₂</b>
            </div>

          </div>


          <div className="machine">

            <div className="machine-icon">
              ↓
            </div>

            <div className="machine-name">
              <strong>Reduction</strong>
              <span>Compared with baseline</span>
            </div>

            <div className="machine-health">
              <b>13.2%</b>
            </div>

          </div>

        </div>

      </section>
    </>
  );
}


/* =========================================================
   REPORTS & ANALYTICS
========================================================= */

function ReportsAnalytics() {
  return (
    <>
      <section className="hero">

        <div className="hero-left">

          <div className="hero-symbol">
            ▤
          </div>

          <div>
            <h2>
              Understand performance. <span>Track improvement.</span>
            </h2>

            <p>
              Reports & Analytics brings energy, production,
              machine and carbon information together.
            </p>
          </div>

        </div>

        <div className="hero-right">

          <label>REPORT PERIOD</label>

          <strong>30</strong>

          <p>days of plant data</p>

          <div className="hero-progress">
            <div style={{ width: "100%" }}></div>
          </div>

        </div>

      </section>


      <section className="kpis">

        <div className="kpi">
          <div className="kpi-icon green">ϟ</div>

          <div>
            <label>ENERGY</label>
            <h2>8,420 <small>kWh</small></h2>

            <p className="green-text">
              ↓ 8.4% <span>vs baseline</span>
            </p>
          </div>
        </div>


        <div className="kpi">
          <div className="kpi-icon blue">▥</div>

          <div>
            <label>PRODUCTION</label>
            <h2>5,000 <small>units</small></h2>

            <p className="blue-text">
              100% <span>target</span>
            </p>
          </div>
        </div>


        <div className="kpi">
          <div className="kpi-icon green">◉</div>

          <div>
            <label>SEC</label>
            <h2>1.68 <small>kWh/unit</small></h2>

            <p className="green-text">
              ↓ 15% <span>improvement</span>
            </p>
          </div>
        </div>


        <div className="kpi">
          <div className="kpi-icon orange">₹</div>

          <div>
            <label>SAVINGS</label>
            <h2>₹12,450</h2>

            <p className="green-text">
              Current period
            </p>
          </div>
        </div>

      </section>


      <section className="bottom">

        <div className="card recommendations">

          <div className="card-head">

            <div>
              <label>REPORT CENTER</label>
              <h3>Available Reports</h3>
            </div>

          </div>


          <div className="recommendation-grid">

            <div className="recommendation">

              <div className="rec-icon green">
                ϟ
              </div>

              <div>
                <strong>Energy Performance Report</strong>

                <p>
                  Energy consumption, baseline, SEC and
                  savings analysis.
                </p>

                <button>
                  Generate Report →
                </button>
              </div>

            </div>


            <div className="recommendation">

              <div className="rec-icon blue">
                ⚙
              </div>

              <div>
                <strong>Machine Health Report</strong>

                <p>
                  Machine health, warnings, anomalies and
                  maintenance recommendations.
                </p>

                <button>
                  Generate Report →
                </button>
              </div>

            </div>


            <div className="recommendation">

              <div className="rec-icon green">
                ♧
              </div>

              <div>
                <strong>Sustainability Report</strong>

                <p>
                  CO₂ emissions, carbon intensity and
                  environmental impact.
                </p>

                <button>
                  Generate Report →
                </button>
              </div>

            </div>

          </div>

        </div>


        <div className="card sustainability">

          <div className="card-head">

            <div>
              <label>ANALYTICS</label>
              <h3>Monthly Snapshot</h3>
            </div>

          </div>


          <div className="sustain-grid">

            <div>
              <span>ϟ</span>
              <strong>8.4%</strong>
              <p>Energy improvement</p>
            </div>

            <div>
              <span>◉</span>
              <strong>15%</strong>
              <p>SEC improvement</p>
            </div>

            <div>
              <span>₹</span>
              <strong>₹12.4K</strong>
              <p>Estimated savings</p>
            </div>

          </div>

        </div>

      </section>
    </>
  );
}


/* =========================================================
   OPTIMIZATION HUB ETC. ARE NOW SEPARATE MODULES
========================================================= */


/* =========================================================
   MAIN APP
========================================================= */

function App() {

  const [active, setActive] = useState("Overview");

  const modules = [
    { name: "Energy Intelligence", icon: "ϟ" },
    { name: "Machine Health", icon: "⚙" },
    { name: "Production Insight", icon: "▥" },
    { name: "Optimization Hub", icon: "↗" },
    { name: "Carbon Tracker", icon: "♧" },
    { name: "Reports & Analytics", icon: "▤" },
  ];


  return (

    <div className="app">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="brand">

          <div className="logo">
            EF
          </div>

          <div>
            <h2>EnerForge AI</h2>
            <span>AI Energy Intelligence</span>
          </div>

        </div>


        <div className="plant">

          <label>ACTIVE PLANT</label>

          <h3>
            Demo Foundry
          </h3>

          <p>
            <i></i> System Online
          </p>

        </div>


        <div className="nav-title">
          ENERFORGE MODULES
        </div>


        <nav>

          <button
            className={
              active === "Overview"
                ? "active"
                : ""
            }
            onClick={() =>
              setActive("Overview")
            }
          >
            <b>▦</b>
            Overview
          </button>


          {modules.map((module) => (

            <button
              key={module.name}
              className={
                active === module.name
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActive(module.name)
              }
            >
              <b>{module.icon}</b>
              {module.name}
            </button>

          ))}

        </nav>


        <div className="ai-status">

          <div className="ai-icon">
            ⚙
          </div>

          <div>

            <strong>
              AI Engine Status
            </strong>

            <p>
              <i></i> Active
            </p>

            <span>
              Monitoring plant data
            </span>

          </div>

        </div>

      </aside>


      {/* ================= MAIN ================= */}

      <main className="main">


        {/* HEADER */}

        <header className="header">

          <div>

            <div className="breadcrumb">
              PLANT / DASHBOARD
            </div>

            <h1>
              {active}
            </h1>

            <p>
              {active === "Overview"
                ? "Real-time overview of your plant performance"
                : `Monitor and analyze ${active.toLowerCase()}`}
            </p>

          </div>


          <div className="header-right">

            <div className="live">
              <i></i>
              LIVE DATA
            </div>


            <button className="bell">
              ♧
              <span>3</span>
            </button>


            <div className="user">

              <div className="avatar">
                PM
              </div>

              <div>
                <strong>
                  Plant Manager
                </strong>

                <span>
                  Administrator
                </span>
              </div>

            </div>


            <b className="arrow">
              ⌄
            </b>

          </div>

        </header>


        {/* ================= MODULE CONTENT ================= */}

        <div className="content">


          {active === "Overview" && (
            <Overview />
          )}


          {active === "Energy Intelligence" && (
            <EnergyIntelligence />
          )}


          {active === "Production Insight" && (
            <ProductionInsight />
          )}


          {active === "Machine Health" && (
            <MachineHealth />
          )}


          


          {active === "Optimization Hub" && (
            <OptimizationHub />
          )}


          {active === "Carbon Tracker" && (
            <CarbonTracker />
          )}


          {active === "Reports & Analytics" && (
            <ReportsAnalytics />
          )}


        </div>

      </main>

    </div>
  );
}
function ProductionInsight() {
  const [formData, setFormData] = useState({
    actual_power_consumption: 20.16,
    spindle_speed: 3076.6,
    throughput_rate: 113.73,
    flow_rate: 69.30,
    motor_current: 24.55,
    production_volume: 125.27,
    cycle_time: 34.81,
    torque: 47.10,
    vibration: 1.00,
    acoustic_level: 74.64,
    machine_utilization: 78.89,
    resource_utilization: 92.71,
    material_feed_rate: 94.06,
    feed_pressure: 82.12,
    hydraulic_pressure: 147.14,
    motor_temperature: 52.97,
    bearing_temperature: 72.15,
    process_temperature: 72.70,
    coolant_temperature: 22.57,
    ambient_temperature: 24.66,
    humidity: 69.27,
    air_pressure: 102.34
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value)
    });
  };

  const predictProductionEnergy = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/predict-production-energy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Prediction failed");
      }

      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Unable to connect to Production Energy AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="module-page">

      <div className="module-header">
        <div>
          <div className="module-title">Production Insight</div>
          <div className="module-subtitle">
            AI-powered production energy analysis
          </div>
        </div>
      </div>

      <div className="machine-input-card">

        <div className="module-section-title">
          Production Conditions
        </div>

        <div className="machine-input-grid">

          {Object.entries(formData).map(([key, value]) => (
            <div className="input-group" key={key}>
              <label>
                {key.replaceAll("_", " ")}
              </label>

              <input
                type="number"
                step="any"
                name={key}
                value={value}
                onChange={handleChange}
              />
            </div>
          ))}

        </div>

        <button
          className="primary-btn"
          onClick={predictProductionEnergy}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Production"}
        </button>

      </div>

      {result && (
  <div className="machine-result-grid">

    <div className="card">
      <div className="kpi-label">
        Actual Power
      </div>

      <div className="kpi-value">
        {result.actual_power_consumption} kWh
      </div>

      <div className="kpi-change">
        Measured consumption
      </div>
    </div>

    <div className="card">
      <div className="kpi-label">
        AI Predicted Power
      </div>

      <div className="kpi-value">
        {result.predicted_power_consumption} kWh
      </div>

      <div className="kpi-change">
        Expected baseline
      </div>
    </div>

    <div className="card">
      <div className="kpi-label">
        Energy Deviation
      </div>

      <div className="kpi-value">
        {result.deviation_percent}%
      </div>

      <div className="kpi-change">
        {result.deviation_kwh} kWh difference
      </div>
    </div>

    <div className="card">
      <div className="kpi-label">
        Energy Status
      </div>

      <div className="kpi-value">
        {result.energy_status}
      </div>

      <div className="kpi-change">
        AI production analysis
      </div>
    </div>

    <div className="card ai-recommendation">
      <div className="kpi-label">
        AI Recommendation
      </div>

      <p>
        {result.recommendation}
      </p>
    </div>

  </div>
)}

    </div>
  );
}

export default App;