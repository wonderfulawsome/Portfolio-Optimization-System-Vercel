import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import axios from 'axios'

// Plotly는 클라이언트 사이드에서만 로드 (SSR 비활성화)
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export default function StockForecast() {
  const router = useRouter()
  const { ticker } = router.query
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [plotConfig, setPlotConfig] = useState(null)
  
  // 설정 옵션
  const [days, setDays] = useState(200)
  const [futureDays, setFutureDays] = useState(30)
  
  // 주식 예측 실행 함수
  const fetchPrediction = async () => {
    if (!ticker) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://finoptima-price-forecast-render.onrender.com'}/api/predict`, {
        params: {
          ticker,
          days,
          future_days: futureDays
        }
      })
      
      setData(response.data)
      prepareChartData(response.data)
    } catch (err) {
      console.error('예측 오류:', err)
      setError(err.response?.data?.error || '서버 연결 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }
  
  // 차트 데이터 준비
  const prepareChartData = (data) => {
    if (!data) return
    
    // 데이터 준비
    const historicalData = data.historical_data.map(item => ({
      ...item,
      date: new Date(item.date)
    }))
    
    const forecastData = data.forecast_data.map(item => ({
      ...item,
      ds: new Date(item.ds)
    }))
    
    const futureData = forecastData.filter(item => 
      new Date(item.ds) > new Date(data.last_date)
    )
    
    // 주가 차트 데이터
    const candlestick = {
      x: historicalData.map(item => item.date),
      open: historicalData.map(item => item.open || item.close),
      high: historicalData.map(item => item.high || item.close),
      low: historicalData.map(item => item.low || item.close),
      close: historicalData.map(item => item.close),
      type: 'candlestick',
      name: '주가',
      increasing: {line: {color: '#00FFAA'}},
      decreasing: {line: {color: '#FF5E5E'}},
    }
    
    // 이동평균선
    const sma20 = {
      x: historicalData.map(item => item.date),
      y: historicalData.map(item => item.sma20),
      type: 'scatter',
      mode: 'lines',
      name: 'SMA 20',
      line: {color: '#00ABFF', width: 1.5}
    }
    
    const sma50 = {
      x: historicalData.map(item => item.date),
      y: historicalData.map(item => item.sma50),
      type: 'scatter',
      mode: 'lines',
      name: 'SMA 50',
      line: {color: '#FFA500', width: 1.5}
    }
    
    const sma200 = {
      x: historicalData.map(item => item.date),
      y: historicalData.map(item => item.sma200),
      type: 'scatter',
      mode: 'lines',
      name: 'SMA 200',
      line: {color: '#FF00FF', width: 1.5}
    }
    
    // 예측 데이터
    const prediction = {
      x: futureData.map(item => item.ds),
      y: futureData.map(item => item.yhat),
      type: 'scatter',
      mode: 'lines',
      name: '예측 주가',
      line: {color: '#FF3333', width: 2, dash: 'dash'}
    }
    
    // 신뢰 구간
    const upperBound = {
      x: futureData.map(item => item.ds),
      y: futureData.map(item => item.yhat_upper),
      type: 'scatter',
      mode: 'lines',
      name: '상단 신뢰구간',
      line: {width: 0},
      showlegend: false
    }
    
    const lowerBound = {
      x: futureData.map(item => item.ds),
      y: futureData.map(item => item.yhat_lower),
      type: 'scatter',
      mode: 'lines',
      name: '하단 신뢰구간',
      line: {width: 0},
      fill: 'tonexty',
      fillcolor: 'rgba(255, 51, 51, 0.2)',
      showlegend: false
    }
    
    // RSI 데이터
    const rsi = {
      x: historicalData.map(item => item.date),
      y: historicalData.map(item => item.rsi),
      type: 'scatter',
      mode: 'lines',
      name: 'RSI',
      line: {color: '#9933FF', width: 1.5},
      yaxis: 'y2'
    }
    
    // 거래량 데이터
    const volume = {
      x: historicalData.map(item => item.date),
      y: historicalData.map(item => item.volume),
      type: 'bar',
      name: '거래량',
      marker: {
        color: historicalData.map((item, i) => 
          i > 0 && item.close >= historicalData[i-1].close ? '#00FFAA' : '#FF5E5E'
        )
      },
      yaxis: 'y3'
    }
    
    // 차트 레이아웃
    const layout = {
      autosize: true,
      height: 800,
      margin: {l: 50, r: 50, b: 50, t: 50, pad: 4},
      paper_bgcolor: '#1E1E1E',
      plot_bgcolor: '#1E1E1E',
      font: {color: 'white'},
      xaxis: {
        title: '날짜',
        gridcolor: '#333333',
        rangeslider: {visible: false}
      },
      yaxis: {
        title: '가격 (USD)',
        gridcolor: '#333333',
        domain: [0.55, 1]
      },
      yaxis2: {
        title: 'RSI',
        titlefont: {color: '#9933FF'},
        tickfont: {color: '#9933FF'},
        anchor: 'x',
        overlaying: 'y',
        side: 'right',
        position: 0.85,
        range: [0, 100],
        domain: [0.3, 0.5]
      },
      yaxis3: {
        title: '거래량',
        titlefont: {color: '#00FFAA'},
        tickfont: {color: '#00FFAA'},
        anchor: 'x',
        overlaying: 'y',
        side: 'right',
        domain: [0, 0.25]
      },
      shapes: [
        // RSI 과매수/과매도 영역
        {
          type: 'rect',
          xref: 'paper',
          yref: 'y2',
          x0: 0,
          y0: 70,
          x1: 1,
          y1: 100,
          fillcolor: 'rgba(255, 0, 0, 0.1)',
          line: {width: 0}
        },
        {
          type: 'rect',
          xref: 'paper',
          yref: 'y2',
          x0: 0,
          y0: 0,
          x1: 1,
          y1: 30,
          fillcolor: 'rgba(0, 255, 0, 0.1)',
          line: {width: 0}
        },
        // 예측 시작선
        {
          type: 'line',
          xref: 'x',
          yref: 'paper',
          x0: data.last_date,
          y0: 0,
          x1: data.last_date,
          y1: 1,
          line: {
            color: 'white',
            width: 1,
            dash: 'dash'
          }
        },
        // 지지/저항선
        ...data.support_levels.map(level => ({
          type: 'line',
          xref: 'paper',
          yref: 'y',
          x0: 0,
          y0: level,
          x1: 1,
          y1: level,
          line: {
            color: 'green',
            width: 1,
            dash: 'dash'
          }
        })),
        ...data.resistance_levels.map(level => ({
          type: 'line',
          xref: 'paper',
          yref: 'y',
          x0: 0,
          y0: level,
          x1: 1,
          y1: level,
          line: {
            color: 'red',
            width: 1,
            dash: 'dash'
          }
        }))
      ],
      annotations: [
        {
          xref: 'x',
          yref: 'paper',
          x: data.last_date,
          y: 1,
          text: '예측 시작',
          showarrow: true,
          arrowhead: 0,
          arrowcolor: 'white',
          arrowsize: 0.3,
          ax: 40,
          ay: 0,
          bgcolor: 'rgba(0, 0, 0, 0.8)',
          bordercolor: 'white',
          borderwidth: 1,
          borderpad: 4,
          font: {color: 'white'}
        }
      ],
      legend: {
        orientation: 'h',
        y: 1.12,
        font: {size: 10}
      }
    }
    
    setPlotConfig({
      data: [candlestick, sma20, sma50, sma200, prediction, upperBound, lowerBound, rsi, volume],
      layout: layout,
      config: {responsive: true}
    })
  }
  
  // 티커가 변경되면 예측 실행
  useEffect(() => {
    if (ticker) {
      fetchPrediction()
    }
  }, [ticker])
  
  // 추천 색상 결정
  const getRecommendationColor = (rec) => {
    switch(rec) {
      case '강력 매수': return 'text-[#00FFAA] font-bold'
      case '매수': return 'text-[#00FFAA]'
      case '중립': return 'text-[#FFFF00]'
      case '매도': return 'text-[#FF5E5E]'
      case '강력 매도': return 'text-[#FF5E5E] font-bold'
      default: return 'text-white'
    }
  }
  
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Head>
        <title>{ticker ? `${ticker} 주가 예측` : '주가 예측'} | 포트폴리오 최적화 시스템</title>
        <meta name="description" content={`${ticker || '주식'} 기술적 지표 기반 주가 예측 분석`} />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#00ABFF]">
            {ticker ? `${ticker} 주가 예측 분석` : '주가 예측 분석'}
          </h1>
          <p className="text-[#AAAAAA] mt-2">이동평균선, RSI, 거래량을 활용한 종합 주가 예측</p>
        </div>
        
        {/* 설정 컨트롤 */}
        <div className="card mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center">
              <label className="mr-2 text-sm">과거 데이터(일):</label>
              <select 
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="bg-[#2E2E2E] text-white border border-gray-800 rounded px-2 py-1"
              >
                {[100, 150, 200, 250, 300, 500].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center">
              <label className="mr-2 text-sm">예측 기간(일):</label>
              <select 
                value={futureDays}
                onChange={(e) => setFutureDays(Number(e.target.value))}
                className="bg-[#2E2E2E] text-white border border-gray-800 rounded px-2 py-1"
              >
                {[10, 20, 30, 40, 50, 60].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={fetchPrediction}
              className="bg-[#00ABFF] hover:bg-[#0099E6] text-white px-4 py-1 rounded"
            >
              예측 실행
            </button>
          </div>
        </div>
        
        {/* 로딩 상태 */}
        {loading && (
          <div className="card flex flex-col items-center justify-center p-12 min-h-[600px]">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#00ABFF] mb-4"></div>
            <h3 className="text-xl font-medium mt-4">{ticker} 주가 데이터 분석 중...</h3>
            <p className="text-[#AAAAAA] mt-2">이동평균선, RSI, 거래량 패턴을 분석하고 있습니다</p>
          </div>
        )}
        
        {/* 에러 상태 */}
        {error && (
          <div className="card bg-red-900 bg-opacity-20 p-4">
            <h3 className="text-xl font-bold text-red-500">오류 발생</h3>
            <p>{error}</p>
          </div>
        )}
        
        {/* 결과 표시 */}
        {!loading && !error && data && (
          <>
            {/* 차트 */}
            <div className="card mb-6">
              {plotConfig ? (
                <Plot 
                  data={plotConfig.data} 
                  layout={plotConfig.layout} 
                  config={plotConfig.config}
                  style={{width: '100%', height: '100%'}}
                />
              ) : (
                <div className="flex items-center justify-center p-12 h-[600px]">
                  <p>차트 데이터 준비 중...</p>
                </div>
              )}
            </div>
            
            {/* 예측 요약 및 기술적 분석 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="card">
                <h3 className="text-xl font-bold mb-4">예측 요약</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-[#2E2E2E] rounded-lg">
                    <p className="text-[#AAAAAA] text-sm">현재 가격</p>
                    <p className="text-xl font-bold">${data.current_price.toFixed(2)}</p>
                  </div>
                  
                  <div className="p-3 bg-[#2E2E2E] rounded-lg">
                    <p className="text-[#AAAAAA] text-sm">예상 가격</p>
                    <p className="text-xl font-bold">${data.final_price.toFixed(2)}</p>
                  </div>
                  
                  <div className="p-3 bg-[#2E2E2E] rounded-lg">
                    <p className="text-[#AAAAAA] text-sm">예상 수익률</p>
                    <p className={`text-xl font-bold ${data.expected_return >= 0 ? 'text-[#00FFAA]' : 'text-[#FF5E5E]'}`}>
                      {data.expected_return >= 0 ? '+' : ''}{data.expected_return.toFixed(2)}%
                    </p>
                  </div>
                  
                  <div className="p-3 bg-[#2E2E2E] rounded-lg">
                    <p className="text-[#AAAAAA] text-sm">투자 제안</p>
                    <p className={`text-xl ${getRecommendationColor(data.recommendation)}`}>
                      {data.recommendation}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-xl font-bold mb-4">기술적 분석</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-[#2E2E2E] rounded-lg">
                    <div>
                      <p className="text-[#AAAAAA] text-sm">RSI 지표</p>
                      <p className="font-bold">{data.rsi.status} ({data.rsi.current.toFixed(2)})</p>
                    </div>
                    <div className="w-32 h-3 bg-[#333333] rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${data.rsi.current > 70 ? 'bg-red-500' : data.rsi.current < 30 ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{width: `${data.rsi.current}%`}}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-[#2E2E2E] rounded-lg">
                    <div>
                      <p className="text-[#AAAAAA] text-sm">현재 추세</p>
                      <p className={`font-bold ${data.trend === '상승세' ? 'text-[#00FFAA]' : 'text-[#FF5E5E]'}`}>
                        {data.trend}
                      </p>
                    </div>
                    <div className="text-2xl">
                      {data.trend === '상승세' ? '📈' : '📉'}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-[#2E2E2E] rounded-lg">
                    <div>
                      <p className="text-[#AAAAAA] text-sm">거래량 상태</p>
                      <p className="font-bold">{data.volume.status}</p>
                    </div>
                    <div className="text-sm font-semibold">
                      {data.volume.recent_avg > 1.5 ? 
                        '거래량 스파이크 가능성 높음' : 
                        data.volume.recent_avg < 0.7 ? 
                          '거래량 낮음' : 
                          '정상 거래량'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 예측 데이터 테이블 */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4">미래 예측 데이터</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#2E2E2E]">
                      <th className="p-2 text-left">날짜</th>
                      <th className="p-2 text-right">예측가격 ($)</th>
                      <th className="p-2 text-right">하한 ($)</th>
                      <th className="p-2 text-right">상한 ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.forecast_data
                      .filter(item => new Date(item.ds) > new Date(data.last_date))
                      .map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-[#1A1A1A]' : 'bg-[#222222]'}>
                          <td className="p-2">{new Date(item.ds).toLocaleDateString()}</td>
                          <td className="p-2 text-right">{item.yhat.toFixed(2)}</td>
                          <td className="p-2 text-right">{item.yhat_lower.toFixed(2)}</td>
                          <td className="p-2 text-right">{item.yhat_upper.toFixed(2)}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        
        {/* 티커가 없는 경우 */}
        {!ticker && !loading && (
          <div className="card flex flex-col items-center justify-center p-12">
            <svg className="w-32 h-32 text-[#333333] mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <h2 className="text-2xl font-bold text-center mb-2">티커 심볼을 입력하세요</h2>
            <p className="text-[#AAAAAA] text-center">
              예: /forecast/AAPL 또는 /forecast/QQQ 형식의 URL로 접근하세요
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
