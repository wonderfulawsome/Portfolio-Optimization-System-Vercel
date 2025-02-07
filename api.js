const BASE_URL = "https://portfolio-optimization-system.onrender.com";

export const optimizePortfolio = async (userInput) => {
    try {
        const response = await fetch(`${BASE_URL}/optimize`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userInput),
        });

        return await response.json();
    } catch (error) {
        console.error("Error optimizing portfolio:", error);
        return null;
    }
};
