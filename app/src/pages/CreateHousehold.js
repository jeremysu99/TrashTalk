// CreateHousehold.js
import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import { auth, database } from "../firebase";
import { ref, set } from "firebase/database";
import { createHousehold } from "../firebaseRoutes";

// import "./CreateHousehold.css";

const CreateHousehold = () => {
  const location = useLocation();
  const { userID } = location.state || {}; // Get userId from state
  const [householdName, setHouseholdName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const[message, setMessage]=useState('')

  const generateInviteCode = async (e) => {
    try{
      const code = Math.random().toString(36).substring(2, 8).toUpperCase(); // Generate a 6-character code
      setInviteCode(code);
      console.log(userID);
      // Save household to Firebase
      await createHousehold(userID, code, householdName);
    }
    catch(error){
      console.error("Error creating house:", error.code, error.message);
      setMessage(error.message);
    }
  };

  return (
    <div className="create-household-container">
      <h2>Create Household</h2>
      <input
        type="text"
        placeholder="Enter household name"
        value={householdName}
        onChange={(e) => setHouseholdName(e.target.value)}
        className="household-input"
      />
      <button onClick={generateInviteCode} className="create-btn">
        Generate Invite Code
      </button>
      {inviteCode && <p>Invite Code: {inviteCode}</p>}
    </div>
  );
};

export default CreateHousehold;
