import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { db } from "../firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { async } from "@firebase/util";
// useAuth Hook declaration
const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth context Provider declaration
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [newUserUID, setNewUserUID] = useState();
  // useEffect declaration
  useEffect(() => {
    const unsubscirbe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    // async function getUserType(currentUser) {
    //   const docRef = doc(db, "users", currentUser.uid);
    //   const docSnap = await getDoc(docRef);
    //   console.log(docSnap.data().type);
    //   setCurrentUser({ ...currentUser, type: docSnap.data().type });
    // }
    // getUserType(currentUser);
    return unsubscirbe;
  }, []);

  // return user type function

  // Login Logout Signup Functions declaration
  const logout = () => {
    return signOut(auth);
  };
  async function signup(email, password, otherIfow) {
    return await createUserWithEmailAndPassword(auth, email, password).then(
      (userCredentail) => {
        const newUser = userCredentail.user;
        setNewUserUID(newUser.uid);
        setDoc(doc(db, "users", newUser.uid), {
          email: newUser.email,
          ...otherIfow,
        });
      }
    );
  }
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Context value declaration
  const value = {
    currentUser,
    newUserUID,
    signup,
    login,
    logout,
  };

  // Return context Provider
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
