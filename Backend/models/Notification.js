import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // For faster queries
  },
  type: {
    type: String,
    enum: ['connection_request', 'connection_accepted', 'connection_rejected'],
    required: true,
  },
  relatedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  connectionRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ConnectionRequest',
    default: null,
  },
  read: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

// Index for faster queries
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;

