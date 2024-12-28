import React, {useState, useEffect} from 'react';
import { database } from '../firebase';
import { ref, get} from "firebase/database";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchDataOnce } from '../firebaseRoutes';

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

    const navBack = () => {
        navigate("/dashboard");
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
            <button onClick={navBack}>
             Go Back
            </button>
        </div>
    )
}

export default ViewHousehold


