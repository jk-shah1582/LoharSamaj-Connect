import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    getMemberBasicInfo,
    getInactiveMemberInfo,
    getDivisionOfUser,
    searchMembersByProfileFilters,
} from "../../services/memberservice/member.profile.service.js";
import { useAuth } from "../../context/AuthContext.jsx";
import MemberDetails from "../dashboard/MemberDetails.jsx";
import GeneralProfile from "../manageusers/GeneralProfile.jsx";


export default function FindMatch({ searchText = "", forApproval = false }) {

    const [filters, setFilters] = useState({
        occupation: "",
        location: "",
        education: "",
        gender: "",
    });

    const { userId } = useAuth();
    const navigate = useNavigate();

    const PAGE_SIZE = 20;
    const [memberProfile, setMemberProfile] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [searchPerformed, setSearchPerformed] = useState(false);

    const observer = useRef();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        setMemberProfile([]);
        setPage(0);
        setHasMore(true);
        setSearchPerformed(true);
    };

    /* ---------------- LOAD MEMBERS ---------------- */
    const loadMembers = async () => {
        if (loading) return;

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
                member_info = await searchMembersByProfileFilters({ ...filters, from, to });
                console.info(member_info)
            }

            if (!member_info || member_info.length === 0) {
                setHasMore(false);
            } else {

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
            setLoading(false);
            console.error("Error loading members:", err);
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- LOAD ON BUTTON CLICK  ---------------- */
    useEffect(() => {
        if (!searchPerformed) return;

        loadMembers();
    }, [page, searchPerformed]);

    /* ---------------- INTERSECTION OBSERVER ---------------- */
    const lastMemberRef = useCallback(
        node => {
            if (loading) return;
            if (!searchPerformed) return;

            if (observer.current) {
                observer.current.disconnect();
            }

            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage(prev => prev + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore, searchPerformed]
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
        <div className="p-4 space-y-6">
            <div>
                <h2 className="text-xl font-bold mb-2">Find Match</h2>
                <p className="text-gray-600">
                    Search for suitable matches using the filters below.
                </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="grid gap-4 md:grid-cols-4">
                    <label className="text-sm font-medium text-gray-700">
                        <span className="mb-1 block">Occupation</span>
                        <select
                            name="occupation"
                            value={filters.occupation}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                        >
                            <option value="">Any</option>
                            <option value="Engineer">Engineer</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Business">Business</option>
                        </select>
                    </label>

                    <label className="text-sm font-medium text-gray-700">
                        <span className="mb-1 block">Location</span>
                        <select
                            name="location"
                            value={filters.location}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                        >
                            <option value="">Any</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="chowk">chowk</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Chennai">Chennai</option>
                        </select>
                    </label>

                    <label className="text-sm font-medium text-gray-700">
                        <span className="mb-1 block">Education</span>
                        <select
                            name="education"
                            value={filters.education}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                        >
                            <option value="">Any</option>
                            <option value="MBA">MBA</option>
                            <option value="Bachelor">Bachelor</option>
                            <option value="Master">Master</option>
                            <option value="Doctorate">Doctorate</option>
                        </select>
                    </label>

                    <label className="text-sm font-medium text-gray-700">
                        <span className="mb-1 block">Gender</span>
                        <select
                            name="gender"
                            value={filters.gender}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                        >
                            <option value="">Any</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </label>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" onClick={handleSearch}>
                        Search Matches
                    </button>
                    <span className="text-sm text-gray-500">
                        Showing results for your selected preferences.
                    </span>
                </div>
            </div>

            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500">
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
            </div>
        </div>
    );
}