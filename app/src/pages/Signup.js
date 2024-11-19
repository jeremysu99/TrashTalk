import React, {useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { auth } from '../firebase';

const Signup = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const[message,setMessage]=useState('')

    const onSubmit = async (e) => {
      e.preventDefault()

      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user);
            setMessage(`User created: ${email}`);
            navigate("/login")
        })
        .catch((error) => {
            //Error
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            setMessage(errorMessage);
        });


    }

  return (
    <main >        
        <section>
            <div>
                <div>                  
                    <h1> TrashTalk </h1>                                                                            
                    <form>                                                                                            
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