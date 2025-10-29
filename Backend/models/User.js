import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: false, // Optional, can be used as display name
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: '', // You'll update this after image upload
  },
  interests: {
    type: [String],
    default: [],
  },
  bio: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  occupation: {
    type: String,
    default: '',
  },
  socialLinks: {
    instagram: String,
    twitter: String,
    linkedin: String,
  },
  visibility: {
    showEmail: { type: Boolean, default: true },
    showPhone: { type: Boolean, default: false },
    showLocation: { type: Boolean, default: true },
    showInterests: { type: Boolean, default: true },
    showOccupation: { type: Boolean, default: true },
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

// --- Mongoose Middleware ---

// 1. Hash password *before* saving a new user
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Mongoose Methods ---

// 2. Add a method to the User model to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model('User', userSchema);

export default User;
