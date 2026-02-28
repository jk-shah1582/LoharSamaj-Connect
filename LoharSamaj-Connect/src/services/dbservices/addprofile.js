import { supabase } from "../superbase";

export async function addProfile(tableName, payload) {
  console.log("Payload received for addProfile:", payload);
  const { data, error } = await supabase
    .from(tableName)
    .insert(payload)
    .select();

  if (error) {
    console.error("Error adding profile:", error);
    throw error;
  }
  console.log("Profile added successfully:", data);
  return data;
}
