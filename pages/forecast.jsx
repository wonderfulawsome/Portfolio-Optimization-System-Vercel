import { useRouter } from "next/router";

export default function Forecast() {
  const router = useRouter();

  const handleClick = (ticker) => {
    router.push(`/forecast/${ticker}`);
  };

  const tickers = [
    { name: "Nasdaq 100", symbol: "QQQ" },
    { name: "SOXX", symbol: "SOXX" },
    { name: "S&P 500", symbol: "SPY" },
    { name: "Dow Jones", symbol: "DIA" },
    { name: "Bitcoin", symbol: "IBIT" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top left, #111, #000)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "80px 20px", // 상하좌우 여백 넉넉히
      }}
    >
      <h1
        style={{
          color: "#f2f2f2",
          fontSize: "3rem",
          fontWeight: "900",
          marginBottom: "16px",
          textShadow: "0 2px 4px rgba(0,0,0,0.6)",
          letterSpacing: "-0.5px",
        }}
      >
        Select a Forecast Target
      </h1>
      <p
        style={{
          color: "#bdbdbd",
          fontSize: "1.1rem",
          maxWidth: "600px",
          textAlign: "center",
          marginBottom: "40px",
          lineHeight: "1.6",
        }}
      >
        Choose one of the major indices or Bitcoin to see a predicted price trend.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "20px",
          width: "80%",       // 전체 중 80% 폭
          maxWidth: "900px",  // 너무 커지지 않도록 제한
          margin: "0 auto",
        }}
      >
        {tickers.map((item) => (
          <button
            key={item.symbol}
            onClick={() => handleClick(item.symbol)}
            style={{
              background: "linear-gradient(145deg, #333, #222)",
              color: "#fff",
              boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.1)",
              border: "1px solid #444",
              borderRadius: "1rem",
              padding: "20px",
              fontSize: "1.1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0,0,0,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "inset 1px 1px 2px rgba(255,255,255,0.1)";
            }}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
