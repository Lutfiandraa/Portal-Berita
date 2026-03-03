import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import { motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners';
import logo from './assets/logo.png';

const API_KEY = '01d3df6599db4d749cf23b47b150c8ce';
const BASE_URL = `https://newsapi.org/v2/top-headlines?country=us&pageSize=50&apiKey=${API_KEY}`;

function Article() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(BASE_URL);
        const data = await response.json();
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles.slice(0, 50));
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0E1E32] text-white">
        <img src={logo} alt="Garuda Tribune" className="w-14 h-14 mb-4 animate-pulse" />
        <ClipLoader color="#ffffff" size={40} />
        <p className="mt-2 text-sm">Loading Article...</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="App min-h-screen font-sans flex items-center justify-center bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
        <p>No articles available.</p>
      </div>
    );
  }

  return (
    <div className="App min-h-screen font-sans bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
      <div className="container mx-auto px-6 my-10">
        <div
          className="w-full rounded-lg mb-10 flex items-center justify-center bg-[#0E1E32] dark:bg-[#1A2A45]"
          style={{ minHeight: '120px' }}
        >
          <h1 className="text-4xl font-semibold text-center text-white m-0" style={{ fontFamily: "'STIX Two Text', serif" }}>Article</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article, index) => (
            <motion.article
              key={index}
              className="bg-white dark:bg-[#1A2A45] dark:text-white rounded-lg shadow-md p-4 flex flex-col"
            >
              <div className="flex flex-col flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleString()
                    : 'Date unavailable'}{' '}
                  · {article.source?.name || 'Unknown'}
                </p>
                <h2 className="text-base font-semibold mb-2 text-gray-800 dark:text-white line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-700 dark:text-gray-200 mb-3 line-clamp-3 flex-1">
                  {article.description || 'No description.'}
                </p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  Read more
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Article;