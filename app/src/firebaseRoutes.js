import { getDatabase, ref, get, onValue, set, push, runTransaction } from "firebase/database";
import { database } from "./firebase";

// Used to send notifications using Firebase functions
export const sendNotification = async (fcmToken, title, body) => {
  const response = await fetch('https://us-central1-trashtalk-453d2.cloudfunctions.net/sendNotification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fcmToken: fcmToken,
      title: title,
      body: body,
    }),
  });

  const result = await response.json();
  console.log(result);
};

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
export const createHousehold = async (userID, houseID, name, nameOfUser) => {
  const houseRef = ref(database, "households/" + houseID);
  const userRef = ref(database, "users/" + userID + "/household");

  const newHouseRef = set(houseRef, {
    currTrashIndex: 0,
    numberOfPeople: 1,
    name: name,
    housemates: [[nameOfUser, userID]],
    trashLevel: 0,
    trashWeight: 0
  });
  await set(userRef, houseID)
};

// Join households with the code

export const joinHousehold = async (userID, houseID, name) => {
  try {
    const houseRef = ref(database, "households/" + houseID + "/housemates");
    const userRef = ref(database, "users/" + userID + "/household");
    const people = await fetchDataOnce("households/" + houseID + "/housemates");
    const numberRef=ref(database,"households/" + houseID + "/numberOfPeople");
    // Append the new userID to the housemates list
    people.push([name, userID]);
    // Update the housemates array in the database
    await set(houseRef, people);
    await set(userRef, houseID);
    //update number of people
    await runTransaction(numberRef, (currentNumber) => {
      return (currentNumber || 0 ) + 1;
    })

    console.log("User successfully added to the household!");
  } catch (error) {
    console.error("Error joining the household:", error);
  }
}
