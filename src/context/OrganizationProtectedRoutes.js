import React, { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
const OrganizationProtectedRoutes = () => {
  useEffect(() => {
    async function UserInfoByUID() {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      setUserType(docSnap.data().type);
      setLoading(false);
    }
    UserInfoByUID();
  }, []);

  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState("");
  const { currentUser } = useAuth();
  return (
    <> {loading || (userType === "ngo" ? <Outlet /> : <Navigate to="/" />)}</>
  );
};

export default OrganizationProtectedRoutes;
