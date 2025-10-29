import React, { useState, useEffect } from "react";
import { MapPin, Users, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";

const CompanionsPage = () => {
  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  const params = useParams();

  useEffect(() => {
    const fetchCompanions = async () => {
      setLoading(true); // Add this to show loading on subsequent fetches
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/mycompanions?interests=${params.id}`
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
              <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-600 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
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
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {companion.fullName}
                </h3>

                <div className="flex items-center text-gray-300 mb-4">
                  <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                  <span className="text-sm">
                    {companion.location || "Location not specified"}
                  </span>
                </div>

                {/* Action Button */}
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg">
                  View Profile
                </button>
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