import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

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
const db = getDatabase(app);

export { auth, db };
export default app;
