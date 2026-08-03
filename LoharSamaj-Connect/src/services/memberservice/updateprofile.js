import { supabase } from "../superbase";

export async function updateProfile(table, id, updatedData) {
  const { data, error } = await supabase
    .from(table)
    .update(updatedData)
    .eq("user_id", id)
    .select(); // returns updated row(s)

  if (error) throw error;

  return data;
}

export async function updateFamProfile(table, memberId, updatedData) {
  const { data, error } = await supabase
    .from(table)
    .update(updatedData)
    .eq("id", memberId)
    .select(); // returns updated row(s)

  if (error) throw error;

  return data;
}

export async function checkFamilyHeadExists(memberId, isHead=true) {
  // Step 1: Get current member's family ID
  const { data: member, error: memberError } = await supabase
    .from("member_profile")
    .select("fam_id")
    .eq("id", memberId)
    .single();

  if (memberError) throw memberError;

  const famId = member.fam_id;

  // Step 2: Check if another family head already exists
  if (isHead) {
    const { data: existingHead, error: headError } = await supabase
      .from("member_profile")
      .select("id")
      .eq("fam_id", famId)
      .eq("is_fam_head", true)
      .neq("id", memberId) // exclude current member
      .maybeSingle();

    if (headError) throw headError;

     return !!existingHead; // true if another head exists, false otherwise
  }
}

export async function updateFamilyHeadStatus(memberId, isHead) {
  // Step 3: Update family head status
  const { data, error } = await supabase
    .from("member_profile")
    .update({ is_fam_head: isHead })
    .eq("id", memberId)
    .select();

  if (error) throw error;

  return data[0].is_fam_head;
}

export async function updateMatrimonyServiceStatus(id, newStatus) {
  // 1️⃣ Check current status
  const { data: existingData, error: fetchError } = await supabase
    .from("member_profile")
    .select("user_matrimony_service_status")
    .eq("user_id", id)
    .single();

  if (fetchError) throw fetchError;

  // 2️⃣ If already registered
  if (existingData?.user_matrimony_service_status === true) {
    alert("You are already registered for Matrimony Service!");
    return false; // or return early
  }

  const { data, error } = await supabase
    .from("member_profile")
    .update({ user_matrimony_service_status: newStatus })
    .eq("user_id", id)
    .select();

  if (error) throw error;
  console.log(
    "Matrimony service status updated:",
    data,
    "for user_id:",
    id,
    "newStatus:",
    newStatus,
  );

  return true;
}

export async function updateLangProfile(
  table,
  memberId,
  updatedData,
  langCode,
) {
  console.log(
    "Updating profile for member_id:",
    memberId,
    "with data:",
    updatedData,
    "and langCode:",
    langCode,
  );
  const { data, error } = await supabase
    .from(table)
    .update(updatedData)
    .eq("id", memberId)
    .eq("lang_code", langCode)
    .select(); // returns updated row(s)

  if (error) throw error;
  
  return data;
}

export async function updateProfilePhoto(
  filePath,
  oldPath,
  file,
  userId,
  onProgress,
) {
  console.log(
    "Updating profile photo. New path:",
    filePath,
    "Old path:",
    oldPath,
  );

  try {
    // Stage 1: Upload file (0-50%)
    if (onProgress) onProgress(0);

    const { error: uploadError } = await supabase.storage
      .from("useravatar")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    if (onProgress) onProgress(50);

    // Stage 2: Update database (50-100%)
    const { data, error } = await supabase
      .from("member_profile")
      .update({ user_photo: filePath })
      .eq("user_id", userId)
      .select();

    if (error) throw error;

    if (onProgress) onProgress(75);

    // 3️⃣ Delete old avatar (if exists)
    if (oldPath) {
      await supabase.storage.from("useravatar").remove([oldPath]);
    }

    if (onProgress) onProgress(100);

    // ✅ Upload and database update succeeded
    return true;
  } catch (error) {
    console.error("Error in updateProfilePhoto:", error);
    throw error;
  }
}

export const setUserApprovalStatus = async(memberId,status) => {
  const { data, error } = await supabase
    .from("member_profile")
    .update({"user_status": status})
    .eq("id", memberId)
    .select(); // returns updated row(s)

  if (error) throw error;

  return data;
}
