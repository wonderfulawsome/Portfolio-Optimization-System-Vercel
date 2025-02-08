// api.js
export async function optimizePortfolio(data) {
    try {
      const response = await fetch("https://portfolio-optimization-system.onrender.com/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      return null;
    }
  }
  