import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {

    const navigate = useNavigate();

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // Signed in
              const uid = user.uid;
              console.log("uid", uid)
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
                <h1>Welcome to your dashboard</h1>
                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>

        </nav>

    )
}

export default Dashboard