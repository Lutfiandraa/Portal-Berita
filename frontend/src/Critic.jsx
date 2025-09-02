import React, { useState } from 'react';
import './App.css';
import './index.css';
import { FaRegComments } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Critic = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!name || !message) {
      alert('Nama dan komentar wajib diisi!');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/critics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, content: message }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log('✅ Critic Saved:', data);
        alert('Kritik berhasil dikirim!');
        setMessage('');
        setName('');
      } else {
        console.warn('⚠️ Gagal simpan kritik:', data.error);
        alert(`Gagal mengirim kritik: ${data.error}`);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Terjadi kesalahan saat mengirim feedback.');
    }
  };

  return (
    <div className="min-h-screen bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text flex flex-col justify-between">
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-3xl bg-white dark:bg-white rounded shadow-md">
          {/* Header */}
          <div className="bg-[#0E1E32] text-white text-center py-4 rounded-t text-xl font-bold flex items-center justify-center gap-2">
            <FaRegComments className="text-white text-3xl" />
            Provide Feedback
          </div>

          {/* Form */}
          <div className="p-8 flex flex-col items-center w-full">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="bg-white text-gray-800 border border-gray-300 rounded shadow-sm w-full p-3 mb-4 text-sm"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please provide your feedback here"
              className="bg-white text-gray-800 border border-gray-300 rounded shadow-sm w-full h-40 p-4 mb-4 text-sm resize-none"
            ></textarea>

            {/* Animated Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300"
            >
              Submit
            </motion.button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Critic;