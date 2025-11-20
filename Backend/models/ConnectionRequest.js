import mongoose from 'mongoose';

const connectionRequestSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

// Prevent duplicate requests
connectionRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

export default ConnectionRequest;

