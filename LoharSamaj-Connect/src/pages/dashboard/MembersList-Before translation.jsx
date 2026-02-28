import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMemberBasicInfo,
  getInactiveMemberInfo,
  getDivisionOfUser,
} from "../../services/memberservice/member.profile.service.js";
import { useAuth } from "../../context/AuthContext.jsx";
import MemberDetails from "./MemberDetails.jsx";
import GeneralProfile from "../manageusers/GeneralProfile.jsx";

export default function MemberList({ searchText = "", forApproval = false }) {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const PAGE_SIZE = 20;
  const [memberProfile, setMemberProfile] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  /* ---------------- LOAD MEMBERS ---------------- */
  const loadMembers = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    let member_info = null;
    try {
      if (forApproval) {
        const divId = await getDivisionOfUser(userId);
        if (divId) {
          member_info = await getInactiveMemberInfo(from, to, divId);
        }
      } else {
        member_info = await getMemberBasicInfo(from, to);
      }

      if (!member_info || member_info.length === 0) {
        setHasMore(false);
      } else {
        //setMemberProfile((prev) => [...prev, ...member_info]);
        setMemberProfile((prev) => {
          const newData = member_info.filter(
            (newItem) => !prev.some((oldItem) => oldItem.id === newItem.id),
          );

          return [...prev, ...newData];
        });
        if (member_info.length < PAGE_SIZE) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error("Error loading members:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    setMemberProfile([]);
    setPage(0);
    setHasMore(true);
  }, [userId]);

  useEffect(() => {
    loadMembers();
  }, [page]);

  /* ---------------- INTERSECTION OBSERVER ---------------- */
  const lastMemberRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  /* ---------------- MEMBER DETAILS ---------------- */
  if (selectedMember) {
    return (
      <GeneralProfile
        id={selectedMember}
        onBack={() => setSelectedMember(null)}
        forApproval={forApproval}
      />
    );
  }

  /* ---------------- SEARCH + SORT ---------------- */
  const filteredMembers = memberProfile
    .map((member) => {
      const profiles = member.member_profile_withtranslation || [];

      const profileEn = profiles.find((p) => p.lang_code === "en");
      const profileMr = profiles.find((p) => p.lang_code === "mr");

      const fullNameEn =
        `${profileEn?.user_fname || ""} ${profileEn?.user_lname || ""}`.toLowerCase();
      const fullNameMr =
        `${profileMr?.user_fname || ""} ${profileMr?.user_lname || ""}`.toLowerCase();

      const occupationEn = (profileEn?.user_occupation || "").toLowerCase();
      const occupationMr = (profileMr?.user_occupation || "").toLowerCase();

      const search = searchText.toLowerCase();

      const isMatch =
        fullNameEn.includes(search) ||
        fullNameMr.includes(search) ||
        occupationEn.includes(search) ||
        occupationMr.includes(search);

      return { ...member, isMatch };
    })
    .sort((a, b) => b.isMatch - a.isMatch);

  /* ---------------- UI ---------------- */
  return (
    <div className="bg-white space-y-4 p-4 rounded-lg shadow-md">
      {filteredMembers.map((member, index) => {
        const profiles = member.member_profile_withtranslation || [];
        const profileEn = profiles.find((p) => p.lang_code === "en");
        const profileMr = profiles.find((p) => p.lang_code === "mr");

        // attach observer to last element
        if (filteredMembers.length === index + 1) {
          return (
            <div
              ref={lastMemberRef}
              key={member.id}
              onClick={() => setSelectedMember(member.id)}
              className="flex items-center bg-white rounded-xl shadow-lg p-4
                         hover:shadow-xl transition cursor-pointer"
            >
              <img
                src="/images/default-user.png"
                alt="User"
                className="h-15 w-15 rounded-md object-cover"
              />

              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {profileEn?.user_fname} {profileEn?.user_mname}{" "}
                  {profileEn?.user_lname}
                  {profileEn && profileMr && " / "}
                  {profileMr?.user_fname} {profileMr?.user_mname}{" "}
                  {profileMr?.user_lname}
                </h3>
              </div>
            </div>
          );
        }

        return (
          <div
            key={member.id}
            onClick={() => setSelectedMember(member.id)}
            className="flex items-center bg-white rounded-xl shadow-lg p-4
                       hover:shadow-xl transition cursor-pointer"
          >
            <img
              src="/images/default-user.png"
              alt="User"
              className="h-15 w-15 rounded-md object-cover"
            />

            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {profileEn?.user_fname} {profileEn?.user_mname}{" "}
                {profileEn?.user_lname}
                {profileEn && profileMr && " / "}
                {profileMr?.user_fname} {profileMr?.user_mname}{" "}
                {profileMr?.user_lname}
              </h3>
            </div>
          </div>
        );
      })}

      {loading && <p className="text-center text-gray-500">Loading more...</p>}
      {!hasMore && <p className="text-center text-gray-400">No more members</p>}
    </div>
  );
}
