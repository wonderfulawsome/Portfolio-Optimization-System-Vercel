// pages/index.js
import { useState } from "react";
import { optimizePortfolio } from "../api";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

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

  // 파이 차트에 사용할 데이터 배열 생성
  const pieData =
    result && result.optimal_portfolio
      ? Object.entries(result.optimal_portfolio).map(([name, value]) => ({
          name,
          value,
        }))
      : [];

  // 차트에 사용할 색상 배열
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

  // 스타일 정의
  const mainContainerStyle = {
    display: "flex",
    flexWrap: "wrap", // 모바일 대응
    backgroundColor: "black",
    color: "white",
    minHeight: "100vh",
    padding: "20px",
    boxSizing: "border-box",
  };

  // 왼쪽 영역: 파이 차트가 가운데 정렬되도록
  const chartColumnStyle = {
    flex: "1",
    minWidth: "300px",
    marginRight: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  // 오른쪽 영역: 텍스트(종목과 퍼센트)
  const textColumnStyle = {
    flex: "1",
    minWidth: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  // 폼 영역 스타일 (왼쪽 상단 고정)
  const formColumnStyle = {
    flex: "1 1 100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  };

  // 폼 내부 요소 스타일
  const formGroupStyle = {
    marginBottom: "10px",
    width: "100%",
    maxWidth: "300px",
    textAlign: "left",
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

  // 버튼 스타일 (세련되게)
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

  // 결과 영역 내부 2분할 스타일 (왼쪽: 차트, 오른쪽: 텍스트)
  const resultSplitStyle = {
    display: "flex",
    flexWrap: "wrap", // 모바일 대응
    justifyContent: "space-between",
    marginTop: "20px",
    width: "100%",
  };

  // 포트폴리오 텍스트 리스트 스타일
  const allocationListStyle = {
    width: "100%",
    textAlign: "center",
  };

  // 로딩(Optimizing...) 팝업 스타일
  const loadingOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    fontSize: "24px",
    fontWeight: "bold",
  };

  return (
    <div style={mainContainerStyle}>
      {loading && (
        <div style={loadingOverlayStyle}>
          Optimizing...
        </div>
      )}

      {/* 상단 폼 영역 */}
      <div style={formColumnStyle}>
        <h1>Portfolio Optimization System</h1>
        <div style={formGroupStyle}>
          <label>
            PER:
            <select
              value={PER}
              onChange={(e) => setPER(e.target.value)}
              style={selectStyle}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>
        <div style={formGroupStyle}>
          <label>
            Dividend Yield:
            <select
              value={DividendYield}
              onChange={(e) => setDividendYield(e.target.value)}
              style={selectStyle}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>
        <div style={formGroupStyle}>
          <label>
            Beta:
            <select
              value={Beta}
              onChange={(e) => setBeta(e.target.value)}
              style={selectStyle}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>
        <div style={formGroupStyle}>
          <label>
            RSI:
            <select
              value={RSI}
              onChange={(e) => setRSI(e.target.value)}
              style={selectStyle}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>
        <div style={formGroupStyle}>
          <label>
            Volume:
            <select
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              style={selectStyle}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>
        <div style={formGroupStyle}>
          <label>
            Volatility:
            <select
              value={Volatility}
              onChange={(e) => setVolatility(e.target.value)}
              style={selectStyle}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>
        <button onClick={handleOptimize} style={buttonStyle}>
          Optimize
        </button>
      </div>

      {/* 결과 영역: 왼쪽은 파이 차트, 오른쪽은 텍스트 목록 */}
      <div style={resultSplitStyle}>
        {/* 왼쪽: 파이 차트 */}
        <div style={chartColumnStyle}>
          {result && result.optimal_portfolio && Object.keys(result.optimal_portfolio).length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#82ca9d"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No portfolio data available.</p>
          )}
        </div>

        {/* 오른쪽: 종목 및 할당 퍼센트 텍스트 */}
        <div style={textColumnStyle}>
          <h3>Portfolio Allocation</h3>
          {result && result.optimal_portfolio && Object.keys(result.optimal_portfolio).length > 0 ? (
            <div style={allocationListStyle}>
              {Object.entries(result.optimal_portfolio).map(([ticker, percent]) => (
                <p key={ticker} style={{ margin: "4px 0" }}>
                  {ticker}: {percent}%
                </p>
              ))}
            </div>
          ) : (
            <p>No portfolio data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
