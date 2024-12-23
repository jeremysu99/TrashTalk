import React, {useState, useEffect} from 'react';
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { auth } from '../firebase';
import { NavLink, useNavigate } from 'react-router-dom'
import { fetchDataOnce } from '../firebaseRoutes';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const[message,setMessage]=useState('')

    const onLogin = async (e) => {

        e.preventDefault();

        try{
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
                <section>
                    <div>                                            
                        <p> TrashTalk </p>                       

                        <form>                                              
                            <div>
                                <label htmlFor="email-address">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"                                    
                                    required                                                                                
                                    placeholder="Email address"
                                    onChange={(e)=>setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"                                    
                                    required                                                                                
                                    placeholder="Password"
                                    onChange={(e)=>setPassword(e.target.value)}
                                />
                            </div>

                            <div>
                                <button                                    
                                    onClick={onLogin}                                        
                                >      
                                    Login                                                                  
                                </button>
                            </div>                               
                        </form>

                        {message && <p>{message}</p>}

                        <p className="text-sm text-white text-center">
                            No account yet? {' '}
                            <NavLink to="/signup">
                                Sign up
                            </NavLink>
                        </p>

                    </div>
                </section>
            </main>
        </>
    )
}

export default Login