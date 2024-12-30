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

    // Check localStorage for an existing user
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            console.log('User found in localStorage, redirecting to Dashboard...');
            navigate('/dashboard');
        }
    }, [navigate]);

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
                <img src={leaf1} alt="leaf1" className="top-left-image"/>
                <img src={leaf2} alt="leaf1" className="bottom-right-image"/>
                <section className="login-container">
                    <div className="login-form">
                        <div className="logo-container">
                            <img src={logo} alt="TrashTalk" className="w-24 h-auto"/>
                        </div>
                        <div className="px-16">                                           
                        <h2 className="syne-login">TrashTalk</h2>                       
                        {successMessage && <p className="message">{successMessage}</p>}
                        <form className="login-form-container">                                              
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"                                    
                                    required                                                                                
                                    placeholder="Email address"
                                    onChange={(e)=>setEmail(e.target.value)}
                                    className="input-field mt-4"
                                />

                                <input
                                    id="password"
                                    name="password"
                                    type="password"                                    
                                    required                                                                                
                                    placeholder="Password"
                                    onChange={(e)=>setPassword(e.target.value)}
                                    className="input-field"
                                />
                            
                            <button                                    
                                onClick={onLogin}
                                className="login-button"                                    
                            >      
                                Login                                                                  
                            </button>
                        </form>
                        
                        {message && <p className="message">{message}</p>}
                        
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