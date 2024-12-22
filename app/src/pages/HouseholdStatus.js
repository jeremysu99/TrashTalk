import { auth, db } from "../firebase";
import { useLocation } from 'react-router-dom';
import React from "react";
import { useNavigate } from "react-router-dom";

const HouseholdStatus = () => {
  const navigate = useNavigate();
  // These two lines retrieve the passed data to know what user is currently making actions
  const location = useLocation();
  const { userID } = location.state || {}; // Get userId from state
  return (
    <div className="container">
      <h1>Household Status</h1> 
      <button onClick={() => navigate("/create", { state: { userID: userID }})}>Create Household</button>
      <button onClick={() => navigate("/join", { state: { userID: userID }})}>Join Household</button>
    </div>
  );
};

export default HouseholdStatus;
