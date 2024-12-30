// CreateHousehold.js
import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, database } from "../firebase";
import { ref, set } from "firebase/database";
import { createHousehold, joinHousehold} from "../firebaseRoutes";
import leaf1 from './images/leaf1.png'
import leaf2 from './images/leaf2.png'

const CreateHousehold = () => {
  const navigate = useNavigate();
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
      await joinHousehold(userID, code, householdName);
      navigate("/dashboard", { state: { userID: userID }});
    }
    catch(error){
      console.error("Error creating house:", error.code, error.message);
      setMessage(error.message);
    }
  };
  const navBack = () => {
    navigate("/household", { state: { userID: userID }});
  }

  return (
    <main>
      <img src={leaf1} alt="leaf1" class="top-left-image"/>
      <img src={leaf2} alt="leaf1" class="bottom-right-image"/>
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
      <button onClick={navBack}>
        Go Back
      </button>
      {inviteCode && <p>Invite Code: {inviteCode}</p>}
    </div>
    </main>
  );
};

export default CreateHousehold;