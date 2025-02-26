import React, { useState, useEffect } from "react";
import Signup from "./pages/Signup";
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { onAuthStateChanged } from "firebase/auth";
import HouseholdStatus from "./pages/HouseholdStatus";
import CreateHousehold from "./pages/CreateHousehold";
import JoinHousehold from "./pages/JoinHousehold";
import ViewHousehold from "./pages/ViewHousehold";
import { auth, generateToken, messaging } from "./firebase";
import { onMessage, getMessaging } from "firebase/messaging"
import { setValueAtPath } from "./firebaseRoutes";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
// Firebase messaging initialization
const messaging = getMessaging();

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
          setUser(currentUser);
          setIsLoading(false);                                             
          if (currentUser) {
            const userID = currentUser.uid;
    
            try {
              const token = await generateToken(); // Wait for the token to be generated
              if (token) {
                await setValueAtPath(`/users/${userID}/fcmToken`, token); // Save token to the database 
              }
            } catch (error) {
              console.error("Error generating or saving token:", error);
            }
    
            onMessage(messaging, (payload) => {
              console.log("Message received:", payload);
              // Extract the notification content
              const notificationTitle = payload.notification.title;
              const notificationOptions = {
                body: payload.notification.body,
              };

              // Show the notification manually in the app (using the Notification API)
              new Notification(notificationTitle, notificationOptions);
            });
          }
      }); 

      return () => unsubscribe(); // Cleanup the listener
  }, []);

  if (isLoading) {
      return (
        <div className="login-container">
          <p className="text-xl font-semibold">Loading...</p>
        </div>
        
    );
  }

  return (
    <Router>
      <div>                
             
        <section>
          <Routes>
            {/* <Route path="*" element={<Signup />} /> */}
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<Signup />} /> 
            <Route path="/view" element={<ViewHousehold/>}/>
                             

            <Route path="/household" element={<HouseholdStatus />} />
            <Route path="/create" element={<CreateHousehold />} />
            <Route path="/join" element={<JoinHousehold />} />
          </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;
