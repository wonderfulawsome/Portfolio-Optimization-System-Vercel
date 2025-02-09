// pages/index.js
import { useState } from "react";
import { optimizePortfolio } from "../api";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

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

  // 색상 배열 (필요에 따라 수정 가능)
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

  // 버튼 스타일 (hover 효과는 CSS-in-JS 라이브러리나 별도 CSS로 구현하는 것이 좋습니다)
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

  // 결과 영역 내부를 2분할: 왼쪽은 Optimized Companies, 오른쪽은 Portfolio Allocation
  const resultSplitStyle = {
    display: "flex",
    flexWrap: "wrap", // 모바일 대응
    justifyContent: "space-between",
    marginTop: "20px",
  };

  const resultListStyle = {
    flex: "1",
    minWidth: "250px",
    marginRight: "20px",
  };

  const portfolioStyle = {
    flex: "1",
    minWidth: "250px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  // 포트폴리오 비중 텍스트 리스트 스타일
  const allocationListStyle = {
    marginTop: "20px",
    width: "100%",
    textAlign: "center",
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
                <ul style={{ listStyleType: "none", padding: 0, textAlign: "center" }}>
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
              {result.optimal_portfolio &&
              Object.keys(result.optimal_portfolio).length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
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
                  <div style={allocationListStyle}>
                    {Object.entries(result.optimal_portfolio).map(([ticker, percent]) => (
                      <p key={ticker} style={{ margin: "4px 0" }}>
                        {ticker}: {percent}%
                      </p>
                    ))}
                  </div>
                </>
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
