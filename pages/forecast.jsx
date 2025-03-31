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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-16">
      <h1 className="text-5xl font-bold text-white mb-16 tracking-tight">📊 Select a Forecast Target</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-5xl">
        {tickers.map((item) => (
          <button
            key={item.symbol}
            onClick={() => handleClick(item.symbol)}
            className="bg-gradient-to-tr from-[#2c2c2e] to-[#1c1c1e] text-white rounded-2xl px-12 py-10 text-xl font-semibold shadow-xl hover:from-[#3a3a3c] hover:to-[#2c2c2e] transition-all duration-300 ease-in-out transform hover:scale-105 border border-gray-700"
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
