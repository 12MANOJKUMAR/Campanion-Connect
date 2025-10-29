import React, { useState } from 'react';
import { 
  FaUser, FaLock, FaBell, FaPalette, FaQuestionCircle, FaSignOutAlt,
  FaCamera, FaKey, FaEnvelope, FaGlobe, FaTrash, FaPause,
  FaEye, FaComments, FaUserPlus, FaBan, FaClock, FaShieldAlt,
  FaMobile, FaVolumeUp, FaMoon, FaToggleOn, FaToggleOff,
  FaChevronRight, FaCheck, FaExclamationTriangle, FaEdit
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Setting = () => {
  const [activeSection, setActiveSection] = useState('account');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [settings, setSettings] = useState({
    // Account
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+91 98765 43210',
    language: 'English',
    
    // Privacy
    profileVisibility: 'everyone',
    messagePrivacy: 'connections',
    connectionRequests: 'everyone',
    showOnlineStatus: true,
    showLastSeen: true,
    twoFactorEnabled: false,
    
    // Notifications
    pushNotifications: true,
    messageNotifications: true,
    connectionNotifications: true,
    eventNotifications: true,
    emailNotifications: true,
    weeklyDigest: true,
    doNotDisturb: false,
    
    // Appearance
    theme: 'dark',
    fontSize: 'medium'
  });

  const [blockedUsers] = useState([
    { id: 1, name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' }
  ]);

  const sections = [
    { id: 'account', label: 'Account Settings', icon: FaUser },
    { id: 'privacy', label: 'Privacy & Security', icon: FaLock },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'appearance', label: 'Appearance', icon: FaPalette },
    { id: 'help', label: 'Help & Support', icon: FaQuestionCircle }
  ];

  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi'];

  const handleToggle = (setting) => {
    setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleSelectChange = (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        enabled ? 'bg-blue-500' : 'bg-slate-600'
      }`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
        enabled ? 'translate-x-6' : ''
      }`}></span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-4">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-2 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border-l-4 border-blue-500'
                      : 'hover:bg-slate-600/50 text-gray-400 hover:text-white'
                  }`}
                >
                  <section.icon className="text-lg" />
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
              
              <hr className="my-4 border-slate-600" />
              
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20 transition-all">
                <FaSignOutAlt className="text-lg" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-6">
              {/* Account Settings */}
              {activeSection === 'account' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white mb-6">Account Settings</h2>
                  
                  {/* Profile Picture */}
                  <div className="flex items-center gap-6 pb-6 border-b border-slate-600">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">Profile Picture</h3>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                          <FaCamera /> Change Photo
                        </button>
                        <button className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Edit Profile Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <div className="flex gap-3">
                        <input 
                          type="text" 
                          value={settings.name}
                          onChange={(e) => handleSelectChange('name', e.target.value)}
                          className="flex-1 px-4 py-2 bg-slate-600/50 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                          <FaEdit />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="flex gap-3">
                        <input 
                          type="email" 
                          value={settings.email}
                          className="flex-1 px-4 py-2 bg-slate-600/50 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                          <FaEnvelope />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <div className="flex gap-3">
                        <input 
                          type="tel" 
                          value={settings.phone}
                          className="flex-1 px-4 py-2 bg-slate-600/50 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                          <FaMobile />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Language Preference */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <FaGlobe className="inline mr-2" />
                      Language Preference
                    </label>
                    <select 
                      value={settings.language}
                      onChange={(e) => handleSelectChange('language', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-600/50 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {languages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>

                  {/* Password */}
                  <div className="pt-6 border-t border-slate-600">
                    <button className="w-full px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors flex items-center justify-between">
                      <span className="flex items-center gap-3">
                        <FaKey />
                        Change Password
                      </span>
                      <FaChevronRight />
                    </button>
                  </div>

                  {/* Account Actions */}
                  <div className="pt-6 border-t border-slate-600 space-y-3">
                    <button className="w-full px-4 py-3 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors flex items-center justify-between">
                      <span className="flex items-center gap-3">
                        <FaPause />
                        Deactivate Account
                      </span>
                      <FaChevronRight />
                    </button>
                    <button 
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-between"
                    >
                      <span className="flex items-center gap-3">
                        <FaTrash />
                        Delete Account
                      </span>
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy & Security Settings */}
              {activeSection === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white mb-6">Privacy & Security</h2>
                  
                  {/* Profile Visibility */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                      <FaEye /> Profile Visibility
                    </h3>
                    <div className="space-y-3">
                      {['everyone', 'connections', 'only-me'].map((option) => (
                        <label key={option} className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="radio" 
                            name="profileVisibility" 
                            value={option}
                            checked={settings.profileVisibility === option}
                            onChange={(e) => handleSelectChange('profileVisibility', e.target.value)}
                            className="w-4 h-4 text-blue-500"
                          />
                          <span className="text-gray-300 capitalize">{option.replace('-', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Message Privacy */}
                  <div className="pt-6 border-t border-slate-600">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                      <FaComments /> Message Privacy
                    </h3>
                    <div className="space-y-3">
                      {['everyone', 'connections'].map((option) => (
                        <label key={option} className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="radio" 
                            name="messagePrivacy" 
                            value={option}
                            checked={settings.messagePrivacy === option}
                            onChange={(e) => handleSelectChange('messagePrivacy', e.target.value)}
                            className="w-4 h-4 text-blue-500"
                          />
                          <span className="text-gray-300 capitalize">
                            {option === 'connections' ? 'Only Connections' : 'Everyone'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Activity Status */}
                  <div className="pt-6 border-t border-slate-600 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Show Online Status</h4>
                        <p className="text-sm text-gray-400">Let others see when you're active</p>
                      </div>
                      <ToggleSwitch 
                        enabled={settings.showOnlineStatus}
                        onChange={() => handleToggle('showOnlineStatus')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Show Last Seen</h4>
                        <p className="text-sm text-gray-400">Display your last active time</p>
                                            </div>
                      <ToggleSwitch 
                        enabled={settings.showLastSeen}
                        onChange={() => handleToggle('showLastSeen')}
                      />
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="pt-6 border-t border-slate-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium flex items-center gap-2">
                          <FaShieldAlt className="text-green-400" />
                          Two-Factor Authentication
                        </h4>
                        <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                      </div>
                      <ToggleSwitch 
                        enabled={settings.twoFactorEnabled}
                        onChange={() => handleToggle('twoFactorEnabled')}
                      />
                    </div>
                  </div>

                  {/* Blocked Users */}
                  <div className="pt-6 border-t border-slate-600">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                      <FaBan /> Blocked Users
                    </h3>
                    {blockedUsers.length > 0 ? (
                      <div className="space-y-3">
                        {blockedUsers.map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-3 bg-slate-600/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                              <span className="text-white">{user.name}</span>
                            </div>
                            <button className="px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-500 transition-colors">
                              Unblock
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No blocked users</p>
                    )}
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white mb-6">Notification Settings</h2>
                  
                  {/* Push Notifications */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                      <FaMobile /> Push Notifications
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">All Notifications</h4>
                          <p className="text-sm text-gray-400">Receive all push notifications</p>
                        </div>
                        <ToggleSwitch 
                          enabled={settings.pushNotifications}
                          onChange={() => handleToggle('pushNotifications')}
                        />
                      </div>
                      
                      {settings.pushNotifications && (
                        <>
                          <div className="flex items-center justify-between pl-6">
                            <div>
                              <h4 className="text-gray-300">Messages</h4>
                              <p className="text-sm text-gray-500">New messages from connections</p>
                            </div>
                            <ToggleSwitch 
                              enabled={settings.messageNotifications}
                              onChange={() => handleToggle('messageNotifications')}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between pl-6">
                            <div>
                              <h4 className="text-gray-300">Connection Requests</h4>
                              <p className="text-sm text-gray-500">Someone wants to connect</p>
                            </div>
                            <ToggleSwitch 
                              enabled={settings.connectionNotifications}
                              onChange={() => handleToggle('connectionNotifications')}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between pl-6">
                            <div>
                              <h4 className="text-gray-300">Events</h4>
                              <p className="text-sm text-gray-500">Event invites and reminders</p>
                            </div>
                            <ToggleSwitch 
                              enabled={settings.eventNotifications}
                              onChange={() => handleToggle('eventNotifications')}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Email Notifications */}
                  <div className="pt-6 border-t border-slate-600">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                      <FaEnvelope /> Email Notifications
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">Email Updates</h4>
                          <p className="text-sm text-gray-400">Receive updates via email</p>
                        </div>
                        <ToggleSwitch 
                          enabled={settings.emailNotifications}
                          onChange={() => handleToggle('emailNotifications')}
                        />
                      </div>
                      
                      {settings.emailNotifications && (
                        <div className="flex items-center justify-between pl-6">
                          <div>
                            <h4 className="text-gray-300">Weekly Digest</h4>
                            <p className="text-sm text-gray-500">Summary of your weekly activity</p>
                          </div>
                          <ToggleSwitch 
                            enabled={settings.weeklyDigest}
                            onChange={() => handleToggle('weeklyDigest')}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Do Not Disturb */}
                  <div className="pt-6 border-t border-slate-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium flex items-center gap-2">
                          <FaMoon className="text-purple-400" />
                          Do Not Disturb
                        </h4>
                        <p className="text-sm text-gray-400">Mute all notifications temporarily</p>
                      </div>
                      <ToggleSwitch 
                        enabled={settings.doNotDisturb}
                        onChange={() => handleToggle('doNotDisturb')}
                      />
                    </div>
                    {settings.doNotDisturb && (
                      <div className="mt-4 p-4 bg-purple-500/20 rounded-lg">
                        <p className="text-purple-300 text-sm">
                          Do Not Disturb is active. You won't receive any notifications until you turn it off.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeSection === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white mb-6">Appearance</h2>
                  
                  {/* Theme */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {['light', 'dark', 'auto'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => handleSelectChange('theme', theme)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            settings.theme === theme
                              ? 'border-blue-500 bg-blue-500/20'
                              : 'border-slate-600 hover:border-slate-500'
                          }`}
                        >
                          <div className={`w-full h-20 rounded mb-2 ${
                            theme === 'light' ? 'bg-white' : theme === 'dark' ? 'bg-slate-800' : 'bg-gradient-to-b from-white to-slate-800'
                          }`}></div>
                          <p className="text-white capitalize">{theme}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div className="pt-6 border-t border-slate-600">
                    <h3 className="text-lg font-medium text-white mb-4">Font Size</h3>
                    <div className="space-y-3">
                      {['small', 'medium', 'large'].map((size) => (
                        <label key={size} className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="radio" 
                            name="fontSize" 
                            value={size}
                            checked={settings.fontSize === size}
                            onChange={(e) => handleSelectChange('fontSize', e.target.value)}
                            className="w-4 h-4 text-blue-500"
                          />
                          <span className={`text-gray-300 capitalize ${
                            size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : ''
                          }`}>
                            {size} Text
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Help & Support */}
              {activeSection === 'help' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white mb-6">Help & Support</h2>
                  
                  <div className="space-y-3">
                    <a href="#" className="block p-4 bg-slate-600/50 rounded-lg hover:bg-slate-600 transition-colors">
                      <h3 className="text-white font-medium mb-1">FAQs</h3>
                      <p className="text-sm text-gray-400">Find answers to common questions</p>
                    </a>
                    
                    <a href="#" className="block p-4 bg-slate-600/50 rounded-lg hover:bg-slate-600 transition-colors">
                      <h3 className="text-white font-medium mb-1">Contact Support</h3>
                      <p className="text-sm text-gray-400">Get help from our support team</p>
                    </a>
                    
                    <a href="#" className="block p-4 bg-slate-600/50 rounded-lg hover:bg-slate-600 transition-colors">
                      <h3 className="text-white font-medium mb-1">Privacy Policy</h3>
                      <p className="text-sm text-gray-400">Learn how we protect your data</p>
                    </a>
                    
                    <a href="#" className="block p-4 bg-slate-600/50 rounded-lg hover:bg-slate-600 transition-colors">
                      <h3 className="text-white font-medium mb-1">Terms of Service</h3>
                      <p className="text-sm text-gray-400">Read our terms and conditions</p>
                    </a>
                    
                    <a href="#" className="block p-4 bg-slate-600/50 rounded-lg hover:bg-slate-600 transition-colors">
                      <h3 className="text-white font-medium mb-1">Community Guidelines</h3>
                      <p className="text-sm text-gray-400">Learn about our community standards</p>
                    </a>
                  </div>

                  <div className="pt-6 border-t border-slate-600">
                    <div className="p-4 bg-blue-500/20 rounded-lg">
                      <h3 className="text-blue-400 font-medium mb-2">Need more help?</h3>
                      <p className="text-sm text-gray-300 mb-3">
                        Our support team is available 24/7 to assist you.
                      </p>
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Chat with Support
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-700 rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle className="text-3xl text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Delete Account?</h3>
                <p className="text-gray-400">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
                >
                  Cancel
                </button>
                <button className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  Yes, Delete My Account
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Setting;