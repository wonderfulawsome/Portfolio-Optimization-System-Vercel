// pages/forecast/[ticker].jsx
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const Line = dynamic(() => import("react-chartjs-2").then(mod => mod.Line), { ssr: false })

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

import annotationPlugin from "chartjs-plugin-annotation"

// 전역 기본 설정: 텍스트는 흰색, 캔버스 배경은 투명하게
ChartJS.defaults.color = "#fff"
ChartJS.defaults.backgroundColor = "transparent"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
)

export default function TickerPage() {
  const router = useRouter()
  const { ticker } = router.query
  const [fullData, setFullData] = useState(null)
  const [chartData, setChartData] = useState(null)
  const [rsiData, setRsiData] = useState(null)
  const [annotations, setAnnotations] = useState({})
  const [elapsedTime, setElapsedTime] = useState(0)

  // 로딩 중 시간 업데이트 (1초마다 증가)
  useEffect(() => {
    let timer = null
    if (!chartData || !rsiData) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [chartData, rsiData])

  // Fetch 데이터
  useEffect(() => {
    if (!ticker) return
    fetch(`https://finoptima-price-forecast-render.onrender.com/forecast/${ticker}`)
      .then(res => res.json())
      .then(data => setFullData(data))
      .catch(err => console.error(err))
  }, [ticker])

  // 데이터 가공
  useEffect(() => {
    if (!fullData) return

    const realDates = fullData.real.map(d => d.ds)
    const predDates = fullData.predicted.map(d => d.ds)
    const allDatesSet = new Set([...realDates, ...predDates])
    const allDatesSorted = Array.from(allDatesSet).sort()

    const dateToIndex = {}
    allDatesSorted.forEach((dt, idx) => { dateToIndex[dt] = idx })

    const realCloseVals = new Array(allDatesSorted.length).fill(null)
    const sma20Vals = new Array(allDatesSorted.length).fill(null)
    const sma50Vals = new Array(allDatesSorted.length).fill(null)
    const sma200Vals = new Array(allDatesSorted.length).fill(null)

    fullData.real.forEach(item => {
      const i = dateToIndex[item.ds]
      realCloseVals[i] = item.close
      sma20Vals[i] = item.sma20
      sma50Vals[i] = item.sma50
      sma200Vals[i] = item.sma200
    })

    const predCloseVals = new Array(allDatesSorted.length).fill(null)
    const predSma20Vals = new Array(allDatesSorted.length).fill(null)
    const predSma50Vals = new Array(allDatesSorted.length).fill(null)
    fullData.predicted.forEach(item => {
      const i = dateToIndex[item.ds]
      predCloseVals[i] = item.yhat
      predSma20Vals[i] = item.sma20
      predSma50Vals[i] = item.sma50
    })

    const rsiVals = new Array(allDatesSorted.length).fill(null)
    const predRsiVals = new Array(allDatesSorted.length).fill(null)
    fullData.real.forEach(item => {
      const i = dateToIndex[item.ds]
      rsiVals[i] = item.rsi
    })
    fullData.predicted.forEach(item => {
      const i = dateToIndex[item.ds]
      predRsiVals[i] = item.rsi
    })
    for (let i = 0; i < rsiVals.length; i++) {
      if (rsiVals[i] === null && predRsiVals[i] !== null) {
        rsiVals[i] = predRsiVals[i]
      }
    }

    const mainChartData = {
      labels: allDatesSorted,
      datasets: [
        {
          label: "Real Price",
          data: realCloseVals,
          borderColor: "white",
          backgroundColor: "white",
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.2
        },
        {
          label: "SMA 20",
          data: sma20Vals,
          borderColor: "green",
          backgroundColor: "green",
          pointRadius: 0,
          borderWidth: 1,
          tension: 0.2
        },
        {
          label: "SMA 50",
          data: sma50Vals,
          borderColor: "blue",
          backgroundColor: "blue",
          pointRadius: 0,
          borderWidth: 1,
          tension: 0.2
        },
        {
          label: "SMA 5",
          data: sma200Vals,
          borderColor: "red",
          backgroundColor: "red",
          pointRadius: 0,
          borderWidth: 1,
          tension: 0.2
        },
        {
          label: "Forecast Price",
          data: predCloseVals,
          borderColor: "red",
          backgroundColor: "red",
          borderDash: [5, 5],
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.2
        },
        {
          label: "Forecast SMA 20",
          data: predSma20Vals,
          borderColor: "green",
          backgroundColor: "green",
          borderDash: [5, 5],
          pointRadius: 0,
          borderWidth: 1,
          tension: 0.2
        },
        {
          label: "Forecast SMA 50",
          data: predSma50Vals,
          borderColor: "blue",
          backgroundColor: "blue",
          borderDash: [5, 5],
          pointRadius: 0,
          borderWidth: 1,
          tension: 0.2
        },
      ]
    }

    const rsiChartData = {
      labels: allDatesSorted,
      datasets: [
        {
          label: "RSI",
          data: rsiVals,
          borderColor: "purple",
          pointRadius: 0,
          borderWidth: 2,
          fill: false,
          tension: 0.2
        }
      ]
    }

    let annots = {}
    fullData.support.forEach((level, idx) => {
      annots[`support_${idx}`] = {
        type: "line",
        borderColor: "green",
        borderDash: [5, 5],
        borderWidth: 1,
        scaleID: "y",
        value: level,
        label: {
          display: idx === 0,
          content: "Support",
          position: "start",
          color: "#fff"
        }
      }
    })
    fullData.resistance.forEach((level, idx) => {
      annots[`resistance_${idx}`] = {
        type: "line",
        borderColor: "red",
        borderDash: [5, 5],
        borderWidth: 1,
        scaleID: "y",
        value: level,
        label: {
          display: idx === 0,
          content: "Resistance",
          position: "start",
          color: "#fff"
        }
      }
    })
    fullData.volumeSpikes.forEach((dstr, idx) => {
      if (!dateToIndex[dstr] && dateToIndex[dstr] !== 0) return
      annots[`volSpike_${idx}`] = {
        type: "line",
        borderColor: "purple",
        borderWidth: 1,
        scaleID: "x",
        value: dateToIndex[dstr],
        borderDash: [2, 2],
        label: {
          display: idx === 0,
          content: "Volume Spike",
          position: "start",
          color: "#fff"
        }
      }
    })
    const fStartIdx = dateToIndex[fullData.forecastStart]
    annots["forecastStart"] = {
      type: "line",
      borderColor: "black",
      borderWidth: 2,
      scaleID: "x",
      value: fStartIdx,
      borderDash: [2, 2],
      label: {
        display: true,
        content: "Forecast Start",
        position: "end",
        color: "#fff"
      }
    }

    setChartData(mainChartData)
    setRsiData(rsiChartData)
    setAnnotations(annots)
  }, [fullData])

  if (!chartData || !rsiData) {
    const formatTime = (seconds) => {
      const min = Math.floor(seconds / 60)
      const sec = seconds % 60
      return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
    }
    return (
      <div style={{
        background: "#000",
        color: "#fff",
        minHeight: "100vh",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div className="spinner"></div>
        <p style={{ marginTop: "20px", fontSize: "18px" }}>Loading Maximum 1 minute</p>
        <div style={{ marginTop: "10px", fontSize: "24px" }}>
          {formatTime(elapsedTime)}
        </div>
        <style jsx>{`
          .spinner {
            border: 4px solid rgba(255,255,255,0.2);
            border-top: 4px solid #fff;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  const mainOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 2000 },
    scales: {
      x: {
        display: true,
        ticks: {
          color: "#fff",
          maxRotation: 45,
          minRotation: 0
        },
        grid: { color: "rgba(255,255,255,0.2)" }
      },
      y: {
        display: true,
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.2)" }
      }
    },
    plugins: {
      legend: { display: true, labels: { color: "#fff" } },
      annotation: { annotations: annotations }
    }
  }

  const rsiOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 2000 },
    scales: {
      x: {
        display: true,
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.2)" }
      },
      y: {
        display: true,
        min: 0,
        max: 100,
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.2)" }
      }
    },
    plugins: {
      legend: { display: true, labels: { color: "#fff" } },
      annotation: {
        annotations: {
          overbought: {
            type: "line",
            scaleID: "y",
            value: 70,
            borderColor: "red",
            borderWidth: 1,
            borderDash: [4, 4],
            label: {
              display: true,
              content: "Overbought",
              position: "end",
              color: "#fff"
            }
          },
          oversold: {
            type: "line",
            scaleID: "y",
            value: 30,
            borderColor: "green",
            borderWidth: 1,
            borderDash: [4, 4],
            label: {
              display: true,
              content: "Oversold",
              position: "end",
              color: "#fff"
            }
          }
        }
      }
    }
  }

  const containerStyle = {
    background: "#000",
    color: "#fff",
    minHeight: "100vh",
    padding: "20px",
    width: "1200px",
    margin: "0 auto"
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: "20px" }}>{ticker} Forecast</h1>
      <div style={{ marginBottom: "50px", height: "500px" }}>
        <Line data={chartData} options={mainOptions} />
      </div>
      <div style={{ height: "300px" }}>
        <Line data={rsiData} options={rsiOptions} />
      </div>
    </div>
  )
}
