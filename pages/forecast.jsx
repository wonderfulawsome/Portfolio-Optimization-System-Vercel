// pages/forecast.jsx
import { useState } from "react";
import { useRouter } from "next/router";

export default function ForecastPage() {
  const [ticker, setTicker] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ticker.trim() !== "") {
      router.push(`/forecast/${ticker.toUpperCase()}`);
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>📈 Stock Price Forecast</h1>
      <p>Select a stock ticker to predict its future prices</p>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Enter Ticker (e.g. AAPL)"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "200px",
            marginRight: "10px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "5px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Predict
        </button>
      </form>
    </div>
  );
}
