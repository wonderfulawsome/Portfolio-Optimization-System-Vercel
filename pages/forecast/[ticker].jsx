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
        setFullData(json.forecast); // 전체 데이터 (기존 + 예측 포함)
        setAnimatedData([]); // 초기화
      } catch (err) {
        console.error("예측 요청 실패:", err);
      }
      setLoading(false);
    };

    fetchForecast();
  }, [ticker]);

  // 빠른 애니메이션 적용: 약 1초 안에 전체 표시
  useEffect(() => {
    if (fullData.length === 0) return;

    let index = 0;
    const interval = setInterval(() => {
      setAnimatedData((prev) => [...prev, fullData[index]]);
      index++;
      if (index >= fullData.length) clearInterval(interval);
    }, 25); // 빠르게 그리기
    return () => clearInterval(interval);
  }, [fullData]);

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
          <LineChart data={animatedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip
              contentStyle={{ backgroundColor: "#222", border: "none" }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#00C49F"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false} // 수동 애니메이션
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
