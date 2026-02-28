import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUName] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [memberId, setMemberId] = useState(null);

  // login function
  const login = (id, type, member_id,photo, name) => {
    console.log("Login called with:", { id, type,  member_id, photo, name });
    const roleMap = {
      user: "Community User",
      admin: "Committee Member",
    };
    setUserId(id);
    setUserType(roleMap[type] || "Community User");
    setUName(name);
    setUserPhoto(photo);
    setMemberId(member_id);
    setUserRole(type);
  };

  // logout function
  const logout = () => {
    setUserId(null);
    setUserType(null);
    setUName(null);
    setUserPhoto(null);
    setMemberId(null);
    setUserRole(null);
  };

  // set user name
  const setUserName = (name) => {
    setUName(name);
  };

  const value = {
    userId,
    userType,
    userName,
    userPhoto,
    memberId,
    userRole,
    login,
    logout,
    setUserName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// custom hook (BEST PRACTICE)
export const useAuth = () => useContext(AuthContext);
