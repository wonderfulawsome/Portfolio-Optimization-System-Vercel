// --- Frontend (pages/forecast/[ticker].jsx) ---
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
  Legend,
} from "recharts";

export default function TickerForecast() {
  const router = useRouter();
  const { ticker } = router.query;

  const [fullData, setFullData] = useState([]);
  const [animatedData, setAnimatedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ticker) return;

    const fetchForecast = async () => {
      setLoading(true);
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

        if (!json.forecast || !Array.isArray(json.forecast)) {
          console.error("예측 데이터 없음:", json);
          return;
        }

        setFullData(json.forecast);
        setAnimatedData([]);
      } catch (err) {
        console.error("예측 요청 실패:", err);
      }
      setLoading(false);
    };

    fetchForecast();
  }, [ticker]);

  useEffect(() => {
    if (fullData.length === 0) return;

    let index = 0;
    const interval = setInterval(() => {
      setAnimatedData((prev) => [...prev, fullData[index]]);
      index++;
      if (index >= fullData.length) clearInterval(interval);
    }, 1000 / fullData.length);

    return () => clearInterval(interval);
  }, [fullData]);

  const actualData = animatedData.filter((d) => d?.type === "actual");
  const forecastData = animatedData.filter((d) => d?.type === "forecast");

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
            <XAxis
              dataKey="date"
              stroke="#ccc"
              type="category"
              allowDuplicatedCategory={false}
              interval="preserveStartEnd"
            />
            <YAxis stroke="#ccc" domain={["dataMin", "dataMax"]} />
            <Tooltip
              contentStyle={{ backgroundColor: "#222", border: "none" }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#fff" }}
            />
            <Legend
              verticalAlign="top"
              wrapperStyle={{ color: "#fff", paddingBottom: "20px" }}
            />
            <Line
              data={actualData}
              type="monotone"
              dataKey="price"
              name="Actual"
              stroke="#FFFFFF"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              data={forecastData}
              type="monotone"
              dataKey="price"
              name="Forecast"
              stroke="#00C8FF"
              strokeWidth={3}
              strokeDasharray="6 3"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
