// pages/forecast/[ticker].jsx
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// 동적 import (SSR 비활성화)
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

// annotation 플러그인 (수평/수직선 그리기 용)
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

  // fullData를 받아서 chart.js 형식으로 변환
  useEffect(() => {
    if (!fullData) return

    // x축 라벨: real + predicted 날짜 전체
    // 단, 중복 제거
    const realDates = fullData.real.map(d => d.ds)
    const predDates = fullData.predicted.map(d => d.ds)
    const allDatesSet = new Set([...realDates, ...predDates])
    const allDatesSorted = Array.from(allDatesSet).sort()

    // 날짜 => 지수 인덱스 맵
    const dateToIndex = {}
    allDatesSorted.forEach((dt, idx) => { dateToIndex[dt] = idx })

    // 실제 종가, 이동평균선, 예측 종가, 예측 이동평균선 등등
    // 차트에서는 label별로 dataset을 만들어줄 수 있음
    const realCloseVals = new Array(allDatesSorted.length).fill(null)
    const sma20Vals = new Array(allDatesSorted.length).fill(null)
    const sma50Vals = new Array(allDatesSorted.length).fill(null)
    const sma200Vals= new Array(allDatesSorted.length).fill(null)

    fullData.real.forEach(item => {
      const i = dateToIndex[item.ds]
      realCloseVals[i] = item.close
      sma20Vals[i] = item.sma20
      sma50Vals[i] = item.sma50
      sma200Vals[i]= item.sma200
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

    // RSI
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
    // 최종 RSI = real + predicted를 하나로 연결해도 되고,  
    // 아래처럼 한 배열로 합쳐버리면 편함
    for (let i=0; i<rsiVals.length; i++){
      if (rsiVals[i]===null && predRsiVals[i]!==null){
        rsiVals[i] = predRsiVals[i]
      }
    }

    // 차트 주가 데이터 구성
    const mainChartData = {
      labels: allDatesSorted,
      datasets: [
        {
          label: "실제 주가",
          data: realCloseVals,
          borderColor: "black",
          backgroundColor: "black",
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
          label: "예측 주가",
          data: predCloseVals,
          borderColor: "red",
          backgroundColor: "red",
          borderDash: [5,5],
          pointRadius: 0,
          borderWidth: 2,
          tension: 0.2
        },
        {
          label: "예측 SMA 20",
          data: predSma20Vals,
          borderColor: "green",
          backgroundColor: "green",
          borderDash: [5,5],
          pointRadius: 0,
          borderWidth: 1,
          tension: 0.2
        },
        {
          label: "예측 SMA 50",
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

    // RSI 차트 데이터
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

    // 수평선(지지/저항) + 수직선(거래량 스파이크, 예측시작)
    let annots = {}
    // 지지선
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
          content: "지지선",
          position: "start"
        }
      }
    })
    // 저항선
    fullData.resistance.forEach((level, idx) => {
      annots[`resist_${idx}`] = {
        type: "line",
        borderColor: "red",
        borderDash: [5,5],
        borderWidth: 1,
        scaleID: "y",
        value: level,
        label: {
          display: idx===0,
          content: "저항선",
          position: "start"
        }
      }
    })
    // 거래량 스파이크 vertical line
    fullData.volumeSpikes.forEach((dstr, idx) => {
      if(!dateToIndex[dstr]) return
      annots[`volSpike_${idx}`] = {
        type: "line",
        borderColor: "purple",
        borderWidth: 1,
        scaleID: "x",
        value: dateToIndex[dstr],
        borderDash: [2,2],
        label: {
          display: idx===0,
          content: "거래량 스파이크",
          position: "start"
        }
      }
    })
    // 예측 시작 vertical line
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
        content: "예측 시작",
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
    animation: {
      duration: 2000
    },
    scales: {
      x: {
        display: true,
        ticks: {
          // 날짜 라벨 너무 많으면 간격 조절 or rotate
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
          // 과매수선
          overbought: {
            type: "line",
            scaleID: "y",
            value: 70,
            borderColor: "red",
            borderWidth: 1,
            borderDash: [4,4],
            label: {
              display: true,
              content: "과매수",
              position: "end"
            }
          },
          // 과매도선
          oversold: {
            type: "line",
            scaleID: "y",
            value: 30,
            borderColor: "green",
            borderWidth: 1,
            borderDash: [4,4],
            label: {
              display: true,
              content: "과매도",
              position: "end"
            }
          }
        }
      }
    }
  }

  return (
    <div style={{ background:"#000", color:"#fff", minHeight:"100vh", padding:"20px" }}>
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
