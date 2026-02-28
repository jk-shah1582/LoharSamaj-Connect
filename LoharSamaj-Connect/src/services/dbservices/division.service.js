import { supabase } from "../superbase";

/**
 * Get Division List
 */
export const getDivisionList = async () => {
  const { data, error } = await supabase
    .from("division_master")
    .select("div_id, div_name")
    .order("div_name");

  if (error) {
    throw error;
  }
  return data;
};

/** * Get Division By ID
 */
export const getDivisionNameById = async (divId) => {
  const { data, error } = await supabase
    .from("division_master")
    .select("div_name")
    .eq("div_id", divId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
