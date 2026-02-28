import UserRegistration from "./UserRegistration.jsx";

export default function AddNewFamilyMember({ familyId }) {
  return (
    <UserRegistration
      defaultFamilyId={familyId}
      isFamilyRegistration
    />
  );
}
