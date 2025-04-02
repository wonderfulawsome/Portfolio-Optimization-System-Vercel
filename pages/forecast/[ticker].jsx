import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Chart.js 등록
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
      .then(res => res.json())
      .then(data => {
        const realDates = data.real.map(p => p.ds)
        const realPrices = data.real.map(p => p.y)

        // 예측된 구간(미래)
        const predDates = data.predicted.map(p => p.ds)
        const predYhat  = data.predicted.map(p => p.yhat)

        // 실제 부분과 예측 부분이 이어지도록
        // (원한다면 dates를 합치는 등 로직 수정 가능)
        setChartData({
          labels: realDates.concat(predDates.slice(realDates.length)),
          datasets: [
            {
              label: "Real",
              data: realPrices,
              borderWidth: 2
            },
            {
              label: "Predicted",
              data: [
                ...Array(realPrices.length - 1).fill(null),
                ...predYhat.slice(realPrices.length - 1)
              ],
              borderWidth: 2
            }
          ]
        })
      })
      .catch(err => console.error(err))
  }, [ticker])

  if (!chartData) return <div style={{ color: "#fff", background: "#000", minHeight: "100vh", padding: "20px" }}>Loading...</div>

  const options = {
    responsive: true,
    animation: {
      duration: 2000
    },
    plugins: {
      legend: { display: true }
    },
    scales: {
      x: { display: true },
      y: { display: true }
    }
  }

  return (
    <div style={{ color: "#fff", background: "#000", minHeight: "100vh", padding: "20px" }}>
      <h1>{ticker} Forecast</h1>
      <Line data={chartData} options={options} />
    </div>
  )
}
