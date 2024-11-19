import { getDatabase, ref, get, onValue } from "firebase/database";

import { database } from "./firebase";

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