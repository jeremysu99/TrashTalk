import { getDatabase, ref, get, onValue, set, push } from "firebase/database";

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
            callback(snapshot.val());
        } else {
            callback(null);
        }
    });
};


// Used to update specific values in the database depending on the path
export const setValueAtPath = async (path, value) => {
  await set(ref(database, path), value)
};

// Create users with a unique id
export const createUser = async (name, email, id) => {
  const userRef = ref(database, "users/"+id);
  const newUserRef = set(userRef, {
    name: name,
    email: email,
    household: null
  });
};

// Create households with the code
export const createHousehold = async (userID, houseID, name) => {
  const houseRef = ref(database, "households/"+houseID);
  const newHouseRef = set(houseRef, {
    currTrashIndex: 0,
    numberOfPeople: 1,
    name: name,
    people: [userID],
    trashLevel: 0,
    trashWeight: 0
  });
};
