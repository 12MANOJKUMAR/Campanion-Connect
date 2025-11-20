import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-800 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Dashboard</h1>
          <p className="text-gray-300 mt-2">Quick overview and shortcuts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="/profile" className="block bg-slate-700/70 rounded-2xl p-6 border border-slate-600 hover:border-blue-400/50 transition-colors">
            <h3 className="text-xl font-semibold text-white mb-2">My Profile</h3>
            <p className="text-gray-300">View your account and activity.</p>
          </a>
          <a href="/setting" className="block bg-slate-700/70 rounded-2xl p-6 border border-slate-600 hover:border-blue-400/50 transition-colors">
            <h3 className="text-xl font-semibold text-white mb-2">Settings</h3>
            <p className="text-gray-300">Edit profile and preferences.</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


