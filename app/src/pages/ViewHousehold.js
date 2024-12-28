import React, {useState, useEffect} from 'react';
import { database } from '../firebase';
import { ref, get} from "firebase/database";
import { useLocation } from "react-router-dom";


const ViewHousehold = () => {
    const location=useLocation();
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
                //refrence to household 
                const householdRef=ref(database,`households/${householdCode}`);
                //fetch data at the reference above
                const householdSnapshot = await get(householdRef);

                //check if household exist in database
                if (householdSnapshot.exists()){

                    const householdData=householdSnapshot.val();
                    console.log("data: ",householdData);

                    const housemateIds=householdData.housemates.flat();
                    const housemateDetails=[];

                    for (const key of housemateIds){
                        const userRef=ref(database, `users/${key}`)
                        const userSnapshot=await get(userRef);

                        if(userSnapshot.exists()){
                            housemateDetails.push(userSnapshot.val());
                        } 
                    }
                    setMembers(housemateDetails)
                }else{
                    console.log("Household not found");
                }
                setLoading(false);
            } catch (error){
                console.error("Error fetching housemates: ", error);
                setLoading(false);
            }
        };
        
        fetchMembers();
    }, [householdCode]);





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
        </div>
    )
}

export default ViewHousehold


