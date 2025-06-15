import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css';

const API_KEY = '01d3df6599db4d749cf23b47b150c8ce';
const BASE_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

function Article() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(BASE_URL);
        const data = await response.json();
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles.slice(0, 15)); // ✅ 15 artikel
        }
      } catch (error) {
        console.error('Gagal mengambil artikel:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="App bg-gray-50 min-h-screen text-gray-800 font-sans flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="App bg-gray-50 min-h-screen text-gray-800 font-sans flex items-center justify-center">
        <p>Tidak ada artikel yang tersedia.</p>
      </div>
    );
  }

  return (
    <div className="App bg-gray-50 min-h-screen text-gray-800 font-sans">
      <div className="container mx-auto px-6 my-10">
        <div
          className="w-full rounded-lg mb-10 flex items-center justify-center"
          style={{ backgroundColor: '#0E1E32', minHeight: '120px' }}
        >
          <h1 className="text-4xl font-semibold text-center text-white m-0">Article</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mb-20 space-y-10">
        {articles.map((article, index) => (
          <div key={index}>
            <p className="text-sm text-gray-500 mb-2">
              {article.publishedAt ? new Date(article.publishedAt).toLocaleString() : 'Tanggal tidak tersedia'} &nbsp;|&nbsp; 
              by {article.source?.name || 'Unknown'} &nbsp;|&nbsp; 2 min read
            </p>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{article.title}</h2>
            <p className="text-gray-700 mb-2">{article.description || 'Tidak ada deskripsi.'}</p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Read more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Article;