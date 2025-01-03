import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { joinHousehold, fetchDataOnce } from "../firebaseRoutes";
import leaf1 from './images/leaf1.png';
import leaf2 from './images/leaf2.png';
import back from './images/back.png'

const JoinHousehold = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userID } = location.state || {}; // Get userId from state

  const [inviteCode, setInviteCode] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const join = async () => {
    try {
      const name = await fetchDataOnce(`/users/${userID}/name`);
      await joinHousehold(userID, inviteCode, name);
      navigate("/dashboard", { state: { userID: userID } });
    } catch (error) {
      console.error("Error joining house:", error.code, error.message);
      setStatusMessage(error.message);
    }
  };

  const navBack = () => {
    navigate("/household", { state: { userID: userID } });
  };

  return (
    <main>
      <button
        className="absolute top-4 left-4 flex items-center text-gray-700 hover:text-gray-900 z-10"
        onClick={() => navBack()} // Navigates to the previous page
      >
        <img src={back} className="h-6 w-6 mr-2" />
      </button>
      <img src={leaf1} alt="leaf1" className="top-left-image" />
      <img src={leaf2} alt="leaf2" className="bottom-right-image" />
      <div className="create-household-container">
        <h1 className="syne-title">Join Household</h1>
        <input
          type="text"
          placeholder="Enter invite code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          className="household-input"
        />
        <div className="button-row-centered">
          <button onClick={join} className="login-button">
            Join
          </button>
          <button onClick={navBack} className="login-button">
            Go Back
          </button>
        </div>
        {statusMessage && <p className="error-message">{statusMessage}</p>}
      </div>
    </main>
  );
};

export default JoinHousehold;
