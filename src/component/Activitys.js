import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "./Navbar";
const Activitys = () => {
  const [loading, setloading] = useState(true);
  useEffect(() => {
    async function getActivitys() {
      const docSnap = await getDocs(collection(db, "activity"));

      if (!docSnap.empty) {
        console.log(
          "Document data:",
          docSnap.docs.map((doc) => doc.data())
        );
        setloading(false);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        setloading(false);
      }
    }
    getActivitys();
  }, []);
  return (
    <>
      <Navbar />
      {loading ? <h1>loading</h1> : <h1>Finished loading</h1>}
    </>
  );
};

export default Activitys;
