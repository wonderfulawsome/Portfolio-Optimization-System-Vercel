# Portfolio Optimization API

## 1️⃣ 최적 포트폴리오 계산
### `POST /optimize`
- **설명:** 사용자가 선택한 `high`, `medium`, `low` 값을 기반으로 최적 포트폴리오 추천.
- **Request Body (JSON)**
```json
{
    "pe": "high",
    "eps": "medium", 
    "marketCap": "low",
    "norm_price_diffs": "medium",
    "norm_price_ranges": "high",
    "norm_volume_ratios": "low"
}
