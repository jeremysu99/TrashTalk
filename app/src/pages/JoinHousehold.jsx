// JoinHousehold.js
import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, database } from "../firebase";
import { ref, get, child } from "firebase/database";
import { joinHousehold, fetchDataOnce } from "../firebaseRoutes";
import leaf1 from './images/leaf1.png'
import leaf2 from './images/leaf2.png'

const JoinHousehold = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userID } = location.state || {}; // Get userId from state

  const [inviteCode, setInviteCode] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const join = async (e) => {
    try{
      const { userID } = location.state || {};
      const name = await fetchDataOnce(`/users/${userID}/name`)
      await joinHousehold(userID, inviteCode, name)
      navigate("/dashboard", { state: { userID: userID } });
    }catch(error){
      console.error("Error joining house:", error.code, error.message);
      setStatusMessage(error.message);
    }
  };
  const navBack = () => {
    navigate("/household", { state: { userID: userID }});
  }
  return (
    <main>
      <img src={leaf1} alt="leaf1" class="top-left-image"/>
      <img src={leaf2} alt="leaf1" class="bottom-right-image"/>
    <div className="join-household-container">
      <h2>Join Household</h2>
      <input
        type="text"
        placeholder="Enter invite code"
        value={inviteCode}
        onChange={(e) => setInviteCode(e.target.value)}
        className="household-input"
      />
      <button onClick={join} className="join-btn">
        Join
      </button>
      <button onClick={navBack}>
        Go Back
      </button>
      {statusMessage && <p>{statusMessage}</p>}
    </div>
    </main>
  );
};

export default JoinHousehold;