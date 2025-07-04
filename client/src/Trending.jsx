import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import { motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners';

function Trending() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true); //State loading

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          'https://newsapi.org/v2/top-headlines?country=us&apiKey=01d3df6599db4d749cf23b47b150c8ce'
        );
        const data = await response.json();
        if (data.status === 'ok') {
          setArticles(data.articles.slice(0, 5));
        }
      } catch (error) {
        console.error('Gagal mengambil data berita:', error);
      } finally {
        setTimeout(() => setLoading(false), 1000); //Delay Supaya Halus
      }
    };

    fetchNews();
    const intervalId = setInterval(fetchNews, 300000);
    return () => clearInterval(intervalId);
  }, []);

  const mainArticle = articles[0];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0E1E32] text-white">
        <ClipLoader color="#ffffff" size={40} />
        <p className="mt-3 text-sm">Loading trending...</p>
      </div>
    );
  }

  return (
    <div className="App min-h-screen font-sans bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
      <div className="container mx-auto px-6 my-10">
        {/* Header */}
        <div className="w-full rounded-lg mb-10 flex items-center justify-center bg-[#0E1E32] dark:bg-[#1A2A45]" style={{ minHeight: '120px' }}>
          <h1 className="text-4xl font-semibold text-center text-white m-0">Trending Today</h1>
        </div>

        {/* Main Article */}
        {mainArticle ? (
          <div className="max-w-4xl mx-auto mb-12">
            <img
              src={mainArticle.urlToImage || 'https://via.placeholder.com/800x400?text=No+Image'}
              alt={mainArticle.title}
              className="w-full h-72 object-cover rounded-lg mb-6"
            />
            <p className="text-sm text-gray-500 mb-2">
              {new Date(mainArticle.publishedAt).toLocaleString()} &nbsp;|&nbsp; By {mainArticle.source?.name || 'Unknown'} &nbsp;|&nbsp; ~4min read
            </p>
            <h2 className="text-2xl font-bold mb-3">{mainArticle.title}</h2>
            <p>{mainArticle.description || 'No description available.'}</p>
          </div>
        ) : (
          <p className="text-center">What's Trending?</p>
        )}

        {/* Other Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {articles.slice(1).map((article, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white dark:bg-[#1A2A45] dark:text-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative">
                <img
                  src={article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image'}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 dark:text-blue-400 hover:underline"
                >
                  <h3 className="font-semibold mb-2">{article.title || 'No title available'}</h3>
                </a>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {article.description || 'No description available.'}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-300">
                  {new Date(article.publishedAt).toLocaleString()} &nbsp;|&nbsp; {article.source?.name || 'Unknown'} &nbsp;|&nbsp; ~4min read
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Trending;