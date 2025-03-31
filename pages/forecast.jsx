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
    <div
      className="flex flex-col items-center justify-center px-8 py-16"
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top left, #111, #000)",
      }}
    >
      <h1
        className="text-5xl font-extrabold mb-6 tracking-tight"
        style={{ color: "#f2f2f2", textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
      >
        Select a Forecast Target
      </h1>
      <p
        className="mb-12 max-w-2xl text-center text-lg"
        style={{ color: "#bdbdbd", lineHeight: "1.5" }}
      >
        Choose one of the major indices or Bitcoin to see a predicted price trend.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {tickers.map((item) => (
          <button
            key={item.symbol}
            onClick={() => handleClick(item.symbol)}
            className="rounded-2xl px-10 py-8 text-xl font-semibold shadow-md border border-gray-700 transform transition-transform duration-300 hover:shadow-2xl hover:-translate-y-1"
            style={{
              background: "linear-gradient(145deg, #333, #222)",
              color: "#fff",
              boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.1)",
            }}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
