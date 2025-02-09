import { useState } from "react";
import { optimizePortfolio } from "../api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function Home() {
  // 각 변수별 상태
  const [PER, setPER] = useState("medium");
  const [DividendYield, setDividendYield] = useState("medium");
  const [Beta, setBeta] = useState("medium");
  const [RSI, setRSI] = useState("medium");
  const [volume, setVolume] = useState("medium");
  const [Volatility, setVolatility] = useState("medium");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 최적화 버튼 클릭 핸들러
  const handleOptimize = async () => {
    setLoading(true);
    try {
      const data = await optimizePortfolio({ PER, DividendYield, Beta, RSI, volume, Volatility });
      setResult(data);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    }
    setLoading(false);
  };

  // UI 스타일 정의
  const mainContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "black",
    color: "white",
    minHeight: "100vh",
    padding: "20px",
  };

  const formContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  };

  const selectStyle = {
    padding: "8px",
    borderRadius: "5px",
    backgroundColor: "#333",
    color: "white",
    border: "1px solid gray",
  };

  const buttonStyle = {
    marginTop: "10px",
    padding: "12px 25px",
    backgroundColor: "#003366",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "0.3s",
  };

  const buttonHoverStyle = {
    backgroundColor: "#0056b3",
  };

  const pieChartStyle = {
    width: "100%",
    height: "300px",
  };

  // 로딩 상태 표시
  if (loading) {
    return (
      <div style={mainContainerStyle}>
        <h1>Optimizing...</h1>
      </div>
    );
  }

  return (
    <div style={mainContainerStyle}>
      <h1>Portfolio Optimization System</h1>
      <div style={formContainerStyle}>
        {["PER", "DividendYield", "Beta", "RSI", "volume", "Volatility"].map((factor) => (
          <select key={factor} value={eval(factor)} onChange={(e) => eval(`set${factor}`)(e.target.value)} style={selectStyle}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        ))}
      </div>
      <button onClick={handleOptimize} style={buttonStyle}>Optimize</button>

      {result && (
        <div>
          <h2>Optimization Result</h2>
          <h3>Optimized Companies</h3>
          <ul>
            {result.optimized_companies.map((company, index) => (
              <li key={index}>{company}</li>
            ))}
          </ul>

          <h3>Portfolio Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={Object.entries(result.optimal_portfolio).map(([name, value]) => ({ name, value }))} cx="50%" cy="50%" outerRadius={100} fill="#82ca9d" label>
                {Object.keys(result.optimal_portfolio).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40'][index % 6]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
