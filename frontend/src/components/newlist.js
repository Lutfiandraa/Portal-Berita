import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners';
import logo from '../assets/logo.png';
import { FaSearch, FaArrowRight } from 'react-icons/fa';

const API_KEY = "01d3df6599db4d749cf23b47b150c8ce";
const BASE_URL = `https://newsapi.org/v2/top-headlines?country=us&pageSize=50&apiKey=${API_KEY}`;

const NewsList = () => {
  const [articles, setArticles] = useState([]);
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
          setArticles(data.articles || []);
          const titles = (data.articles || []).map(a => a.title).filter(Boolean);
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

  const filteredArticles = articles.filter(
    (article) =>
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const headline = filteredArticles[0];
  const gridTop = filteredArticles.slice(1, 5);
  const terpopuler = filteredArticles.slice(5, 15);
  const rest = filteredArticles.slice(15);

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '';

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#0E1E32]">
        <img src={logo} alt="Garuda Tribune" className="w-14 h-14 mb-4 animate-pulse" />
        <ClipLoader color="#ffffff" size={40} />
        <p className="mt-2 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Search bar - di bawah ticker, cari dari 50 berita */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="w-full sm:max-w-md relative">
              <input
                type="text"
                placeholder={
                  placeholderList.length > 0
                    ? `Search: ${placeholderList[placeholderIndex]}`
                    : 'Search across 50 latest stories...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-gray-800 dark:text-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {filteredArticles.length} stories
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Hero / Headline */}
        {headline && (
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <a
              href={headline.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-md">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[320px]">
                    <img
                      src={headline.urlToImage || 'https://via.placeholder.com/800x450?text=No+Image'}
                      alt={headline.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded">
                      Headline
                    </span>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {formatDate(headline.publishedAt)} · {headline.source?.name || 'News'}
                    </p>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-3">
                      {headline.title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                      {headline.description || 'Read more.'}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-sm">
                      Read more <FaArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </motion.article>
        )}

        {/* Grid 4 berita di bawah headline - Kilas */}
        {gridTop.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {gridTop.map((article, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg overflow-hidden group"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={article.urlToImage || 'https://via.placeholder.com/400x225?text=No+Image'}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {article.source?.name} · {formatDate(article.publishedAt)}
                    </p>
                    <h2 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {article.title}
                    </h2>
                  </div>
                </a>
              </motion.article>
            ))}
          </div>
        )}

        {/* Terpopuler + Grid kanan - layout 2 kolom */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Daftar Terpopuler */}
          {terpopuler.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b-2 border-red-600 w-fit">
                  Most Read
                </h2>
                <ol className="space-y-3">
                  {terpopuler.map((article, index) => (
                    <li key={index}>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex gap-3 group"
                      >
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-200">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-800 dark:text-gray-100 text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {article.title}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* Berita lainnya - grid */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Latest News</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {rest.map((article, index) => (
                <motion.article
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(index * 0.03, 0.3) }}
                >
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md p-3 group"
                  >
                    <div className="w-28 h-24 flex-shrink-0 rounded overflow-hidden">
                      <img
                        src={article.urlToImage || 'https://via.placeholder.com/112x96?text=No+Image'}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                        {article.source?.name}
                      </p>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {formatDate(article.publishedAt)}
                      </p>
                    </div>
                  </a>
                </motion.article>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center text-gray-500 dark:text-gray-400">
                No stories match your search.
              </div>
            )}
          </div>
        </div>

        <div className="pb-20" />
      </div>
    </div>
  );
};

export default NewsList;
