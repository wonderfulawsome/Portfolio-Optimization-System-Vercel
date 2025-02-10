// pages/index.js
import { useState } from "react";
import { optimizePortfolio } from "../api";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

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

  // 색상 배열
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

  // 오른쪽 결과 영역 스타일
  const resultColumnStyle = {
    flex: "1",
    minWidth: "300px",
    borderLeft: "1px solid gray",
    paddingLeft: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };

  // 폼 내부 요소 스타일
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

  // 버튼 스타일 (세련된 hover 효과 포함)
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

  // 결과 영역(오른쪽) 내부를 위/아래로 분할: 위쪽은 파이 차트, 아래쪽은 종목 및 비율 리스트(3분할로 나누어 배치)
  const resultUpperStyle = {
    width: "100%",
    height: "300px",
  };

  const resultLowerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: "20px",
  };

  const allocationItemStyle = {
    flex: "1 1 30%",
    margin: "10px",
    textAlign: "center",
    border: "1px solid gray",
    borderRadius: "5px",
    padding: "10px",
  };

  // 로딩(Optimizing...) 팝업 스타일 (애니메이션 포함)
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
    animation: "pulse 1s infinite",
  };

  // 설명 아이콘 및 툴팁 스타일 (styled-jsx 사용)
  // 만약 styled-jsx 사용이 불편하다면 CSS Modules 또는 다른 CSS 솔루션을 사용할 수 있습니다.
  return (
    <div style={mainContainerStyle}>
      {loading && (
        <div style={loadingOverlayStyle}>
          Optimizing...
        </div>
      )}

      {/* 왼쪽 폼 영역 */}
      <div style={formColumnStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <h1>Portfolio Optimization System</h1>
          <div className="tooltip-container">
            <span className="info-icon">ℹ️</span>
            <div className="tooltip">
              이 시스템은 PER(주가수익비율), 배당수익률, 베타, RSI(상대강도지수), 거래량, 변동성과 같은 다양한 요소를 기반으로 포트폴리오를 최적화합니다. <br />
              이러한 매개변수들을 조정하고 "Optimize" 버튼을 클릭하면 최적의 포트폴리오 배분을 확인할 수 있습니다.
            </div>
          </div>
        </div>
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

      {/* 오른쪽 결과 영역: 위쪽 파이 차트, 아래쪽 3분할 종목/비율 리스트 */}
      <div style={resultColumnStyle}>
        <h2 style={{ textAlign: "center" }}>Optimization Result</h2>
        {result ? (
          <>
            <div style={resultUpperStyle}>
              <ResponsiveContainer width="100%" height="100%">
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
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={resultLowerStyle}>
              {Object.entries(result.optimal_portfolio).map(([ticker, percent]) => (
                <div key={ticker} style={allocationItemStyle}>
                  <strong>{ticker}</strong>
                  <p>{percent}%</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p style={{ textAlign: "center" }}>No optimization result yet.</p>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.7;
          }
        }
        .tooltip-container {
          position: relative;
          display: inline-block;
        }
        .info-icon {
          cursor: pointer;
          margin-left: 10px;
          font-size: 20px;
        }
        .tooltip {
          visibility: hidden;
          width: 300px;
          background-color: #555;
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 8px 10px;
          position: absolute;
          z-index: 1;
          bottom: 125%; /* 위쪽에 위치 */
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .tooltip::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 5px;
          border-style: solid;
          border-color: #555 transparent transparent transparent;
        }
        .tooltip-container:hover .tooltip {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
