import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus, selectCurrentUser } from '../../store/authSlice';
import { 
  FaMapMarkerAlt, FaBriefcase, FaCalendar, FaEdit, 
  FaShare,
  FaInstagram, FaTwitter, FaLinkedin
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { buildApiUrl } from '../../utils/apiConfig';

const Profile = ({isOwnProfile = true}) => {
  const dispatch = useDispatch();
  const authedUser = useSelector(selectCurrentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [connectionsCount, setConnectionsCount] = useState(0);

  // Derive user data from auth state; provide graceful fallbacks
  const user = useMemo(() => {
    const u = authedUser || {};
    return {
      name: u.fullName || 'User',
      username: u.email ? `@${u.email.split('@')[0]}` : '@user',
      avatar: u.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName || 'User')}&background=random&size=256`,
      bio: u.bio || '',
      location: u.location || '—',
      occupation: u.occupation || '—',
      joinedDate: u.createdAt ? new Date(u.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' }) : '—',
      interests: Array.isArray(u.interests) ? u.interests : [],
      stats: { connections: connectionsCount },
      socialLinks: u.socialLinks || {},
    };
  }, [authedUser, connectionsCount]);

  useEffect(() => {
    // Ensure we have current user on first mount
    if (!authedUser) {
      dispatch(checkAuthStatus());
    }
  }, [authedUser, dispatch]);

  // Fetch actual connections count
  useEffect(() => {
    const fetchConnectionsCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(buildApiUrl('/connections/list'), {
          headers,
        });

        const data = await response.json();

        if (data.success) {
          setConnectionsCount(data.count || 0);
        }
      } catch (error) {
        setConnectionsCount(0);
      }
    };

    if (authedUser) {
      fetchConnectionsCount();
    }

    // Refresh count when page becomes visible (user comes back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden && authedUser) {
        fetchConnectionsCount();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [authedUser]);


  return (
    <div className="min-h-screen bg-slate-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-700/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-slate-600 shadow-xl object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=256`;
                }}
              />
              {isOwnProfile && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="absolute -bottom-1 -right-1 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors shadow-lg"
                  title="Edit Profile"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    {user.name}
                  </h1>
                  <p className="text-gray-400 text-sm sm:text-base mb-3">{user.username}</p>
                  
                  {user.bio && (
                    <p className="text-gray-300 text-sm sm:text-base mb-4">{user.bio}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
                    {user.location && user.location !== '—' && (
                      <span className="flex items-center gap-1.5">
                        <FaMapMarkerAlt className="w-3.5 h-3.5" />
                        <span>{user.location}</span>
                      </span>
                    )}
                    {user.occupation && user.occupation !== '—' && (
                      <span className="flex items-center gap-1.5">
                        <FaBriefcase className="w-3.5 h-3.5" />
                        <span>{user.occupation}</span>
                      </span>
                    )}
                    {user.joinedDate && user.joinedDate !== '—' && (
                      <span className="flex items-center gap-1.5">
                        <FaCalendar className="w-3.5 h-3.5" />
                        <span>Joined {user.joinedDate}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {!isOwnProfile && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="px-4 sm:px-6 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors text-sm">
                      Connect
                    </button>
                    <button className="p-2 bg-slate-500/20 text-slate-300 border border-slate-500/30 rounded-lg hover:bg-slate-500/30 transition-colors">
                      <FaShare className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-slate-600">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-2xl font-bold text-white">{user.stats.connections}</p>
                    <p className="text-sm text-gray-400">Connections</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>


        {/* Interests Section */}
        {user.interests && user.interests.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-700/90 backdrop-blur-sm rounded-2xl p-6 mb-6"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <span 
                  key={index}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                >
                  {interest}
                </span>
              ))}
            </div>
          </motion.div>
        )}


        {/* Social Links */}
        {(user.socialLinks.instagram || user.socialLinks.twitter || user.socialLinks.linkedin) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-700/90 backdrop-blur-sm rounded-2xl p-6"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
              Social Links
            </h3>
            <div className="flex flex-wrap gap-3">
              {user.socialLinks.instagram && (
                <a 
                  href={`https://instagram.com/${user.socialLinks.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-colors text-sm"
                >
                  <FaInstagram />
                  <span>Instagram</span>
                </a>
              )}
              {user.socialLinks.twitter && (
                <a 
                  href={`https://twitter.com/${user.socialLinks.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-lg hover:bg-sky-500/30 transition-colors text-sm"
                >
                  <FaTwitter />
                  <span>Twitter</span>
                </a>
              )}
              {user.socialLinks.linkedin && (
                <a 
                  href={`https://linkedin.com/in/${user.socialLinks.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                >
                  <FaLinkedin />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Profile;