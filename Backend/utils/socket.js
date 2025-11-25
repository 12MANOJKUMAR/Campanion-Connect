import { Server } from 'socket.io';

let io;
const onlineUsers = new Map(); // userId -> socketId

export const getOnlineUsers = () => onlineUsers;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'https://campanion-connect.vercel.app',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    // Add user to online users when they connect
    socket.on('add-user', (userId) => {
      if (userId) {
        onlineUsers.set(userId.toString(), socket.id);
        socket.userId = userId.toString();
        io.emit('online-users', Array.from(onlineUsers.keys()));
      }
    });

    // Handle sending messages (real-time)
    socket.on('send-message', (data) => {
      const receiverId = data.receiverId?.toString();
      const senderId = data.senderId?.toString();
      const receiverSocketId = onlineUsers.get(receiverId);
      
      // Format message for receiver
      const receiverMessage = {
        _id: data._id,
        senderId: data.senderIdObj || data.senderId,
        receiverId: data.receiverIdObj || data.receiverId,
        message: data.message,
        type: data.type || 'text',
        imageUrl: data.imageUrl || '',
        read: data.read || false,
        createdAt: data.createdAt || new Date(),
        updatedAt: data.updatedAt || new Date(),
      };
      
      if (receiverSocketId) {
        // Send to receiver
        io.to(receiverSocketId).emit('receive-message', receiverMessage);
      }
      
      // Also send back to sender for confirmation (if sender is online)
      const senderSocketId = onlineUsers.get(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit('message-sent', receiverMessage);
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId?.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing', {
          senderId: data.senderId,
          isTyping: data.isTyping,
        });
      }
    });

    // Handle stop typing
    socket.on('stop-typing', (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId?.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('stop-typing', {
          senderId: data.senderId,
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit('online-users', Array.from(onlineUsers.keys()));
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

