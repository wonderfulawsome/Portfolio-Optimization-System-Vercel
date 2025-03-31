import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function TickerForecast() {
  const router = useRouter();
  const { ticker } = router.query;
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ticker) return;

    const fetchForecast = async () => {
      try {
        const res = await fetch(
          "https://finoptima-price-forecast-render.onrender.com/forecast",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ticker }),
          }
        );
        const blob = await res.blob();
        setImageSrc(URL.createObjectURL(blob));
      } catch (err) {
        console.error("예측 요청 실패:", err);
      }
      setLoading(false);
    };

    fetchForecast();
  }, [ticker]);

  return (
    <div
      style={{
        background: "#000",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "60px 20px",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "30px" }}>
        Forecast for {ticker}
      </h1>

      {loading ? (
        <p>Loading prediction chart...</p>
      ) : imageSrc ? (
        <img
          src={imageSrc}
          alt="Forecast"
          style={{
            width: "100%",
            maxWidth: "900px",
            borderRadius: "12px",
            boxShadow: "0 0 20px rgba(255,255,255,0.15)",
          }}
        />
      ) : (
        <p>Failed to load chart.</p>
      )}
    </div>
  );
}
