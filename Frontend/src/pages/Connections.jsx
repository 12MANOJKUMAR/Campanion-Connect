import React, { useState, useEffect } from 'react';
import { Users, MapPin, MessageCircle, UserMinus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ProfileViewModal from '../components/Dashboard/ProfileViewModal';
import { toast } from 'react-toastify';

const Connections = () => {
  const [connections, setConnections] = useState({ today: [], yesterday: [], older: [] });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disconnectingIds, setDisconnectingIds] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:5000/api/connections/list', {
        headers,
      });

      const data = await response.json();

      if (data.success) {
        setConnections(data.data);
      } else {
        setConnections({ today: [], yesterday: [], older: [] });
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
      setConnections({ today: [], yesterday: [], older: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (connectionId) => {
    if (!connectionId) {
      toast.error('Invalid connection information');
      return;
    }

    setDisconnectingIds(prev => new Set(prev).add(connectionId));
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:5000/api/connections/disconnect/${connectionId}`, {
        method: 'DELETE',
        headers,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Connection disconnected successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Refresh the connections list
        await fetchConnections();
      } else {
        toast.error(data.message || 'Failed to disconnect');
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast.error('Failed to disconnect. Please try again.');
    } finally {
      setDisconnectingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(connectionId);
        return newSet;
      });
    }
  };

  const renderConnectionCard = (connection) => {
    const user = connection.user;
    if (!user) return null;

    return (
      <motion.div
        key={connection._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-700/90 rounded-xl p-3 sm:p-4 md:p-5 border border-slate-600 hover:border-blue-400/40 transition-all group"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random&size=200`}
              alt={user.fullName}
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-slate-600 group-hover:border-blue-400 transition-colors"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random&size=200`;
              }}
            />
            <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-green-500 rounded-full border-2 border-slate-800"></div>
          </div>
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
              {user.fullName}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-gray-400">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">{user.location || 'Location not specified'}</span>
            </div>
            {user.interests && user.interests.length > 0 && (
              <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2">
                {user.interests.slice(0, 3).map((interest, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30"
                  >
                    {interest}
                  </span>
                ))}
                {user.interests.length > 3 && (
                  <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-slate-600 text-gray-300 rounded-full">
                  +{user.interests.length - 3}
                </span>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-col gap-2 w-full sm:w-auto sm:min-w-[140px] mt-2 sm:mt-0">
            <button
              onClick={() => handleViewProfile(user)}
              className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-500/20 text-slate-300 border border-slate-500/30 rounded-lg hover:bg-slate-500/30 transition-colors text-xs sm:text-sm whitespace-nowrap"
            >
              View Profile
            </button>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => navigate(`/chat/${user._id}`)}
                className="flex-1 sm:flex-1 px-2 sm:px-2.5 py-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors text-[10px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap"
              >
                <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Message</span>
              </button>
              <button
                onClick={() => handleDisconnect(connection._id)}
                disabled={disconnectingIds.has(connection._id)}
                className="flex-1 sm:flex-1 px-2 sm:px-2.5 py-1.5 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors text-[10px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {disconnectingIds.has(connection._id) ? (
                  <svg className="animate-spin h-3 w-3 sm:h-3.5 sm:w-3.5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    <UserMinus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">Disconnect</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderSection = (title, items, dateLabel) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
          <span className="w-1 h-5 sm:h-6 bg-blue-500 rounded"></span>
          {title}
        </h2>
        <div className="space-y-2 sm:space-y-3">
          {items.map((connection) => (
            <div key={connection._id}>
              {dateLabel && connection.formattedDate && (
                <p className="text-[10px] sm:text-xs text-gray-500 mb-1 sm:mb-2 ml-2 sm:ml-4">{connection.formattedDate}</p>
              )}
              {renderConnectionCard(connection)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300 font-medium">Loading connections...</p>
        </div>
      </div>
    );
  }

  const totalConnections = connections.today.length + connections.yesterday.length + connections.older.length;

  return (
    <div className="min-h-screen bg-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-slate-700 rounded-xl">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Connections</h1>
              <p className="text-sm sm:text-base text-gray-400">Your network of connections</p>
            </div>
          </div>
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-700 rounded-full">
            <span className="text-xs sm:text-sm font-semibold text-blue-400">{totalConnections}</span>
            <span className="text-xs sm:text-sm text-gray-300 ml-2">Total Connections</span>
          </div>
        </div>

        {/* Connections List */}
        {totalConnections === 0 ? (
          <div className="text-center py-16 bg-slate-700/50 rounded-xl">
            <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No connections yet</h3>
            <p className="text-gray-400">Start connecting with people to build your network</p>
          </div>
        ) : (
          <>
            {renderSection('Today Connected', connections.today)}
            {renderSection('Yesterday Connected', connections.yesterday)}
            {renderSection('Older Connections', connections.older, true)}
          </>
        )}
      </div>

      {/* Profile View Modal */}
      <ProfileViewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
      />
    </div>
  );
};

export default Connections;

