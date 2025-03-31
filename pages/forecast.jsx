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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-8 py-16">
      <h1 className="text-5xl font-bold text-gray-200 mb-10 tracking-tight">Select a Forecast Target</h1>
      <p className="text-gray-400 mb-12 max-w-2xl text-center text-lg">
        Choose one of the major indices or Bitcoin to see a predicted price trend.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
        {tickers.map((item) => (
          <button
            key={item.symbol}
            onClick={() => handleClick(item.symbol)}
            className="rounded-2xl bg-gradient-to-t from-zinc-900 to-zinc-800 text-gray-100 px-10 py-8 text-xl font-medium shadow-md transform transition-transform duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
