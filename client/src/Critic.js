import React from 'react';
import './App.css';
import './index.css';
import { FaRegComments } from 'react-icons/fa';

const Critic = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      {/* Feedback Section */}
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-3xl bg-white rounded shadow-md">
          {/* Header */}
        <div className="bg-[#0E1E32] text-white text-center py-4 rounded-t text-xl font-bold flex items-center justify-center gap-2">
        <FaRegComments className="text-white text-3xl" />
        Provide Feedback
        </div>


          {/* Form */}
          <div className="p-8 flex flex-col items-center">
            <textarea
              placeholder="Fill"
              className="w-full h-40 p-4 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 resize-none"
            ></textarea>
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
              Submit
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Critic;