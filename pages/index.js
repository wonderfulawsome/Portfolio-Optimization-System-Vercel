// pages/index.js
import { useState } from "react";
import { optimizePortfolio } from "../api";

export default function Home() {
  // 각 변수별 상태를 개별적으로 관리합니다.
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

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>포트폴리오 최적화 시스템</h1>
      
      <div style={{ marginBottom: "10px" }}>
        <label>
          PER:
          <select value={PER} onChange={(e) => setPER(e.target.value)} style={{ marginLeft: "5px" }}>
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
          <select value={Beta} onChange={(e) => setBeta(e.target.value)} style={{ marginLeft: "5px" }}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>
      
      <div style={{ marginBottom: "10px" }}>
        <label>
          RSI:
          <select value={RSI} onChange={(e) => setRSI(e.target.value)} style={{ marginLeft: "5px" }}>
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
        <div style={{ marginTop: "20px" }}>
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
          {result.optimal_portfolio && Object.keys(result.optimal_portfolio).length > 0 ? (
            <pre>{JSON.stringify(result.optimal_portfolio, null, 2)}</pre>
          ) : (
            <p>포트폴리오 데이터가 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}
