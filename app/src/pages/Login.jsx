import React, {useState, useEffect} from 'react';
import {  setPersistence, browserLocalPersistence, signInWithEmailAndPassword   } from 'firebase/auth';
import { auth } from '../firebase';
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { fetchDataOnce } from '../firebaseRoutes';
import logo from './images/logo.png'
import leaf1 from './images/leaf1.png'
import leaf2 from './images/leaf2.png'

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { successMessage } = location.state || {};
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const[message,setMessage]=useState('')



    const onLogin = async (e) => {
        e.preventDefault();
        try{
            try {
                await setPersistence(auth, browserLocalPersistence); // Ensures persistence across sessions
                console.log("Persistence set to local.");
            } catch (error) {
                console.error("Error setting persistence:", error);
            }
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            // Signed in
            const user = userCredential.user;
            const userID = user.uid;
            const fetchedInfo = await fetchDataOnce(`/users/${userID}`)
            // If the user doesn't have a household, nav to household
            if (!fetchedInfo?.household){      
                navigate("/household", { state: { userID: userID }});
            }
            // Otherwise go to dashboard
            else{
                navigate("/dashboard");
            }
            console.log(user);
        }
        catch(error){
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
            setMessage(errorMessage);
        }
        
    }
    return(
        <>
            <main >        
                <img src={leaf1} alt="leaf1" class="top-left-image"/>
                <img src={leaf2} alt="leaf1" class="bottom-right-image"/>
                <section class="login-container">
                    <div class="login-form">
                        <div class="logo-container">
                            <img src={logo} alt="TrashTalk" class="w-24 h-auto"/>
                        </div>
                        <div class="px-16">                                           
                        <h2 class="syne-login">TrashTalk</h2>                       
                        {successMessage && <p class="message">{successMessage}</p>}
                        <form class="login-form-container">                                              
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"                                    
                                    required                                                                                
                                    placeholder="Email address"
                                    onChange={(e)=>setEmail(e.target.value)}
                                    class="input-field mt-8"
                                />

                                <input
                                    id="password"
                                    name="password"
                                    type="password"                                    
                                    required                                                                                
                                    placeholder="Password"
                                    onChange={(e)=>setPassword(e.target.value)}
                                    class="input-field"
                                />
                            
                            <button                                    
                                onClick={onLogin}
                                class="login-button"                                    
                            >      
                                Login                                                                  
                            </button>
                        </form>
                        
                        {message && <p class="message">{message}</p>}
                        
                        <p className="signup-link">
                            {' '}
                            <NavLink to="/signup">
                            Don't have an account yet? Sign up
                            </NavLink>
                        </p>
                    </div> 
                    
                    </div>

                </section>
            </main>
        </>
    )
}

export default Login