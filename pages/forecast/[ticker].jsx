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

  useEffect(() => {
    if (!ticker) return
    fetch(`https://finoptima-price-forecast-render.onrender.com/forecast/${ticker}`)
      .then(res => res.json())
      .then(data => {
        setFullData(data)
      })
      .catch(err => console.error(err))
  }, [ticker])

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
    const predSma20Vals= new Array(allDatesSorted.length).fill(null)
    const predSma50Vals= new Array(allDatesSorted.length).fill(null)
    fullData.predicted.forEach(item => {
      const i = dateToIndex[item.ds]
      predCloseVals[i] = item.yhat
      predSma20Vals[i]= item.sma20
      predSma50Vals[i]= item.sma50
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
    for (let i=0; i<rsiVals.length; i++){
      if (rsiVals[i]===null && predRsiVals[i]!==null){
        rsiVals[i] = predRsiVals[i]
      }
    }

    const mainChartData = {
      labels: allDatesSorted,
      datasets: [
        {
          label: "Real Price",
          data: realCloseVals,
          borderColor: "white", // 흰색 실선
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
          label: "SMA 200",
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
          borderDash: [5,5],
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.2
        },
        {
          label: "Forecast SMA 20",
          data: predSma20Vals,
          borderColor: "green",
          backgroundColor: "green",
          borderDash: [5,5],
          pointRadius: 0,
          borderWidth: 1,
          tension: 0.2
        },
        {
          label: "Forecast SMA 50",
          data: predSma50Vals,
          borderColor: "blue",
          backgroundColor: "blue",
          borderDash: [5,5],
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
    // Support lines
    fullData.support.forEach((level, idx) => {
      annots[`support_${idx}`] = {
        type: "line",
        borderColor: "green",
        borderDash: [5,5],
        borderWidth: 1,
        scaleID: "y",
        value: level,
        label: {
          display: idx===0,
          content: "Support",
          position: "start"
        }
      }
    })
    // Resistance lines
    fullData.resistance.forEach((level, idx) => {
      annots[`resistance_${idx}`] = {
        type: "line",
        borderColor: "red",
        borderDash: [5,5],
        borderWidth: 1,
        scaleID: "y",
        value: level,
        label: {
          display: idx===0,
          content: "Resistance",
          position: "start"
        }
      }
    })
    // Volume Spike (vertical lines)
    fullData.volumeSpikes.forEach((dstr, idx) => {
      if(!dateToIndex[dstr] && dateToIndex[dstr]!==0) return
      annots[`volSpike_${idx}`] = {
        type: "line",
        borderColor: "purple",
        borderWidth: 1,
        scaleID: "x",
        value: dateToIndex[dstr],
        borderDash: [2,2],
        label: {
          display: idx===0,
          content: "Volume Spike",
          position: "start"
        }
      }
    })
    // Forecast Start
    const fStartIdx = dateToIndex[fullData.forecastStart]
    annots["forecastStart"] = {
      type: "line",
      borderColor: "black",
      borderWidth: 2,
      scaleID: "x",
      value: fStartIdx,
      borderDash: [2,2],
      label: {
        display: true,
        content: "Forecast Start",
        position: "end"
      }
    }

    setChartData(mainChartData)
    setRsiData(rsiChartData)
    setAnnotations(annots)
  }, [fullData])

  if(!chartData || !rsiData) {
    return (
      <div style={{ background:"#000", color:"#fff", minHeight:"100vh", padding:"20px" }}>
        Loading...
      </div>
    )
  }

  const mainOptions = {
    responsive: true,
    // 차트를 가로로 더 길게 보이려면 부모 컨테이너 폭을 늘리는 쪽이 더 간단
    animation: {
      duration: 2000
    },
    scales: {
      x: {
        display: true,
        ticks: {
          maxRotation: 45,
          minRotation: 0
        }
      },
      y: { display: true }
    },
    plugins: {
      legend: { display: true },
      annotation: {
        annotations: annotations
      }
    }
  }

  const rsiOptions = {
    responsive: true,
    animation: {
      duration: 2000
    },
    scales: {
      x: { display: true },
      y: {
        display: true,
        min: 0,
        max: 100
      }
    },
    plugins: {
      legend: { display: true },
      annotation: {
        annotations: {
          // Overbought line
          overbought: {
            type: "line",
            scaleID: "y",
            value: 70,
            borderColor: "red",
            borderWidth: 1,
            borderDash: [4,4],
            label: {
              display: true,
              content: "Overbought",
              position: "end"
            }
          },
          // Oversold line
          oversold: {
            type: "line",
            scaleID: "y",
            value: 30,
            borderColor: "green",
            borderWidth: 1,
            borderDash: [4,4],
            label: {
              display: true,
              content: "Oversold",
              position: "end"
            }
          }
        }
      }
    }
  }

  // 더 넓은 폭을 위해 스타일 추가
  const containerStyle = {
    background:"#000",
    color:"#fff",
    minHeight:"100vh",
    padding:"20px",
    // 원하는 가로 폭 설정 (예: 1200px)
    width: "1200px",
    margin: "0 auto"
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom:"20px" }}>{ticker} Forecast</h1>
      <div style={{ marginBottom:"50px" }}>
        <Line data={chartData} options={mainOptions} />
      </div>
      <div>
        <Line data={rsiData} options={rsiOptions} />
      </div>
    </div>
  )
}
