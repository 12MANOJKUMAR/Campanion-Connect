import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaInfoCircle,
  FaLightbulb,
  FaEnvelope,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserPlus,
  FaUsers,
  FaCompass,
  FaQuestionCircle,
  FaUserCircle,
  FaCog,
  FaChevronDown,
  FaHeart,
  FaBell,
} from "react-icons/fa";
import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../store/authSlice";
import companionLogo from "../../assets/companionlogo.png";
import axios from "axios";
import { buildApiUrl } from "../../utils/apiConfig";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [companionOpen, setCompanionOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [interestOpen, setInterestOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [allInterests, setAllInterests] = useState([]);
  const [interestsLoading, setInterestsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const companionRef = useRef(null);
  const profileRef = useRef(null);
  const exploreRef = useRef(null);
  const interestRef = useRef(null);
  const notificationRef = useRef(null);

  // ✅ Fix 1: Use token and user from Redux or localStorage
  const isLogin = !!user || !!localStorage.getItem("token");

  // ✅ Fix 2: Fetch interests on component mount
  useEffect(() => {
    const fetchAllInterests = async () => {
      try {
        setInterestsLoading(true);
        const response = await axios.get(buildApiUrl('/interests/all'));
        if (response.data && response.data.success) {
          const interests = response.data.data || [];
          setAllInterests(Array.isArray(interests) ? interests : []);
        } else {
          console.error("Invalid response structure:", response.data);
          setAllInterests([]);
        }
      } catch (err) {
        console.error("Error fetching interests:", err);
        setAllInterests([]);
      } finally {
        setInterestsLoading(false);
      }
    };
    fetchAllInterests();
  }, []);

  // Fetch notifications
  useEffect(() => {
    if (!isLogin) return;

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(buildApiUrl('/connections/notifications'), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (data.success) {
          setNotifications(data.data || []);
          setNotificationCount(data.count || 0);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isLogin]);

  // ✅ Fix 3: Click outside handler (desktop only so mobile accordions stay open)
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isDesktop =
        typeof window !== "undefined" &&
        window.matchMedia("(min-width: 768px)").matches;
      if (!isDesktop) return;

      if (
        companionRef.current &&
        !companionRef.current.contains(event.target)
      ) {
        setCompanionOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (exploreRef.current && !exploreRef.current.contains(event.target)) {
        setExploreOpen(false);
      }
      if (interestRef.current && !interestRef.current.contains(event.target)) {
        setInterestOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mobile menu side-effects: lock scroll and reset submenus on close, support Esc to close
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setProfileOpen(false);
      setCompanionOpen(false);
      setExploreOpen(false);
      setInterestOpen(false);
      setNotificationOpen(false);
    }

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // --- Data for Menus ---
  const baseLink = { title: "Home", link: "/", icon: <FaHome /> };

  const loggedOutLinks = [
    { title: "About", link: "/about", icon: <FaInfoCircle /> },
    { title: "Features", link: "/features", icon: <FaLightbulb /> },
    { title: "Contact", link: "/contact", icon: <FaEnvelope /> },
  ];

  const loggedInLinks = [];

  // ✅ Fix 4: Improved logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logoutUser()); // Dispatch the logout action
    setOpen(false);
    setProfileOpen(false);
    navigate("/");
  };

  // ✅ Fix 5: Remove problematic checkLoginStatus
  // This was causing infinite loop and navigation issues
  // Login status should be managed by Redux state

  const handleProfileLinkClick = (link) => {
    // Close drawer first to avoid overlay issues on mobile, then navigate
    setOpen(false);
    setProfileOpen(false);
    navigate(link);
  };

  const handleCompanionLinkClick = (link) => {
    setOpen(false);
    setCompanionOpen(false);
    navigate(link);
  };

  const handleExploreInterestClick = (interestName) => {
    setOpen(false);
    setExploreOpen(false);
    navigate(`/explore/${encodeURIComponent(interestName)}`);
  };

  const handleInterestClick = (interestName) => {
    setOpen(false);
    setInterestOpen(false);
    navigate(`/interest/${encodeURIComponent(interestName)}`);
  };

  const handleNotificationClick = (notification) => {
    setNotificationOpen(false);
    setOpen(false);
    
    // For connection_accepted notifications, navigate to the user's profile (no Accept/Reject needed)
    if (notification.type === 'connection_accepted') {
      navigate(`/profile/view/${notification.senderId._id || notification.senderId}`);
    } else if (notification.connectionRequestId) {
      // For connection requests, navigate with requestId for Accept/Reject
      navigate(`/profile/view/${notification.senderId._id || notification.senderId}?requestId=${notification.connectionRequestId}`);
    } else {
      navigate(`/profile/view/${notification.senderId._id || notification.senderId}`);
    }
  };

  // Helper function for simple links
  const renderLink = (item, isMobile = false) => (
    <Link
      to={item.link}
      key={item.title}
      className={
        isMobile
          ? "flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 group"
          : "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 group"
      }
      onClick={() => isMobile && setOpen(false)}
    >
      <span
        className={`text-gray-400 group-hover:text-blue-400 transition-colors ${
          isMobile ? "text-xl" : ""
        }`}
      >
        {item.icon}
      </span>
      <span
        className={`font-medium group-hover:text-blue-400 transition-colors ${
          isMobile ? "text-lg" : "text-sm"
        }`}
      >
        {item.title}
      </span>
    </Link>
  );

  return (
    <>
      {/* Navbar container */}
      <nav className="navbar relative z-50 bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Brand */}
            <Link to={"/"} className="flex items-center space-x-3 group">
              <img
                src={companionLogo}
                alt="logo"
                className="relative h-10 w-10 object-contain"
              />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Companion Connect
              </h1>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {renderLink(baseLink)}

              {isLogin ? (
                <>
                  {/* My Companion Dropdown */}
                  <div className="relative" ref={companionRef}>
                    <button
                      onClick={() => { setCompanionOpen((v) => !v); setExploreOpen(false); setProfileOpen(false); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                    >
                      <span className="text-gray-400 group-hover:text-blue-400">
                        <FaUsers />
                      </span>
                      <span className="text-sm font-medium group-hover:text-blue-400">
                        My Companion
                      </span>
                      <FaChevronDown
                        className={`text-gray-500 text-xs transition-transform ${
                          companionOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {companionOpen && (
                      <div className="absolute top-12 left-0 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                        {user?.interests && user.interests.length > 0 ? (
                          user.interests.map((item) => (
                            <button
                              key={item}
                              onClick={() =>
                                handleCompanionLinkClick(
                                  `/my-companion/${item}`
                                )
                              }
                              className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors group"
                            >
                              <span className="text-sm text-gray-300 group-hover:text-blue-400">
                                {item}
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-400">
                            No interests yet
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Explore Dropdown */}
                  <div className="relative" ref={exploreRef}>
                    <button
                      onClick={() => { setExploreOpen((v) => !v); setCompanionOpen(false); setProfileOpen(false); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                    >
                      <span className="text-gray-400 group-hover:text-blue-400">
                        <FaCompass />
                      </span>
                      <span className="text-sm font-medium group-hover:text-blue-400">
                        Explore
                      </span>
                      <FaChevronDown
                        className={`text-gray-500 text-xs transition-transform ${
                          exploreOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {exploreOpen && (
                      <div className="absolute top-12 left-0 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden max-h-96 overflow-y-auto z-50">
                        {interestsLoading ? (
                          <div className="px-4 py-3 text-sm text-gray-400">
                            Loading...
                          </div>
                        ) : Array.isArray(allInterests) && allInterests.length > 0 ? (
                          allInterests.map((item, index) => (
                            <button
                              key={item || index}
                              onClick={() => handleExploreInterestClick(item)}
                              className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors group"
                            >
                              <span className="text-sm text-gray-300 group-hover:text-blue-400">
                                {item}
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-400">
                            No interests available
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Interest Dropdown */}
                  <div className="relative" ref={interestRef}>
                    <button
                      onClick={() => { setInterestOpen((v) => !v); setCompanionOpen(false); setExploreOpen(false); setProfileOpen(false); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                    >
                      <span className="text-gray-400 group-hover:text-blue-400">
                        <FaHeart />
                      </span>
                      <span className="text-sm font-medium group-hover:text-blue-400">
                        Interest
                      </span>
                      <FaChevronDown
                        className={`text-gray-500 text-xs transition-transform ${
                          interestOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {interestOpen && (
                      <div className="absolute top-12 left-0 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                        {Array.isArray(user?.interests) && user.interests.length > 0 ? (
                          user.interests.map((item, index) => (
                            <button
                              key={item || index}
                              onClick={() => handleInterestClick(item)}
                              className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors group"
                            >
                              <span className="text-sm text-gray-300 group-hover:text-blue-400">
                                {item}
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-400">
                            No interests yet
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Other Logged In Links */}
                  {loggedInLinks.map((item) => renderLink(item))}

                  {/* Notifications Dropdown */}
                  <div className="relative" ref={notificationRef}>
                    <button
                      onClick={() => { setNotificationOpen((v) => !v); setCompanionOpen(false); setExploreOpen(false); setInterestOpen(false); setProfileOpen(false); }}
                      className="relative flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                    >
                      <span className="text-gray-400 group-hover:text-blue-400 relative">
                        <FaBell />
                        {notificationCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                            {notificationCount > 9 ? '9+' : notificationCount}
                          </span>
                        )}
                      </span>
                    </button>
                    {notificationOpen && (
                      <div className="absolute top-12 right-0 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden max-h-96 overflow-y-auto">
                        <div className="p-3 border-b border-slate-700">
                          <h3 className="text-sm font-semibold text-white">Notifications</h3>
                        </div>
                        {notifications.length > 0 ? (
                          <div className="divide-y divide-slate-700">
                            {notifications.map((notification) => {
                              const sender = notification.senderId;
                              return (
                                <button
                                  key={notification._id}
                                  onClick={() => handleNotificationClick(notification)}
                                  className="w-full text-left p-4 hover:bg-white/10 transition-colors group"
                                >
                                  <div className="flex items-start gap-3">
                                    <img
                                      src={sender?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(sender?.fullName || 'User')}&background=random&size=100`}
                                      alt={sender?.fullName}
                                      className="w-10 h-10 rounded-full object-cover"
                                      onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(sender?.fullName || 'User')}&background=random&size=100`;
                                      }}
                                    />
                                    <div className="flex-1">
                                      <p className="text-sm text-white group-hover:text-blue-400">
                                        {notification.type === 'connection_accepted' ? (
                                          <>
                                            <span className="font-semibold">{sender?.fullName || 'Someone'}</span>
                                            {' '}accepted your connection request
                                          </>
                                        ) : (
                                          <>
                                            <span className="font-semibold">{sender?.fullName || 'Someone'}</span>
                                            {' '}sent you a connection request
                                          </>
                                        )}
                                      </p>
                                      <p className="text-xs text-gray-400 mt-1">
                                        {new Date(notification.createdAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-gray-400 text-sm">
                            No new notifications
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Profile Dropdown */}
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => { setProfileOpen((v) => !v); setCompanionOpen(false); setExploreOpen(false); setInterestOpen(false); setNotificationOpen(false); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                    >
                      <span className="text-gray-400 group-hover:text-blue-400">
                        <FaUserCircle />
                      </span>
                      <span className="text-sm font-medium group-hover:text-blue-400">
                        {user?.fullName?.split(" ")[0] || "User"}
                      </span>
                      <FaChevronDown
                        className={`text-gray-500 text-xs transition-transform ${
                          profileOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {profileOpen && (
                      <div className="absolute top-12 right-0 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                        <button
                          onClick={() => handleProfileLinkClick("/profile")}
                          className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors group"
                        >
                          <FaUserCircle className="text-gray-400 group-hover:text-blue-400" />
                          <span className="text-sm text-gray-300 group-hover:text-blue-400">
                            Profile
                          </span>
                        </button>
                        <button
                          onClick={() => handleProfileLinkClick("/my-requests")}
                          className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors group"
                        >
                          <FaUserPlus className="text-gray-400 group-hover:text-blue-400" />
                          <span className="text-sm text-gray-300 group-hover:text-blue-400">
                            My Requests
                          </span>
                        </button>
                        <button
                          onClick={() => handleProfileLinkClick("/connections")}
                          className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors group"
                        >
                          <FaUsers className="text-gray-400 group-hover:text-blue-400" />
                          <span className="text-sm text-gray-300 group-hover:text-blue-400">
                            Connections
                          </span>
                        </button>
                        <button
                          onClick={() => handleProfileLinkClick("/setting")}
                          className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors group"
                        >
                          <FaCog className="text-gray-400 group-hover:text-blue-400" />
                          <span className="text-sm text-gray-300 group-hover:text-blue-400">
                            Setting
                          </span>
                        </button>
                        <hr className="border-white/10" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-red-600/80 transition-colors group"
                        >
                          <FaSignOutAlt className="text-red-400 group-hover:text-white" />
                          <span className="text-sm text-red-400 group-hover:text-white font-medium">
                            Sign Out
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {loggedOutLinks.map((item) => renderLink(item))}
                  <Link
                    to="/signin"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                  >
                    <span className="text-gray-400 group-hover:text-blue-400">
                      <FaSignInAlt />
                    </span>
                    <span className="text-sm font-medium group-hover:text-blue-400">
                      Sign In
                    </span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300"
                  >
                    <FaUserPlus />
                    <span className="text-sm font-medium">Sign Up</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setOpen(!open)}
            >
              {open ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`${
          open ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 left-0 w-full h-screen bg-gradient-to-b from-slate-900 to-slate-800 z-40 transition-transform duration-300 ease-in-out md:hidden overflow-y-auto`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between h-16 p-4 border-b border-white/10">
          <Link
            to={"/"}
            className="flex items-center space-x-3"
            onClick={() => setOpen(false)}
          >
            <img
              src={companionLogo}
              alt="logo"
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Companion Connect
            </h1>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Mobile Links */}
        <div className="flex flex-col p-4 space-y-2">
          {renderLink(baseLink, true)}
          <hr className="border-white/10 my-2" />

          {isLogin ? (
            <>
              {/* Profile Section */}
              <div className="px-4 py-3">
                <p className="text-sm text-gray-400">Welcome,</p>
                <p className="text-lg font-medium text-white">
                  {user?.fullName || "User"}
                </p>
              </div>
              {/* Account submenu toggle */}
              <div>
                <button
                  onClick={() => { setProfileOpen((v) => !v); setCompanionOpen(false); setExploreOpen(false); }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                >
                  <span className="text-xl text-gray-400 group-hover:text-blue-400">
                    <FaUserCircle />
                  </span>
                  <span className="text-lg font-medium text-gray-300 group-hover:text-blue-400">
                    Account
                  </span>
                  <FaChevronDown
                    className={`text-gray-500 text-xs transition-transform ml-auto ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {profileOpen && (
                  <div className="px-2 pb-2">
                    <button
                      onClick={() => handleProfileLinkClick('/profile')}
                      className="w-full text-left flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                    >
                      <FaUserCircle className="text-gray-400 group-hover:text-blue-400" />
                      <span className="text-lg font-medium text-gray-300 group-hover:text-blue-400">Profile</span>
                    </button>
                    <button
                      onClick={() => handleProfileLinkClick('/my-requests')}
                      className="w-full text-left flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                    >
                      <FaUserPlus className="text-gray-400 group-hover:text-blue-400" />
                      <span className="text-lg font-medium text-gray-300 group-hover:text-blue-400">My Requests</span>
                    </button>
                    <button
                      onClick={() => handleProfileLinkClick('/connections')}
                      className="w-full text-left flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                    >
                      <FaUsers className="text-gray-400 group-hover:text-blue-400" />
                      <span className="text-lg font-medium text-gray-300 group-hover:text-blue-400">Connections</span>
                    </button>
                    <button
                      onClick={() => handleProfileLinkClick('/setting')}
                      className="w-full text-left flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                    >
                      <FaCog className="text-gray-400 group-hover:text-blue-400" />
                      <span className="text-lg font-medium text-gray-300 group-hover:text-blue-400">Setting</span>
                    </button>
                  </div>
                )}
              </div>
              <hr className="border-white/10 my-2" />

              {/* My Companion Section (collapsible) */}
              <div>
                <button
                  onClick={() => { setCompanionOpen((v) => !v); setProfileOpen(false); setExploreOpen(false); }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                >
                  <span className="text-xl text-gray-400 group-hover:text-blue-400">
                    <FaUsers />
                  </span>
                  <span className="text-lg font-medium text-gray-300 group-hover:text-blue-400">
                    My Companion
                  </span>
                  <FaChevronDown
                    className={`text-gray-500 text-xs transition-transform ml-auto ${
                      companionOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {companionOpen && (
                  <div className="px-2 pb-2">
                    {user?.interests && user.interests.length > 0 ? (
                      user.interests.map((item) => (
                        <button
                          key={item}
                          onClick={() => {
                            handleCompanionLinkClick(`/my-companion/${item}`);
                          }}
                          className="w-full text-left flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                        >
                          <span className="text-lg font-medium text-gray-300 group-hover:text-blue-400">
                            {item}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-400">
                        No interests yet
                      </div>
                    )}
                  </div>
                )}
              </div>
              <hr className="border-white/10 my-2" />

              {/* Explore Section */}
              <div>
                <button
                  onClick={() => { setExploreOpen((v) => !v); setProfileOpen(false); setCompanionOpen(false); setInterestOpen(false); }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                >
                  <span className="text-xl text-gray-400 group-hover:text-blue-400">
                    <FaCompass />
                  </span>
                  <span className="text-lg font-medium text-gray-300 group-hover:text-blue-400">
                    Explore
                  </span>
                  <FaChevronDown
                    className={`text-gray-500 text-xs transition-transform ml-auto ${
                      exploreOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {exploreOpen && (
                  <div className="px-4 py-2 space-y-1 max-h-64 overflow-y-auto">
                    {interestsLoading ? (
                      <div className="px-4 py-2 text-sm text-gray-400">
                        Loading...
                      </div>
                    ) : Array.isArray(allInterests) && allInterests.length > 0 ? (
                      allInterests.map((interest, index) => (
                        <button
                          key={interest || index}
                          onClick={() => {
                            handleExploreInterestClick(interest);
                            setExploreOpen(false);
                          }}
                          className="w-full text-left flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                        >
                          <span className="text-lg font-medium text-gray-300 group-hover:text-blue-400">
                            {interest}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-400">
                        No interests available
                      </div>
                    )}
                  </div>
                )}
              </div>
              <hr className="border-white/10 my-2" />

              {/* Interest Section */}
              <div>
                <button
                  onClick={() => { setInterestOpen((v) => !v); setProfileOpen(false); setCompanionOpen(false); setExploreOpen(false); }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                >
                  <span className="text-xl text-gray-400 group-hover:text-blue-400">
                    <FaHeart />
                  </span>
                  <span className="text-lg font-medium text-gray-300 group-hover:text-blue-400">
                    Interest
                  </span>
                  <FaChevronDown
                    className={`text-gray-500 text-xs transition-transform ml-auto ${
                      interestOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {interestOpen && (
                  <div className="px-2 pb-2">
                    {Array.isArray(user?.interests) && user.interests.length > 0 ? (
                      user.interests.map((item, index) => (
                        <button
                          key={item || index}
                          onClick={() => {
                            handleInterestClick(item);
                            setInterestOpen(false);
                          }}
                          className="w-full text-left flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                        >
                          <span className="text-lg font-medium text-gray-300 group-hover:text-blue-400">
                            {item}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-400">
                        No interests yet
                      </div>
                    )}
                  </div>
                )}
              </div>
              <hr className="border-white/10 my-2" />

              {loggedInLinks.map((item) => renderLink(item, true))}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-lg bg-red-600/50 hover:bg-red-600/80 transition-all duration-300 group"
              >
                <span className="text-red-300 group-hover:text-white text-xl">
                  <FaSignOutAlt />
                </span>
                <span className="text-lg font-medium text-red-300 group-hover:text-white">
                  Sign Out
                </span>
              </button>
            </>
          ) : (
            <>
              {loggedOutLinks.map((item) => renderLink(item, true))}
              <hr className="border-white/10 my-2" />
              <Link
                to="/signin"
                className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                onClick={() => setOpen(false)}
              >
                <span className="text-gray-400 group-hover:text-blue-400 text-xl">
                  <FaSignInAlt />
                </span>
                <span className="text-lg font-medium group-hover:text-blue-400">
                  Sign In
                </span>
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-4 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300"
                onClick={() => setOpen(false)}
              >
                <FaUserPlus className="text-xl" />
                <span className="text-lg font-medium">Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;