import React from 'react';
import './App.css';
import './index.css';

function Article() {
  return (
    <div className="App bg-gray-50 min-h-screen text-gray-800 font-sans">
      {/* Header Title dengan style dan container sama seperti Trending */}
      <div className="container mx-auto px-6 my-10">
        <div
          className="w-full rounded-lg mb-10 flex items-center justify-center"
          style={{
            backgroundColor: '#0E1E32',
            minHeight: '120px'
          }}
        >
          <h1 className="text-4xl font-semibold text-center text-white m-0">Article</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 mb-20">
        {/* Article Info */}
        <p className="text-sm text-gray-500 mb-4 text-center">
          12 hours ago &nbsp;|&nbsp; by winnicode.com &nbsp;|&nbsp; 2min read
        </p>

        {/* Main Content */}
        <p>
          Harga emas PT Aneka Tambang Tbk (ANTM) atau Antam mengalami penurunan pada perdagangan Jumat (25/5). 
          Mengutip situs{' '}
          <a href="https://www.logammulia.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Logam Mulia
          </a>, harga emas hari ini anjlok Rp 20.000 menjadi Rp 1.912.000 per gram.
        </p>

        <p className="mt-3">
          Sementara itu, harga jual kembali atau buyback emas Antam hari ini juga turun Rp 20.000 menjadi Rp 1.761.000 per gram.
        </p>

        <p className="mt-3">
          Dalam{' '}
          <a href="https://peraturan.bpk.go.id/Home/Details/255476/pmk-no-48pmk032023" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            PMK Nomor 48 Tahun 2023
          </a>, konsumen akhir dibebaskan Pajak Penghasilan (PPh) saat membeli emas batangan.
        </p>

        <p className="mt-3">
          Namun, pengusaha emas wajib memungut PPN 22 sebesar 0,25 persen dari harga jual, turun dari aturan sebelumnya sebesar 0,45 persen. Harga emas ini berlaku di Butik Emas Graha Dipta Pulog Gadung, Jakarta. Untuk harga emas di gerai penjualan lain bisa berbeda.
        </p>

        {/* Sub Article */}
        <h2 className="text-xl font-semibold text-gray-700 mt-10 mb-3">
          Jensen Huang: Chip AI China Akan Saingi Nvidia, Huawei Perusahaan Terkuat
        </h2>

        <div className="bg-gray-100 p-3 border-l-4 border-pink-400 mb-4">
          CEO NVIDIA, Jensen Huang menyampaikan pandangan dalam acara diskusi pada Indonesia AI Day (4/4/2025),{' '}
          <a href="https://www.winnicode.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            winnicode.com
          </a>
        </div>

        <p>
          CEO Nvidia, Jensen Huang, mengatakan AS dan China kini bersaing ketat dalam perlombaan teknologi chip AI dunia. Dia mengatakan kepada wartawan di Gedung Capitol, Washington DC, AS, bahwa (30/4) bahwa “China tidak tertinggal” dalam hal ini.
        </p>

        <p className="mt-3">
          Ketika ditanya lebih lanjut oleh wartawan, apakah China lebih unggul dari AS? Jensen menjelaskan, “China tepat di belakang kita. Kita sudah sangat, sangat dekat.”
        </p>

        <p className="mt-3 italic">
          “Ingatlah bahwa ini adalah perlombaan jangka panjang dan tak terbatas,” lanjutnya, mengutip{' '}
          <a href="https://www.businessinsider.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Business Insider
          </a>.
        </p>

        <p className="mt-3">
          Jensen juga memperingatkan bahwa perusahaan telekomunikasi China, Huawei, kini dalam proses untuk menjadi produsen chip AI. Huawei kelak menjadi pesaing utama bagi Nvidia dan perusahaan chip AS.
        </p>

        <p className="mt-3">
          Huawei, yang sudah lama masuk daftar hitam perdagangan AS, kini dilaporkan tengah mengembangkan chip AI miliknya sendiri untuk perusahaan dan startup AI China. Huawei berupaya menjawab kebutuhan pasar domestik China atas kurangnya pasokan chip AI untuk menjalankan komputasi dengan sumber daya sangat besar.
        </p>
      </div>
    </div>
  );
}

export default Article;