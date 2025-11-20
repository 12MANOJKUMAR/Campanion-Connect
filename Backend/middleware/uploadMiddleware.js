import multer from 'multer';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// Configure multer to store files in memory (as buffer)
const storage = multer.memoryStorage();

// File filter - only accept images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Middleware to upload single file to Cloudinary
export const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(); // No file uploaded, continue
    }

    // Convert buffer to data URI for Cloudinary
    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(dataUri, 'companion-connect/profiles');
    
    if (uploadResult.success) {
      // Attach Cloudinary URL to request body
      req.body.profilePicture = uploadResult.url;
    } else {
      return res.status(400).json({
        success: false,
        message: uploadResult.error || 'Failed to upload image',
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error processing image upload',
    });
  }
};

// Export multer instance for direct use if needed
export { upload };

