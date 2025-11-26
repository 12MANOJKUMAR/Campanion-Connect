import React, { useState, useEffect } from 'react';
import { X, MapPin, Heart, Circle, UserPlus, Check, X as XIcon, MessageCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { buildApiUrl } from '../../utils/apiConfig';

const ProfileViewModal = ({ isOpen, onClose, user, pendingRequestId, onRequestResponded, isConnected = false }) => {
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isAlreadyConnected, setIsAlreadyConnected] = useState(false);

  // Check request status when modal opens or user changes
  useEffect(() => {
    const checkRequestStatus = async () => {
      if (!isOpen || !user || isConnected || pendingRequestId) {
        setPendingRequest(null);
        return;
      }

      setIsCheckingStatus(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsCheckingStatus(false);
          return;
        }

        const response = await fetch(buildApiUrl(`/connections/check/${user._id}`), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          if (data.data.isConnected) {
            setIsAlreadyConnected(true);
            setPendingRequest(null);
            setRequestSent(false);
          } else if (data.data.pendingRequest) {
            setPendingRequest(data.data.pendingRequest);
            setRequestSent(true);
            setIsAlreadyConnected(false);
          } else {
            setPendingRequest(null);
            setRequestSent(false);
            setIsAlreadyConnected(false);
          }
        }
      } catch (error) {
        console.error('Error checking request status:', error);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkRequestStatus();
  }, [isOpen, user, isConnected, pendingRequestId]);

  // Reset state when modal closes or user changes
  useEffect(() => {
    if (!isOpen || !user) {
      setRequestSent(false);
      setIsSending(false);
      setIsResponding(false);
      setPendingRequest(null);
      setIsAlreadyConnected(false);
    }
  }, [isOpen, user]);

  if (!user) return null;

  // Get initials from full name
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Check if profile picture exists and is valid
  const hasValidPhoto = user.profilePicture && 
    user.profilePicture.trim() !== '' && 
    !user.profilePicture.includes('ui-avatars.com');

  // Generate avatar URL if no photo
  const avatarUrl = hasValidPhoto 
    ? user.profilePicture 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=random&size=400`;

  // Mock status (you can replace this with real status from backend)
  const isActive = true; // This should come from backend/websocket

  const handleSendRequest = async () => {
    if (!user._id) {
      toast.error('Invalid user information');
      return;
    }

    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(buildApiUrl('/connections/send'), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          receiverId: user._id,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setRequestSent(true);
        // Fetch the request ID from response
        if (data.data && data.data._id) {
          setPendingRequest({
            _id: data.data._id,
            status: 'pending',
            createdAt: data.data.createdAt,
          });
        }
        toast.success('Request Sent Successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(data.message || 'Failed to send request');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      toast.error('Failed to send request. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleRespondToRequest = async (action) => {
    if (!pendingRequestId) {
      toast.error('Invalid request information');
      return;
    }

    setIsResponding(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(buildApiUrl(`/connections/respond/${pendingRequestId}`), {
        method: 'PUT',
        headers,
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(`Request ${action}ed successfully!`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        if (onRequestResponded) {
          onRequestResponded();
        }
        onClose();
      } else {
        toast.error(data.message || `Failed to ${action} request`);
      }
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      toast.error(`Failed to ${action} request. Please try again.`);
    } finally {
      setIsResponding(false);
    }
  };

  const handleWithdrawRequest = async () => {
    if (!pendingRequest || !pendingRequest._id) {
      toast.error('Invalid request information');
      return;
    }

    setIsWithdrawing(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(buildApiUrl(`/connections/withdraw/${pendingRequest._id}`), {
        method: 'DELETE',
        headers,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPendingRequest(null);
        setRequestSent(false);
        toast.success('Request withdrawn successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(data.message || 'Failed to withdraw request');
      }
    } catch (error) {
      console.error('Error withdrawing request:', error);
      toast.error('Failed to withdraw request. Please try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <h2 className="text-2xl font-bold text-white">Profile Details</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-6 h-6 text-gray-400 hover:text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Left Panel - Photo/Initials */}
                  <div className="bg-slate-900/50 p-8 flex flex-col items-center justify-center min-h-[400px]">
                    <div className="relative">
                      {hasValidPhoto ? (
                        <>
                          <img
                            src={user.profilePicture}
                            alt={user.fullName}
                            className="w-64 h-64 rounded-full object-cover border-4 border-slate-600 shadow-2xl"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const initialsDiv = e.target.nextElementSibling;
                              if (initialsDiv) {
                                initialsDiv.style.display = 'flex';
                              }
                            }}
                          />
                          <div
                            className={`w-64 h-64 rounded-full border-4 border-slate-600 shadow-2xl flex items-center justify-center text-6xl font-bold text-white hidden ${getGradientColor(user.fullName)}`}
                            style={{ display: 'none' }}
                          >
                            {getInitials(user.fullName)}
                          </div>
                        </>
                      ) : (
                        <div
                          className={`w-64 h-64 rounded-full border-4 border-slate-600 shadow-2xl flex items-center justify-center text-6xl font-bold text-white ${getGradientColor(user.fullName)}`}
                        >
                          {getInitials(user.fullName)}
                        </div>
                      )}
                      {/* Status indicator */}
                      <div className="absolute bottom-4 right-4">
                        <div className={`w-6 h-6 rounded-full border-4 border-slate-800 ${
                          isActive ? 'bg-green-500' : 'bg-gray-500'
                        }`} />
                      </div>
                    </div>
                  </div>

                  {/* Right Panel - Details */}
                  <div className="bg-slate-800 p-8 space-y-6">
                    {/* Name */}
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">
                        {user.fullName || 'Unknown User'}
                      </h3>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Location</p>
                        <p className="text-white font-medium">
                          {user.location || 'Location not specified'}
                        </p>
                      </div>
                    </div>

                    {/* Interests */}
                    <div className="flex items-start gap-3">
                      <Heart className="w-5 h-5 text-pink-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-400 mb-2">Interests</p>
                        {user.interests && user.interests.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {user.interests.map((interest, index) => (
                              <span
                                key={index}
                                className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400">No interests specified</p>
                        )}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-start gap-3">
                      <Circle className={`w-5 h-5 mt-1 flex-shrink-0 ${
                        isActive ? 'text-green-400 fill-green-400' : 'text-gray-400 fill-gray-400'
                      }`} />
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Status</p>
                        <p className={`font-medium ${
                          isActive ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          {isActive ? 'Active' : 'Offline'}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 space-y-3">
                      {pendingRequestId ? (
                        // Accept/Reject buttons for pending requests
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => handleRespondToRequest('accept')}
                            disabled={isResponding}
                            className="py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isResponding ? (
                              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <>
                                <Check className="w-5 h-5" />
                                Accept
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleRespondToRequest('reject')}
                            disabled={isResponding}
                            className="py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isResponding ? (
                              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <>
                                <XIcon className="w-5 h-5" />
                                Reject
                              </>
                            )}
                          </button>
                        </div>
                      ) : isConnected || isAlreadyConnected ? (
                        // Send Messages button for connected users (My Companion or already connected)
                        <button
                          onClick={() => {
                            onClose();
                            navigate(`/chat/${user._id}`);
                          }}
                          className="w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30"
                        >
                          <MessageCircle className="w-5 h-5" />
                          {isConnected ? 'Send Messages' : 'Already Connected'}
                        </button>
                      ) : pendingRequest ? (
                        // Pending status with Withdraw button
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            disabled
                            className="py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 cursor-not-allowed"
                          >
                            <Clock className="w-5 h-5" />
                            Pending
                          </button>
                          <button
                            onClick={handleWithdrawRequest}
                            disabled={isWithdrawing}
                            className="py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isWithdrawing ? (
                              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <>
                                <XIcon className="w-5 h-5" />
                                Withdraw
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        // Send Request button (normal flow)
                        <button
                          onClick={handleSendRequest}
                          disabled={isSending || isCheckingStatus}
                          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 border ${
                            isSending || isCheckingStatus
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/30 cursor-not-allowed'
                              : 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30'
                          }`}
                        >
                          {isSending || isCheckingStatus ? (
                            <>
                              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              {isSending ? 'Sending...' : 'Checking...'}
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-5 h-5" />
                              Send Request
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Helper function to generate gradient color class based on name
const getGradientColor = (name) => {
  const gradients = [
    'bg-gradient-to-br from-blue-500 to-indigo-600',
    'bg-gradient-to-br from-purple-500 to-pink-600',
    'bg-gradient-to-br from-green-500 to-emerald-600',
    'bg-gradient-to-br from-orange-500 to-red-600',
    'bg-gradient-to-br from-yellow-500 to-amber-600',
    'bg-gradient-to-br from-cyan-500 to-blue-600',
  ];
  if (!name) return gradients[0];
  const index = name.charCodeAt(0) % gradients.length;
  return gradients[index];
};

export default ProfileViewModal;

