import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  });

  const onlineUsers = new Map(); // userId -> socketId

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Add user to online users when they connect
    socket.on('add-user', (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit('online-users', Array.from(onlineUsers.keys()));
    });

    // Handle sending messages
    socket.on('send-message', (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive-message', data);
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing', {
          senderId: data.senderId,
          isTyping: data.isTyping,
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          io.emit('online-users', Array.from(onlineUsers.keys()));
          break;
        }
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

