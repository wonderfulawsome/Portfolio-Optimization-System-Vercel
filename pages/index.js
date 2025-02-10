// pages/index.js
import { useState } from "react";
import { optimizePortfolio } from "../api";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// 설명 팝업 아이콘 컴포넌트
function InfoIcon() {
  return (
    <div className="info-icon">
      <span style={{ fontSize: "24px" }}>ℹ️</span>
      <div className="tooltip">
      이 시스템은 PER(주가수익비율), 배당수익률, 베타, RSI(상대강도지수), 거래량, 변동성과 같은 다양한 요소를 기반으로 포트폴리오를 최적화합니다. 이러한 매개변수들을 조정하고 "Optimize" 버튼을 클릭하면 최적의 포트폴리오 배분을 확인할 수 있습니다.
        <div className="tooltip-arrow" />
      </div>
      <style jsx>{`
        .info-icon {
          position: relative;
          display: inline-block;
          cursor: pointer;
          margin-left: 10px;
        }
        .tooltip {
          visibility: hidden;
          width: 250px;
          background-color: rgba(0, 0, 0, 0.8);
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 8px;
          position: absolute;
          z-index: 1;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .tooltip-arrow {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 5px;
          border-style: solid;
          border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
        }
        .info-icon:hover .tooltip {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  // 상태 변수
  const [PER, setPER] = useState("medium");
  const [DividendYield, setDividendYield] = useState("medium");
  const [Beta, setBeta] = useState("medium");
  const [RSI, setRSI] = useState("medium");
  const [volume, setVolume] = useState("medium");
  const [Volatility, setVolatility] = useState("medium");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 최적화 버튼 핸들러
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

  // 파이 차트 데이터 생성
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

  // 스타일 정의
  const mainContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    backgroundColor: "black",
    color: "white",
    minHeight: "100vh",
    padding: "20px",
    boxSizing: "border-box",
  };

  // 왼쪽 폼 영역 (중앙 정렬)
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

  // 오른쪽 결과 영역 (전체 결과를 위/아래로 분할)
  const resultColumnStyle = {
    flex: "1",
    minWidth: "300px",
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

  // 세련된 버튼 스타일
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

  // 오른쪽 결과 영역 내부 (상단: 파이 차트, 하단: 3분할 그리드로 종목+비율 목록)
  const resultUpperStyle = {
    width: "100%",
    height: "300px",
    marginBottom: "20px",
  };

  const allocationGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
    gap: "10px",
    textAlign: "center",
  };

  const allocationItemStyle = {
    padding: "5px",
    border: "1px solid #555",
    borderRadius: "4px",
    backgroundColor: "#222",
  };

  // 로딩 오버레이 스타일 (스피너 포함)
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
  };

  const spinnerStyle = {
    border: "8px solid #f3f3f3",
    borderTop: "8px solid #007bff",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    animation: "spin 2s linear infinite",
    marginBottom: "20px",
  };

  return (
    <div style={mainContainerStyle}>
      {loading && (
        <div style={loadingOverlayStyle}>
          <div style={spinnerStyle} />
          Optimizing...
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <h1>Portfolio Optimization System</h1>
          <InfoIcon />
        </div>
        {[
          { label: "PER", value: PER, setter: setPER },
          { label: "Dividend Yield", value: DividendYield, setter: setDividendYield },
          { label: "Beta", value: Beta, setter: setBeta },
          { label: "RSI", value: RSI, setter: setRSI },
          { label: "Volume", value: volume, setter: setVolume },
          { label: "Volatility", value: Volatility, setter: setVolatility },
        ].map((factor) => (
          <div style={formGroupStyle} key={factor.label}>
            <label>
              {factor.label}:
              <select
                value={factor.value}
                onChange={(e) => factor.setter(e.target.value)}
                style={selectStyle}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>
        ))}
        <button onClick={handleOptimize} style={buttonStyle}>
          Optimize
        </button>
      </div>

      {/* 오른쪽 결과 영역 (상단: 파이 차트, 하단: 3분할 그리드로 종목+비율) */}
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={allocationGridStyle}>
              {Object.entries(result.optimal_portfolio).map(([ticker, percent]) => (
                <div key={ticker} style={allocationItemStyle}>
                  <strong>{ticker}</strong>
                  <br />
                  {percent}%
                </div>
              ))}
            </div>
          </>
        ) : (
          <p style={{ textAlign: "center" }}>No optimization result yet.</p>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
