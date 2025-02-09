// pages/index.js
import { useState } from "react";
import { optimizePortfolio } from "../api";

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

  // 전체 레이아웃 스타일: 2분할 (왼쪽: 폼, 오른쪽: 결과)
  const mainContainerStyle = {
    display: "flex",
    backgroundColor: "black",
    color: "white",
    minHeight: "100vh",
    padding: "20px",
    boxSizing: "border-box",
  };

  // 왼쪽 폼 영역 스타일 (내용을 중앙 정렬)
  const formColumnStyle = {
    flex: "1",
    marginRight: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
  };

  // 오른쪽 결과 영역 스타일
  const resultColumnStyle = {
    flex: "1",
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
  };

  const buttonStyle = {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#0056b3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  // 결과 영역 내부를 2분할: 왼쪽은 Optimized Companies, 오른쪽은 Portfolio Allocation
  const resultSplitStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  };

  const resultListStyle = {
    flex: "1",
    marginRight: "20px",
  };

  const portfolioStyle = {
    flex: "1",
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
          <div style={resultSplitStyle}>
            <div style={resultListStyle}>
              <h3>Optimized Companies</h3>
              {result.optimized_companies && result.optimized_companies.length > 0 ? (
                <ul style={{ listStyleType: "none", padding: 0 }}>
                  {result.optimized_companies.map((company, index) => (
                    <li key={index} style={{ marginBottom: "5px" }}>
                      {company}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No optimized companies found.</p>
              )}
            </div>
            <div style={portfolioStyle}>
              <h3>Portfolio Allocation</h3>
              {result.optimal_portfolio && Object.keys(result.optimal_portfolio).length > 0 ? (
                <div>
                  {Object.entries(result.optimal_portfolio).map(([ticker, percent]) => (
                    <p key={ticker} style={{ marginBottom: "5px" }}>
                      {ticker}: {percent}%
                    </p>
                  ))}
                </div>
              ) : (
                <p>No portfolio data available.</p>
              )}
            </div>
          </div>
        ) : (
          <p>No optimization result yet.</p>
        )}
      </div>
    </div>
  );
}
