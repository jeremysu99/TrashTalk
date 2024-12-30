import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../firebase';
import { createUser } from '../firebaseRoutes';
import logo from './images/logo.png'
import leaf1 from './images/leaf1.png'
import leaf2 from './images/leaf2.png'

const Signup = () => {
    const navigate = useNavigate();

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const[message,setMessage]=useState('')

    const onSubmit = async (e) => {
      e.preventDefault()
      try {
        // Create the user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;  
        // Set user's name in Realtime Database
        const userID = user.uid;
        const path = `/users/${userID}/name`;
        await createUser(name, email, userID)
        setMessage(`User created: ${email}`);
        navigate("/login", { state: { successMessage: "Sign up successful! Please log in." } });
      } catch (error) {
        // Handle errors
        console.error("Error creating user:", error.code, error.message);
        setMessage(error.message);
      }
    }

  return (
    <main >  
        <img src={leaf1} alt="leaf1" class="top-left-image"/>
        <img src={leaf2} alt="leaf1" class="bottom-right-image"/>      
        <section class="login-container">
            <div class="login-form">
                <div>
                    <div class="logo-container">
                            <img src={logo} alt="TrashTalk" class="w-24 h-auto"/>
                    </div>
                    <div class="px-16">                  
                    <h2 class="syne-login">TrashTalk</h2>                                                                            
                    <form class="login-form-container">
                        <div>
                            <input
                                type="name"
                                label="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}  
                                required                                    
                                placeholder="Name"
                                class="input-field mt-8"                                
                            />
                        </div>                                                                                            
                        <div>
                            <input
                                type="email"
                                label="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}  
                                required                                    
                                placeholder="Email address"
                                class="input-field"                                
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                label="Create password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                required                                 
                                placeholder="Password"
                                class="input-field"              
                            />
                        </div>                                             

                        <button
                            type="submit" 
                            onClick={onSubmit}
                            class="login-button"                        
                        >  
                            Sign up                                
                        </button>

                    </form>
                    {message && <p class="message">{message}</p>}

                    <p className="signup-link">
                        <NavLink to="/login" >
                            Already have an account? Sign in
                        </NavLink>
                    </p>  
                    </div>                 
                </div>
            </div>
        </section>
    </main>
  )
}

export default Signup