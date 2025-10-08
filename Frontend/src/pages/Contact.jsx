import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaLinkedin, FaTwitter, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const socialLinks = [
    { icon: FaInstagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
    { icon: FaLinkedin, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-600' },
    { icon: FaTwitter, href: '#', label: 'Twitter', color: 'hover:bg-sky-500' },
    { icon: FaYoutube, href: '#', label: 'YouTube', color: 'hover:bg-red-600' }
  ];

  return (
    <div className="min-h-screen bg-slate-800 py-12 px-4">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          We'd love to hear from you!
        </h1>
        <p className="text-xl text-gray-300">
          Have questions, suggestions, or feedback? Our team is just a message away.
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-slate-700/50 backdrop-blur-md rounded-2xl p-8 shadow-xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-600/50 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Your name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-600/50 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-600/50 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Select a subject</option>
                  <option value="technical">Technical Issue</option>
                  <option value="general">General Inquiry</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-600/50 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <FaEnvelope />
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Contact Info & Social Links */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Contact Info Card */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-600 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <FaEnvelope className="text-blue-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email us at</p>
                    <p className="text-white">hello@companionconnect.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <FaPhone className="text-green-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Call us at</p>
                    <p className="text-white">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <FaMapMarkerAlt className="text-purple-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Visit us at</p>
                    <p className="text-white">Mumbai, Maharashtra, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links Card */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-600 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6">Follow Us</h3>
              <p className="text-gray-300 mb-6">
                Stay connected and join our community on social media
              </p>
              
              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center text-white transition-all duration-300 ${social.color}`}
                      aria-label={social.label}
                    >
                      <Icon className="text-xl" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Response Time Card */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <p className="text-white text-center">
                <span className="text-2xl">⚡</span> We typically respond within 24 hours
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;