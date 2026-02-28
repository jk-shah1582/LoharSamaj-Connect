import { supabase } from "../superbase";

/**
 * Get user information using userId
 */
export const getUserRoleById = async (userId) => {
  const { data, error } = await supabase
    .from("member_profile")
    .select(`
      user_role,
      user_photo
    `)
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching user role:", error);
    throw error;
  }
  
  return data;
};

export const getUserProfileWTById = async (userId) => {
  console.log(`Fetching profile for User ID: ${userId}`);
  const { data, error } = await supabase
    .from("member_profile_withtranslation")
    .select(`*`)
    .eq("id", userId)

  if (error) {
    throw error;
  }
  if(data.length === 0) {
    console.log("No profile found for the given User ID.");
    return null;
  }
  
  return data;
};

export const getUserProfileById = async (userId) => {
  console.log(`Fetching profile for User ID: ${userId}`);
  const { data, error } = await supabase
    .from("member_profile")
    .select(`*`)
    .eq("user_id", userId)

  if (error) {
    throw error;
  }
  if(data.length === 0) {
    console.log("No profile found for the given User ID.");
    return null;
  }
  
  return data;
};