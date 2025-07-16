import React, { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';

const API_KEY = '0e47b59c781e4937bc5dd5ad6477e56e';

const SYMBOLS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA'
];

const MarketTicker = () => {
  const [marketData, setMarketData] = useState([]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const symbolsString = SYMBOLS.join(',');
        const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbolsString}&apikey=${API_KEY}`);
        const data = await response.json();
        console.log('✅ Data API:', data);

        // Handle jika data error
        if (data.status === 'error' || data.code) {
          console.error('❌ Error API:', data.message || data.code);
          return;
        }

        const parsedData = SYMBOLS.map((symbol) => {
          const item = data?.[symbol];
          if (!item || item.code || item.status) return null;

          const price = parseFloat(item.close);
          const change = parseFloat(item.change);
          const percent = parseFloat(item.percent_change);

          return {
            symbol,
            price: isNaN(price) ? 0 : price,
            change: isNaN(change) ? 0 : change,
            percent_change: isNaN(percent) ? 0 : percent,
          };
        }).filter(Boolean);

        setMarketData(parsedData);
      } catch (error) {
        console.error('Gagal ambil data saham:', error);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 15 * 60 * 1000); // 15 menit
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0E1E32] py-2">
      <Marquee speed={50} gradient={false} className="text-sm font-medium">
        {marketData.length > 0 ? (
          marketData.map((item, index) => {
            const isPositive = item.change >= 0;
            return (
              <span
                key={index}
                className="mx-6 flex items-center gap-1"
                style={{ color: isPositive ? '#16a34a' : '#dc2626' }}
              >
                {isPositive ? '↑' : '↓'}&nbsp;
                <strong>{item.symbol}</strong>&nbsp;
                {item.price.toFixed(2)}&nbsp;
                <span className="font-normal">
                  {isPositive ? '+' : ''}
                  {item.change.toFixed(2)} ({item.percent_change.toFixed(2)}%)
                </span>
              </span>
            );
          })
        ) : (
          <span className="text-white">Load...</span>
        )}
      </Marquee>
    </div>
  );
};

export default MarketTicker;