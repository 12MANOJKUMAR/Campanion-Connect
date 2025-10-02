import React from "react";
import { Link } from "react-router-dom";
import { 
  FaFacebook, 
  FaInstagram, 
  FaLinkedin, 
  FaTwitter,
  FaEnvelope,
  FaPhone,
  FaComments,
  FaHeart
} from "react-icons/fa";

const Footer = () => {
  const socialLinks = [
    { icon: <FaFacebook />, href: "#", name: "Facebook" },
    { icon: <FaInstagram />, href: "#", name: "Instagram" },
    { icon: <FaLinkedin />, href: "#", name: "LinkedIn" },
    { icon: <FaTwitter />, href: "#", name: "Twitter" },
  ];

  const legalLinks = [
    { title: "Disclaimer", href: "/disclaimer" },
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms & Conditions", href: "/terms" },
  ];

  return (
    <footer className="bg-slate-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Social Media Section */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-white mb-4">Stay Connected with Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.name}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300 transform group-hover:scale-110">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Follow us for updates and connect with our community
            </p>
          </div>

          {/* Contact/Support Section */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-white mb-4">Contact & Support</h3>
            <div className="space-y-3">
              <a 
                href="mailto:support@companionconnect.com" 
                className="flex items-center justify-center md:justify-start gap-3 hover:text-blue-400 transition-colors group"
              >
                <FaEnvelope className="text-blue-400 group-hover:scale-110 transition-transform" />
                <span>support@companionconnect.com</span>
              </a>
              <a 
                href="tel:+919876543210" 
                className="flex items-center justify-center md:justify-start gap-3 hover:text-blue-400 transition-colors group"
              >
                <FaPhone className="text-blue-400 group-hover:scale-110 transition-transform" />
                <span>+91-9876543210</span>
              </a>
              <Link 
                to="/help" 
                className="flex items-center justify-center md:justify-start gap-3 hover:text-blue-400 transition-colors group"
              >
                <FaComments className="text-blue-400 group-hover:scale-110 transition-transform" />
                <span>Live Chat / Help</span>
              </Link>
            </div>
          </div>

          {/* Legal Section */}
          <div className="text-center md:text-left lg:text-right">
            <h3 className="text-xl font-semibold text-white mb-4">Legal</h3>
            <div className="space-y-2">
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="block hover:text-blue-400 transition-colors hover:translate-x-1 transform duration-300"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800"></div>

        {/* Copyright Section */}
        <div className="py-6 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            © 2025 Companion Connect. All rights reserved. 
            <span className="text-red-500 animate-pulse">
              <FaHeart className="inline" />
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;