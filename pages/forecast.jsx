import { useRouter } from "next/router";

export default function Forecast() {
  const router = useRouter();

  const handleClick = (ticker) => {
    router.push(`/forecast/${ticker}`);
  };

  const tickers = [
    { name: "Nasdaq 100", symbol: "QQQ" },
    { name: "SOXX", symbol: "SOXX" },
    { name: "S&P 500", symbol: "SPY" },
    { name: "Dow Jones", symbol: "DIA" },
    { name: "Bitcoin", symbol: "BTC-USD" },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-semibold mb-12 text-white tracking-wide">📈 Forecast Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-4xl">
        {tickers.map((item) => (
          <button
            key={item.symbol}
            onClick={() => handleClick(item.symbol)}
            className="bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-2xl shadow-lg px-10 py-8 text-xl font-semibold hover:from-gray-700 hover:to-gray-600 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
