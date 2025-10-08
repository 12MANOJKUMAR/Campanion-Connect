import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-800">
      {/* Hero Section with Abstract Shapes */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
          >
            About Companion Connect
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300"
          >
            We believe technology should bring people closer — not apart.
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left - Image */}
              <div className="h-full">
                <img 
                  src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&h=600&fit=crop" 
                  alt="People connecting and laughing"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Right - Text */}
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Companion Connect started with a simple idea — to help people find like-minded friends 
                  and companions in their everyday life. Whether you're a student, working professional, 
                  or retiree, we make it easier to discover meaningful connections based on interests 
                  and values.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Mission Card */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🎯</span>
                <h3 className="text-2xl font-bold text-white">Mission</h3>
              </div>
              <p className="text-gray-300 text-lg">
                To create a positive, safe, and inclusive environment for people to connect.
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">👁️</span>
                <h3 className="text-2xl font-bold text-white">Vision</h3>
              </div>
              <p className="text-gray-300 text-lg">
                A world where conversations spark genuine friendships.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Snapshot */}
      <section className="py-16 px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white text-center mb-12"
          >
            What Makes Us Different
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🤖", title: "Smart Matching", desc: "AI-powered connections" },
              { icon: "🔒", title: "Secure Communication", desc: "Your privacy matters" },
              { icon: "🎨", title: "Easy-to-use Interface", desc: "Simple and intuitive" },
              { icon: "🧭", title: "Local + Global Connections", desc: "Connect anywhere" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-slate-700 to-slate-600 rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;