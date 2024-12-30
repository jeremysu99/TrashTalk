import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../firebase';
import { useLocation, useNavigate} from 'react-router-dom'
import { listenToData, fetchDataOnce, setValueAtPath } from '../firebaseRoutes';
import TrashVisualizer from '../components/TrashVisualizer';
import house from './images/house.png'
import logout from './images/logout.png'

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
    const previousTrashLevelRef = useRef(null);
    const previousFullRef = useRef(false);

    useEffect(() => {
        // Store isFull in localStorage
        localStorage.setItem('isFull', JSON.stringify(isFull));
    }, [isFull]);

    useEffect(()=>{   
        const fetchUserData = async (userID) => {
            try {
                const info = await fetchDataOnce(`/users/${userID}`)
                setUserInfo(info);
                const code = info.household
                setHouseCode(code)
                const infoHouse = await fetchDataOnce(`/households/${code}`)
                setHouseInfo(infoHouse);
                setTrashIndex(infoHouse.currTrashIndex)
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        const handleDataUpdate = (data) => {
            if (data !== null) {
                setTrashLevel(data.trashLevel);
                setTrashWeight(data.trashWeight);
                setTrashIndex(data.currTrashIndex);
                const person = data.housemates[data.currTrashIndex][0];
                if (data.trashLevel <= 250 && data.trashWeight > 4) {
                    setFull(true);
                    if (userInfo.name === person) {
                        setWarningMessage("Trash is Full! It's your turn to take out the trash!");
                    } else {
                        setWarningMessage(`Trash is Full! It's ${person}'s turn to take out the trash!`);
                    }
                } else {
                    setFull(false)
                    if (userInfo.name === person) {
                        setWarningMessage("Trash is not Full, but you must take it out soon!");
                    } else {
                        setWarningMessage(`Trash is not Full. It's ${person}'s turn to take out the trash next.`);
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
        
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // Signed in
              const uid = user.uid;
              fetchUserData(uid);
            } else {
               navigate("/")
            }
          });
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

    const handleViewHouseholdMembers=() => {
        if(userInfo && userInfo.household){
            navigate("/view",{state:{ householdCode: userInfo.household}})
        }else{
            console.error("Household infor is not available")
        }
    }


    // If the fullness of the trash changes, update the previousFullRef
    useEffect(() => {
        if (isFull)
            previousFullRef.current = isFull
    }, [isFull])
    // Detect changes in `isFull` and handle when trash is no longer full
    useEffect(() => {
        if (previousFullRef.current && trashLevel > 250) {
            // Only update the index if the current one has changed
            if (trashLevel > previousTrashLevelRef.current) {
                setValueAtPath(`/households/${houseCode}/currTrashIndex`, (trashIndex + 1) % houseInfo.numberOfPeople);
                setTrashIndex((prevIndex) => (prevIndex + 1) % houseInfo.numberOfPeople);
            }
        }
    }, [previousFullRef, trashLevel]);

    return (
 
        <nav>
            <div class="bg-[#FFFBF1] w-screen h-screen">
                {userInfo ? (
                <div>
                    <h1>Welcome to your dashboard {userInfo.name}!</h1>
                    {/* Add more fields as needed */}
                </div> 
                ) : (
                <p class="message">Loading user information...</p>
                )}
                {houseInfo ? (
                <div>
                    <p><strong>Household Number:</strong> {userInfo.household || "Not assigned"}</p>
                    <p><strong>Household Name:</strong> {houseInfo.name || "Not assigned"}</p>
                    <p><strong>Whose Turn it is Next:</strong> {houseInfo.housemates[houseInfo.currTrashIndex][0] || "Not assigned"}</p>
                    {/* Add more fields as needed */}
                </div>
                ) : (
                <p class="message">Loading user information...</p>
                )}
                <div>
                    <h1>Trash Level Monitor</h1>
                    {!trashLevel ? (
                        <p class="message">Loading trash level...</p>
                    ) : (
                        <>
                            <TrashVisualizer trashLevel={trashLevel} trashWeight={trashWeight} />
                        </>
                        
                    )}

                    {warningMessage && <div>{warningMessage}</div>}
                </div>
                <div className="footer fixed bottom-0 w-full bg-white flex justify-around py-4 shadow-lg">
                    <button onClick={handleViewHouseholdMembers} className="footer-button px-6 py-2  text-white rounded hover:bg-[#DBEAD5]">
                        <img src={house} class="w-8"/>
                    </button>
                    <button onClick={handleLogout} className="footer-button px-6 py-2 text-white rounded hover:bg-[#DBEAD5]">
                        <img src={logout} class="w-8"/>
                    </button>
                </div>
            </div>

        </nav>

    )
}

export default Dashboard