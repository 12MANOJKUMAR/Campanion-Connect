import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus, selectCurrentUser } from '../../store/authSlice';
import { 
  FaUserCircle, FaMapMarkerAlt, FaBriefcase, FaCalendar, FaEdit, 
  FaHeart, FaUsers, FaCamera, FaLock, FaUnlock, FaShare, FaEllipsisV,
  FaStar, FaTrophy, FaMedal, FaAward, FaCrown, FaGem, FaShieldAlt,
  FaInstagram, FaTwitter, FaLinkedin, FaGlobe
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const Profile = ({isOwnProfile = true}) => {
  const dispatch = useDispatch();
  const authedUser = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    showEmail: true,
    showPhone: false,
    showLocation: true,
    showInterests: true
  });

  // Derive user data from auth state; provide graceful fallbacks
  const user = useMemo(() => {
    const u = authedUser || {};
    return {
      name: u.fullName || 'User',
      username: u.email ? `@${u.email.split('@')[0]}` : '@user',
      avatar: u.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName || 'User')}&background=random&size=256`,
      coverImage: u.coverImage || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&h=400&fit=crop',
      bio: u.bio || '',
      location: u.location || '—',
      occupation: u.occupation || '—',
      joinedDate: u.createdAt ? new Date(u.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' }) : '—',
      email: u.email || '',
      purpose: u.purpose || '',
      interests: Array.isArray(u.interests) ? u.interests : [],
      stats: { connections: u.connectionsCount || 0, groups: u.groupsCount || 0, posts: 0, events: 0 },
      achievements: [],
      mutualInterests: [],
      mutualFriends: 0,
      compatibilityScore: 0,
      gallery: [],
      socialLinks: u.socialLinks || {},
    };
  }, [authedUser]);

  useEffect(() => {
    // Ensure we have current user on first mount
    if (!authedUser) {
      dispatch(checkAuthStatus());
    }
  }, [authedUser, dispatch]);

  const tabs = [
    { id: 'posts', label: 'Posts', count: user.stats.posts },
    { id: 'friends', label: 'Friends', count: user.stats.connections },
    { id: 'gallery', label: 'Gallery', count: user.gallery.length },
    { id: 'events', label: 'Events', count: user.stats.events }
  ];

  return (
    <div className="min-h-screen bg-slate-800">
      {/* Cover Image Section */}
      <div className="relative h-64 md:h-80">
        <img 
          src={user.coverImage} 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        
        {/* Profile Actions */}
        {isOwnProfile && (
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-slate-800/80 backdrop-blur-sm rounded-lg text-white hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <FaEdit />
              <span>Edit Profile</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Profile Content */}
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        {/* Profile Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-700/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="relative">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-slate-600 shadow-xl"
              />
              {!isOwnProfile && (
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-slate-700"></div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                    {user.name}
                    <FaShieldAlt className="text-green-400 text-xl" title="Verified" />
                  </h1>
                  <p className="text-gray-400">{user.username}</p>
                  
                  <p className="mt-3 text-gray-300 max-w-2xl">{user.bio}</p>
                  
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt />
                      {user.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaBriefcase />
                      {user.occupation}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendar />
                      Joined {user.joinedDate}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                {!isOwnProfile && (
                  <div className="flex gap-2">
                    <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all">
                      Connect
                    </button>
                    <button className="p-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors">
                      <FaShare />
                    </button>
                    <button className="p-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors">
                      <FaEllipsisV />
                    </button>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-600">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{user.stats.connections}</p>
                  <p className="text-sm text-gray-400">Connections</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{user.stats.groups}</p>
                  <p className="text-sm text-gray-400">Groups</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{user.stats.posts}</p>
                  <p className="text-sm text-gray-400">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{user.stats.events}</p>
                  <p className="text-sm text-gray-400">Events</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Compatibility Score (for other users' profiles) */}
        {!isOwnProfile && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-blue-500/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  💖 Compatibility Score
                </h3>
                <p className="text-gray-300">
                  Based on {user.mutualInterests.length} mutual interests and {user.mutualFriends} mutual friends
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {user.compatibilityScore}%
                </div>
                <p className="text-sm text-gray-400">Match</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Purpose Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-700/90 backdrop-blur-sm rounded-2xl p-6 mb-6"
        >
          <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
            🎯 My Purpose
          </h3>
          <p className="text-gray-300 italic">"{user.purpose}"</p>
        </motion.div>

        {/* Achievements Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-700/90 backdrop-blur-sm rounded-2xl p-6 mb-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            🏆 Achievements & Badges
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {user.achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className="text-center p-4 bg-slate-600/50 rounded-xl hover:bg-slate-600 transition-colors cursor-pointer group"
              >
                <achievement.icon className={`text-3xl ${achievement.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                <p className="text-sm font-medium text-white">{achievement.title}</p>
                <p className="text-xs text-gray-400 mt-1">{achievement.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Interests Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-700/90 backdrop-blur-sm rounded-2xl p-6 mb-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            💝 Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest, index) => (
              <span 
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  user.mutualInterests.includes(interest)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-slate-600 text-gray-300 hover:bg-slate-500'
                }`}
              >
                {interest}
                {user.mutualInterests.includes(interest) && ' ✨'}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <div className="bg-slate-700/90 backdrop-blur-sm rounded-t-2xl overflow-hidden">
          <div className="flex border-b border-slate-600">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 font-medium transition-all relative ${
                  activeTab === tab.id
                    ? 'text-blue-400 bg-slate-600/30'
                    : 'text-gray-400 hover:text-white hover:bg-slate-600/20'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="ml-2 text-xs bg-slate-600
                                    px-2 py-0.5 rounded-full">{tab.count}</span>
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div className="space-y-4">
                <div className="bg-slate-600/50 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-white">{user.name}</h4>
                        <span className="text-sm text-gray-400">• 2 hours ago</span>
                      </div>
                      <p className="text-gray-300">
                        Just finished an amazing hike at the Western Ghats! The sunrise was absolutely breathtaking. 
                        Nature never fails to inspire me. 🌄 Who else loves early morning adventures?
                      </p>
                      <div className="mt-3 flex gap-4 text-sm">
                        <button className="text-gray-400 hover:text-blue-400 transition-colors">
                          <FaHeart className="inline mr-1" /> 24
                        </button>
                        <button className="text-gray-400 hover:text-blue-400 transition-colors">
                          💬 12 Comments
                        </button>
                        <button className="text-gray-400 hover:text-blue-400 transition-colors">
                          <FaShare className="inline mr-1" /> Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Add more posts here */}
                <div className="text-center py-8">
                  <p className="text-gray-400">More posts loading...</p>
                </div>
              </div>
            )}

            {/* Friends Tab */}
            {activeTab === 'friends' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((friend) => (
                  <div key={friend} className="bg-slate-600/50 rounded-xl p-4 text-center hover:bg-slate-600 transition-colors cursor-pointer">
                    <img 
                      src={`https://i.pravatar.cc/150?img=${friend}`} 
                      alt="Friend" 
                      className="w-20 h-20 rounded-full mx-auto mb-3"
                    />
                    <h4 className="font-medium text-white">Friend {friend}</h4>
                    <p className="text-sm text-gray-400">Mumbai</p>
                    <button className="mt-3 text-sm text-blue-400 hover:text-blue-300">
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Gallery Tab */}
            {activeTab === 'gallery' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {user.gallery.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group cursor-pointer overflow-hidden rounded-xl"
                  >
                    <img 
                      src={image} 
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-white text-sm">Adventure #{index + 1}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="space-y-4">
                {[1, 2, 3].map((event) => (
                  <div key={event} className="bg-slate-600/50 rounded-xl p-6 hover:bg-slate-600 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-white text-lg mb-2">
                          Weekend Hiking Trip #{event}
                        </h4>
                        <p className="text-gray-300 mb-3">
                          Join us for an exciting hiking adventure in the Sahyadri mountains.
                        </p>
                        <div className="flex gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <FaCalendar /> Nov {15 + event}, 2024
                          </span>
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt /> Lonavala
                          </span>
                          <span className="flex items-center gap-1">
                            <FaUsers /> 12 attending
                          </span>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Join
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        
        {/* Social Links */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-700/90 backdrop-blur-sm rounded-2xl p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            🌐 Connect on Social Media
          </h3>
          <div className="flex gap-4">
            {user.socialLinks.instagram && (
              <a 
                href={`https://instagram.com/${user.socialLinks.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
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
                className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
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
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaLinkedin />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;