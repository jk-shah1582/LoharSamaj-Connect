import { supabase } from "../superbase";

export const getAllMembers = async () => {
  const { data, error } = await supabase
  .from("member_profile")
  .select(`
    *,
    member_profile_withtranslation(*)
  `);

if (error) {
  console.error(error);
}

return data;
};

export const getMemberBasicInfo = async (from, to) => {
  
  const { data, error } = await supabase
  .from("member_profile")
  .select(`
    id,
    user_id,
    user_photo,
    user_phone,
    member_profile_withtranslation(member_id, user_fname, user_mname, user_lname,user_nativeplace,user_education, user_occupation, lang_code, id)
  `)
  .eq("user_status",true)
  .range(from, to);

  if (error) {
    console.error("ERROR fetching member basic info:", error.message, error);
    return null;
  }
  
  // Sort by user_fname from the first translation (lang_code preference)
  const sortedData = data?.sort((a, b) => {
    const nameA = a.member_profile_withtranslation?.[0]?.user_fname || "";
    const nameB = b.member_profile_withtranslation?.[0]?.user_fname || "";
    return nameA.localeCompare(nameB);
  });

  console.log("Sorted members list : ", sortedData);
  return sortedData;
};

export const getInactiveMemberInfo = async (from, to, divId) => {
  
  const { data, error } = await supabase
  .from("member_profile")
  .select(`
    id,
    user_id,
    user_phone,
    member_profile_withtranslation(member_id, user_fname, user_mname, user_lname,user_nativeplace,user_education, user_occupation, lang_code, id)
  `)
  .eq("user_status",false)
  .eq("user_fromdivision", divId)
  .order("id", { ascending: true })
  .range(from, to);

  if (error) {
    console.error("ERROR fetching member basic info:", error.message, error);
    return null;
  }
  console.log("Inactive members : ",data);
  return data;
};

export const getMemberById = async (memberId) => {
  const { data, error } = await supabase
    .from("member_profile")
    .select(`
      *,
      member_profile_withtranslation(*)
    `)
    .eq("id", memberId)
    .single(); // ensures one object, not array

  if (error) {
    console.error("Error fetching member:", error);
    return null;
  }

  return data;
};

export const getFamilyIdByMemberId = async (memberId) => {
  const { data, error } = await supabase
    .from("member_profile")
    .select("fam_id")
    .eq("id", memberId)
    .single();
  if (error) {
    console.error("Error fetching family ID:", error);
    return null;
  }
  return data.fam_id;
}

export const getMemberPhotoPublicUrl = (photoPath) => {
  const publicUrl =
    photoPath
      ? supabase.storage.from("useravatar").getPublicUrl(photoPath).data.publicUrl
      : "/images/default-user.png";

  return publicUrl;
}

export const getMemberIdByUserId = async (userId) => {
  const { data, error } = await supabase
    .from("member_profile")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching member ID:", error);
    return null;
  }
  
  return data.id;
}

export const getMemberNameById = async (memberId) => {
  console.log(`inside getMemberNameById method for member id: ${memberId}`);
  const { data, error } = await supabase
    .from("member_profile_withtranslation")
    .select("user_fname, user_mname, user_lname")
    .eq("user_id", memberId)
    .eq("lang_code", "en") // Assuming you want the English name; adjust as needed
    .single();  

  if (error) {
    console.error("Error fetching member name:", error);
    return null;
  }
  console.log(`Fetched member name for member ID ${memberId}:`, data);
  const memberName = `${data.user_fname} ${data.user_mname} ${data.user_lname}`;
  console.log(`Constructed member name: ${memberName}`);
  return memberName;
}

export const searchMembersByName = async (query) => {
  try {
    if (!query?.trim()) return [];
    const { data, error } = await supabase
      .from("member_profile")
      .select(
        `
        id,
        user_id,
        user_phone,
        member_profile_withtranslation!inner(user_fname, user_mname, user_lname, user_nativeplace)
      `,
      )
      .not("user_id", "is", null)
      .or(
        `user_fname.ilike.%${query}%,user_mname.ilike.%${query}%,user_lname.ilike.%${query}%`,
        { foreignTable: "member_profile_withtranslation" },
      )
      
    if (error) throw error;
    console.log("searchMembers - Raw results:", data);
    return data || [];
  } catch (err) {
    console.error("searchMembers error:", err);
    return [];
  }
};

export const getDivisionOfUser = async(userId) => {
  const { data, error } = await supabase
    .from("member_profile")
    .select("user_fromdivision")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching family ID:", error);
    return null;
  }
  return data.user_fromdivision;
}

export const searchMembersByProfileFilters = async ({
  occupation = "",
  location = "",
  education = "",
  gender = "",
  from = 0,
  to = 99,
} = {}) => {
  try {
    const { data, error } = await supabase
      .from("member_profile")
      .select(`
        id,
        user_id,
        user_photo,
        user_phone,
        member_profile_withtranslation(member_id, user_fname, user_mname, user_lname, user_nativeplace, user_education, user_occupation, user_gender, lang_code, id)
      `)
      .eq("user_status", true)
      .neq("member_profile_withtranslation.user_maritalstatus", "Married")
      .range(from, to);

    if (error) throw error;

    const normalize = (value) => (value || "").toString().trim().toLowerCase();

    const filteredData = (data || []).filter((member) => {
      const translations = member.member_profile_withtranslation || [];

      return translations.some((translation) => {
        const matchesAddress = !location || normalize(translation.user_nativeplace).includes(normalize(location));
        const matchesOccupation = !occupation || normalize(translation.user_occupation).includes(normalize(occupation));
        const matchesGender = !gender || normalize(translation.user_gender) === normalize(gender);
        const matchesEducation = !education || normalize(translation.user_education).includes(normalize(education));

        return matchesAddress && matchesOccupation && matchesGender && matchesEducation;
      });
    });

    return filteredData.sort((a, b) => {
      const nameA = a.member_profile_withtranslation?.[0]?.user_fname || "";
      const nameB = b.member_profile_withtranslation?.[0]?.user_fname || "";
      return nameA.localeCompare(nameB);
    });
  } catch (err) {
    console.error("Error searching members by profile filters:", err);
    return [];
  }
};

export const getDistinctEducations = async () => {
  try {
    const { data, error } = await supabase
      .from("member_profile_withtranslation")
      .select("user_education");

    if (error) throw error;

    return [...new Set((data || [])
      .map((item) => item.user_education)
      .filter(Boolean))];
  } catch (err) {
    console.error("Error fetching distinct educations:", err);
    return [];
  }
};

export const getDistinctOccupations = async () => {
  try {
    const { data, error } = await supabase
      .from("member_profile_withtranslation")
      .select("user_occupation");

    if (error) throw error;

    return [...new Set((data || [])
      .map((item) => item.user_occupation)
      .filter(Boolean))];
  } catch (err) {
    console.error("Error fetching distinct occupations:", err);
    return [];
  }
};