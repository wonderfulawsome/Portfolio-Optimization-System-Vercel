export async function optimizePortfolio({
    pe,
    eps,
    marketCap,
    norm_price_diffs,
    norm_price_ranges,
    norm_volume_ratios,
  }) {
    try {
      const response = await fetch(
        "https://portfolio-optimization-system-flask.onrender.com/optimize",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pe,
            eps,
            marketCap,
            norm_price_diffs,
            norm_price_ranges,
            norm_volume_ratios,
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
