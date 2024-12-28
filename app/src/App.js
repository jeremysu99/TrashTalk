import React, { useState, useEffect } from "react";
import Signup from "./pages/Signup";
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { onAuthStateChanged } from "firebase/auth";
import HouseholdStatus from "./pages/HouseholdStatus";
import CreateHousehold from "./pages/CreateHousehold";
import JoinHousehold from "./pages/JoinHousehold";
import { auth, generateToken, messaging } from "./firebase";
import { onMessage } from "firebase/messaging"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log(payload)
    })
  }, [])

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setIsLoading(false);
      });

      return () => unsubscribe(); // Cleanup the listener
  }, []);

  if (isLoading) {
      return <p>Loading...</p>;
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
