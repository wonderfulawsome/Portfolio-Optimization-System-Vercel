// pages/index.js
import { useState } from "react";
import { optimizePortfolio } from "../api";

export default function Home() {
  // 각 변수별 상태 관리
  const [PER, setPER] = useState("medium");
  const [DividendYield, setDividendYield] = useState("medium");
  const [Beta, setBeta] = useState("medium");
  const [RSI, setRSI] = useState("medium");
  const [volume, setVolume] = useState("medium");
  const [Volatility, setVolatility] = useState("medium");
  const [result, setResult] = useState(null);

  const handleOptimize = async () => {
    try {
      const data = await optimizePortfolio({
        PER,
        DividendYield,
        Beta,
        RSI,
        volume,
        Volatility,
      });
      console.log("API Response:", data);
      setResult(data);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    }
  };

  // 전체 컨테이너 스타일: 검은 배경, 흰 글씨, 중앙정렬 등
  const containerStyle = {
    backgroundColor: "black",
    color: "white",
    textAlign: "center",
    padding: "20px",
    minHeight: "100vh",
  };

  // 결과 출력 영역 스타일 (좌측정렬, 인라인 블록)
  const resultContainerStyle = {
    textAlign: "left",
    display: "inline-block",
    marginTop: "20px",
  };

  const portfolioItemStyle = {
    margin: "0 0 5px 0",
    fontFamily: "Arial, sans-serif", // 기본 글꼴 사용
    fontSize: "16px",
  };

  return (
    <div style={containerStyle}>
      <h1>포트폴리오 최적화 시스템</h1>

      <div style={{ marginBottom: "10px" }}>
        <label>
          PER:
          <select
            value={PER}
            onChange={(e) => setPER(e.target.value)}
            style={{ marginLeft: "5px" }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          Dividend Yield:
          <select
            value={DividendYield}
            onChange={(e) => setDividendYield(e.target.value)}
            style={{ marginLeft: "5px" }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          Beta:
          <select
            value={Beta}
            onChange={(e) => setBeta(e.target.value)}
            style={{ marginLeft: "5px" }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          RSI:
          <select
            value={RSI}
            onChange={(e) => setRSI(e.target.value)}
            style={{ marginLeft: "5px" }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          거래량 (Volume):
          <select
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            style={{ marginLeft: "5px" }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          변동성 (Volatility):
          <select
            value={Volatility}
            onChange={(e) => setVolatility(e.target.value)}
            style={{ marginLeft: "5px" }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      <button onClick={handleOptimize} style={{ marginTop: "20px" }}>
        최적화 실행
      </button>

      {result && (
        <div style={resultContainerStyle}>
          <h2>최적화 결과</h2>
          <h3>최적화된 종목</h3>
          {result.optimized_companies && result.optimized_companies.length > 0 ? (
            <ul>
              {result.optimized_companies.map((company, index) => (
                <li key={index}>{company}</li>
              ))}
            </ul>
          ) : (
            <p>최적화된 종목이 없습니다.</p>
          )}
          <h3>포트폴리오 비중</h3>
          {result.optimal_portfolio &&
          Object.keys(result.optimal_portfolio).length > 0 ? (
            <div>
              {Object.entries(result.optimal_portfolio).map(
                ([ticker, weight]) => (
                  <p key={ticker} style={portfolioItemStyle}>
                    {ticker}: {weight}%
                  </p>
                )
              )}
            </div>
          ) : (
            <p>포트폴리오 데이터가 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}
