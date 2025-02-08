// pages/index.js
import { useState } from "react";
import { optimizePortfolio } from "../api";

export default function Home() {
  const [riskLevel, setRiskLevel] = useState("medium");
  const [result, setResult] = useState(null);

  const handleOptimize = async () => {
    try {
      // 백엔드 API에 요청을 보냅니다.
      const data = await optimizePortfolio({
        PER: riskLevel,
        DividendYield: "low",
        Beta: "high",
        RSI: "medium",
        volume: "high",
        Volatility: "low"
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
      <label>
        리스크 수준 선택:
        <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
      <button onClick={handleOptimize} style={{ marginLeft: "10px" }}>
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
