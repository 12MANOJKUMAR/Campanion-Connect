import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaHome, FaUsers, FaEnvelope, FaVideo, FaUser } from "react-icons/fa";
import { useState } from "react";
import companionLogo from "../../assets/companionlogo.png";


const Navbar = () => {
  const [open, setOpen] = useState(false);


  const links = [
    { title: "Home", link: "/", icon: <FaHome /> },
    { title: "Find Companions", link: "/companions", icon: <FaUsers /> },
    { title: "Messages", link: "/messages", icon: <FaEnvelope /> },
    { title: "Meetings", link: "/meetings", icon: <FaVideo /> },
    { title: "Profile", link: "/profile", icon: <FaUser /> },
  ];

  return (
    <>
      {/* ✅ Navbar container */}
      <nav className="navbar relative z-50 bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* ✅ Logo + Brand */}
            <Link to={"/"} className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <img
                  src={companionLogo}
                  alt="logo"
                  className="relative h-10 w-10 object-contain"
                />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Companion Connect
              </h1>
            </Link>

            {/* ✅ Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {links.map((item, i) => (
                <Link
                  to={item.link}
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 group"
                >
                  <span className="text-gray-400 group-hover:text-blue-400 transition-colors">
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>

            {/* ✅ Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setOpen(!open)}
            >
              {open ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ✅ Mobile Menu */}
      <div
        className={`${
          open ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 left-0 w-full h-screen bg-gradient-to-b from-slate-900 to-slate-800 z-40 transition-transform duration-300 ease-in-out`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Link to={"/"} className="flex items-center space-x-3" onClick={() => setOpen(false)}>
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
          {links.map((item, i) => (
            <Link
              to={item.link}
              key={i}
              className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 group"
              onClick={() => setOpen(false)}
            >
              <span className="text-gray-400 group-hover:text-blue-400 transition-colors text-xl">
                {item.icon}
              </span>
              <span className="text-lg font-medium group-hover:text-blue-400 transition-colors">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;