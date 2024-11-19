import { auth, db } from "../firebase";
import React from "react";
import { useNavigate } from "react-router-dom";

const HouseholdStatus = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Household Status</h1>
      <button onClick={() => navigate("/create")}>Create Household</button>
      <button onClick={() => navigate("/join")}>Join Household</button>
    </div>
  );
};

export default HouseholdStatus;
