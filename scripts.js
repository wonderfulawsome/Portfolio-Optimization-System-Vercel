document.getElementById('optimize-button').addEventListener('click', function() {
    const formData = {
      PER: document.getElementById('PER').value,
      DividendYield: document.getElementById('DividendYield').value,
      Beta: document.getElementById('Beta').value,
      RSI: document.getElementById('RSI').value,
      Volume: document.getElementById('Volume').value,
      Volatility: document.getElementById('Volatility').value,
    };
  
    // 필수 입력값이 빠지면 경고
    for (const key in formData) {
      if (formData[key] === "") {
        alert(`${key} 값을 선택해주세요.`);
        return;
      }
    }
  
    fetch("http://127.0.0.1:5000/optimize", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      document.getElementById("result").innerText = 
        "추천 기업: " + data.optimized_companies.join(", ");
    })
    .catch(error => console.error("Error:", error));
  });
  