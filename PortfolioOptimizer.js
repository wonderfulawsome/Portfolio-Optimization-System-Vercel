import { useState } from "react";

export default function PortfolioOptimizer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    pe: "",
    eps: "",
    marketCap: "",
    norm_price_diffs: "",
    norm_price_ranges: "",
    norm_volume_ratios: ""
  });

  const handleInputChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    });
  };

  const optimizePortfolio = async () => {
    // 빈 값 검증
    if (Object.values(inputs).some(v => !v)) {
      alert("모든 필드를 선택해주세요");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://portfolio-optimization-system-flask.onrender.com/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert(`오류 발생: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Portfolio Optimization</h1>
      
      <div style={{ marginBottom: "20px", backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          <div>
            <label>PE Ratio:</label>
            <select name="pe" value={inputs.pe} onChange={handleInputChange} style={{ width: "100%", padding: "5px" }}>
              <option value="">선택</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div>
            <label>EPS:</label>
            <select name="eps" value={inputs.eps} onChange={handleInputChange} style={{ width: "100%", padding: "5px" }}>
              <option value="">선택</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div>
            <label>Market Cap:</label>
            <select name="marketCap" value={inputs.marketCap} onChange={handleInputChange} style={{ width: "100%", padding: "5px" }}>
              <option value="">선택</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div>
            <label>Price Diffs:</label>
            <select name="norm_price_diffs" value={inputs.norm_price_diffs} onChange={handleInputChange} style={{ width: "100%", padding: "5px" }}>
              <option value="">선택</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div>
            <label>Price Ranges:</label>
            <select name="norm_price_ranges" value={inputs.norm_price_ranges} onChange={handleInputChange} style={{ width: "100%", padding: "5px" }}>
              <option value="">선택</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div>
            <label>Volume Ratios:</label>
            <select name="norm_volume_ratios" value={inputs.norm_volume_ratios} onChange={handleInputChange} style={{ width: "100%", padding: "5px" }}>
              <option value="">선택</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
        
        <button 
          onClick={optimizePortfolio} 
          disabled={loading}
          style={{ 
            marginTop: "20px", 
            padding: "10px 30px", 
            backgroundColor: "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Loading..." : "Optimize Portfolio"}
        </button>
      </div>

      {data && (
        <div style={{ marginTop: "20px" }}>
          {data.error ? (
            <div style={{ color: "red" }}>Error: {data.error}</div>
          ) : (
            <>
              <h2>Optimized Portfolio</h2>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#007bff", color: "white" }}>
                    <th style={{ padding: "10px", textAlign: "left" }}>Company</th>
                    <th style={{ padding: "10px", textAlign: "right" }}>Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data.optimal_portfolio).map(([ticker, weight]) => (
                    <tr key={ticker} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ padding: "10px" }}>{ticker}</td>
                      <td style={{ padding: "10px", textAlign: "right" }}>{weight.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
                <h3>Performance Metrics</h3>
                <p><strong>Expected Return:</strong> {(data.expected_return * 100).toFixed(2)}%</p>
                <p><strong>Expected Volatility:</strong> {(data.expected_volatility * 100).toFixed(2)}%</p>
                <p><strong>Cluster:</strong> {data.closest_cluster}</p>
              </div>
              
              <div style={{ marginTop: "20px" }}>
                <h3>Recommended Companies</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {data.optimized_companies.map((company) => (
                    <span key={company} style={{ 
                      padding: "5px 10px", 
                      backgroundColor: "#e9ecef", 
                      borderRadius: "3px" 
                    }}>
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
