import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUser, FaEnvelope, FaLock, FaGoogle, FaGithub, FaEye, FaEyeSlash, 
  FaCamera, FaCheck, FaHeart, FaRocket, FaStar, FaGift,
  FaBolt, FaFire, FaShieldAlt, FaUsers, FaTrophy, FaPlane, FaBook, FaCode, FaMusic, FaGamepad 
} from 'react-icons/fa'; 
import { HiSparkles } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { registerUser } from '../store/authSlice'; // ⬅️ Correct Thunk Import

// --- Interest Options Definition (from previous fix) ---
const interestOptions = [
  { name: 'Technology', icon: <FaCode className="text-blue-400" /> },
  { name: 'Gaming', icon: <FaGamepad className="text-pink-400" /> },
  { name: 'Travel', icon: <FaPlane className="text-yellow-400" /> },
  { name: 'Fitness', icon: <FaHeart className="text-red-400" /> },
  { name: 'Reading', icon: <FaBook className="text-teal-400" /> },
  { name: 'Music', icon: <FaMusic className="text-purple-400" /> },
  { name: 'Startups', icon: <FaRocket className="text-indigo-400" /> },
  { name: 'Science', icon: <FaBolt className="text-orange-400" /> },
  { name: 'Movies', icon: <FaStar className="text-amber-400" /> },
];
// ---------------------------------

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    interests: '',
    agreeToTerms: false
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [showInterestDropdown, setShowInterestDropdown] = useState(false);
  const [interestSearch, setInterestSearch] = useState('');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const interestContainer = document.querySelector('.interest-dropdown-container');
      if (showInterestDropdown && interestContainer && !interestContainer.contains(event.target)) {
        setShowInterestDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showInterestDropdown]);

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (!password) return { strength: 0, message: '' };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    const messages = ['', 'Weak 😟', 'Fair 😐', 'Good 😊', 'Strong 💪'];
    const colors = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-emerald-400'];

    return { 
      strength, 
      message: messages[strength], 
      color: colors[strength],
      percentage: (strength / 4) * 100
    };
  };

  const passwordStrength = checkPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicture(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleInterest = (interestName) => {
    setSelectedInterests(prev => 
      prev.includes(interestName) 
        ? prev.filter(i => i !== interestName)
        : [...prev, interestName]
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);

    // 🎯 DISPATCHING THE THUNK WHICH NOW MAKES THE API CALL
    dispatch(registerUser({ 
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      selectedInterests,
      profilePicture // Profile picture handling is complex, sent as is for context
    }))
    .unwrap()
    .then(() => {
      // ✅ SUCCESS! API call finished, navigate to signin
      setLoading(false);
      navigate('/signin');
    })
    .catch((error) => {
      // ❌ ERROR! API call failed (error message comes from rejectWithValue)
      setLoading(false);
      setErrors({ ...errors, form: error || 'Registration failed. Please try again.' }); // Show general error
    });
  };

  const handleSocialSignUp = (provider) => {
    console.log(`Signing up with ${provider}`);
  };

  

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* Subtle Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-7xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-700/50"
        >
          <div className="grid lg:grid-cols-2">
            
            {/* Left Section - Simplified and Matching Theme */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-slate-700 to-slate-800 relative overflow-hidden"
            >
              {/* Subtle Pattern Background */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
              </div>

              {/* Logo/Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="mb-8"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <FaUsers className="text-white text-3xl" />
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl lg:text-5xl font-bold text-white mb-4"
              >
                Join Our Community
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-slate-300 mb-8"
              >
                Connect with like-minded people and build meaningful relationships in a safe, friendly environment.
              </motion.p>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {[
                  { icon: FaShieldAlt, text: "Safe & Secure Platform", color: "text-blue-400" },
                  { icon: FaUsers, text: "50,000+ Active Members", color: "text-indigo-400" },
                  { icon: FaTrophy, text: "Award-Winning Community", color: "text-yellow-400" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="p-2 bg-slate-600/50 rounded-lg">
                      <item.icon className={`text-lg ${item.color}`} />
                    </div>
                    <span className="text-slate-200">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Simple Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-600/50"
              >
                {[
                  { number: "50K+", label: "Users" },
                  { number: "100+", label: "Groups" },
                  { number: "4.9", label: "Rating" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-white">{stat.number}</div>
                    <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* Testimonial or Quote */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-8 p-4 bg-slate-600/30 rounded-xl border border-slate-600/50"
              >
                <p className="text-sm text-slate-300 italic">
                  "The best decision I made was joining this community. Found amazing friends!" 
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-xs" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">- Sarah J.</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Section - Form */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="p-8 lg:p-12"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="inline-block mb-4"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto shadow-xl">
                    <HiSparkles className="text-white text-2xl" />
                  </div>
                </motion.div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Create Account
                </h1>
                <p className="text-gray-400">Start your journey with us today</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Profile Picture */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex justify-center mb-6"
                >
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-200"></div>
                    <div className="relative w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border-4 border-slate-800">
                      {profilePicture ? (
                        <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <FaUser className="text-3xl text-gray-500" />
                      )}
                    </div>
                    <label htmlFor="profilePicture" className="absolute bottom-0 right-0 bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg">
                      <FaCamera className="text-white text-xs" />
                      <input
                        type="file"
                        id="profilePicture"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </motion.div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="relative"
                  >
                    <FaUser className="absolute left-3 top-3.5 text-gray-500" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-700/50 border ${
                        errors.fullName ? 'border-red-500' : 'border-slate-600'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="John Doe"
                    />
                  </motion.div>
                  {errors.fullName && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-400 mt-1"
                    >
                      {errors.fullName}
                    </motion.p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="relative"
                  >
                    <FaEnvelope className="absolute left-3 top-3.5 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-700/50 border ${
                        errors.email ? 'border-red-500' : 'border-slate-600'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="you@example.com"
                    />
                  </motion.div>
                  {errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-400 mt-1"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="relative"
                  >
                    <FaLock className="absolute left-3 top-3.5 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-3 bg-slate-700/50 border ${
                        errors.password ? 'border-red-500' : 'border-slate-600'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </motion.div>
                  {errors.password && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-400 mt-1"
                    >
                      {errors.password}
                    </motion.p>
                  )}

                  {/* Password Strength Meter */}
                  {formData.password && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Password strength</span>
                        <span className={`text-xs font-bold ${passwordStrength.color}`}>
                          {passwordStrength.message}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${passwordStrength.percentage}%` }}
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            passwordStrength.strength === 1 ? 'bg-red-500' :
                            passwordStrength.strength === 2 ? 'bg-orange-500' :
                            passwordStrength.strength === 3 ? 'bg-yellow-500' :
                            passwordStrength.strength === 4 ? 'bg-emerald-500' : ''
                          }`}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="relative"
                  >
                    <FaLock className="absolute left-3 top-3.5 text-gray-500" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-3 bg-slate-700/50 border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-slate-600'
                      } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </motion.div>
                  {errors.confirmPassword && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-400 mt-1"
                    >
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                </div>

                {/* Interests - Searchable Dropdown Menu */}
                <div className="interest-dropdown-container">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Your Interests (Optional)
                  </label>
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="relative"
                  >
                    <div
                      onClick={() => setShowInterestDropdown(!showInterestDropdown)}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all cursor-pointer"
                    >
                      {selectedInterests.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {selectedInterests.slice(0, 3).map((interest) => {
                            const interestData = interestOptions.find(i => i.name === interest);
                            return (
                              <span key={interest} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/30 text-blue-300 rounded text-xs">
                                <span>{interestData?.icon}</span>
                                {interest}
                              </span>
                            );
                          })}
                          {selectedInterests.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 bg-slate-600 text-gray-300 rounded text-xs">
                              +{selectedInterests.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">Choose your interests</span>
                      )}
                    </div>

                    {/* Dropdown Menu with Search */}
                    {showInterestDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-20 w-full mt-2 bg-slate-700 border border-slate-600 rounded-lg shadow-xl"
                      >
                        {/* Search Input */}
                        <div className="p-2 border-b border-slate-600">
                          <input
                            type="text"
                            placeholder="Search interests..."
                            value={interestSearch}
                            onChange={(e) => setInterestSearch(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-600 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={(e) => e.stopPropagation()} // Prevent closing dropdown on search input click
                          />
                        </div>

                        {/* Options List */}
                        <div className="max-h-48 overflow-y-auto">
                          {interestOptions
                            .filter(interest => 
                              interest.name.toLowerCase().includes(interestSearch.toLowerCase())
                            )
                            .map((interest) => (
                              <button
                                key={interest.name}
                                type="button"
                                onClick={() => {
                                  toggleInterest(interest.name);
                                  // setInterestSearch(''); 
                                }}
                                className={`w-full px-4 py-3 text-left hover:bg-slate-600 transition-colors flex items-center justify-between group ${
                                  selectedInterests.includes(interest.name) ? 'bg-slate-600/50' : ''
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">{interest.icon}</span>
                                  <span className={`${
                                    selectedInterests.includes(interest.name) 
                                      ? 'text-white font-medium' 
                                      : 'text-gray-300'
                                  }`}>
                                    {interest.name}
                                  </span>
                                </div>
                                {selectedInterests.includes(interest.name) && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                                  >
                                    <FaCheck className="text-white text-xs" />
                                  </motion.div>
                                )}
                              </button>
                            ))}
                          {interestOptions.filter(interest => 
                            interest.name.toLowerCase().includes(interestSearch.toLowerCase())
                          ).length === 0 && (
                            <div className="px-4 py-3 text-gray-400 text-center">
                              No interests found
                            </div>
                          )}
                        </div>

                        {/* Clear/Done Buttons */}
                        <div className="p-2 border-t border-slate-600 flex justify-between">
                          <button
                            type="button"
                            onClick={() => setSelectedInterests([])}
                            className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                          >
                            Clear all
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowInterestDropdown(false)}
                            className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                          >
                            Done
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-400">
                    I agree to the{' '}
                    <Link to="/terms" className="text-blue-400 hover:text-blue-300 underline">
                      terms and conditions
                    </Link>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-400"
                  >
                    {errors.agreeToTerms}
                  </motion.p>
                )}
                
                {/* General Form Error Display */}
                {errors.form && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-400 text-center font-medium p-2 bg-red-900/30 rounded"
                  >
                    {errors.form}
                  </motion.p>
                )}


                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    'Sign Up'
                  )}
                </motion.button>

                {/* Social Sign Up */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-slate-800 text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSocialSignUp('Google')}
                      className="flex items-center justify-center px-4 py-2.5 bg-white rounded-lg shadow hover:shadow-lg transition-all"
                    >
                      <FaGoogle className="mr-2 text-red-500" />
                      <span className="text-gray-700 font-medium">Google</span>
                    </motion.button>
                    
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSocialSignUp('GitHub')}
                      className="flex items-center justify-center px-4 py-2.5 bg-gray-900 rounded-lg shadow hover:shadow-lg transition-all border border-gray-800"
                    >
                      <FaGithub className="mr-2 text-white" />
                      <span className="text-white font-medium">GitHub</span>
                    </motion.button>
                  </div>
                </div>

                {/* Sign In Link */}
                <p className="text-center text-gray-400 mt-6">
                  Already have an account?{' '}
                  <Link to="/signin" className="text-blue-400 hover:text-blue-300 font-semibold">
                    Sign In
                  </Link>
                </p>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;