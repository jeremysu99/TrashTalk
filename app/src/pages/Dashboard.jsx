import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { listenToData, fetchDataOnce, setValueAtPath, sendNotification } from '../firebaseRoutes';
import TrashVisualizer from '../components/TrashVisualizer.jsx';
import house from './images/house.png';
import logout from './images/logout.png';
import trashGreen from './images/trashGreen.png';

const Dashboard = () => {
    console.log("dashboard component mounted");
    const navigate = useNavigate();
    
    const [userInfo, setUserInfo] = useState(null);
    const [houseInfo, setHouseInfo] = useState(null);
    const [houseCode, setHouseCode] = useState(null);
    const [trashIndex, setTrashIndex] = useState(null);
    const [trashLevel, setTrashLevel] = useState(null);
    const [trashWeight, setTrashWeight] = useState(null);
    const [warningMessage, setWarningMessage] = useState(null);
    const [isFull, setFull] = useState(false);
    
    const previousFullRef = useRef(false);
    const notifSentRef = useRef(false);

    useEffect(() => {
        localStorage.setItem('isFull', JSON.stringify(isFull));
    }, [isFull]);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        if (savedUser) {
            setUserInfo(savedUser);
            setHouseCode(savedUser.household);
        }
    }, []);

    const fetchUserData = async (userID) => {
        console.log("Fetching user data for:", userID);
        try {
            const info = await fetchDataOnce(`/users/${userID}`);
            if (!info || !info.household) throw new Error("User missing household info");

            localStorage.setItem('user', JSON.stringify(info));
            setUserInfo(info);
            setHouseCode(info.household);

            const infoHouse = await fetchDataOnce(`/households/${info.household}`);
            if (!infoHouse) throw new Error("Household data missing");

            setHouseInfo(infoHouse);
            setTrashIndex(infoHouse.currTrashIndex);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User detected:", user.uid);
                if (!userInfo) fetchUserData(user.uid);
            } else {
                navigate("/");
            }
        });
    }, [navigate, userInfo]);

    useEffect(() => {
        if (!houseCode || !userInfo) return;

        const handleDataUpdate = (data) => {
            if (!data) return console.log("No data found at this path.");

            setTrashLevel(data.trashLevel);
            setTrashWeight(data.trashWeight);
            setTrashIndex(data.currTrashIndex);

            const person = data.housemates[data.currTrashIndex][0];
            let newMessage = `Trash is not Full. It's ${person}'s turn.`;

            if (data.trashLevel <= 250 && data.trashWeight > 4) {
                setFull(true);
                newMessage = `Trash is Full! It's ${person}'s turn to take it out!`;

                if (userInfo.name === person && !notifSentRef.current) {
                    sendNotification(userInfo.fcmToken, "♻️♻️TRASH TIME♻️♻️", `Hi ${person}, it's your turn to take out the trash!`);
                    notifSentRef.current = true;
                }
            } else if (data.trashLevel >= 750 && data.trashWeight < 3) {
                setFull(false);
                if (userInfo.name === person) newMessage = "Trash is not Full, but it's your turn!";
            } else if (isFull) {
                newMessage = `Trash is Full! It's ${person}'s turn!`;
            }

            setWarningMessage(newMessage);
        };

        listenToData(`/households/${houseCode}`, handleDataUpdate);
    }, [houseCode, userInfo]);

    useEffect(() => {
        if (!houseInfo || trashIndex === null || houseCode === null) return;

        if (previousFullRef.current && trashLevel>=750) {
            console.log("cycling trash index")
            const newIndex = (trashIndex + 1) % houseInfo.numberOfPeople;
            setValueAtPath(`/households/${houseCode}/currTrashIndex`, newIndex).then(() => {
                setTrashIndex(newIndex);
                notifSentRef.current = false;
            });

            setFull(false);
        }

        previousFullRef.current = isFull;
    }, [isFull, trashIndex, houseCode, houseInfo]);

    const handleLogout = () => {               
        signOut(auth).then(() => {
            localStorage.removeItem('user');
            setUserInfo(null);
            navigate("/");
            console.log("Signed out successfully");
        }).catch(console.error);
    };

    const handleViewHouseholdMembers = () => {
        if (userInfo?.household) {
            navigate("/view", { state: { householdCode: userInfo.household } });
        } else {
            console.error("Household information is not available");
        }
    };

    return (
        <nav>
            <div className="full-screen-container">
                {houseInfo ? (
                    <h1 className="syne-title">{houseInfo.name}'s Trash</h1>
                ) : (
                    <p className="message font-semibold text-xl">Loading house information...</p>
                )}
                <div>
                    {!trashLevel ? (
                        <p className="message font-semibold text-xl">Loading trash level...</p>
                    ) : (
                        <TrashVisualizer trashLevel={trashLevel} trashWeight={trashWeight} />
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
    );
};

export default Dashboard;
