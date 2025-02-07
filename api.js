import axios from "axios";

const BASE_URL = "https://flask-api.onrender.com"; // 백엔드 주소

export async function optimizePortfolio(data) {
    try {
        const response = await axios.post(`${BASE_URL}/optimize`, data, {
            headers: { "Content-Type": "application/json" },
        });
        return response.data;
    } catch (error) {
        console.error("Error calling optimize API:", error);
        return { error: "API 요청 실패" };
    }
}
