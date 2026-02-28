import { supabase } from "../superbase";
export const searchMembers = async (query, familyId) => {
  try {
    if (!query?.trim()) return [];
    const { data, error } = await supabase
      .from("member_profile")
      .select(
        `
        id,
        user_phone,
        fam_id,
        member_profile_withtranslation!inner(user_fname, user_mname, user_lname, user_nativeplace)
      `,
      )
      .or(
        `user_fname.ilike.%${query}%,user_mname.ilike.%${query}%,user_lname.ilike.%${query}%`,
        { foreignTable: "member_profile_withtranslation" },
      )
      .neq("fam_id", familyId);
    if (error) throw error;
    console.log("searchMembers - Raw results:", data);
    return data || [];
  } catch (err) {
    console.error("searchMembers error:", err);
    return [];
  }
};

/**
 * Assign an existing member to a new family
 *
 * @param {number|string} memberId - Member being added
 * @param {number|string} newFamilyId - Parent's family_id
 */
export const updateMemberFamilyId = async (memberId, newFamilyId) => {
  console.log(
    "updateMemberFamilyId called with memberId:",
    memberId,
    "newFamilyId:",
    newFamilyId,
  );
  try {
    // 1️⃣ Fetch current family_id
    const { data: member, error: fetchError } = await supabase
      .from("member_profile")
      .select("fam_id")
      .eq("id", memberId)
      .single();

    if (fetchError) throw fetchError;

    // 2️⃣ Safety: already related
    if (member?.fam_id === newFamilyId) {
      throw new Error("This member already belongs to your family");
    }

    // 3️⃣ Update family_id
    const { data, error: updateError } = await supabase
      .from("member_profile")
      .update({ fam_id: newFamilyId })
      .eq("id", memberId)
      .select(); // returns updated row(s)
    console.log("Inside update familyid Updated member ", data);

    if (updateError) throw updateError;

    return { success: true };
  } catch (err) {
    console.error("updateMemberFamilyId error:", err);
    throw err;
  }
};

export const getFamilyMembers = async (familyId, userId) => {
  console.log("getFamilyMembers called with familyId:", familyId, "userId:", userId);
  const { data, error } = await supabase
  .from("member_profile")
  .select(`
    *,
    member_profile_withtranslation(*)
  `)
  .eq("fam_id", familyId);

  if (error) {
    console.error(error);
  }
  console.log("getFamilyMembers - Raw results:", data);
  return data;
};

export async function removeFamilyMemberFromFamily(memberId) {
  const { data, error } = await supabase
    .from("member_profile")
    .update({ fam_id: "0" })
    .eq("id", memberId)
    .select();

  if (error) {
    console.error("Error removing family member:", error);
  }
  console.log("removeFamilyMemberFromFamily - Removed member:", data);
  return data;
}