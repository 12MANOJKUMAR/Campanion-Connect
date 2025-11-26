import React, { useState, useEffect } from "react";
import { MapPin, Users, Loader2, MessageCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import ProfileViewModal from "./ProfileViewModal";
import { buildApiUrl } from "../../utils/apiConfig";

const CompanionsPage = () => {
  const navigate = useNavigate();
  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const params = useParams();

  const handleViewProfile = (companion) => {
    setSelectedUser(companion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    const fetchCompanions = async () => {
      setLoading(true); // Add this to show loading on subsequent fetches
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(
          buildApiUrl(`/users/mycompanions?interests=${encodeURIComponent(params.id)}`),
          {
            headers,
          }
        );

        const data = await response.json();

        if (data.success) {
          setCompanions(data.companions);
          setCount(data.count);
        } else {
          setCompanions([]);
          setCount(0);
        }
      } catch (error) {
        console.error("Error fetching companions:", error);
        setCompanions([]);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCompanions();
    }
  }, [params.id]); // Add params.id to dependency array

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-300 font-medium">Loading companions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700 rounded-full mb-4">
            <Users className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            {params.id.toLocaleUpperCase()} COMPANION
          </h1>
          <p className="text-lg text-gray-300">
            Discover amazing people to travel with
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-slate-700 rounded-full shadow-sm border border-slate-600">
            <span className="text-sm font-semibold text-blue-400">{count}</span>
            <span className="text-sm text-gray-300 ml-2">
              Companions Available
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companions.map((companion, index) => (
            <div
              key={companion._id}
              className="group bg-slate-700/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-600 hover:border-blue-400/40 transform hover:-translate-y-1"
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Card Header with Image */}
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img
                  src={companion.profilePicture}
                  alt={companion.fullName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      companion.fullName
                    )}&background=random&size=400`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                <div className="absolute bottom-2 sm:bottom-3 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white truncate">
                      {companion.fullName}
                    </h3>
                    <div className="mt-1 flex items-center text-gray-200 text-xs sm:text-sm">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 text-blue-400 flex-shrink-0" />
                      <span className="truncate">{companion.location || "Location not specified"}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/chat/${companion._id}`)}
                    aria-label="Chat"
                    className="p-2 sm:p-3 rounded-full bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 text-blue-300 shadow-lg transition-colors flex-shrink-0"
                    title="Chat"
                  >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 sm:p-5 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <span className="inline-flex items-center gap-2 text-xs text-gray-300">
                    <span className="h-2 w-2 rounded-full bg-green-400"></span>
                    Active now
                  </span>
                  <button 
                    onClick={() => handleViewProfile(companion)}
                    className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-500/20 text-slate-300 border border-slate-500/30 rounded-lg hover:bg-slate-500/30 transition-colors text-xs sm:text-sm"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {companions.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-700 rounded-full mb-4">
              <Users className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No companions found
            </h3>
            <p className="text-gray-300">
              Check back later for new travel companions
            </p>
          </div>
        )}
      </div>

      {/* Profile View Modal */}
      <ProfileViewModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
        isConnected={true}
      />

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CompanionsPage;