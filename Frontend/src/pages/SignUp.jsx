import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUser, FaEnvelope, FaLock, FaGoogle, FaGithub, FaEye, FaEyeSlash, 
  FaCamera, FaCheck 
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const SignUp = () => {
  const navigate = useNavigate();
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

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (!password) return { strength: 0, message: '' };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    const messages = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-green-400'];

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
    setTimeout(() => {
      console.log('Form submitted:', formData);
      navigate('/signin');
      setLoading(false);
    }, 2000);
  };

  const handleSocialSignUp = (provider) => {
    console.log(`Signing up with ${provider}`);
  };

  const interestOptions = [
    'Teaching', 'Singing', 'Traveling', 'Reading', 'Gaming', 
    'Cooking', 'Sports', 'Technology', 'Art', 'Music'
  ];

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-6xl">
        <div className="bg-slate-700/50 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            
            {/* Left Section */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-600 to-purple-700"
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Join Our Community!
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Connect with like-minded people, share your interests, and build meaningful relationships.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white">
                  <FaCheck className="text-green-300" />
                  <span>Find companions who share your interests</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <FaCheck className="text-green-300" />
                  <span>Join interest-based communities</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <FaCheck className="text-green-300" />
                  <span>Safe and secure platform</span>
                </div>
              </div>
            </motion.div>

            {/* Right Section */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="p-8 lg:p-12"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Create Your Account</h1>
                <p className="text-gray-400">Join us today and start connecting!</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Profile Picture */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-slate-600 flex items-center justify-center overflow-hidden">
                      {profilePicture ? (
                        <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <FaUser className="text-3xl text-gray-400" />
                      )}
                    </div>
                    <label htmlFor="profilePicture" className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                      <FaCamera className="text-white text-sm" />
                      <input
                        type="file"
                        id="profilePicture"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3 text-gray-500" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-600/50 border ${errors.fullName ? 'border-red-500' : 'border-slate-500'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.fullName && <p className="text-sm text-red-400 mt-1">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-3 text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-600/50 border ${errors.email ? 'border-red-500' : 'border-slate-500'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-3 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-3 bg-slate-600/50 border ${errors.password ? 'border-red-500' : 'border-slate-500'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-400 mt-1">{errors.password}</p>}

                  {/* Strength Meter */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Password strength</span>
                        <span className={`text-xs font-medium ${passwordStrength.color}`}>{passwordStrength.message}</span>
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            passwordStrength.strength === 1 ? 'bg-red-500' :
                            passwordStrength.strength === 2 ? 'bg-orange-500' :
                            passwordStrength.strength === 3 ? 'bg-yellow-500' :
                            passwordStrength.strength === 4 ? 'bg-green-500' : ''
                          }`}
                          style={{ width: `${passwordStrength.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-3 text-gray-500" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-3 bg-slate-600/50 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-500'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-400 mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Your Interests (Optional)
                  </label>
                  <select
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-600/50 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Choose an Interest --</option>
                    {interestOptions.map((interest) => (
                      <option key={interest} value={interest}>{interest}</option>
                    ))}
                  </select>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-300">
                    I agree to the <Link to="/terms" className="text-blue-400 hover:underline">terms and conditions</Link>
                  </label>
                </div>
                {errors.agreeToTerms && <p className="text-sm text-red-400">{errors.agreeToTerms}</p>}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-60"
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>

                {/* Social Buttons */}
                <div className="mt-6 text-center">
                  <p className="text-gray-400 mb-4">Or sign up using</p>
                  <div className="flex justify-center space-x-4">
                    <button
                      type="button"
                      onClick={() => handleSocialSignUp('Google')}
                      className="flex items-center px-4 py-2 bg-white text-gray-800 rounded-lg shadow hover:bg-gray-100 transition"
                    >
                      <FaGoogle className="mr-2" /> Google
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialSignUp('GitHub')}
                      className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg shadow hover:bg-gray-800 transition"
                    >
                      <FaGithub className="mr-2" /> GitHub
                    </button>
                  </div>
                </div>

                {/* Sign In Redirect */}
                <p className="text-center text-gray-400 mt-6">
                  Already have an account?{' '}
                  <Link to="/signin" className="text-blue-400 hover:underline">
                    Sign In
                  </Link>
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
