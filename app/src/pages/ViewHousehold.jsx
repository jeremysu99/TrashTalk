import React, {useState, useEffect} from 'react';
import { database, auth } from '../firebase';
import { ref, get} from "firebase/database";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchDataOnce } from '../firebaseRoutes';
import { signOut } from "firebase/auth";
import logout from './images/logout.png'
import trashcan from './images/trashcan.png'
import houseGreen from './images/houseGreen.png'
import { listenToData } from '../firebaseRoutes';

const ViewHousehold = () => {
    const location=useLocation();
    const navigate = useNavigate();

    const {householdCode}=location.state || {};
    const [houseInfo, setHouseInfo] = useState(null);
    const[members,setMembers]=useState([]);
    const[loading, setLoading] = useState(true);
    const [currPerson, setPerson] = useState(null);

    useEffect(()=>{
        const fetchMembers = async () => {
            try{
                if (!householdCode) {
                    console.error("Household code is missing");
                    setLoading(false);
                    return;
                }
                const householdData = await fetchDataOnce(`/households/${householdCode}`)
                console.log("data: ",householdData);
                setHouseInfo(householdData);
                const housemateIds=householdData.housemates.flat();
                const housemateDetails=[];

                for (const key of housemateIds){
                    const userData = await fetchDataOnce(`/users/${key}`)
                    if (userData)
                        housemateDetails.push(userData);
                }
                setMembers(housemateDetails)
                
                setLoading(false);
            } catch (error){
                console.error("Error fetching housemates: ", error);
                setLoading(false);
            }
        };
        
        fetchMembers();
    }, [householdCode]);

    useEffect(() => {
        const handleDataUpdate = (data) => {
            if (data !== null) {
                setPerson(data.housemates[data.currTrashIndex][0])
            } else {
                console.log("No data found at this path.");
            }
        }
        if (householdCode) {
            listenToData(`/households/${householdCode}`, handleDataUpdate);
        }
    }, [householdCode])
    
    const handleLogout = () => {               
        signOut(auth).then(() => {
        // Sign-out successful.
            localStorage.removeItem('user');
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
        // An error happened.
        });
    }

    const handleDashboard=() => {
        navigate("/dashboard")
    }

    return(
        <div className="full-screen-container">
            <h1 className="syne-title">Whose Turn Is It?</h1>
            { loading ? (
                <p className="message text-xl font-semibold">Loading Information..</p>
            ): (
            <div className="grid">
                {members.map((member, index) => (
                    <div 
                        key={index} 
                        className={`member-card ${member.name === currPerson ? 'turn-card' : ''}`}
                    >
                        <p className="text-2xl font-semibold">{member.name}</p>
                    </div>
                ))}
            </div>
            )}
            <div className="footer fixed bottom-0 w-full bg-white flex justify-around py-4 shadow-lg">
                    <button className="footer-button">
                        <img src={houseGreen} className="w-8"/>
                    </button>
                        
                    <button onClick={handleDashboard} className="footer-button">
                        <img src={trashcan} className="w-8"/>
                    </button>
                    <button onClick={handleLogout} className="footer-button px-6 py-2">
                        <img src={logout} className="w-10"/>
                    </button>
            </div>
        </div>
    )
}

export default ViewHousehold


