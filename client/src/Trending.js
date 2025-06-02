import React from 'react';
import './App.css';
import './index.css';
import arybakri from './assets/arybakri.png';
// import logo from './assets/logo.png'; // Tidak perlu logo & navbar di sini
// import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
// import { Link } from 'react-router-dom';

function Trending() {
  return (
    <div className="App bg-gray-50 min-h-screen text-gray-800 font-sans">
      {/* Content */}
      <div className="container mx-auto px-6 my-10">
        {/* background */}
        <div
          className="w-full rounded-lg mb-10 flex items-center justify-center"
          style={{
            backgroundColor: '#0E1E32',
            minHeight: '120px'
          }}
        >
          <h1 className="text-4xl font-semibold text-center text-white m-0">Trending Today</h1>
        </div>

        {/* Main Article */}
        <div className="max-w-4xl mx-auto mb-12">
          <img
            src={arybakri}
            alt="Trending"
            className="w-full h-72 object-cover rounded-lg mb-6"
          />
          <p className="text-sm text-gray-500 mb-2">12 hours ago &nbsp;|&nbsp; By winnicode.com &nbsp;|&nbsp; 4min read</p>
          <p>
            Kejaksaan Agung memeriksa MJR, nahkoda kapal milik advokat Ariyanto Bakri yang merupakan tersangka kasus dugaan suap dan gratifikasi terkait penanganan perkara di Pengadilan Tindak Pidana Korupsi Jakarta Pusat.
          </p>
          <p className="mt-3">
            MJR diperiksa bersama dua orang lainnya, yaitu AS selaku sopir dari advokat sekaligus tersangka Marcella Santoso, dan LWP selaku Perancang Peraturan Perundang-Undangan Ahli Muda Biro Hukum Kementerian Perdagangan.
          </p>
          <p className="mt-3">
            Kejagung telah menetapkan delapan orang tersangka dalam kasus dugaan suap penanganan perkara di PN Jakarta Pusat terkait kasus vonis lepas ekspor CPO terhadap tiga perusahaan, yakni PT Wilmar Group, PT Permata Hijau Group, dan PT Musim Mas Group.
          </p>
        </div>

        {/* Grid Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[1,2,3,4].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img
                  src="/path-to-coming-soon-image.jpg"
                  alt="Coming Soon"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <span className="text-pink-300 text-xl italic">coming soon</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Coming Soon With News.API</h3>
                <p className="text-gray-600 mb-4">Coming Soon</p>
                <p className="text-xs text-gray-400">2 hours ago &nbsp;|&nbsp; By winnicode.com &nbsp;|&nbsp; 4min read</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Trending;