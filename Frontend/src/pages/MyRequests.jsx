import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, UserPlus, X as XIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const MyRequests = () => {
  const [requests, setRequests] = useState({ today: [], yesterday: [], older: [] });
  const [loading, setLoading] = useState(true);
  const [withdrawingIds, setWithdrawingIds] = useState(new Set());

  useEffect(() => {
    const fetchSentRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('http://localhost:5000/api/connections/sent', {
          headers,
        });

        const data = await response.json();

        if (data.success) {
          setRequests(data.data);
        } else {
          setRequests({ today: [], yesterday: [], older: [] });
        }
      } catch (error) {
        console.error('Error fetching sent requests:', error);
        setRequests({ today: [], yesterday: [], older: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchSentRequests();
  }, []);

  const handleWithdrawRequest = async (requestId) => {
    if (!requestId) {
      toast.error('Invalid request information');
      return;
    }

    setWithdrawingIds(prev => new Set(prev).add(requestId));
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:5000/api/connections/withdraw/${requestId}`, {
        method: 'DELETE',
        headers,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Request withdrawn successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Refresh the requests list
        const refreshResponse = await fetch('http://localhost:5000/api/connections/sent', {
          headers,
        });
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setRequests(refreshData.data);
        }
      } else {
        toast.error(data.message || 'Failed to withdraw request');
      }
    } catch (error) {
      console.error('Error withdrawing request:', error);
      toast.error('Failed to withdraw request. Please try again.');
    } finally {
      setWithdrawingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />;
      default:
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    }
  };

  const renderRequestCard = (request) => {
    const user = request.receiverId || request.receiver;
    if (!user) return null;

    const isWithdrawing = withdrawingIds.has(request._id);
    const isPending = request.status === 'pending';

    return (
      <motion.div
        key={request._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-700/90 rounded-xl p-3 sm:p-4 border border-slate-600 hover:border-blue-400/40 transition-all"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random&size=200`}
              alt={user.fullName}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-slate-600"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random&size=200`;
              }}
            />
          </div>
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <h3 className="text-base sm:text-lg font-semibold text-white truncate">{user.fullName}</h3>
            <p className="text-xs sm:text-sm text-gray-400 truncate">{user.location || 'Location not specified'}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {getStatusIcon(request.status)}
              <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full border ${getStatusColor(request.status)}`}>
                {getStatusText(request.status)}
              </span>
              {isPending && (
                <button
                  onClick={() => handleWithdrawRequest(request._id)}
                  disabled={isWithdrawing}
                  className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium rounded-full border bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {isWithdrawing ? (
                    <>
                      <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span className="hidden sm:inline">Withdrawing...</span>
                    </>
                  ) : (
                    <>
                      <XIcon className="w-3 h-3" />
                      <span>Withdraw</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderSection = (title, items, dateLabel) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-blue-500 rounded"></span>
          {title}
        </h2>
        <div className="space-y-3">
          {items.map((request) => (
            <div key={request._id}>
              {dateLabel && request.formattedDate && (
                <p className="text-xs text-gray-500 mb-2 ml-4">{request.formattedDate}</p>
              )}
              {renderRequestCard(request)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-300 font-medium">Loading requests...</p>
        </div>
      </div>
    );
  }

  const totalRequests = requests.today.length + requests.yesterday.length + requests.older.length;

  return (
    <div className="min-h-screen bg-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-slate-700 rounded-xl">
              <UserPlus className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">My Requests</h1>
              <p className="text-gray-400">View all your connection requests</p>
            </div>
          </div>
          <div className="inline-flex items-center px-4 py-2 bg-slate-700 rounded-full">
            <span className="text-sm font-semibold text-blue-400">{totalRequests}</span>
            <span className="text-sm text-gray-300 ml-2">Total Requests</span>
          </div>
        </div>

        {/* Requests List */}
        {totalRequests === 0 ? (
          <div className="text-center py-16 bg-slate-700/50 rounded-xl">
            <UserPlus className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No requests sent</h3>
            <p className="text-gray-400">You haven't sent any connection requests yet</p>
          </div>
        ) : (
          <>
            {renderSection('Today', requests.today)}
            {renderSection('Yesterday', requests.yesterday)}
            {renderSection('Older', requests.older, true)}
          </>
        )}
      </div>
    </div>
  );
};

export default MyRequests;

