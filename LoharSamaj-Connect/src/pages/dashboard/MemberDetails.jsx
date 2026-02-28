import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  getMemberById,
  getMemberIdByUserId,
} from "../../services/memberservice/member.profile.service.js";
import { getDivisionNameById } from "../../services/dbservices/division.service.js";
import { getMemberPhotoPublicUrl } from "../../services/memberservice/member.profile.service.js";
import { useAuth } from "../../context/AuthContext";
import ConfirmDialog from "../../component/ConfirmationDialog.jsx";
import { updateMatrimonyServiceStatus, setUserApprovalStatus } from "../../services/memberservice/updateprofile.js";

export default function MemberDetail({
  id,
  onBack,
  showBackButton = true,
  editProfile = false,

  /* 🔑 NAV STATE */ activeView = "members",
  onChangeView,
  onEditProfile,
  setActionView,
  forApproval = false,
}) {
  const menuRef = useRef(null);
  const [member, setMember] = useState(null);
  const [divName, setDivName] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { userId } = useAuth();

  useEffect(() => {
    if (!id && !userId) return; // nothing to fetch yet

    const fetchMember = async () => {
      try {
        let memberId = id;

        // 🔁 fallback: if id is null, use userId to get memberId
        if (!memberId && userId) {
          memberId = await getMemberIdByUserId(userId);
        }

        if (!memberId) {
          console.warn("No memberId found");
          return;
        }

        const data = await getMemberById(memberId);
        console.log(
          "MemberDetails - MemberID:",
          memberId,
          "Member Data:",
          data,
        );

        setMember(data);
      } catch (error) {
        console.error("Error fetching member:", error);
      }
    };

    fetchMember();
  }, [id, userId]);

  useEffect(() => {
    const fetchDivisionName = async () => {
      const data = await getDivisionNameById(member.user_fromdivision);
      setDivName(data.div_name);
      console.log("Division Name:", data.div_name);
    };
    fetchDivisionName();
  }, [member?.user_fromdivision]);

  // -- Close menu on outside click----
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const maritalStatus = en?.user_maritalstatus?.toLowerCase();

  const handleUserApproval = async () => {
    const approvedUser = await setUserApprovalStatus(member.id,true);
    approvedUser ? alert("User Approved") : alert("Fail to Approve");
  };

  const handleRegisterMatrimony = async () => {
    try {
      const res = await updateMatrimonyServiceStatus(userId, true);
      if (res) {
        alert("You are now registered for Matrimony!");
      }
    } catch (error) {
      console.error("Matrimony registration failed", error);
      alert("Something went wrong");
    }
  };

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
            {!editProfile && (
              <img
                src={
                  member?.user_photo
                    ? getMemberPhotoPublicUrl(member.user_photo)
                    : "/images/default-user.png"
                }
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover border"
              />
            )}

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {en?.user_fname} {en?.user_mname} {en?.user_lname}
              </h2>
              <p className="text-gray-500 text-sm">
                {mr?.user_fname} {mr?.user_lname}
              </p>
              <p className="text-sm text-blue-600 capitalize">
                {member.user_role}
              </p>
            </div>
          </div>
          {forApproval && (
            <button
              type="button"
              onClick={handleUserApproval}
              className="flex items-center gap-1 p-2 text-gray-700 hover:text-gray-800 bg-transparent
                        hover:bg-transparent focus:outline-none focus:ring-0"
            >
              <button className="bg-green-600 text-white px-3 py-1 rounded-md">
                ✓
              </button>
              <span>Approve</span>
            </button>
          )}
          {/* Right section – Edit Profile */}
          {editProfile && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setOpenMenu((prev) => !prev)}
                className="flex items-center gap-1 p-2 text-gray-700 hover:text-gray-800 bg-transparent
                        hover:bg-transparent focus:outline-none focus:ring-0"
              >
                <span className="text-lg">⚙️</span>
                <span>Settings</span>
              </button>

              {openMenu && (
                // <div className="absolute right-0 mt-2 w-48 rounded-md border bg-white shadow-lg z-50">
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg z-50">
                  <ul className="py-1 text-sm">
                    {/* Edit Profile */}
                    {editProfile && (
                      <li>
                        <button
                          onClick={() => {
                            setOpenMenu(false);
                            onEditProfile();
                          }}
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          Edit Profile
                        </button>
                      </li>
                    )}

                    {/* Register for MatriMoney */}
                    {!["married", "not specified"].includes(maritalStatus) && (
                      <li>
                        <button
                          onClick={() => {
                            setOpenMenu(false);
                            setShowConfirm(true);
                          }}
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          Register for MatriMoney
                        </button>
                      </li>
                    )}
                    {
                      /* Add Family Members */
                      <li>
                        <button
                          onClick={() => {
                            setOpenMenu(false);
                            setActionView("assignfamily");
                          }}
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          Add Family Members
                        </button>
                      </li>
                    }
                  </ul>
                </div>
              )}
            </div>
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
      {/* 👇 Render dialog HERE */}
      <ConfirmDialog
        open={showConfirm}
        title="Confirm Registration"
        message="Do you want to confirm your registration to access Matrimonial Service?"
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          handleRegisterMatrimony();
        }}
      />
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
