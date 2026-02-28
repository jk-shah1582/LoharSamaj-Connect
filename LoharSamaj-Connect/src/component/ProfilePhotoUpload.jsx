import { useRef, useState, useEffect } from "react";
import {updateProfilePhoto } from "../services/memberservice/updateprofile";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/superbase";

const MAX_FILE_SIZE = 50 * 1024; // 50 KB

export default function ProfilePhotoUpload({
  photoPath,
  onUploadSuccess,
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [displayPhotoPath, setDisplayPhotoPath] = useState(photoPath);
  const { userId } = useAuth();
  //console.log("ProfilePhotoUpload for :", userId, "current photo path:", photoPath);

  // Sync displayPhotoPath when photoPath prop changes
  useEffect(() => {
    setDisplayPhotoPath(photoPath);
  }, [photoPath]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 🔒 Size validation
    if (file.size > MAX_FILE_SIZE) {
      alert("Image size must be less than 50 KB");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-photos/${userId}/${fileName}`;
      
      // ⬆ Upload to Supabase Storage with progress tracking
      const result = await updateProfilePhoto(filePath, photoPath, file, userId, (progress) => {
        setUploadProgress(progress);
      });
      
      if (!result) throw new Error("Upload failed");

      // ✅ Update displayed image immediately after successful upload
      setDisplayPhotoPath(filePath);
      
      // ✅ Notify parent only if upload succeeded
      onUploadSuccess(filePath);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Photo upload failed. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      e.target.value = "";
    }
    
  };
  
  const publicUrl =
    displayPhotoPath
      ? supabase.storage.from("useravatar").getPublicUrl(displayPhotoPath).data.publicUrl
      : "/images/default-user.png";

  
  return (
    <div className="flex flex-col items-center gap-2">
      <img
        src={publicUrl}
        alt="Profile"
        onClick={handleImageClick}
        className="h-24 w-24 rounded-full object-cover border cursor-pointer hover:opacity-80"
      />

      {uploading ? (
        <div className="w-full max-w-xs">
          <div className="flex flex-col items-center gap-1">
            <progress 
              value={uploadProgress} 
              max={100} 
              className="w-full h-2 accent-blue-500"
            />
            <span className="text-xs text-gray-600">
              {uploadProgress < 50 
                ? `Uploading to storage... ${Math.round(uploadProgress * 2)}%` 
                : `Updating database... ${50 + Math.round((uploadProgress - 50) * 2)}%`}
            </span>
          </div>
        </div>
      ) : (
        <span className="text-xs text-gray-500">Click to change photo</span>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFileChange}
      />
    </div>
  );
}
