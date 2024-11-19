import React, { useState, useEffect } from "react";
import logo from './logo.svg';
import './App.css';
import { listenToData } from './firebaseRoutes';

function App() {
    // State to hold the fetched data
    const [data, setData] = useState(null);

    useEffect(() => {
      // Define the callback function to handle the data
      const handleData = (fetchedData) => {
        setData(fetchedData); // Update state with fetched data
      };
  
      // Path in your Firebase Realtime Database
      const path = "Room1/trashLevel"; // Adjust the path according to your database structure
  
      // Start listening to data at the given path
      listenToData(path, handleData);
  
      // Optional cleanup function to stop listening if needed
      return () => {
        // Your cleanup code here if you need to stop listening
      };
    }, []); // Empty dependency array ensures this runs only once on component mount
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
