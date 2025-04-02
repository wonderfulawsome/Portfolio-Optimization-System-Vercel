import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function TickerPage() {
  const router = useRouter()
  const { ticker } = router.query
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!ticker) return
    fetch(`https://finoptima-price-forecast-render.onrender.com/forecast/${ticker}`)
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.error(err))
  }, [ticker])

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: "50px" }}>
      <h1>{ticker} Forecast</h1>
      {!data && <p>Loading...</p>}
      {data && (
        <div>
          <p>Data Loaded</p>
          {/* 예: <img src={`data:image/png;base64,${data.image}`} alt="forecast" /> */}
        </div>
      )}
    </div>
  )
}
