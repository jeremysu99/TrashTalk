import { auth, db } from "../firebase";
import { useLocation } from 'react-router-dom';
import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { fetchDataOnce } from "../firebaseRoutes";

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
    return <p>No userID available.</p>;
  }

  if (!userInfo) {
    return <p>Loading user info...</p>; // Render a loading state while data is fetched
  }


  return (
    <div className="container">
      {userInfo ? (
        <div>
          <h1>Hi {userInfo.name}! It seems you are not in a Household yet. Please either Create or Join a Household</h1> 
        </div>
        ) : (
        <p>Loading user information...</p>
        )}
      
      <button onClick={() => navigate("/create", { state: { userID: userID }})}>Create Household</button>
      <button onClick={() => navigate("/join", { state: { userID: userID }})}>Join Household</button>
    </div>
  );
};

export default HouseholdStatus;