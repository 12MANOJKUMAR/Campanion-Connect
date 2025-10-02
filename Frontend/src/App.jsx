import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";

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
          <Route path="/" element={<div className="p-8">Home Page</div>} />
          <Route path="/companions" element={<div className="p-8">Find Companions</div>} />
          <Route path="/messages" element={<div className="p-8">Messages</div>} />
          <Route path="/meetings" element={<div className="p-8">Meetings</div>} />
          <Route path="/profile" element={<div className="p-8">Profile</div>} />
        </Routes>
      </main>
    </div>
  );
};

export default App;