import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

export interface UploadOptions {
  folder?: string;
  resource_type?: string;
}

/**
 * Upload a file to Cloudinary
 * @param fileBuffer - The file buffer to upload
 * @param fileName - Original file name (used for uniqueness)
 * @param options - Upload options (folder, resource_type, etc.)
 * @returns Promise<{ secure_url: string; public_id: string }>
 */
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  fileName: string,
  options: UploadOptions = {}
): Promise<{ secure_url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: `${Date.now()}-${fileName.split('.')[0]}`,
        folder: options.folder || 'loan-documents',
        resource_type: options.resource_type || 'auto',
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else if (result) {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
    );

    // Convert buffer to stream and pipe to upload stream
    const readableStream = Readable.from(fileBuffer);
    readableStream.pipe(uploadStream);
  });
};

/**
 * Delete a file from Cloudinary
 * @param publicId - The public ID of the file to delete
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(new Error(`Cloudinary delete failed: ${error.message}`));
      } else {
        resolve();
      }
    });
  });
};
