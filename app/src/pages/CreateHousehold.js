// CreateHousehold.js
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { ref, set } from "firebase/database";
// import "./CreateHousehold.css";

const CreateHousehold = () => {
  const [householdName, setHouseholdName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const generateInviteCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase(); // Generate a 6-character code
    setInviteCode(code);

    // Save household to Firebase
    set(ref(db, `households/${code}`), {
      householdName,
      members: [],
    })
      .then(() => {
        alert("Household created with invite code: " + code);
      })
      .catch((error) => {
        console.error("Error creating household: ", error);
      });
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
