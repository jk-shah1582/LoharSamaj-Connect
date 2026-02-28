import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMemberById } from "../../services/memberservice/member.profile.service.js";
import { getDivisionNameById } from "../../services/dbservices/division.service.js";
import { getMemberPhotoPublicUrl } from "../../services/memberservice/member.profile.service.js";
import { useAuth } from "../../context/AuthContext";

export default function MemberDetail({
  onBack,
  showBackButton = true,
  editProfile = false,

  /* 🔑 NAV STATE */ activeView = "members",
  onChangeView,
  onEditProfile,
}) {
  //const { id } = useParams();
  const [member, setMember] = useState(null);
  const [divName, setDivName] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { userId } = useAuth();
  console.log("OnEditProfile prop in memberdetails page :", onEditProfile);

  useEffect(() => {
    const fetchMember = async () => {
      const data = await getMemberById(userId);
      setMember(data);
    };
    fetchMember();
  }, [userId]);

  useEffect(() => {
    const fetchDivisionName = async () => {
      const data = await getDivisionNameById(member.user_fromdivision);
      setDivName(data.div_name);
      console.log("Division Name:", data.div_name);
    };
    fetchDivisionName();
  }, [member?.user_fromdivision]);

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // called after profile update
  const handleProfileUpdated = (updatedMember) => {
    setMember(updatedMember);
    setIsEditing(false); // 👈 switch back to details view
  };

  const en = member.member_profile_withtranslation.find(
    (p) => p.lang_code === "en",
  );
  const mr = member.member_profile_withtranslation.find(
    (p) => p.lang_code === "mr",
  );

  return (
    <>
      {/* Header */}
      <div className="mb-4">
        {showBackButton && (
          <button
            onClick={onBack}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Members
          </button>
        )}

        <h2 className="text-xl font-semibold mt-2">
          {member.user_fname} {member.user_lname}
        </h2>
      </div>

      <div className="w-full bg-white rounded-xl shadow-lg p-6 md:p-8">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between mb-6">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <img
              src={
                getMemberPhotoPublicUrl(member.user_photo) ||
                "/images/default-user.png"
              }
              alt="Profile"
              className="h-20 w-20 rounded-full object-cover border"
            />

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {en?.user_fname} {en?.user_lname}
              </h2>
              <p className="text-gray-500 text-sm">
                {mr?.user_fname} {mr?.user_lname}
              </p>
              <p className="text-sm text-blue-600 capitalize">
                {member.user_role}
              </p>
            </div>
          </div>

          {/* Right section – Edit Profile */}
          {editProfile && (
            <button
              type="button"
              className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
              onClick={onEditProfile}
              onCancel={() => setIsEditing(false)}
            >
              Edit Profile
            </button>
          )}
          {/* Register for matrimoney service based on martital status */}
          {!["married", "not specified"].includes(
            en?.user_maritalstatus?.toLowerCase(),
          ) && (
            <button className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50">
              Register for MatriMoney
            </button>
          )}
        </div>

        {/* ================= PERSONAL INFO ================= user_incomegroup */}
        <Section title="Personal Information">
          <Info label="Gender" value={en?.user_gender} />
          <Info label="Date of Birth" value={member.user_dob} />
          <Info label="Age" value={member.user_age} />
          <Info label="Blood Group" value={member.user_bloodgrp} />
          <Info label="Native Place" value={en?.user_nativeplace} />
          <Info label="Relationship" value={en?.fam_relationship} />
          <Info label="Education" value={en?.user_education} />
          <Info
            label="Reservation Status"
            value={member.user_reservationstatus}
          />
          <Info
            label="Reservation Details"
            value={en?.user_reservationdetails}
          />
          <Info label="Division" value={divName} />
          <Info label="Marital Status" value={en?.user_maritalstatus} />
        </Section>

        {/* ================= CONTACT INFO ================= */}
        <Section title="Contact">
          <Info label="Phone" value={member.user_phone} />
          <Info label="Address" value={en?.user_address} />
        </Section>

        {/* ================= PROFESSIONAL ================= */}
        <Section title="Professional Details">
          <Info label="Income Group" value={member.user_incomegroup} />
          <Info label="Occupation" value={en?.user_occupation} />
          <Info label="Firm Name" value={en?.user_firmname} />
        </Section>
      </div>
    </>
  );
}

/* ================= REUSABLE UI ================= */

const Section = ({ title, children }) => (
  <div className="mb-6 bg-white rounded-lg shadow-md p-6">
    <h3 className="text-md font-semibold text-gray-700 mb-3 border-b pb-2">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium text-gray-800">{value || "-"}</p>
  </div>
);
