import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import { FaRegComments } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Critic = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [hasMounted, setHasMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const checkSession = async () => {
    try {
      console.log('🔍 Checking session...');
      const sessionRes = await fetch('http://localhost:4000/api/check-session', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Session response status:', sessionRes.status);

      if (!sessionRes.ok) {
        console.warn('⚠️ Gagal cek session');
        setIsLoggedIn(false);
        setIsProfileComplete(false);
        return { isLoggedIn: false, userEmail: '', allowedToComment: false };
      }

      const sessionData = await sessionRes.json();
      console.log('📊 Session data:', sessionData);

      if (!sessionData.isLoggedIn || !sessionData.userEmail) {
        console.log('❌ Tidak ada session aktif');
        setIsLoggedIn(false);
        setIsProfileComplete(false);
        return { isLoggedIn: false, userEmail: '', allowedToComment: false };
      }

      setIsLoggedIn(true);
      setUserEmail(sessionData.userEmail);

      // Cek status user: boleh komentar hanya jika profil lengkap DAN status aktif
      const statusRes = await fetch(`http://localhost:4000/auth/status?email=${encodeURIComponent(sessionData.userEmail)}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!statusRes.ok) {
        console.warn('⚠️ Gagal cek status user');
        setIsProfileComplete(false);
        return { isLoggedIn: true, userEmail: sessionData.userEmail, allowedToComment: false };
      }

      const statusData = await statusRes.json();
      console.log('📊 Status data:', statusData);
      const allowedToComment = statusData.profile_complete === true && statusData.status === 'aktif';
      setIsProfileComplete(allowedToComment);

      return {
        isLoggedIn: true,
        userEmail: sessionData.userEmail,
        allowedToComment,
      };
    } catch (error) {
      console.error('❌ Error checking login status:', error);
      setIsLoggedIn(false);
      setIsProfileComplete(false);
      return { isLoggedIn: false, userEmail: '', allowedToComment: false };
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true);
      await checkSession();
      setIsLoading(false);
      setHasMounted(true);
    };

    initializeApp();
  }, [navigate]);

  const handleSubmit = async () => {
    if (!name || !message) {
      alert('Name and comment are required.');
      return;
    }

    // Ambil status terbaru dari server (jangan andalkan state, bisa stale)
    const { isLoggedIn: loggedIn, allowedToComment } = await checkSession();

    if (!loggedIn) {
      alert('You must sign in first to submit feedback.');
      navigate('/login');
      return;
    }

    if (!allowedToComment) {
      alert('You are not yet allowed to comment. Please register, sign in, and ensure your account is active.');
      navigate('/profile');
      return;
    }

    try {
      setIsLoading(true);
      console.log('📤 Sending critic...', { name, message });
      
      const res = await fetch('http://localhost:4000/critics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, content: message }),
      });

      const data = await res.json();
      console.log('📥 Critic response:', data);

      if (res.ok) {
        console.log('✅ Critic Saved:', data);
        alert('Kritik berhasil dikirim!');
        setMessage('');
        setName('');
      } else {
        console.warn('⚠️ Gagal simpan kritik:', data.error);
        
        if (res.status === 403) {
          alert('You must sign in first to submit feedback.');
          navigate('/login');
        } else if (res.status === 400) {
          alert(`❌ ${data.error}`);
        } else {
          alert('An error occurred whilst submitting feedback.');
        }
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Terjadi kesalahan saat mengirim feedback.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleProfileRedirect = () => {
    navigate('/profile');
  };

  const handleRefreshSession = async () => {
    setIsLoading(true);
    await checkSession();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text flex flex-col justify-between">
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: hasMounted ? 1 : 0, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl bg-white dark:bg-white rounded shadow-md"
        >
          {/* Header */}
          <div className="bg-[#0E1E32] text-white text-center py-4 rounded-t text-xl font-bold flex items-center justify-center gap-2">
            <FaRegComments className="text-white text-3xl" />
            <span style={{ fontFamily: "'STIX Two Text', serif" }}>Provide Feedback</span>
          </div>

          {/* Form */}
          <div className="p-8 flex flex-col items-center w-full">
            {/* Debug Info */}
            <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded mb-4 w-full text-xs">
              <strong>Debug Info:</strong> {isLoggedIn ? `Logged in as: ${userEmail}` : 'Not logged in'} | 
              Profile: {isProfileComplete ? 'Complete' : 'Incomplete'} |
              <button 
                onClick={handleRefreshSession}
                className="ml-2 bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
              >
                Refresh Status
              </button>
            </div>

            {/* Status Info */}
            {isLoading && (
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 w-full">
                <strong>Loading...</strong> Checking sign-in status...
              </div>
            )}

            {!isLoading && !isLoggedIn && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 w-full">
                <strong>Notice.</strong> You must sign in first to submit feedback.
                <button 
                  onClick={handleLoginRedirect}
                  className="ml-2 bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                >
                  Sign in now
                </button>
              </div>
            )}

            {!isLoading && isLoggedIn && !isProfileComplete && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 w-full">
                <strong>Notice.</strong> Your profile is incomplete. Please complete your profile before submitting feedback.
                <button 
                  onClick={handleProfileRedirect}
                  className="ml-2 bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                >
                  Complete profile
                </button>
              </div>
            )}

            {!isLoading && isLoggedIn && isProfileComplete && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 w-full">
                <strong>Status:</strong> You may submit feedback. Signed in as: {userEmail}
              </div>
            )}

            {/* Input fields */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="bg-white text-gray-800 border border-gray-300 rounded shadow-sm w-full p-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please provide your feedback here"
              className="bg-white text-gray-800 border border-gray-300 rounded shadow-sm w-full h-40 p-4 mb-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: isLoggedIn && isProfileComplete && !isLoading && name && message ? 1.05 : 1 }}
              whileTap={{ scale: isLoggedIn && isProfileComplete && !isLoading && name && message ? 0.95 : 1 }}
              onClick={handleSubmit}
              disabled={isLoading || !name || !message}
              className={`font-semibold px-6 py-3 rounded-full transition duration-300 min-w-[120px] ${
                isLoading 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : isLoggedIn && isProfileComplete && name && message
                  ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : !isLoggedIn ? (
                'Sign in first'
              ) : !isProfileComplete ? (
                'Complete profile'
              ) : !name || !message ? (
                'Complete the form'
              ) : (
                'Submit feedback'
              )}
            </motion.button>

            {/* Additional Info */}
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>You may fill in the feedback form at any time.</p>
              <p>Feedback will be submitted once you are signed in with a complete profile.</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Critic;