import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken } from "firebase/messaging";
import { setValueAtPath } from "./firebaseRoutes";

const firebaseConfig = {
  apiKey: "AIzaSyBkFUa3yHyKsXN30wkr217R5qM5_-msve8",
  authDomain: "trashtalk-453d2.firebaseapp.com",
  databaseURL: "https://trashtalk-453d2-default-rtdb.firebaseio.com",
  projectId: "trashtalk-453d2",
  storageBucket: "trashtalk-453d2.firebasestorage.app",
  messagingSenderId: "948007141722",
  appId: "1:948007141722:web:00243368a7469951583363",
  measurementId: "G-EDHLKZER11"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const messaging = getMessaging(app);


export const generateToken = async () => {
    const permission = await Notification.requestPermission();
    console.log(permission)
    if (permission === 'granted'){
        const currentToken=await getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY });
            if (currentToken) {
                console.log(currentToken)
                return currentToken
            } else {
            // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
            // ...
            }
    }
}

export { auth, database, messaging };
export default app;

