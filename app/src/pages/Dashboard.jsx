import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../firebase';
import { useLocation, useNavigate} from 'react-router-dom'
import { listenToData, fetchDataOnce, setValueAtPath } from '../firebaseRoutes';
import TrashVisualizer from '../components/TrashVisualizer.jsx';
import house from './images/house.png'
import logout from './images/logout.png'
import trashGreen from './images/trashGreen.png'
import { sendNotification } from '../firebaseRoutes.js';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [savedUser, setUser] = useState(null);
    const [houseInfo, setHouseInfo] = useState(null);
    const [houseCode, setHouseCode] = useState(null);
    const [trashIndex, setTrashIndex] = useState(null);
    const [trashLevel, setTrashLevel] = useState(null);
    const [trashWeight, setTrashWeight] = useState(null);
    const [warningMessage, setWarningMessage] = useState(null);
    const [isFull, setFull] = useState(false);
    const previousTrashLevelRef = useRef(null);
    const previousFullRef = useRef(false);
    const [notifSent, setNotifSent] = useState(false);

    useEffect(() => {
        // Store isFull in localStorage
        localStorage.setItem('isFull', JSON.stringify(isFull));
    }, [isFull]);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        if (savedUser) {
            setUser(savedUser); // Updates the component's state
        }
    }, []);

    useEffect(()=>{   
        const fetchUserData = async (userID) => {
            try {
                const info = await fetchDataOnce(`/users/${userID}`)
                // Set local storage to keep user signed in
                localStorage.setItem('user', JSON.stringify(info));

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
                        if (!notifSent)
                            sendNotification(userInfo.fcmToken, "♻️♻️TRASH TIME♻️♻️", `Hi ${person}, it's your turn to take out the trash!`)
                            setNotifSent(true)
                    } else {
                        setWarningMessage(`Trash is Full! It's ${person}'s turn to take out the trash!`);
                    }
                } else if (data.trashLevel >= 750 && data.trashWeight < 3){
                    if (!isFull)
                        setFull(false)
                    if (userInfo.name === person) {
                        setWarningMessage("Trash is not Full, but it's your turn!");
                    } else {
                        setWarningMessage(`Trash is not Full. It's ${person}'s turn.`);
                    }
                }
                else{
                    if (isFull){
                        if (userInfo.name === person) {
                            setWarningMessage("Trash is Full! It's your turn!");
                        } else {
                            setWarningMessage(`Trash is Full! It's ${person}'s turn!`);
                        }
                    }
                    else{
                        if (userInfo.name === person) {
                            setWarningMessage("Trash is not Full, but it's your turn!");
                        } else {
                            setWarningMessage(`Trash is not Full. It's ${person}'s turn.`);
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
            localStorage.removeItem('user');
            setUser(null);
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
            console.error("Household information is not available")
        }
    }

    // If the fullness of the trash changes, update the previousFullRef
    useEffect(() => {
        if (isFull)
            previousFullRef.current = isFull
    }, [isFull])

    // Detect changes in `isFull` and handle when trash is no longer full
    useEffect(() => {
        if (previousFullRef.current && trashLevel > 750 && trashWeight < 4) {
            // Only update the index if the current one has changed
            if (trashLevel > previousTrashLevelRef.current) {
                setValueAtPath(`/households/${houseCode}/currTrashIndex`, (trashIndex + 1) % houseInfo.numberOfPeople);
                setTrashIndex((prevIndex) => (prevIndex + 1) % houseInfo.numberOfPeople);
                setNotifSent(false);
            }
        }
    }, [previousFullRef, trashLevel, trashWeight]);

    return (
 
        <nav>
            <div className="full-screen-container">
                {houseInfo ? (
                <div>
                    <h1 className="syne-title">{houseInfo.name}'s Trash</h1>
                    {/* Add more fields as needed */}
                </div> 
                ) : (
                <p className="message font-semibold text-xl">Loading house information...</p>
                )}
                <div>
                    {!trashLevel ? (
                        <p className="message font-semibold text-xl">Loading trash level...</p>
                    ) : (
                        <>
                            <TrashVisualizer trashLevel={trashLevel} trashWeight={trashWeight} />
                        </>
                    )}
                    {warningMessage && <div className="syne-body mt-8 w-full text-center mx-auto max-w-[80%]">{warningMessage}</div>}
                </div>
                
            </div>
            <div className="footer fixed bottom-0 w-full bg-white flex justify-around py-4 shadow-lg">
                    <button onClick={handleViewHouseholdMembers} className="footer-button">
                        <img src={house} className="w-8"/>
                    </button>
                    <button className="footer-button px-6 py-2">
                        <img src={trashGreen} className="w-8"/>
                    </button>
                    <button onClick={handleLogout} className="footer-button">
                        <img src={logout} className="w-10"/>
                    </button>
            </div>
        </nav>

    )
}

export default Dashboard