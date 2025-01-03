import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { createHousehold, fetchDataOnce } from "../firebaseRoutes";
import leaf1 from './images/leaf1.png';
import leaf2 from './images/leaf2.png';
import '../index.css';

const CreateHousehold = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userID } = location.state || {}; // Get userId from state
  const [householdName, setHouseholdName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [message, setMessage] = useState("");

  const generateInviteCode = async () => {
    try {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase(); // Generate a 6-character code
      setInviteCode(code);

      const nameOfUser = await fetchDataOnce(`/users/${userID}/name`);
      await createHousehold(userID, code, householdName, nameOfUser);
      navigate("/dashboard", { state: { userID: userID } });
    } catch (error) {
      console.error("Error creating house:", error.code, error.message);
      setMessage(error.message);
    }
  };

  const navBack = () => {
    navigate("/household", { state: { userID: userID } });
  };

  return (
    <main className="create-household-container">
      <img src={leaf1} alt="leaf1" className="top-left-image" />
      <img src={leaf2} alt="leaf2" className="bottom-right-image" />
      <div className="div-container">
        <h1 className="syne-title title-at-top">Create a Household</h1>
        <input
          type="text"
          placeholder="Enter household name"
          value={householdName}
          onChange={(e) => setHouseholdName(e.target.value)}
          className="household-input always-show-focus"
        />
        <div className="button-row-centered">
          <button className="login-button" onClick={generateInviteCode}>
            Create House
          </button>
          <button className="login-button" onClick={navBack}>
            Go Back
          </button>
        </div>
        {inviteCode && <p className="invite-code">Invite Code: <strong>{inviteCode}</strong></p>}
        {message && <p className="error-message">{message}</p>}
      </div>
    </main>
  );
};

export default CreateHousehold;
