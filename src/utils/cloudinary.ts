import * as cloudinary from "cloudinary";
import { v4 as uuidv4 } from "uuid";
import { config } from "../config";

cloudinary.v2.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

export interface UploadedFileInfo {
  cloudinaryId: string;
  url: string;
  fileName: string;
  uploadedAt: string;
}

export interface FileBinary {
  buffer: Buffer;
  originalname: string;
}

// Helper to upload a single file to Cloudinary
const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string,
  publicId: string,
): Promise<cloudinary.UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!);
      },
    );

    uploadStream.end(fileBuffer);
  });
};

// Helper to delete files from Cloudinary
export const deleteFromCloudinary = async (
  publicIds: string[],
): Promise<void> => {
  try {
    if (publicIds.length > 0) {
      await cloudinary.v2.api.delete_resources(publicIds);
    }
  } catch (error) {
    console.error("Failed to cleanup Cloudinary files:", error);
  }
};

// Upload files without database persistence (for transaction-like behavior)
export const uploadFilesToCloudinary = async (
  files: FileBinary[],
  type: "image" | "file" | "video" | "3d",
  userId: string,
): Promise<UploadedFileInfo[]> => {
  if (!files || !Array.isArray(files) || files.length === 0) {
    throw new Error("No files uploaded");
  }

  const today = new Date();
  const folderPath = `love/${type || "default"}/${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
  const uploadedFiles: UploadedFileInfo[] = [];
  const uploadedPublicIds: string[] = [];

  try {
    for (const file of files) {
      const { buffer, originalname } = file;
      const id = uuidv4();

      const result = await uploadToCloudinary(buffer, folderPath, id);
      uploadedPublicIds.push(result.public_id);

      uploadedFiles.push({
        cloudinaryId: result.public_id,
        url: result.secure_url,
        fileName: originalname,
        uploadedAt: new Date().toISOString(),
      });
    }

    return uploadedFiles;
  } catch (error: any) {
    // Cleanup uploaded files if any upload failed
    await deleteFromCloudinary(uploadedPublicIds);
    throw new Error(`File upload failed: ${error.message}`);
  }
};

// Rollback function to delete uploaded files
export const rollbackCloudinaryUploads = async (
  uploadedFiles: UploadedFileInfo[],
): Promise<void> => {
  const publicIds = uploadedFiles.map((file) => file.cloudinaryId);
  await deleteFromCloudinary(publicIds);
};

// Generate folder path
export const generateFolderPath = (type: string): string => {
  const today = new Date();
  return `love/${type || "default"}/${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
};
