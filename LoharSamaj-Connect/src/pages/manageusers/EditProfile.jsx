import { useAuth } from "../../context/AuthContext";
import { use, useEffect, useState } from "react";
import { getMemberById, getMemberIdByUserId } from "../../services/memberservice/member.profile.service.js";
import { getDivisionList } from "../../services/dbservices/division.service";
import {
  updateProfile,
  updateLangProfile,
} from "../../services/memberservice/updateprofile";
import ProfilePhotoUpload from "../../component/ProfilePhotoUpload";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

/* ---------------- Validation Schema ---------------- */
const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  middleName: Yup.string().required("Middle name is required"),
  lastName: Yup.string().required("Last name is required"),
  dob: Yup.date()
      .required("Date of birth is required")
      .max(new Date(), "Date of Birth cannot be in the future"),
  gender: Yup.string().required("Gender is required"),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile must be 10 digits")
    .required("Mobile number is required"),
  division: Yup.string().required("Division is required"),
  address: Yup.string().required("Address is required"),
  familyRelation: Yup.string().required("Family relation is required"),
  maritalStatus: Yup.string().required("Marital status is required"),
});

export default function EditProfile({ onCancel, onSave }) {
  const { userId } = useAuth();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [divisionList, setDivisionList] = useState([]);
  const [photoPath, setPhotoPath] = useState("");
  const [memberId, setMemberId] = useState(null);
  useEffect(() => {
    const fetchMember = async () => {
      const memberId = await getMemberIdByUserId(userId);
      setMemberId(memberId);
      const data = await getMemberById(memberId);
      console.log("Fetched member data for EditProfile:", data);
      setMember(data);
      setPhotoPath(data?.user_photo || "");
      console.log("Member details in edit profile page:", member);
    };
    fetchMember();
  }, [userId]);

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
  }, [userId]);

  //========English Profile Data Extraction========
  const englishProfile =
    member?.member_profile_withtranslation?.find(
      (item) => item.lang_code === "en",
    ) || {};

  const handlePhotoUploaded = (filePath) => {
    setPhotoPath(filePath);
  };

  const handleEditProfileSubmit = async (
    values,
    { setSubmitting, resetForm },
  ) => {
    try {
      //-------Payloads--------------
      const memberProfilePayload = {
        user_dob: values.dob,
        user_age: values.age,
        user_phone: values.mobile,
        user_bloodgrp: values.bloodGroup,
        fam_id: userId,
        user_incomegroup: values.incomeGroup,
        user_reservationstatus: values.reservationBenefit,
        user_fromdivision: values.division,
        user_photo: photoPath || member?.user_photo, // use new photo path if updated, else keep existing
      };

      const memberTranslationPayload = {
        id: memberId,
        user_fname: values.firstName,
        user_mname: values.middleName,
        user_lname: values.lastName,
        user_gender: values.gender,
        user_address: values.address,
        user_education: values.education,
        user_nativeplace: values.nativePlace,
        fam_relationship: values.familyRelation,
        user_occupation: values.occupation,
        user_firmname: values.firmName,
        user_reservationdetails: values.reservationdetails,
        user_maritalstatus: values.maritalStatus,
        lang_code: "en",
      };

      // update member profile
      const result = await updateProfile(
        "member_profile",
        userId,
        memberProfilePayload,
      );
      console.log("Profile updated:", result);

      //add member to translation table
      const result_en = await updateLangProfile(
        "member_profile_withtranslation",
        memberId,
        memberTranslationPayload,
        englishProfile.lang_code,
      );
      console.log("Member translation added (EN):", result_en);

      // ✅ Refetch member data to update initial values
      const updatedMember = await getMemberById(memberId);
      // setMember(updatedMember);
      // setPhotoPath(updatedMember?.user_photo || "");

      alert("Profile Updation successful ✅");
      // ✅ Return control to previous view by calling onSave callback
      onSave && onSave(updatedMember);
      /*  const result_m = await addProfile("member_profile_withtranslation", memberTranslationPayload_M);
            console.log("Member translation added (M):", result_m);*/
    } catch (err) {
      console.error("Error updating profile:", err.message);
      alert("Error updating profile: " + err.message);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6">
        {console.log("Memebers details :", member?.user_reservation_benefit, "reservation details:", englishProfile?.user_reservationdetails, "marital status:", englishProfile?.user_maritalstatus)}
        <Formik
          enableReinitialize
          initialValues={{
            firstName: englishProfile?.user_fname || "",
            middleName: englishProfile?.user_mname || "",
            lastName: englishProfile?.user_lname || "",
            dob: member?.user_dob || "",
            age: member?.user_age || "",
            gender: englishProfile?.user_gender || "",
            mobile: member?.user_phone || "",
            division: member?.user_fromdivision || "",
            address: englishProfile?.user_address || "",
            education: englishProfile?.user_education || "",
            nativePlace: englishProfile?.user_nativeplace || "",
            bloodGroup: member?.user_bloodgrp || "",
            familyRelation: englishProfile?.fam_relationship || "",
            occupation: englishProfile?.user_occupation || "",
            firmName: englishProfile?.user_firmname || "",
            incomeGroup: member?.user_incomegroup || "",
            reservationBenefit: member?.user_reservationstatus || "",
            reservationdetails:
              englishProfile?.user_reservationdetails || "",
            maritalStatus: englishProfile?.user_maritalstatus || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleEditProfileSubmit}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="col-span-1 md:col-span-3 flex flex-col items-center">
                <ProfilePhotoUpload
                  photoPath={member?.user_photo}
                  onUploadSuccess={handlePhotoUploaded}
                />
              </div>
              {/* First Name */console.log("Formik values:", values)}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <Field
                  name="firstName"
                  className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="firstName"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Middle Name */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Middle Name *
                </label>
                <Field
                  name="middleName"
                  className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="middleName"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <Field
                  name="lastName"
                  className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="lastName"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* DOB */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Date of Birth *
                </label>
                <Field
                  type="date"
                  name="dob"
                   max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    setFieldValue("dob", e.target.value);
                    setFieldValue("age", calculateAge(e.target.value));
                  }}
                  className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="dob"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Age */}
              <div>
                <label className="text-sm font-medium text-gray-700">Age</label>
                <Field
                  name="age"
                  readOnly
                  className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Gender *
                </label>
                <Field
                  as="select"
                  name="gender"
                  className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Field>
                <ErrorMessage
                  name="gender"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Mobile *
                </label>
                <Field
                  name="mobile"
                  maxLength={10}
                  inputMode="numeric"
                  onChange={(e) =>
                    setFieldValue("mobile", e.target.value.replace(/\D/g, ""))
                  }
                  className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="mobile"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Division */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Division *
                </label>
                <Field
                  as="select"
                  name="division"
                  className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select Division --</option>
                  {divisionList.map((division) => (
                    <option key={division.div_id} value={division.div_id}>
                      {division.div_name}
                    </option>
                  ))}
                </Field>

                <ErrorMessage
                  name="division"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Address */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Address *
                </label>
                <Field
                  as="textarea"
                  name="address"
                  rows="2"
                  className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="address"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Family Relation */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Family Relation *
                </label>
                <Field
                  as="select"
                  name="familyRelation"
                  className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Self">Self</option>
                  <option value="Wife">Wife</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                </Field>
                <ErrorMessage
                  name="familyRelation"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Optional Fields */}
              {[
                ["education", "Education"],
                ["nativePlace", "Native Place"],
                ["bloodGroup", "Blood Group"],
                ["occupation", "Occupation"],
                ["firmName", "Firm Name"],
              ].map(([name, label]) => (
                <div key={name}>
                  <label className="text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <Field
                    name={name}
                    className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              {/* Annual Family Income Group */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Annual Family Income Group
                </label>

                <Field
                  as="select"
                  name="incomeGroup"
                  className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="lt_250000">Below ₹2.5 Lakh</option>
                  <option value="250000_500000">₹2.5 – ₹5 Lakh</option>
                  <option value="500000_1000000">₹5 – ₹10 Lakh</option>
                  <option value="1000000_1500000">₹10 – ₹15 Lakh</option>
                  <option value="gt_1500000">Above ₹15 Lakh</option>
                </Field>
              </div>

              {/* Marital Status */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Marital Status
                </label>

                <Field
                  as="select"
                  name="maritalStatus"
                  className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </Field>
              </div>
              
              {/* Reservation details */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Reservation Benefit
                </label>

                <Field
                  as="select"
                  name="reservationBenefit"
                  className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Y">Yes</option>
                  <option value="N">No</option>
                </Field>
              </div>

              {/* Reservation Benefit Details - Conditional */}
              {values.reservationBenefit === "Y" && (
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Reservation Benefit Details
                  </label>
                  <Field
                    as="textarea"
                    name="reservationdetails"
                    rows="1"
                    placeholder="Enter details about your reservation benefit..."
                    className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Submit */}
              <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => onCancel && onCancel()}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg font-semibold
                             hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold
                             hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting || loading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
