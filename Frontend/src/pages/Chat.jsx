import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';
import { initSocketClient, getSocketClient, disconnectSocketClient } from '../utils/socketClient.js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatUser, setChatUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket and fetch chat
  useEffect(() => {
    const fetchChatData = async () => {
      if (!user || !userId) {
        navigate('/');
        return;
      }

      setLoading(true);

      try {
        // Fetch chat user details
        const token = localStorage.getItem('token');
        const userResponse = await fetch(`https://campanion-connect.onrender.com/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.success) {
            setChatUser(userData.data);
          }
        }

        // Fetch chat history
        const messagesResponse = await fetch(`https://campanion-connect.onrender.com/api/messages/chat/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          if (messagesData.success) {
            setMessages(messagesData.data || []);
          }
        }

        // Initialize socket
        const socket = initSocketClient(user._id);
        socketRef.current = socket;

        // Listen for new messages
        socket.on('receive-message', (message) => {
          const senderId = (message.senderId?._id || message.senderId)?.toString();
          const receiverId = (message.receiverId?._id || message.receiverId)?.toString();
          const currentUserId = user._id?.toString();
          const chatUserId = userId?.toString();
          
          // Check if message is for this chat
          if (
            (senderId === chatUserId && receiverId === currentUserId) ||
            (senderId === currentUserId && receiverId === chatUserId)
          ) {
            // Check if message already exists to avoid duplicates
            setMessages((prev) => {
              const exists = prev.some((msg) => msg._id === message._id);
              if (exists) {
                return prev;
              }
              return [...prev, message];
            });
          }
        });
        
        // Listen for message sent confirmation
        socket.on('message-sent', (message) => {
          const senderId = message.senderId?.toString() || message.senderId;
          const receiverId = message.receiverId?.toString() || message.receiverId;
          const currentUserId = user._id?.toString();
          const chatUserId = userId?.toString();
          
          // If we sent this message, add it to our view
          if (senderId === currentUserId && receiverId === chatUserId) {
            setMessages((prev) => {
              const exists = prev.some((msg) => msg._id === message._id);
              if (exists) {
                return prev;
              }
              return [...prev, message];
            });
          }
        });

        // Listen for typing indicator
        socket.on('typing', (data) => {
          if (data.senderId === userId || data.senderId?.toString() === userId) {
            setIsTyping(true);
          }
        });

        socket.on('stop-typing', (data) => {
          if (data.senderId === userId || data.senderId?.toString() === userId) {
            setIsTyping(false);
          }
        });

      } catch (error) {
        toast.error('Failed to load chat');
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.off('receive-message');
        socketRef.current.off('message-sent');
        socketRef.current.off('typing');
        socketRef.current.off('stop-typing');
      }
    };
  }, [userId, user, navigate]);

  // Handle typing indicator
  const handleTyping = () => {
    if (socketRef.current && userId) {
      socketRef.current.emit('typing', {
        senderId: user._id,
        receiverId: userId,
        isTyping: true,
      });

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        if (socketRef.current) {
          socketRef.current.emit('stop-typing', {
            senderId: user._id,
            receiverId: userId,
          });
        }
      }, 1000);
    }
  };

  // Handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const token = localStorage.getItem('token');

      // Send via API (saves to database)
      const response = await fetch('https://campanion-connect.onrender.com/api/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: userId,
          message: messageText,
          type: 'text',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Format message for socket
        const socketMessage = {
          _id: data.data._id,
          senderId: {
            _id: data.data.senderId._id || data.data.senderId,
            fullName: data.data.senderId.fullName || user.fullName,
            profilePicture: data.data.senderId.profilePicture || user.profilePicture,
          },
          receiverId: {
            _id: data.data.receiverId._id || data.data.receiverId,
          },
          message: messageText,
          type: 'text',
          createdAt: data.data.createdAt,
          updatedAt: data.data.updatedAt,
        };

        // Add message to local state
        setMessages((prev) => {
          const exists = prev.some((msg) => msg._id === socketMessage._id);
          if (exists) {
            return prev;
          }
          return [...prev, socketMessage];
        });

        // Emit via socket for real-time
        if (socketRef.current && socketRef.current.connected) {
          socketRef.current.emit('send-message', {
            _id: socketMessage._id,
            senderId: user._id.toString(),
            receiverId: userId.toString(),
            message: messageText,
            type: 'text',
            createdAt: socketMessage.createdAt,
            senderIdObj: socketMessage.senderId,
            receiverIdObj: socketMessage.receiverId,
          });
        }
      } else {
        toast.error(data.message || 'Failed to send message');
        setNewMessage(messageText); // Restore message
      }
    } catch (error) {
      toast.error('Failed to send message');
      setNewMessage(messageText); // Restore message
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-gray-300 font-medium">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!chatUser) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="text-center p-8 bg-slate-700 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-red-400 mb-4">User Not Found</h3>
          <p className="text-gray-300 mb-6">The user you're trying to chat with doesn't exist.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-800 flex flex-col">
      {/* Header */}
      <div className="bg-slate-700/90 border-b border-slate-600 px-4 py-3 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-600 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-300" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <img
            src={chatUser.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(chatUser.fullName)}&background=random&size=200`}
            alt={chatUser.fullName}
            className="w-10 h-10 rounded-full object-cover border-2 border-slate-600"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(chatUser.fullName)}&background=random&size=200`;
            }}
          />
          <div>
            <h2 className="text-lg font-semibold text-white">{chatUser.fullName}</h2>
            {isTyping && (
              <p className="text-xs text-blue-400">typing...</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.senderId?._id === user._id || message.senderId?._id?.toString() === user._id;
            return (
              <div
                key={message._id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2 max-w-[70%] sm:max-w-[60%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isOwn && (
                    <img
                      src={message.senderId?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.senderId?.fullName || 'User')}&background=random&size=100`}
                      alt={message.senderId?.fullName}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(message.senderId?.fullName || 'User')}&background=random&size=100`;
                      }}
                    />
                  )}
                  <div className={`rounded-2xl px-4 py-2 ${isOwn ? 'bg-blue-500 text-white' : 'bg-slate-700 text-gray-100'}`}>
                    <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                    <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="bg-slate-700/90 border-t border-slate-600 px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1 bg-slate-600 text-white placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;

