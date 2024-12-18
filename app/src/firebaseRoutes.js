import { getDatabase, ref, get, onValue } from "firebase/database";

import { database } from "./firebase";

// Used to read data once (best for users and curr user index)
export const fetchDataOnce = async (path) => {
    const dbRef = ref(database, path); // Create a reference to the path in Firebase Realtime Database
    try {
      const snapshot = await get(dbRef); // Fetch the data once
      if (snapshot.exists()) {
        return snapshot.val(); // Return the data
      } else {
        return null; // Return null if no data exists at the path
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
      return null; // Return null in case of an error
    }
  };

// Used to update realtime data (best for trash level)
export const listenToData = (path, callback) => {
    const dbRef = ref(database, path);
    onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val())
            callback(snapshot.val());
        } else {
            callback(null);
        }
    });
};