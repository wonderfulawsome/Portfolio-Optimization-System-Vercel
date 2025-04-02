import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function TickerPage() {
  const router = useRouter()
  const { ticker } = router.query
  const [imageData, setImageData] = useState(null)

  useEffect(() => {
    if (!ticker) return
    fetch(`https://finoptima-price-forecast-render.onrender.com/forecast/${ticker}`)
      .then(res => res.json())
      .then(result => {
        if(result && result.image) {
          setImageData(result.image)
        }
      })
      .catch(err => console.error(err))
  }, [ticker])

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: "50px" }}>
      <h1>{ticker} Forecast</h1>
      {!imageData && <p>Loading...</p>}
      {imageData && <img src={`data:image/png;base64,${imageData}`} alt="forecast" />}
    </div>
  )
}
