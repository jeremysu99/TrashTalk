import React, {useState, useEffect} from 'react';
import { database, auth } from '../firebase';
import { ref, get} from "firebase/database";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchDataOnce } from '../firebaseRoutes';
import { signOut } from "firebase/auth";
import logout from './images/logout.png'
import trashcan from './images/trashcan.png'
import houseGreen from './images/houseGreen.png'

const ViewHousehold = () => {
    const location=useLocation();
    const navigate = useNavigate();

    const {householdCode}=location.state || {};

    const[members,setMembers]=useState([]);
    const[loading, setLoading] = useState(true);

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
        <div>
            <h2>Household  Members</h2>
            { loading ? (
                <p>Loading Information..</p>
            ): (
             <ul>
                {members.map((members, index) => (
                    <li key={index}>
                        {members.name}
                    </li>
                ))}
             </ul>
            )}
            <div className="footer fixed bottom-0 w-full bg-white flex justify-around py-4 shadow-lg">
                    <button className="footer-button px-6 py-2  text-white rounded hover:bg-[#DBEAD5]">
                        <img src={houseGreen} className="w-8"/>
                    </button>
                        
                    <button onClick={handleDashboard} className="footer-button px-6 py-2  text-white rounded hover:bg-[#DBEAD5]">
                        <img src={trashcan} className="w-8"/>
                    </button>
                    <button onClick={handleLogout} className="footer-button px-6 py-2 text-white rounded hover:bg-[#DBEAD5]">
                        <img src={logout} className="w-8"/>
                    </button>
            </div>
        </div>
    )
}

export default ViewHousehold


