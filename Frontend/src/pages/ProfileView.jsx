import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import ProfileViewModal from '../components/Dashboard/ProfileViewModal';
import { buildApiUrl } from '../utils/apiConfig';

const ProfileView = () => {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const requestId = searchParams.get('requestId');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(buildApiUrl(`/users/${userId}`), {
          headers,
        });

        const data = await response.json();

        if (data.success) {
          setUser(data.data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleRequestResponded = () => {
    // Refresh notifications or navigate away
    navigate('/my-requests');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300 font-medium">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <ProfileViewModal
      isOpen={true}
      onClose={() => navigate(-1)}
      user={user}
      pendingRequestId={requestId}
      onRequestResponded={handleRequestResponded}
    />
  );
};

export default ProfileView;

