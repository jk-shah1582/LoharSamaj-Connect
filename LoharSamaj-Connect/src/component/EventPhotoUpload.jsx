import React, { useState, useEffect } from "react";
import { supabase } from "../services/superbase";
import {
  getEventByID,
  uploadEventPhotos,
} from "../services/eventservices/event.manage.service";
const MAX_FILE_SIZE = 50 * 1024; // 50 KB

const EventPhotoUpload = ({ event, onFilesChange }) => {
  console.log("Event in Eventphotoupload  : ", event);
  //const [event, setEvent] = useState(null);
  const [fileNames, setFileNames] = useState("");
  const [uploading, setUploading] = useState(false);
 

  const handleFileChange = async (index, file) => {
    if (!file) return;

    //------code to upload file to bucket--------

    // 1. 🔒 Size validation
    if (file.size > MAX_FILE_SIZE) {
      alert("Image size must be less than 50 KB");
      return;
    }
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${event.event_id}-${Date.now()}.${fileExt}`;
    const filePath = `event-photos/${event.event_id}/${fileName}`;

    const result = await uploadEventPhotos(filePath, file);
    console.log("Upload event img result: ", result);
    if (!result) throw new Error("Upload failed");
    setUploading(false);
    //------ code to update db with uploaded file path
    setFileNames((prev) => {
      let namesArray = prev ? prev.split(",") : [];

      // Ensure array has 2 slots
      namesArray[index] = filePath;

      // Remove undefined values
      const cleaned = namesArray.filter(Boolean);

      const finalString = cleaned.join(",");

      console.log("Final string for event images ", finalString);
      // 🔥 Send string to parent
      onFilesChange(finalString);
      return finalString;
    });
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-gray-600">
        Upload Event Photos (Max 2)
      </label>

      {/* First Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(0, e.target.files[0])}
        className="w-full border rounded-lg p-2"
      />

      {/* Second Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(1, e.target.files[0])}
        className="w-full border rounded-lg p-2"
      />

      {/* Debug / Preview */}
      {fileNames && (
        <p className="text-sm text-gray-500">Stored File Names: {fileNames}</p>
      )}
    </div>
  );
};

export default EventPhotoUpload;
