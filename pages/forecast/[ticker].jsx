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

        // 실제 데이터와 예측 데이터에 구분 플래그 추가
        const processed = json.forecast.map((d) => ({
          ...d,
          actual: d.actual ?? false,
        }));

        setFullData(processed);
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
    const interval = setInterval(() => {
      setAnimatedData((prev) => [...prev, fullData[index]]);
      index++;
      if (index >= fullData.length) clearInterval(interval);
    }, 1000 / fullData.length);

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
            <YAxis stroke="#ccc" domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip
              formatter={(value, name, props) =>
                [`${value}`, props.payload.actual ? "Actual" : "Forecast"]
              }
              contentStyle={{ backgroundColor: "#222", border: "none" }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#fff" }}
            />
            {/* 실제 데이터 라인 */}
            <Line
              type="monotone"
              dataKey={(d) => (d.actual ? d.price : null)}
              stroke="#ffffff"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
              name="Actual"
            />
            {/* 예측 데이터 라인 */}
            <Line
              type="monotone"
              dataKey={(d) => (!d.actual ? d.price : null)}
              stroke="#00CFFF"
              strokeWidth={2.5}
              dot={false}
              strokeDasharray="5 5"
              isAnimationActive={false}
              name="Forecast"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
