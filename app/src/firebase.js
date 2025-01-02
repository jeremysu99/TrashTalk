import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
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
            } else {
            // Show permission request UI
                console.log('No registration token available. Request permission to generate one.');
            // ...
            }
    }
}
export { auth, database, messaging };
export default app;

