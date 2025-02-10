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

  // 색상 배열
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

  // 오른쪽 결과 영역 스타일 (전체 결과를 위/아래로 분할)
  const resultColumnStyle = {
    flex: "1",
    minWidth: "300px",
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

  // 버튼 스타일 (세련되게)
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

  // 오른쪽 결과 영역 내부: 상단은 파이차트, 하단은 3분할로 종목+비율 목록
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

  // 로딩(Optimizing...) 팝업 스타일 + 애니메이션 추가 (간단한 스피너)
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
        </div>
      )}

      {/* 왼쪽 폼 영역 */}
      <div style={formColumnStyle}>
        <h1>Portfolio Optimization System</h1>
        {[
          { name: "PER", value: PER, setter: setPER },
          { name: "Dividend Yield", value: DividendYield, setter: setDividendYield },
          { name: "Beta", value: Beta, setter: setBeta },
          { name: "RSI", value: RSI, setter: setRSI },
          { name: "Volume", value: volume, setter: setVolume },
          { name: "Volatility", value: Volatility, setter: setVolatility },
        ].map((factor) => (
          <div style={formGroupStyle} key={factor.name}>
            <label>
              {factor.name}:
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

      {/* 오른쪽 결과 영역 (위: 파이차트, 아래: 종목 및 비율 목록 - 3분할 그리드) */}
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

      {/* CSS Keyframes (인라인 스타일로 keyframes는 별도 <style jsx>를 활용) */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
