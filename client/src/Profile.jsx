import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa'; // ✅ Tambahkan ini

const Profile = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      fetch(`http://localhost:4000/profile?email=${savedEmail}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.name && data.email) {
            setProfileComplete(true);
            setFormData({
              email: data.email,
              password: '',
              name: data.name,
            });
          }
        })
        .catch((err) => console.error('❌ Error fetch profil:', err));
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Data sent to backend:', formData);

    try {
      const response = await fetch('http://localhost:4000/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('✅ Response from backend:', result);

      if (response.ok) {
        localStorage.setItem('userEmail', formData.email);
        setProfileComplete(true);
        alert('Successfully saved your profile!');
      } else {
        alert(result.error || 'Terjadi kesalahan.');
      }
    } catch (error) {
      console.error('❌ Gagal mengirim data:', error);
      alert('Something went wrong while saving your profile.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen pt-24 bg-gray-100">
      <div className="bg-white shadow-lg rounded-md w-full max-w-md mb-16">
        <div className="bg-[#0E1E32] text-white text-center py-4 rounded-t-md">
          <h2 className="text-xl font-semibold">
            {profileComplete ? 'Profile Completed!' : 'Complete your Profile'}
          </h2>
        </div>

        <div className="flex flex-col items-center py-6 px-4">
          {profileComplete ? (
            <p className="mb-4 text-green-600 font-semibold text-sm flex items-center gap-2">
              <FaCheckCircle className="text-green-600" /> Your profile has been completed.
            </p>
          ) : (
            <form className="w-full px-6" onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold mb-1">E-Mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="E-Mail"
                className="w-full mb-3 px-4 py-2 border rounded text-xs"
              />

              <label className="block text-sm font-semibold mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full mb-3 px-4 py-2 border rounded text-xs"
              />

              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full mb-6 px-4 py-2 border rounded text-xs"
              />

              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-1.5 text-sm rounded-full hover:bg-blue-700 transition font-semibold shadow w-full mb-4"
              >
                Submit
              </button>

              {/*Button Login */}
              <Link to="/login" className="block text-center text-sm text-blue-600 hover:underline font-medium">
                Already have an account? Login here
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;