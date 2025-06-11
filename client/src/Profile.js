import React from 'react';

const Profile = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-md w-full max-w-md">
        {/* Head */}
        <div className="bg-[#0E1E32] text-white text-center py-4 rounded-t-md">
          <h2 className="text-xl font-semibold">Complete your Profile</h2>
        </div>
        <div className="flex flex-col items-center py-6 px-4">
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8V22h19.2v-2.8c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>

          <form className="w-full px-6">
            <label className="block text-sm font-semibold mb-1">E-Mail</label>
            <input type="email" placeholder="Fill" className="w-full mb-3 px-4 py-2 border rounded" />

            <label className="block text-sm font-semibold mb-1">Password</label>
            <input type="password" placeholder="Fill" className="w-full mb-3 px-4 py-2 border rounded" />

            <label className="block text-sm font-semibold mb-1">Name</label>
            <input type="text" placeholder="Fill" className="w-full mb-6 px-4 py-2 border rounded" />

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;