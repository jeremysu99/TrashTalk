import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../firebase';
import { createUser } from '../firebaseRoutes';


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
  
        console.log(user);
  
        // Set user's name in Realtime Database
        const userID = user.uid;
        const path = `/users/${userID}/name`;
        console.log(path)
        await createUser(name, email, userID)
  
        setMessage(`User created: ${email}`);
        
        navigate("/login");
      } catch (error) {
        // Handle errors
        console.error("Error creating user:", error.code, error.message);
        setMessage(error.message);
      }


    }

  return (
    <main >        
        <section>
            <div>
                <div>                  
                    <h1> TrashTalk </h1>                                                                            
                    <form>
                        <div>
                            <label htmlFor="name">
                                Name
                            </label>
                            <input
                                type="name"
                                label="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}  
                                required                                    
                                placeholder="Name"                                
                            />
                        </div>                                                                                            
                        <div>
                            <label htmlFor="email-address">
                                Email address
                            </label>
                            <input
                                type="email"
                                label="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}  
                                required                                    
                                placeholder="Email address"                                
                            />
                        </div>

                        <div>
                            <label htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                label="Create password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                required                                 
                                placeholder="Password"              
                            />
                        </div>                                             

                        <button
                            type="submit" 
                            onClick={onSubmit}                        
                        >  
                            Sign up                                
                        </button>

                    </form>
                    {message && <p>{message}</p>}

                    <p>
                        Already have an account?{' '}
                        <NavLink to="/login" >
                            Sign in
                        </NavLink>
                    </p>                   
                </div>
            </div>
        </section>
    </main>
  )
}

export default Signup