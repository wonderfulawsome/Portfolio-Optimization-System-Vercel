// pages/index.js
import Link from 'next/link';

export default function Home() {
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
    color: '#fff',
    padding: '40px',
  };

  const boxStyle = {
    display: 'flex',
    gap: '40px',
    marginTop: '30px',
  };

  const cardStyle = {
    backgroundColor: '#222',
    padding: '30px 50px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    textAlign: 'center',
    transition: '0.3s',
    cursor: 'pointer',
  };

  const titleStyle = {
    fontSize: '24px',
    marginBottom: '10px',
    fontWeight: 'bold',
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '36px', textAlign: 'center' }}>
        Welcome to FinOptima
      </h1>
      <p style={{ fontSize: '18px', marginTop: '10px' }}>
        Choose a service below to get started
      </p>
      <div style={boxStyle}>
        <Link href="/portfolio">
          <div style={cardStyle}>
            <div style={titleStyle}>📊 Portfolio Optimization</div>
            <p>Optimize your investments with smart metrics</p>
          </div>
        </Link>
        <Link href="/forecast">
          <div style={cardStyle}>
            <div style={titleStyle}>📈 Price Forecast</div>
            <p>Predict stock price trends with Prophet</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
