document.getElementById('optimize-button').addEventListener('click', function() {
    const formData = {
      pe: document.getElementById('pe').value,
      eps: document.getElementById('eps').value,
      marketCap: document.getElementById('marketCap').value,
      norm_price_diffs: document.getElementById('norm_price_diffs').value,
      norm_price_ranges: document.getElementById('norm_price_ranges').value,
      norm_volume_ratios: document.getElementById('norm_volume_ratios').value,
    };
  
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
