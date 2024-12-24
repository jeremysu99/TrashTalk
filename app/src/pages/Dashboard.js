import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../firebase';
import { useLocation, useNavigate } from 'react-router-dom'
import { listenToData, fetchDataOnce, setValueAtPath } from '../firebaseRoutes';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [houseInfo, setHouseInfo] = useState(null);
    const [houseCode, setHouseCode] = useState(null);
    const [trashIndex, setTrashIndex] = useState(null);
    const [trashLevel, setTrashLevel] = useState(null);
    const [trashWeight, setTrashWeight] = useState(null);
    const [warningMessage, setWarningMessage] = useState(null);
    const [isFull, setFull] = useState(false);

    useEffect(()=>{   
        const fetchUserData = async (userID) => {
            try {
                const info = await fetchDataOnce(`/users/${userID}`)
                setUserInfo(info);
                const code = info.household
                setHouseCode(code)
                const infoHouse = await fetchDataOnce(`/households/${code}`)
                setHouseInfo(infoHouse);
                
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        const handleDataUpdate = (data) => {
            console.log("Updating data");
            if (data !== null) {
                setTrashLevel(data.trashLevel);
                setTrashWeight(data.trashWeight);
                setTrashIndex(data.currTrashIndex);

                const person = data.people[data.currTrashIndex];
                if (data.trashLevel <= 250 && data.trashWeight > 1) {
                    setFull(true);
                    if (userInfo.name === person) {
                        setWarningMessage("Trash is Full! It's your turn to take out the trash!");
                    } else {
                        setWarningMessage(`Trash is Full! It's ${person}'s turn to take out the trash!`);
                    }
                } else {
                    if (isFull){
                        setWarningMessage("Trash has been taken out.")
                        setFull(false)
                        setTrashIndex((data.currTrashIndex + 1) % data.numberOfPeople)
                        setValueAtPath(`households/${houseCode}`, (data.currTrashIndex + 1) % data.numberOfPeople, 
                                      data.name, data.people, data.numberOfPeople, data.trashLevel, data.trashWeight);
                    }
                    else{
                        setFull(false);
                        if (userInfo.name === person) {
                            setWarningMessage("Trash is not Full, but you must take it out soon!");
                        } else {
                            setWarningMessage(`Trash is not Full. It's ${person}'s turn to take out the trash.`);
                        }
                    }
                }
            } else {
                console.log("No data found at this path.");
            }
        };

        // Only start listening to data if houseCode is available
        if (houseCode) {
            listenToData(`/households/${houseCode}`, handleDataUpdate);
        }
        else{
            console.log("No house code")
        }
        
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // Signed in
              const uid = user.uid;
              fetchUserData(uid);
            } else {
            
               navigate("/")
            }
          });
        return () => {
            // You might need to implement an off() function in your Firebase service
            // if your `listenToData` doesn't handle cleanup automatically
        };
    }, [navigate, houseCode])

    const handleLogout = () => {               
        signOut(auth).then(() => {
        // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
        // An error happened.
        });
    }


    return (
 
        <nav>
            <div>
                {userInfo ? (
                <div>
                    <h1>Welcome to your dashboard {userInfo.name}!</h1>
                    {/* Add more fields as needed */}
                </div>
                ) : (
                <p>Loading user information...</p>
                )}
                {houseInfo ? (
                <div>
                    <p><strong>Household Number:</strong> {userInfo.household || "Not assigned"}</p>
                    <p><strong>Household Name:</strong> {houseInfo.name || "Not assigned"}</p>
                    <p><strong>Who's Turn it is Next:</strong> {houseInfo.people[trashIndex] || "Not assigned"}</p>
                    {/* Add more fields as needed */}
                </div>
                ) : (
                <p>Loading user information...</p>
                )}
                <div>
                    <h1>Trash Level Monitor</h1>
                    {!trashLevel ? (
                        <p>Loading trash level...</p>
                    ) : (
                        <>
                            <p>Trash Level from Top: {trashLevel} millimeters</p>
                            <p>Current Trash Weight: {trashWeight} pounds</p>
                        </>
                    )}

                    {warningMessage && <div>{warningMessage}</div>}
                </div>
                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>

        </nav>

    )
}

export default Dashboard