import { db } from "../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

export async function SetVolunterToRequest(userUID, eventUId) {
  const activityRef = doc(db, "activity", eventUId);
  await updateDoc(activityRef, {
    voluntersRequest: arrayUnion(userUID),
  });
}
export async function RemoveVolunterFromRequest(userUID, eventUID) {
  const activityRef = doc(db, "activity", eventUID);
  await updateDoc(activityRef, {
    voluntersRequest: arrayRemove(userUID),
  });
}
export async function SetVolunterToAccept(userUID, eventUID) {
  const activityRef = doc(db, "activity", eventUID);
  await updateDoc(activityRef, {
    acceptedVolunters: arrayUnion(userUID),
  });
}
