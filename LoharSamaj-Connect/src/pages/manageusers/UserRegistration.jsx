import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateProfile } from "../../services/memberservice/updateprofile";
import { addProfile } from "../../services/dbservices/addprofile";
import { getDivisionList } from "../../services/dbservices/division.service";
import { getMemberIdByUserId } from "../../services/memberservice/member.profile.service";
import { useAuth } from "../../context/AuthContext.jsx";
import ResponsiveHeader from "../../component/ResponsiveHeader.jsx";

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
});

export default function Register({
  defaultFamilyId = null,
  isFamilyRegistration = false,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { userId, userType } = useAuth();
  const [divisionList, setDivisionList] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedDivision_M, setSelectedDivision_M] = useState("");
  const [memberId, setMemberId] = useState(null);
  const [famMemberId, setFamMemberId] = useState(null);

  console.log("isFamilyRegistration:", isFamilyRegistration, "userId on Registration:", userId, "memberId on Registration: ", memberId);

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
  /* --------------- Fetch member_id List for registered user--------------- */
  useEffect(() => {
    const fetchMemberId = async () => {
      try {
        const data = await getMemberIdByUserId(userId);
        console.log(
          "Fetched member_id for userId:",
          userId,
          "member_id:",
          data,
        );
        setMemberId(data);
      } catch (err) {
        console.error("Error fetching member_id:", err.message);
      }
    };
    fetchMemberId();
  }, [userId]);
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
  /*--------------Generate Family ID -----------*/
  const generateFamilyId = () => Date.now() + Math.floor(Math.random() * 1000);
  /* ---------------On Submit Use this handler ---------------- */
  const handleRegister = async (values, { setSubmitting, resetForm }) => {
    try {
      const family_id = isFamilyRegistration
        ? defaultFamilyId // ✅ inherit from parent
        : generateFamilyId(); // ✅ create new family
      //------------Toggle submit button ---------------
      if (loading) return; // extra safety
      setLoading(true);

      const age = calculateAge(values.dob);
      const memberProfilePayload = {
        user_dob: values.dob,
        user_age: age,
        user_phone: values.mobile,
        user_bloodgrp: values.bloodGroup,
        fam_id: Date.now() + Math.floor(Math.random() * 1000), // simple unique ID for family, can be improved
        user_incomegroup: values.incomeGroup,
        user_reservationstatus: values.reservationBenefit,
        user_fromdivision: values.division,
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

      const emptymemberTranslationPayload = {
        id: memberId,
        user_fname: "",
        user_mname: "",
        user_lname: "",
        user_gender: "",
        user_address: "",
        user_education: "",
        user_nativeplace: "",
        fam_relationship: "",
        user_occupation: "",
        user_firmname: "",
        user_reservationdetails: "",
        user_maritalstatus: "",
      };
      //-------------To translate text to Marathi
      /* const { data, error } = await supabase.functions.invoke("translate", {
          body: { text: values.firstName }
        });
      console.log("Translation testing : ",data.transalted_text);*/
      const memberTranslationPayload_M = {
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
        lang_code: "M",
      };
      let newFamMemberId = null;
      if (isFamilyRegistration) {
        console.log("Family registration - adding new member profile - with default_family_id:", defaultFamilyId);
        console.log("Member profile payload:", memberProfilePayload);
        // 1️⃣ Add new member profile
        const result = await addProfile("member_profile", {
          ...memberProfilePayload,
          fam_id: defaultFamilyId,
        });
        console.log("New member_profile added:", result,"ID for new member:", result[0].id);
        newFamMemberId = result[0].id; // capture the new member's ID
        console.log("New member profile added with New Fam member iD:", newFamMemberId);
      } else {
        // update member profile
        const result = await updateProfile(
          "member_profile",
          userId,
          memberProfilePayload,
        );
        console.log("Profile updated:", result);
      }
      // 2️⃣ Add translation entry (for both family and individual registration)
      let result_en="";
      if (isFamilyRegistration) {
        console.log("Inside member_profile_withtanslation. Adding translation entry for new family member with New famMemberId:", newFamMemberId);
        console.log("Payload:", memberTranslationPayload, "FamMemberId:", newFamMemberId);
        //add member to translation table
        result_en = await addProfile("member_profile_withtranslation", {
          ...memberTranslationPayload,
          id: newFamMemberId,
        });
        console.log("Member translation added (EN):", result_en);
      } else {
        result_en = await addProfile("member_profile_withtranslation",memberTranslationPayload);
        console.log("Member translation added (EN):", result_en);
      }

      //If user registration is successful but fail to add user details in translation table then also navigate to login page with alert message
      if(result_en.success === false){
        console.error("Error adding member translation:", result_en.error);
        alert("User Registration done But fail to add user details ❌ ");
        result_en = await addProfile("member_profile_withtranslation",emptymemberTranslationPayload);
        navigate("/login");
      }
      
      
      /*  const result_m = await addProfile("member_profile_withtranslation", memberTranslationPayload_M);
      console.log("Member translation added (M):", result_m);*/

      alert("Registration successful ✅");
      resetForm();
      setLoading(false);
      navigate("/home"); // optional
    } catch (err) {
      console.error(err.message);
      alert("Failed to register member ❌");
      if(!isFamilyRegistration){
        navigate("/login"); // optional: redirect even on failure for individual registration
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {!isFamilyRegistration && <ResponsiveHeader />}
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6">
          {/* Header */}
          <div className="text-center mb-6">
            {!isFamilyRegistration && (
              <h3 className="text-lg font-semibold mb-4">User Registration</h3>
            )}
            <p className="text-sm text-gray-500 mt-1">
              {isFamilyRegistration
                ? "Fill in the details to add a new member to your family"
                : "Create your account to join the community"}
            </p>
          </div>

          <Formik
            initialValues={{
              userName: "",
              password: "",
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
              family_id: defaultFamilyId || "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleRegister}
          >
            {({ setFieldValue, values }) => (
              <Form className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* First Name */}
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
                  <label className="text-sm font-medium text-gray-700">
                    Age
                  </label>
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
                    <option value="">Select Division</option>
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
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Daughter In Law">Daughter In Law</option>
                    <option value="Grand Daughter">Grand Daughter</option>
                    <option value="Grand Son">Grand Son</option>
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

                {/* Reservation Details */}
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
                <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold
                             hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Register
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
