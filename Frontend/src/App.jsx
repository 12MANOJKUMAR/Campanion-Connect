import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/common/Navbar";
import Hero from "./pages/Hero";
import Footer from "./components/common/Footer";
import About from "./pages/About";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import InterestPage from "./pages/Interest";
import MyRequests from "./pages/MyRequests";
import Connections from "./pages/Connections";
import ProfileView from "./pages/ProfileView";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import { selectCurrentUser, selectIsAuthenticated } from "./store/authSlice";
import { initSocketClient, disconnectSocketClient, getSocketClient } from "./utils/socketClient";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { checkAuthStatus } from "./store/authSlice";
import Profile from "./components/profile/Profile";
import Setting from "./components/profile/Setting";
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
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);

  // When the app first mounts, dispatch the auth check
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Initialize socket.io after auth ready
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && currentUser?._id) {
      initSocketClient(currentUser._id);
    }

    // Cleanup on unmount or when user logs out
    return () => {
      if (!isAuthenticated) {
        disconnectSocketClient();
      }
    };
  }, [isAuthLoading, isAuthenticated, currentUser?._id]);

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
          <Route path="/interest/:id" element={<InterestPage />} />
          <Route path="/my-requests" element={<MyRequests />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/profile/view/:userId" element={<ProfileView />} />
          <Route path="/chat/:userId" element={<Chat />} />
          <Route path="/dashboard" element={<Dashboard />} />
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default App;