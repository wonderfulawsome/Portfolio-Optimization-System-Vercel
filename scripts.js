document.getElementById('optimize-button').addEventListener('click', async () => {
  const formData = {
    pe: document.getElementById('pe').value,
    eps: document.getElementById('eps').value,
    marketCap: document.getElementById('marketCap').value,
    norm_price_diffs: document.getElementById('norm_price_diffs').value,
    norm_price_ranges: document.getElementById('norm_price_ranges').value,
    norm_volume_ratios: document.getElementById('norm_volume_ratios').value
  };

  // 빈 값 검증
  if (Object.values(formData).some(v => !v)) {
    alert('모든 필드를 선택해주세요');
    return;
  }

  try {
    const response = await fetch('https://portfolio-optimization-system-flask.onrender.com/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    
    if (data.error) {
      document.getElementById('result').innerHTML = `<p>에러: ${data.error}</p>`;
      return;
    }

    let html = '<h2>최적화 결과</h2>';
    html += '<h3>포트폴리오 비중</h3><ul>';
    for (const [ticker, weight] of Object.entries(data.optimal_portfolio)) {
      html += `<li>${ticker}: ${weight}%</li>`;
    }
    html += '</ul>';
    html += `<p>예상 수익률: ${(data.expected_return * 100).toFixed(2)}%</p>`;
    html += `<p>예상 변동성: ${(data.expected_volatility * 100).toFixed(2)}%</p>`;
    
    document.getElementById('result').innerHTML = html;
  } catch (error) {
    document.getElementById('result').innerHTML = `<p>에러: ${error.message}</p>`;
  }
});
