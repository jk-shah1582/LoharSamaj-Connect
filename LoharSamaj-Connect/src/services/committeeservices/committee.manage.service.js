import { supabase } from "../superbase";

export const getCommittes = async () => {
  const { data, error } = await supabase.from("committee_master").select(`*`);

  if (error) {
    return [];
  }
  return data;
};

export const getActiveCommitteMembers = async (comID) => {
  const { data, error } = await supabase
    .from("committee_members")
    .select(`*`)
    .eq("com_id", comID);

  if (error) {
    return [];
  }
  return data;
};

export const getCommitteeMembersWithDetails = async (comID) => {
  // 1️⃣ Get committee members
  const { data: committeeMembers, error } = await supabase
    .from("committee_members")
    .select("*")
    .eq("com_id", comID)
    .eq("user_committee_status", "active");

  if (error || !committeeMembers?.length) {
    console.error("Error fetching committee members:", error);
    return [];
  }

  // 2️⃣ Extract auth user IDs
  const userIds = committeeMembers.map((cm) => cm.user_id);

  // 3️⃣ Get member IDs for those user IDs
  const { data: membersMap, error: memberMapError } = await supabase
    .from("member_profile")
    .select("id, user_id")
    .in("user_id", userIds);

  if (memberMapError || !membersMap?.length) {
    console.error("Error fetching member IDs:", memberMapError);
    return [];
  }

  // Build user_id → member_id lookup
  const userIdToMemberId = {};
  membersMap.forEach((m) => {
    userIdToMemberId[m.user_id] = m.id;
  });

  const memberIds = membersMap.map((m) => m.id);

  // 4️⃣ Fetch member details using member IDs
  const { data: memberDetails, error: detailsError } = await supabase
    .from("member_profile_withtranslation")
    .select("*")
    .in("id", memberIds)
    .eq("lang_code", "en");

  if (detailsError || !memberDetails) {
    console.error("Error fetching member details:", detailsError);
    return [];
  }

  // Build member_id → details lookup
  const memberDetailsMap = {};
  memberDetails.forEach((md) => {
    memberDetailsMap[md.id] = md;
  });

  // 5️⃣ Merge everything
  return committeeMembers.map((cm) => {
    const memberId = userIdToMemberId[cm.user_id];
    return {
      ...cm,
      member: memberDetailsMap[memberId] || null,
    };
  });
};

export const NAgetCommitteeMembersWithDetails = async (comID) => {
  console.log("Fetching committee members for committee ID:", comID);
  // 1️⃣ Get committee_members
  const { data: committeeMembers, error } = await supabase
    .from("committee_members")
    .select("*")
    .eq("com_id", comID)
    .eq("user_committee_status", "active");

  if (error || !committeeMembers) {
    console.error(error);
    return [];
  }

  // 2️⃣ Fetch all members in ONE query using IN
  const userIds = committeeMembers.map((cm) => cm.user_id);
  const fetchedUserIds = userIds.join(", ");
  console.log("User IDs for committee members:", fetchedUserIds);

  const { data: members, error: memberError } = await supabase
    .from("member_profile_withtranslation")
    .select("*")
    .in("user_id", userIds)
    .eq("lang_code", "en");

  if (memberError || !members) {
    console.error(memberError);
    return [];
  }

  // 3️⃣ Merge data manually
  return committeeMembers.map((cm) => ({
    ...cm,
    member: members.find((m) => m.user_id === cm.user_id),
  }));
};

export const addCommittee = async (comData) => {
  const { data, error } = await supabase
    .from("committee_master")
    .insert(comData)
    .select();
  if (error) {
    throw new Error(error.message);
  }

  return data[0];
};

export const updateCommittee = async (comId, updatedData) => {
  const { data, error } = await supabase
    .from("committee_master")
    .update(updatedData)
    .eq("com_id", comId)
    .select();
  if (error) {
    throw new Error(error.message);
  }
  return data[0];
};

export const deleteCommittee = async (comId) => {
  const { error } = await supabase
    .from("committee_master")
    .delete()
    .eq("com_id", comId);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
};

export const assignMemberToCommittee = async (payload) => {
  const { data, error } = await supabase
    .from("committee_members")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error(error);
    return { success: false };
  }

  return { success: true, data };
};

export const updateCommitteeMemberStatus = async (comId) => {
  const { data, error } = await supabase
    .from("committee_members")
    .update({ user_committee_status: "NA" })
    .eq("id", comId)
    .select();
  if (error) {
    throw new Error(error.message);
  }
  return data[0];
};
