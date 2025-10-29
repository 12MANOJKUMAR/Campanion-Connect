import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Hero from "./pages/Hero";
import Footer from "./components/common/Footer";
import About from "./pages/About";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { checkAuthStatus } from "./store/authSlice";
import Profile from "./components/profile/Profile";
import Setting from "./components/profile/setting";
import Explore from "./components/Dashboard/Explore";
import CompanionsPage from "./components/Dashboard/MyCompanion";
import ExplorePage from "./components/Dashboard/Explore";


// A simple loading component
const AppLoading = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
  </div>
);
const App = () => {

  const dispatch = useDispatch();
  // Get the new loading state from the auth slice
  const { isAuthLoading } = useSelector((state) => state.auth);

  // When the app first mounts, dispatch the auth check
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  if (isAuthLoading) {
    return <AppLoading />;
  }
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
          <Route path="/profile" element={<Profile />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/my-companion/:id" element={<CompanionsPage />} />
          <Route path="/explore/:id" element={<ExplorePage />} />
        </Routes>
        <div className="footer">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default App;