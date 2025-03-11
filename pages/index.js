// pages/index.js
import { useState, useEffect } from "react";
import { optimizePortfolio } from "../api";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function Home() {
  const [PER, setPER] = useState("medium");
  const [DividendYield, setDividendYield] = useState("medium");
  const [Beta, setBeta] = useState("medium");
  const [RSI, setRSI] = useState("medium");
  const [volume, setVolume] = useState("medium");
  const [Volatility, setVolatility] = useState("medium");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => timer && clearInterval(timer);
  }, [loading]);

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const data = await optimizePortfolio({
        PER,
        DividendYield,
        Beta,
        RSI,
        volume,
        Volatility,
      });
      setResult(data);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    }
    setLoading(false);
  };

  const pieData =
    result && result.optimal_portfolio
      ? Object.entries(result.optimal_portfolio).map(([name, value]) => ({
          name,
          value,
        }))
      : [];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28FD0",
    "#FF6699",
    "#33CCFF",
    "#66FF66",
  ];

  const mainContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    backgroundColor: "black",
    color: "white",
    minHeight: "100vh",
    padding: "20px",
    boxSizing: "border-box",
  };

  const formColumnStyle = {
    flex: "1",
    minWidth: "300px",
    marginRight: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  };

  const resultColumnStyle = {
    flex: "1",
    minWidth: "300px",
    borderLeft: "1px solid gray",
    paddingLeft: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };

  const formGroupStyle = {
    marginBottom: "10px",
    width: "100%",
    maxWidth: "300px",
  };

  const selectStyle = {
    marginLeft: "5px",
    padding: "5px",
    width: "100%",
    backgroundColor: "#333",
    color: "white",
    border: "1px solid #555",
    borderRadius: "4px",
  };

  const buttonStyle = {
    marginTop: "20px",
    padding: "12px 30px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s, transform 0.3s",
  };

  const allocationItemStyle = {
    padding: "10px",
    border: "1px solid gray",
    borderRadius: "5px",
  };

  const loadingOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  };

  return (
    <div style={mainContainerStyle}>
      {loading && (
        <div style={loadingOverlayStyle}>
          <div className="spinner"></div>
          <div style={{ marginTop: "20px", fontSize: "24px" }}>
            {formatTime(elapsedTime)}
          </div>
          <div style={{ marginTop: "10px", fontSize: "18px" }}>
            로딩에서 약 2분 소요
          </div>
        </div>
      )}

      <div style={formColumnStyle}>
        <h1>
          FinOptima<br />
          <small style={{ fontSize: "60%", fontWeight: "normal" }}>
            : Portfolio Optimization System
          </small>
        </h1>
        <div className="tooltip-container">
          <span className="info-icon">ℹ️</span>
          <div className="tooltip">
            이 시스템은 PER(주가수익비율), 배당수익률, 베타, RSI(상대강도지수),
            거래량, 변동성과 같은 요소를 기반으로 포트폴리오를 최적화합니다.
            <br />
            매개변수를 조정하고 "Optimize"를 클릭하면 포트폴리오 배분을 확인할 수 있습니다.
          </div>
        </div>

        {["PER", "Dividend Yield", "Beta", "RSI", "Volume", "Volatility"].map(
          (item, idx) => (
            <div key={idx} style={formGroupStyle}>
              <label>
                {item}:
                <select
                  value={eval(item.replace(" ", ""))}
                  onChange={(e) =>
                    eval(`set${item.replace(" ", "")}(e.target.value)`)
                  }
                  style={selectStyle}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
            </div>
        )}

        <button onClick={handleOptimize} style={buttonStyle}>
          Optimize
        </button>
      </div>

      <div style={resultColumnStyle}>
        {result ? (
          <>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#82ca9d"
                  label
                >
                  {pieData.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
              {pieData.map((entry) => (
                <div key={entry.name} style={allocationItemStyle}>
                  <strong>{entry.name}</strong>
                  <br />
                  {entry.value}%
                </div>
              ))}
            </div>
        </div>

        <button onClick={handleOptimize} style={buttonStyle}>
          Optimize
        </button>
      </div>
    </div>
  );
}
