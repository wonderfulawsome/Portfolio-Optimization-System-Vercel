import { useState } from "react";

export default function PortfolioOptimizer() {
  const [data, setData] = useState(null); // API 결과 저장
  const [loading, setLoading] = useState(false); // 로딩 상태

  // 백엔드 API 호출 함수
  const optimizePortfolio = async () => {
    setLoading(true); // 버튼 비활성화 (로딩 중)
    try {
      const response = await fetch("https://portfolio-optimization-system.onrender.com/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "PER": "medium",
          "DividendYield": "low",
          "Beta": "high",
          "RSI": "medium",
          "volume": "high",
          "Volatility": "low"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setData(result); // 결과 저장
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false); // 로딩 종료
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Portfolio Optimization</h1>
      <button onClick={optimizePortfolio} disabled={loading}>
        {loading ? "Loading..." : "Optimize Portfolio"}
      </button>

      {data && (
        <div style={{ marginTop: "20px" }}>
          <h2>Optimized Portfolio</h2>
          <table border="1" style={{ margin: "0 auto", width: "50%", textAlign: "left" }}>
            <thead>
              <tr>
                <th>Company</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.optimal_portfolio).map(([ticker, weight]) => (
                <tr key={ticker}>
                  <td>{ticker}</td>
                  <td>{(weight * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Recommended Companies</h2>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {data.optimized_companies.map((company, index) => (
              <li key={index}>{company}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
