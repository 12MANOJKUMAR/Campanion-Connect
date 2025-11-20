import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {Buffer|String} file - File buffer or file path
 * @param {String} folder - Folder name in Cloudinary (optional)
 * @returns {Promise<Object>} - Upload result with secure_url
 */
export const uploadToCloudinary = async (file, folder = 'companion-connect') => {
  try {
    // If file is a buffer (from multer), convert to data URI
    let uploadOptions = {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    };

    const result = await cloudinary.uploader.upload(file, uploadOptions);
    
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to upload image to Cloudinary',
    };
  }
};

/**
 * Delete image from Cloudinary
 * @param {String} publicId - Public ID of the image to delete
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === 'ok',
      result: result.result,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to delete image from Cloudinary',
    };
  }
};

export default cloudinary;


