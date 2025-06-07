import React, { useEffect, useState } from 'react';

const API_KEY = '01d3df6599db4d749cf23b47b150c8ce';
const BASE_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

const NewsList = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(BASE_URL);
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('Gagal mengambil berita:', error);
      }
    };

    fetchNews();
  }, []);

  if (articles.length === 0) {
    return <p className="text-center col-span-full">Load...</p>;
  }

  return (
    <>
      {articles.map((article, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
        >
          {article.urlToImage ? (
            <img
              src={article.urlToImage}
              alt={article.title || 'thumbnail'}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-600">
              No Image
            </div>
          )}
          <div className="p-4 flex flex-col justify-between flex-grow">
            <div>
              <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                {article.title || 'No title available'}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3">
                {article.description || 'Tidak ada deskripsi.'}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {article.publishedAt ? new Date(article.publishedAt).toLocaleString() : 'Tanggal tidak tersedia'}
              </p>
            </div>
            <div className="mt-4">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm"
              >
                Read More
              </a>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default NewsList;