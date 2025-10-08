import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Hero from "./pages/Hero";
import Footer from "./components/common/Footer";
import About from "./pages/About";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

const App = () => {
  return (
    <div className="App min-h-screen bg-gray-50">
      {/* Navbar - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      
      {/* Main Content - Add padding to account for fixed navbar */}
      <main className="pt-16">
        {/* Your routes will go here */}
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/about" element={<About />} />
          <Route path="/messages" element={<div className="p-8">Messages</div>} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
        <div className="footer">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default App;