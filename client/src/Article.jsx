import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import { motion } from 'framer-motion';
import { ClipLoader } from 'react-spinners';
import logo from './assets/logo.png'; // sesuaikan path jika perlu

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
          setArticles(data.articles.slice(0, 15));
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
        <img src={logo} alt="Logo" className="w-14 h-14 mb-4 animate-pulse" />
        <ClipLoader color="#ffffff" size={40} />
        <p className="mt-2 text-sm">Loading Article...</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="App min-h-screen font-sans flex items-center justify-center bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text">
        <p>Tidak ada artikel yang tersedia.</p>
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
          <h1 className="text-4xl font-semibold text-center text-white m-0">Article</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 mb-20 space-y-10">
        {articles.map((article, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="bg-white dark:bg-[#1A2A45] dark:text-white rounded-lg shadow-md p-6"
          >
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleString()
                : 'Tanggal tidak tersedia'}{' '}
              &nbsp;|&nbsp; by {article.source?.name || 'Unknown'} &nbsp;|&nbsp; 2 min read
            </p>
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
              {article.title}
            </h2>
            <p className="text-gray-700 dark:text-gray-200 mb-2">
              {article.description || 'Tidak ada deskripsi.'}
            </p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Read more
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Article;