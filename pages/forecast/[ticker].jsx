import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function TickerForecast() {
  const router = useRouter();
  const { ticker } = router.query;
  const [fullData, setFullData] = useState([]);
  const [animatedData, setAnimatedData] = useState([]);
  const [loading, setLoading] = useState(true);

  // API 호출
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
        const json = await res.json();
        setFullData(json.forecast);
        setAnimatedData([]);
      } catch (err) {
        console.error("예측 요청 실패:", err);
      }
      setLoading(false);
    };

    fetchForecast();
  }, [ticker]);

  // 애니메이션
  useEffect(() => {
    if (fullData.length === 0) return;

    let index = 0;
    const totalDuration = 1000; // 1초
    const intervalTime = totalDuration / fullData.length;

    const interval = setInterval(() => {
      setAnimatedData((prev) => [...prev, fullData[index]]);
      index++;
      if (index >= fullData.length) clearInterval(interval);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [fullData]);

  const actualLine = animatedData.filter((d) => d.type === "actual");
  const forecastLine = animatedData.filter((d) => d.type === "forecast");

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
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis stroke="#ccc" domain={['dataMin', 'dataMax']} />
            <Tooltip
              contentStyle={{ backgroundColor: "#222", border: "none" }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#fff" }}
            />

            <Line
              type="monotone"
              data={actualLine}
              dataKey="price"
              stroke="#ffffff"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />

            <Line
              type="monotone"
              data={forecastLine}
              dataKey="price"
              stroke="#00CFFF"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
