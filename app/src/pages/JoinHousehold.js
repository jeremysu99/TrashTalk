// JoinHousehold.js
import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, database } from "../firebase";
import { ref, get, child } from "firebase/database";

const JoinHousehold = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userID } = location.state || {}; // Get userId from state
  
  const [inviteCode, setInviteCode] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const joinHousehold = () => {
    const dbRef = ref(database);

    // Check if invite code exists in Firebase
    get(child(dbRef, `households/${inviteCode}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const household = snapshot.val();
          setStatusMessage(`Joined household: ${household.householdName}`);
          // You can add additional logic here to update members or navigate
        } else {
          setStatusMessage("Invalid invite code. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error joining household: ", error);
        setStatusMessage("An error occurred. Please try again.");
      });
  };
  const navBack = () => {
    navigate("/household", { state: { userID: userID }});
  }
  return (
    <div className="join-household-container">
      <h2>Join Household</h2>
      <input
        type="text"
        placeholder="Enter invite code"
        value={inviteCode}
        onChange={(e) => setInviteCode(e.target.value)}
        className="household-input"
      />
      <button onClick={joinHousehold} className="join-btn">
        Join
      </button>
      <button onClick={navBack}>
        Go Back
      </button>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default JoinHousehold;
