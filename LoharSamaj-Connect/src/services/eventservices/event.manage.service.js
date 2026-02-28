import { supabase } from "../superbase";
const EVENT_BUCKET = "event_images";
export const getUpcommingEvents = async () => {
  const { data, error } = await supabase
    .from("event_master")
    .select(`*`)
    .eq("event_status", true)
    .order("event_date", { ascending: true });

  if (error) {
    return [];
  }
  return data;
};

export const getEventPhotos = async (eventId) => {
  const { data, error } = await supabase
    .from("event_master")
    .select(`event_image`)
    .eq("event_id", eventId);

  if (error) {
    return [];
  }
  return data;
};

export const getPhotosForAllEvents = async () => {
  const { data, error } = await supabase
    .from("event_master")
    .select("event_image, event_title")
    .eq("event_status", true)
    .neq("event_image", null)
    .order("event_date", { ascending: true })
    .limit(4);

  if (error) {
    console.log("Event Photos Error: ", error);
    return [];
  }
  return data;
};

export const getEventByID = async (id) => {
  const { data, error } = await supabase
    .from("event_master")
    .select(`*`)
    .eq("event_status", true)
    .eq("event_id", id);

  if (error) {
    return [];
  }
  return data;
};

export const addEvents = async (eventData) => {
  const { data, error } = await supabase
    .from("event_master")
    .insert(eventData)
    .select();
  if (error) {
    throw new Error(error.message);
  }

  return data[0];
};

export const updateEvent = async (eventId, updatedData) => {
  const { data, error } = await supabase
    .from("event_master")
    .update(updatedData)
    .eq("event_id", eventId)
    .select();
  if (error) {
    throw new Error(error.message);
  }
  return data[0];
};

export const deleteEvent = async (eventId) => {
  const { data, error } = await supabase
    .from("event_master")
    .delete()
    .eq("id", eventId)
    .select();
  if (error) {
    throw new Error(error.message);
  }
  return data[0];
};

export async function uploadEventPhotos(filePath, file) {
  console.log("Uploading event photo. Path:", filePath);

  const { error: uploadError } = await supabase.storage
    .from(EVENT_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw uploadError;
  return true;
}

export async function removePhotosOfDeletedEvent(eventId) {
  let storageErrors = [];

  // 1️⃣ Mark event as deleted in DB
  const { data, error: dbError } = await supabase
    .from("event_master")
    .update({ event_status: false })
    .eq("event_id", eventId)
    .select()
    .single();

  if (dbError) {
    return {
      success: false,
      message: dbError.message,
      data: null,
      storageErrors: [],
    };
  }

  // 2️⃣ Remove files from storage
  try {
    const photo = await getEventPhotos(eventId);

    if (photo?.[0]?.event_image) {
      const photos = photo[0].event_image.split(",");

      for (const photoPath of photos) {
        if (photoPath?.trim()) {
          console.log("Deleting photo:", photoPath);

          const { error: storageError } = await supabase.storage
            .from(EVENT_BUCKET)
            .remove([photoPath]);

          if (storageError) {
            console.warn("Failed to delete:", photoPath, storageError);
            storageErrors.push({
              path: photoPath,
              error: storageError.message,
            });
          }
        }
      }
    }
  } catch (error) {
    console.warn("Error removing photos:", error);
    storageErrors.push({ generalError: error.message });
  }

  // 3️⃣ Return structured response
  return {
    success: true,
    message:
      storageErrors.length > 0
        ? "Event marked deleted, but some photos failed to delete."
        : "Event deleted successfully.",
    data,
    storageErrors,
  };
}
