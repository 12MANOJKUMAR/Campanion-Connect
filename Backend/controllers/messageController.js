import asyncHandler from 'express-async-handler';
import Message from '../models/Message.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

// --- Send Message ---
export const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { receiverId, message, type } = req.body;
    const senderId = req.user._id; // From auth middleware

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
      type: type || 'text',
      imageUrl: req.file ? req.file.path : '',
    });

    // Emit real-time message via Socket.io
    const { getIO } = await import('../utils/socket.js');
    const io = getIO();
    io.emit('new-message', newMessage);

    res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || 'Failed to send message');
  }
});

// --- Get Chat History ---
export const getChatHistory = asyncHandler(async (req, res) => {
  try {
    const { receiverId } = req.params;
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    })
    .sort({ createdAt: 1 })
    .populate('senderId', 'fullName profilePicture')
    .populate('receiverId', 'fullName profilePicture');

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || 'Failed to fetch chat history');
  }
});

