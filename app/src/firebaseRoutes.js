import { getDatabase, ref, get, onValue } from "firebase/database";

import { database } from "./firebase";

// Function to fetch data once
export const fetchDataOnce = async (path) => {
    const dbRef = ref(database, path);
    try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.log("No data available");
            return null;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Function to listen to real-time updates
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

