// utils/cloudinaryUpload.js
 const uploadToCloudinary = async (file) => {
    debugger
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    console.log("cloudinary/name is", cloudName);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_image_upload"); // your preset
    formData.append("folder", "poojas"); // optional
  
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      return data.secure_url; // public URL of uploaded image
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      throw err;
    }
  };
  export default uploadToCloudinary