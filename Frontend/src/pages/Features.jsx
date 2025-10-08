import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      icon: "🎯",
      title: "Interest-based Matching",
      description: "Connect with people who share your passions and hobbies"
    },
    {
      icon: "💬",
      title: "Private & Secure Chats",
      description: "Your conversations stay safe with end-to-end encryption"
    },
    {
      icon: "🗓️",
      title: "Plan Meetups & Group Activities",
      description: "Organize events and activities with your new connections"
    },
    {
      icon: "🤖",
      title: "Smart Recommendations",
      description: "AI-powered suggestions to find your perfect companions"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-800">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&h=1080&fit=crop"
            alt="People connecting"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 via-slate-800/70 to-slate-800"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Connecting People Beyond Screens.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Companion Connect is built to bring people closer — to talk, share, and grow together in a safe and positive space.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link 
              to="/signup"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Join the Community
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-700 to-slate-600 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Text Content */}
              <div className="p-8 md:p-12 order-2 md:order-1">
                <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  During college or after retirement, loneliness or lack of like-minded people can feel isolating. 
                  We started Companion Connect to help people discover new friends who share their interests — 
                  whether it's music, travel, reading, or simply good conversations.
                </p>
              </div>
              
              {/* Image */}
              <div className="h-full order-1 md:order-2">
                <img 
                  src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=600&fit=crop" 
                  alt="Friends laughing together"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl p-8 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🌍</span>
                <h3 className="text-2xl font-bold text-white">Our Mission</h3>
              </div>
              <p className="text-gray-300 text-lg">
                To make human connection easier and meaningful through technology.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-8 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🤝</span>
                <h3 className="text-2xl font-bold text-white">Our Vision</h3>
              </div>
              <p className="text-gray-300 text-lg">
                A world where everyone finds companionship, understanding, and joy — one conversation at a time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How We Help You Connect */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
          >
            How We Help You Connect
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-16 px-4 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-slate-700 to-slate-600 rounded-2xl p-8 md:p-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Meet the Team</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Companion Connect was founded by passionate students and developers who believe 
              technology should build empathy, not distance. We're committed to creating a platform 
              that brings real human connections to the digital age.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <span className="text-3xl">💻</span>
              <span className="text-3xl">❤️</span>
              <span className="text-3xl">🌟</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Features;