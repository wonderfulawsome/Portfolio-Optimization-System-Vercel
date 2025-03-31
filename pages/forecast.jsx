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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-semibold mb-10 text-gray-900">Choose Asset to Forecast</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl">
        {tickers.map((item) => (
          <button
            key={item.symbol}
            onClick={() => handleClick(item.symbol)}
            className="bg-white text-gray-900 rounded-2xl shadow-md px-8 py-6 text-lg font-medium hover:bg-gray-200 transition transform hover:-translate-y-1"
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
