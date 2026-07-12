import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    getMemberBasicInfo,
    getInactiveMemberInfo,
    getDivisionOfUser,
    searchMembersByProfileFilters,
    getDistinctEducations,
    getDistinctOccupations,
} from "../../services/memberservice/member.profile.service.js";
import { useAuth } from "../../context/AuthContext.jsx";
import MemberDetails from "../dashboard/MemberDetails.jsx";
import GeneralProfile from "../manageusers/GeneralProfile.jsx";


export default function FindMatch({ searchText = "", forApproval = false }) {
    const PAGE_SIZE = 20;
    const [filters, setFilters] = useState({
        occupation: "",
        location: "",
        education: "",
        gender: "",
    });

    const { userId } = useAuth();
    const navigate = useNavigate();
    const [memberProfile, setMemberProfile] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [educationOptions, setEducationOptions] = useState([]);
    const [occupationOptions, setOccupationOptions] = useState([]);

    const observer = useRef();
    
    /* ----------- Updating filter everytime user select any value ---------- */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    /* ---------------- LOAD MEMBERS ---------------- */
    const fetchMembers = async (pageNo) => {
        if (loading) return;
        if (!hasMore && pageNo !== 0) return;

        setLoading(true);

        const from = pageNo * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        try {
            const member_info = await searchMembersByProfileFilters({
                ...filters,
                from,
                to,
            });

            if (pageNo === 0) {
                setMemberProfile(member_info || []);
            } else {
                setMemberProfile((prev) => {
                    const newMembers = (member_info || []).filter(
                        (m) => !prev.some((p) => p.id === m.id)
                    );
                    return [...prev, ...newMembers];
                });
            }

            setHasMore((member_info || []).length >= PAGE_SIZE);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- LOAD ON BUTTON CLICK  ---------------- */
    useEffect(() => {
        setMemberProfile([]);
        setPage(0);
        setHasMore(true);
        fetchMembers(0);
    }, [filters]);

    useEffect(() => {
        if (page === 0) return;
        fetchMembers(page);
    }, [page]);

    useEffect(() => {
        const loadDropdownOptions = async () => {
            try {
                const [educationData, occupationData] = await Promise.all([
                    getDistinctEducations(),
                    getDistinctOccupations(),
                ]);

                setEducationOptions(educationData || []);
                setOccupationOptions(occupationData || []);
            } catch (err) {
                console.error("Error loading filter options:", err);
                setEducationOptions([]);
                setOccupationOptions([]);
            }
        };

        loadDropdownOptions();
    }, []);

    /* ---------------- INTERSECTION OBSERVER ---------------- */
    const lastMemberRef = useCallback((node) => {
        if (loading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prev) => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);


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
                            {occupationOptions
                                .slice()
                                .sort((a, b) => a.localeCompare(b))
                                .map((occupation) => (
                                    <option key={occupation} value={occupation}>
                                        {occupation}
                                    </option>
                                ))}
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
                            {educationOptions
                                .slice()
                                .sort((a, b) => a.localeCompare(b))
                                .map((education) => (
                                    <option key={education} value={education}>
                                        {education}
                                    </option>
                                ))}
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