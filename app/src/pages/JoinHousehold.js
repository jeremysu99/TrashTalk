// JoinHousehold.js
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { ref, get, child } from "firebase/database";

const JoinHousehold = () => {
  const [inviteCode, setInviteCode] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const joinHousehold = () => {
    const dbRef = ref(db);

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
      {statusMessage && <p>{statusMessage}</p>}
    </div>
  );
};

export default JoinHousehold;
