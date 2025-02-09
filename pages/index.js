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

  // 전체 레이아웃: 왼쪽은 폼/버튼, 오른쪽은 결과 (2분할)
  const mainContainerStyle = {
    display: "flex",
    backgroundColor: "black",
    color: "white",
    minHeight: "100vh",
    padding: "20px",
    boxSizing: "border-box",
  };

  // 왼쪽 폼 영역 스타일
  const formColumnStyle = {
    flex: "1",
    marginRight: "20px",
  };

  // 오른쪽 결과 영역 스타일
  const resultColumnStyle = {
    flex: "1",
    borderLeft: "1px solid gray",
    paddingLeft: "20px",
  };

  // 폼 내부 요소 스타일
  const formGroupStyle = {
    marginBottom: "10px",
  };

  const selectStyle = {
    marginLeft: "5px",
    padding: "5px",
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

  // 결과 영역 내부를 2분할 (왼쪽: 최적화된 종목, 오른쪽: 포트폴리오 비중)
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

  // 로딩(최적화중...) 팝업 스타일
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
          최적화중...
        </div>
      )}

      {/* 왼쪽 폼 영역 */}
      <div style={formColumnStyle}>
        <h1>포트폴리오 최적화 시스템</h1>
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
            거래량 (Volume):
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
            변동성 (Volatility):
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
          최적화 실행
        </button>
      </div>

      {/* 오른쪽 결과 영역 */}
      <div style={resultColumnStyle}>
        <h2>최적화 결과</h2>
        {result ? (
          <div style={resultSplitStyle}>
            <div style={resultListStyle}>
              <h3>최적화된 종목</h3>
              {result.optimized_companies && result.optimized_companies.length > 0 ? (
                <ul>
                  {result.optimized_companies.map((company, index) => (
                    <li key={index} style={{ marginBottom: "5px" }}>
                      {company}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>최적화된 종목이 없습니다.</p>
              )}
            </div>
            <div style={portfolioStyle}>
              <h3>포트폴리오 비중</h3>
              {result.optimal_portfolio && Object.keys(result.optimal_portfolio).length > 0 ? (
                <div>
                  {Object.entries(result.optimal_portfolio).map(([ticker, weight]) => (
                    <p key={ticker} style={{ marginBottom: "5px" }}>
                      {ticker}: {weight}%
                    </p>
                  ))}
                </div>
              ) : (
                <p>포트폴리오 데이터가 없습니다.</p>
              )}
            </div>
          </div>
        ) : (
          <p>최적화 결과가 아직 없습니다.</p>
        )}
      </div>
    </div>
  );
}
