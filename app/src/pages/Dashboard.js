import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../firebase';
import { useLocation, useNavigate } from 'react-router-dom'
import { listenToData, fetchDataOnce } from '../firebaseRoutes';

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [houseInfo, setHouseInfo] = useState(null);
    const [houseCode, setHouseCode] = useState(null);
    const [housePeople, setHousePeople] = useState(null);
    const [trashIndex, setTrashIndex] = useState(null);
    const [trashLevel, setTrashLevel] = useState(null);
    const [trashWeight, setTrashWeight] = useState(null);
    const [warningMessage, setWarningMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    
    const fetchUserData = async (userID) => {
        try {
            setIsLoading(true); // Start loading
            const info = await fetchDataOnce(`/users/${userID}`)
            setUserInfo(info);
            const code = info.household
            setHouseCode(code)
            const infoHouse = await fetchDataOnce(`/households/${code}`)
            
            setHouseInfo(infoHouse);
            
            const people = infoHouse.people;
            setHousePeople(people)

            const index = infoHouse.currTrashIndex;
            setTrashIndex(index);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }finally {
            setIsLoading(false); // End loading
        }
    }

    useEffect(()=>{   
        const handleDataUpdate = (data) => {
            console.log("Updating data")
            console.log("trashLevel:", trashLevel);
            console.log("trashWeight:", trashWeight);
            console.log("housePeople:", housePeople);
            console.log("trashIndex:", trashIndex);
            if (data !== null) {
              const person = housePeople[trashIndex]
              setTrashLevel(data.trashLevel);
              setTrashWeight(data.trashWeight);
                
              if (trashLevel <= 250 && trashWeight > 1){
                
                if (userInfo.name == person){
                    setWarningMessage("Trash is Full! It's your turn to take out the trash!")
                }
                else{
                    setWarningMessage(`Trash is Full! It's ${person}'s turn to take out the trash!`);
                }
              }else{
                if (userInfo.name == person){
                    setWarningMessage("Trash is not Full, but you must take it out soon!")
                }
                else{
                    setWarningMessage(`Trash is not Full. It's ${person}'s turn to take out the trash.`);
                }
              }
            } else {
              console.log("No data found at this path.");
            }
            setIsLoading(false)
        };
        listenToData(`/households/${houseCode}`, handleDataUpdate);
         
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // Signed in
              const uid = user.uid;
              console.log("uid", uid);
              fetchUserData(uid);
              // listenHouseData();
            } else {
               navigate("/")
            }
          });
    }, [navigate])

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
                    <p><strong>Who's Turn it is Next:</strong> {houseInfo.people[houseInfo.currTrashIndex] || "Not assigned"}</p>
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