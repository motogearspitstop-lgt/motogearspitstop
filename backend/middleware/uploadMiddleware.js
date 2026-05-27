//backend/middleware/uploadMiddleware.js

import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadToCloudinary = async (file, folder = 'motogearspitstop') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, transformation: [{ width: 800, quality: 'auto' }] },
      (error, result) => {
        if (error) reject(error);
        else resolve({ public_id: result.public_id, url: result.secure_url });
      }
    ).end(file.buffer);
  });
};

export default upload;