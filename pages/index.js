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

  // 파이 차트에 사용할 색상 배열
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

  // 전체 레이아웃: 왼쪽은 폼, 오른쪽은 결과 (2분할)
  const mainContainerStyle = {
    display: "flex",
    flexWrap: "wrap", // 모바일 대응
    backgroundColor: "black",
    color: "white",
    minHeight: "100vh",
    padding: "20px",
    boxSizing: "border-box",
  };

  // 왼쪽 폼 영역 스타일 (내용 중앙 정렬)
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

  // 오른쪽 결과 영역 스타일 (전체 결과 영역)
  const resultColumnStyle = {
    flex: "1",
    minWidth: "300px",
    borderLeft: "1px solid gray",
    paddingLeft: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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

  // 오른쪽 결과 영역 내부: 위쪽은 파이 차트, 아래쪽은 3열 그리드로 종목별 할당 퍼센트 표시
  const rightInnerContainerStyle = {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const chartContainerStyle = {
    width: "100%",
    maxWidth: "400px",
    height: "300px",
    marginBottom: "20px",
  };

  const allocationGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    width: "100%",
    maxWidth: "400px",
  };

  const allocationItemStyle = {
    textAlign: "center",
    backgroundColor: "#222",
    padding: "8px",
    borderRadius: "4px",
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
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    fontSize: "24px",
    fontWeight: "bold",
    color: "white",
  };

  // 스피너 스타일 (로딩 애니메이션)
  const spinnerStyle = {
    width: "50px",
    height: "50px",
    border: "6px solid #f3f3f3",
    borderTop: "6px solid #007bff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  };

  return (
    <div style={mainContainerStyle}>
      {loading && (
        <div style={loadingOverlayStyle}>
          <div style={spinnerStyle}></div>
          Optimizing...
          {/* JSX 스타일 태그로 keyframes 정의 */}
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* 왼쪽 폼 영역 */}
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

      {/* 오른쪽 결과 영역 */}
      <div style={resultColumnStyle}>
        <h2>Optimization Result</h2>
        {result ? (
          <div style={rightInnerContainerStyle}>
            {/* 상단: 파이 차트 */}
            <div style={chartContainerStyle}>
              {result.optimal_portfolio &&
              Object.keys(result.optimal_portfolio).length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
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
            {/* 하단: 종목 및 할당 퍼센트 3열 그리드 */}
            <div style={allocationGridStyle}>
              {result.optimal_portfolio &&
                Object.entries(result.optimal_portfolio).map(([ticker, percent]) => (
                  <div key={ticker} style={allocationItemStyle}>
                    <p style={{ margin: "4px 0", fontWeight: "bold" }}>{ticker}</p>
                    <p style={{ margin: "4px 0" }}>{percent}%</p>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <p>No optimization result yet.</p>
        )}
      </div>
    </div>
  );
}
