import { useEffect, useState } from "react";
import { getMemberById, getMemberIdByUserId } from "../../services/memberservice/member.profile.service.js";
import { getDivisionList } from "../../services/dbservices/division.service";
import {
  updateFamProfile,
  updateLangProfile,
} from "../../services/memberservice/updateprofile";
import ProfilePhotoUpload from "../../component/ProfilePhotoUpload";

export default function EditFamMember({ onCancel, onSave, famMember }) {
  //console.log("EditFamMember - Received famMember prop:", famMember);
  const [photoPath, setPhotoPath] = useState(null);
  const [divisionList, setDivisionList] = useState([]);
  const [formValues, setFormValues] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    age: "",
    gender: "",
    mobile: "",
    division: "",
    address: "",
    education: "",
    nativePlace: "",
    bloodGroup: "",
    familyRelation: "",
    occupation: "",
    firmName: "",
    incomeGroup: "",
    reservationBenefit: "",
    reservationdetails: "",
    maritalStatus: "",
  });
  useEffect(() => {
    const translation =
      famMember?.member_profile_withtranslation?.find((item) => item.lang_code === "en") ||
      famMember?.member_profile_withtranslation?.[0] ||
      {};

    setFormValues({
      firstName: translation?.user_fname || "",
      middleName: translation?.user_mname || "",
      lastName: translation?.user_lname || "",
      dob: famMember?.user_dob || "",
      age: famMember?.user_age || "",
      gender: translation?.user_gender || "",
      mobile: famMember?.user_phone || "",
      division: famMember?.user_fromdivision || "",
      address: translation?.user_address || "",
      education: translation?.user_education || "",
      nativePlace: translation?.user_nativeplace || "",
      bloodGroup: famMember?.user_bloodgrp || "",
      familyRelation: translation?.fam_relationship || "",
      occupation: translation?.user_occupation || "",
      firmName: translation?.user_firmname || "",
      incomeGroup: famMember?.user_incomegroup || "",
      reservationBenefit: famMember?.user_reservationstatus || "",
      reservationdetails: translation?.user_reservationdetails || "",
      maritalStatus: translation?.user_maritalstatus || "",
    });
  }, [famMember]);

  /* --------------- Calculate Age --------------- */
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  /*----------------Display Division List ----------------*/
  useEffect(() => {
    const fetchDivision = async () => {
      try {
        const data = await getDivisionList();
        setDivisionList(data);
        console.log("Division data:", data);
      } catch (err) {
        console.error("Error loading user types:", err.message);
      }
    };

    fetchDivision();
  }, [famMember.id]);

  //========English Profile Data Extraction========
  const englishProfile =
    famMember?.member_profile_withtranslation?.find(
      (item) => item.lang_code === "en",
    ) || {};

  const handlePhotoUploaded = (filePath) => {
    setPhotoPath(filePath);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const submittedValues = Object.fromEntries(formData.entries());

    console.log("EditFamMember submit values:", submittedValues);
    try {
      //-------Payloads--------------
      const memberProfilePayload = {
        user_dob: submittedValues.dob,
        user_age: submittedValues.age,
        user_phone: submittedValues.mobile,
        user_bloodgrp: submittedValues.bloodGroup,
        user_incomegroup: submittedValues.incomeGroup,
        user_reservationstatus: submittedValues.reservationBenefit,
        user_fromdivision: submittedValues.division,
        user_photo: photoPath || submittedValues.user_photo, // use new photo path if updated, else keep existing
      };

      const memberTranslationPayload = {
        id: famMember.id, // Ensure you have the correct ID for the translation record
        user_fname: submittedValues.firstName,
        user_mname: submittedValues.middleName,
        user_lname: submittedValues.lastName,
        user_gender: submittedValues.gender,
        user_address: submittedValues.address,
        user_education: submittedValues.education,
        user_nativeplace: submittedValues.nativePlace,
        fam_relationship: submittedValues.familyRelation,
        user_occupation: submittedValues.occupation,
        user_firmname: submittedValues.firmName,
        user_reservationdetails: submittedValues.reservationdetails,
        user_maritalstatus: submittedValues.maritalStatus,
        lang_code: "en",
      };
      // Update DB tables with the payloads
      // update member profile
      const result = await updateFamProfile(
        "member_profile",
        famMember.id,
        memberProfilePayload,
      );
      console.log("Profile updated:", result);

      //add member to translation table
      const result_en = await updateLangProfile(
        "member_profile_withtranslation",
        famMember.id,
        memberTranslationPayload,
        englishProfile.lang_code,
      );
      console.log("Member translation added (EN):", result_en);
      console.log("Member Profile Payload:", memberProfilePayload);
      console.log("Member Translation Payload:", memberTranslationPayload);
    }
    catch (error) {
      console.error("Error in handleSubmit:", error);
    }
    if (onSave) {
      onSave(submittedValues);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "dob") {
      const calculatedAge = value ? calculateAge(value) : "";
      setFormValues((prev) => ({ ...prev, dob: value, age: calculatedAge }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 px-4 py-6">
      <div className="mx-auto w-full max-w-4xl rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Edit Family Member</h2>
          </div>
          <button
            type="button"
            onClick={() => onCancel && onCancel()}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-1 md:col-span-3 flex flex-col items-center">
            
              <ProfilePhotoUpload
                                photoPath={famMember?.user_photo}
                                onUploadSuccess={handlePhotoUploaded}
                              />
            
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">First Name</label>
            <input name="firstName" value={formValues.firstName} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Middle Name</label>
            <input name="middleName" value={formValues.middleName} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Last Name</label>
            <input name="lastName" value={formValues.lastName} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Date of Birth</label>
            <input type="date" name="dob" value={formValues.dob} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Age</label>
            <input name="age" value={formValues.age} readOnly className="mt-1 w-full rounded-lg border px-3 py-2 bg-gray-100" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Gender</label>
            <select name="gender" value={formValues.gender} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Mobile</label>
            <input name="mobile" value={formValues.mobile} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Division</label>
            <select name="division" value={formValues.division} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2">
              <option value="">Select</option>
              {divisionList.map((division) => (
                <option key={division.div_id} value={division.div_id}>
                  {division.div_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Address</label>
            <input name="address" value={formValues.address} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Education</label>
            <input name="education" value={formValues.education} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Native Place</label>
            <input name="nativePlace" value={formValues.nativePlace} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Blood Group</label>
            <input name="bloodGroup" value={formValues.bloodGroup} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Family Relation</label>
            <input name="familyRelation" value={formValues.familyRelation} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Occupation</label>
            <input name="occupation" value={formValues.occupation} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Firm Name</label>
            <input name="firmName" value={formValues.firmName} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Income Group</label>

            <select name="incomeGroup" value={formValues.incomeGroup} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2">
              <option value="">Select</option>
              <option value="lt_250000">Below ₹2.5 Lakh</option>
              <option value="250000_500000">₹2.5 – ₹5 Lakh</option>
              <option value="500000_1000000">₹5 – ₹10 Lakh</option>
              <option value="1000000_1500000">₹10 – ₹15 Lakh</option>
              <option value="gt_1500000">Above ₹15 Lakh</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Reservation Benefit</label>
            <select name="reservationBenefit" value={formValues.reservationBenefit} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2">
              <option value="">Select</option>
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Reservation Details</label>
            <input name="reservationdetails" value={formValues.reservationdetails} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Marital Status</label>

            <select name="maritalStatus" value={formValues.maritalStatus} onChange={handleChange} className="mt-1 w-full rounded-lg border px-3 py-2">
              <option value="">Select</option>
              {["Single", "Married", "Divorced", "Widowed"].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-1 flex justify-end gap-3 md:col-span-3">
            <button
              type="button"
              onClick={() => onCancel && onCancel()}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
