import { useState } from "react";
import { optimizePortfolio } from "../api";

export default function Home() {
    const [riskLevel, setRiskLevel] = useState("medium");
    const [result, setResult] = useState(null);

    const handleOptimize = async () => {
        try {
            const response = await optimizePortfolio({ risk: riskLevel });
            setResult(response);
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
            <button onClick={handleOptimize}>최적화 실행</button>

            {result && (
                <div>
                    <h2>최적화 결과</h2>
                    <h3>최적화된 종목</h3>
                    <ul>
                        {result.optimized_companies.map((company, index) => (
                            <li key={index}>{company}</li>
                        ))}
                    </ul>
                    <h3>포트폴리오 비중</h3>
                    <pre>{JSON.stringify(result.optimal_portfolio, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
