import { auth, db } from "../firebase";
import { useLocation } from 'react-router-dom';
import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { fetchDataOnce } from "../firebaseRoutes";
import logo from './images/logo.png'
import leaf1 from './images/leaf1.png'
import leaf2 from './images/leaf2.png'
import back from './images/back.png'
import '../index.css';

const HouseholdStatus = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  // These two lines retrieve the passed data to know what user is currently making actions
  const location = useLocation();
  const { userID } = location.state || {}; // Get userId from state
  useEffect(() => {
    // Fetch user info when the component mounts
    const fetchUserInfo = async () => {
      if (userID) {
        try {
          const fetchedInfo = await fetchDataOnce(`/users/${userID}`);
          setUserInfo(fetchedInfo);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      } else {
        console.error("No userID found in location state.");
      }
    };

    fetchUserInfo();
  }, [userID]);

  if (!userID) {
    return <div className="login-container">
          <p className="text-xl font-semibold">No User ID found</p>
        </div>
  }

  if (!userInfo) {
    return <div className="login-container">
          <p className="text-xl font-semibold">Loading...</p>
        </div>
  }

  const navBack = () => {
    localStorage.removeItem('user');
    navigate("/login", { state: { userID: userID } });
  };

  return (
    <main className="create-household-container">
      <button
        className="absolute top-4 left-4 flex items-center text-gray-700 hover:text-gray-900 z-10"
        onClick={() => navBack()} // Navigates to the previous page
      >
        <img src={back} className="h-6 w-6 mr-2" />
      </button>
      <img src={leaf1} alt="leaf1" className="top-left-image"/>
      <img src={leaf2} alt="leaf1" className="bottom-right-image"/>
      <div className="div-container">
        {userInfo ? (
          <div className="syne-trash">
            <h1>Hi {userInfo.name}! Please either Join or Create a Household.</h1> 
          </div>
          ) : (
          <p className="message">Loading user information...</p>
          )}
          <div className="mt-12">
          <button className="login-button" onClick={() => navigate("/create", { state: { userID: userID }})}>Create Household</button>
          <button className="login-button ml-6" onClick={() => navigate("/join", { state: { userID: userID }})}>Join Household</button>
          </div>
      </div>
    </main>
  );
};

export default HouseholdStatus;
