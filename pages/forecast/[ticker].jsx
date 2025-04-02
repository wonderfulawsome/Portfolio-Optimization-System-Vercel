import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Chart 컴포넌트를 동적 import (SSR 비활성화)
const LineChart = dynamic(
  () =>
    import("react-chartjs-2").then((mod) => mod.Line),
  { ssr: false }
)

// Chart.js 모듈 등록
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function TickerPage() {
  const router = useRouter()
  const { ticker } = router.query
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    if (!ticker) return
    fetch(`https://YOUR_BACKEND_URL/forecast_data/${ticker}`)
      .then((res) => res.json())
      .then((data) => {
        // 예시: real와 predicted 데이터를 합쳐서 차트용 data 생성
        const realDates = data.real.map((p) => p.ds)
        const realPrices = data.real.map((p) => p.y)
        const predDates = data.predicted.map((p) => p.ds)
        const predYhat = data.predicted.map((p) => p.yhat)
        setChartData({
          labels: realDates.concat(predDates.slice(realDates.length)),
          datasets: [
            {
              label: "Real",
              data: realPrices,
              borderColor: "green",
              fill: false,
            },
            {
              label: "Predicted",
              data: [
                ...Array(realPrices.length - 1).fill(null),
                ...predYhat.slice(realPrices.length - 1),
              ],
              borderColor: "red",
              fill: false,
            },
          ],
        })
      })
      .catch((err) => console.error(err))
  }, [ticker])

  if (!chartData)
    return (
      <div style={{ color: "#fff", background: "#000", minHeight: "100vh", padding: "20px" }}>
        Loading...
      </div>
    )

  const options = {
    responsive: true,
    animation: {
      duration: 2000,
    },
    plugins: {
      legend: { display: true },
    },
    scales: {
      x: { display: true },
      y: { display: true },
    },
  }

  return (
    <div style={{ color: "#fff", background: "#000", minHeight: "100vh", padding: "20px" }}>
      <h1>{ticker} Forecast</h1>
      <LineChart data={chartData} options={options} />
    </div>
  )
}
