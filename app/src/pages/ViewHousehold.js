import React, {useState, useEffect} from 'react';
import { database } from '../firebase';
import { collection, getDocs, getDoc, doc} from "firebase/firestore";
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
                const householdDocumentRef=doc(database,"households", householdCode);
                //fetch the document to make sure it exists
                const householdDocument = await getDoc(householdDocumentRef);

                if (householdDocument.exists()){
                    console.log("Household Doument: ", householdDocument.data());

                    const housematesRef = collection(database, "households", householdCode, "housemates");
                    const housemateQuery = await getDocs(housematesRef);

                    const housematesList =[];
                    housemateQuery.forEach((doc) => {
                        housematesList.push(doc.data());
                    });

                    setMembers(housematesList);
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


