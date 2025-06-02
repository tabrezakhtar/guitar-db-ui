import { resizeImage } from "./imageUtils";

export const cloudinaryUpload = async (file, folder) => {
  // If it's already a cloudinary URL, no need to re-upload
  if (!file.url || !file.url.startsWith("blob:http")) {
    return file.url;
  }

  const cloudName = "x8d5hlk1";
  const apiKey = "124113443758435";
  const formData = new FormData();

  const resizedFile = await resizeImage(file.file);
  formData.append("file", resizedFile);
  formData.append("folder", folder);
  formData.append("upload_preset", "guitar-images");
  formData.append("api_key", apiKey);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error("Error uploading image:", data.error);
      return { 
        success: false, 
        error: data.error 
      };
    }
    
    return {
      success: true,
      secure_url: data.secure_url,
      originalUrl: file.url
    };
  } catch (error) {
    console.error("Failed to upload to cloudinary:", error);
    throw error;
  }
};