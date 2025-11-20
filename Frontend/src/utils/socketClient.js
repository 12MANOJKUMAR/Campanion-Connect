import { io } from 'socket.io-client';

let socket = null;

// Get the backend URL - use same port as API calls (5000)
// Socket.io runs on the same server as the API
const getBackendUrl = () => {
  // Use the same port as API calls (5000) since socket.io is on the same server
  // Hardcoded to localhost:5000 to match API calls
  return 'http://localhost:5000';
};

export const initSocketClient = (userId) => {
  // Disconnect existing socket if not connected
  if (socket && !socket.connected) {
    socket.disconnect();
    socket = null;
  }

  if (socket && socket.connected) {
    // If already connected, just add user if not already added
    if (userId) {
      socket.emit('add-user', userId);
    }
    return socket;
  }

  const backendUrl = getBackendUrl();

  socket = io(backendUrl, {
    transports: ['websocket', 'polling'], // Allow fallback to polling if websocket fails
    withCredentials: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    forceNew: false, // Reuse connection if possible
  });

  socket.on('connect', () => {
    if (userId) {
      socket.emit('add-user', userId);
    }
  });

  socket.on('disconnect', (reason) => {
    if (reason === 'io server disconnect') {
      // Server disconnected the socket, reconnect manually
      socket.connect();
    }
  });

  socket.on('reconnect', (attemptNumber) => {
    if (userId) {
      socket.emit('add-user', userId);
    }
  });

  return socket;
};

export const getSocketClient = () => socket;

export const disconnectSocketClient = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};





