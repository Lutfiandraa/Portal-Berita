import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners';
import logo from '../assets/logo.png';

const API_KEY = '01d3df6599db4d749cf23b47b150c8ce';
const BASE_URL = `https://newsapi.org/v2/top-headlines?country=us&pageSize=30&apiKey=${API_KEY}`;

const NewsList = () => {
  const [articles, setArticles] = useState([]);
  const [visibleCount, setVisibleCount] = useState(21);
  const [searchTerm, setSearchTerm] = useState('');
  const [placeholderList, setPlaceholderList] = useState([]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${BASE_URL}&timestamp=${Date.now()}`);
        const data = await response.json();
        if (data.status === 'ok') {
          setArticles(data.articles);
          const titles = data.articles.map(a => a.title).filter(Boolean);
          const words = titles.flatMap(t => t.split(' '));
          const keywordCandidates = words.filter(w => w.length > 4);
          const unique = [...new Set(keywordCandidates)].slice(0, 50);
          setPlaceholderList(unique);
        }
      } catch (error) {
        console.error('Gagal mengambil berita:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
    const intervalId = setInterval(fetchNews, 300000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % (placeholderList.length || 1));
    }, 3000);
    return () => clearInterval(intervalId);
  }, [placeholderList]);

  const filteredArticles = articles.filter(article =>
    article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#0E1E32]">
        <img src={logo} alt="Logo" className="w-14 h-14 mb-4 animate-pulse" />
        <ClipLoader color="#ffffff" size={40} />
        <p className="mt-2 text-sm">Loading News...</p>
      </div>
    );
  }

  return (
    <>
      {/* Search & Heading */}
      <div className="container mx-auto px-6 my-10">
        <div className="flex items-center justify-between bg-[#0E1E32] text-white p-3 rounded font-semibold">
          <input
            type="text"
            placeholder={
              placeholderList.length > 0
                ? `Search: ${placeholderList[placeholderIndex]}`
                : 'Search Breaking News...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-gray-800 px-4 py-2 rounded w-1/3"
          />
          <div className="text-center flex-1">
            <span className="text-white text-xl font-semibold">Explore Content</span>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
        {filteredArticles.slice(0, visibleCount).map((article, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden flex flex-col"
          >
            {article.urlToImage ? (
              <img
                src={article.urlToImage}
                alt={article.title || 'thumbnail'}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="w-full h-40 bg-gray-300 flex items-center justify-center text-gray-600">
                No Image
              </div>
            )}

            <div className="p-3 flex flex-col justify-between flex-grow">
              <div>
                <h3 className="font-semibold text-base mb-1 line-clamp-2 text-gray-800 dark:text-gray-100">
                  {article.title || 'No title available'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                  {article.description || 'Tidak ada deskripsi.'}
                </p>
                {article.source?.name && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                    (source: {article.source.name})
                  </p>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleString()
                    : 'Tanggal tidak tersedia'}
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
          </motion.div>
        ))}
      </div>

      {/* View More */}
      {visibleCount < filteredArticles.length && (
        <div className="text-center my-8">
          <button
            className="border border-gray-400 px-6 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100"
            onClick={() => setVisibleCount(prev => prev + 9)}
          >
            View More
          </button>
        </div>
      )}
    </>
  );
};

export default NewsList;