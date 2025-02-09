// api.js
export async function optimizePortfolio({
    PER,
    DividendYield,
    Beta,
    RSI,
    volume,
    Volatility,
  }) {
    try {
      const response = await fetch(
        "https://portfolio-optimization-system-flask.onrender.com/optimize",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            PER,
            DividendYield,
            Beta,
            RSI,
            volume,
            Volatility,
          }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      return null;
    }
  }
  