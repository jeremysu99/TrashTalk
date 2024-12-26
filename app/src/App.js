import React, {useState, useEffect} from 'react';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

=======
import HouseholdStatus from "./pages/HouseholdStatus";
import CreateHousehold from "./pages/CreateHousehold";
import JoinHousehold from "./pages/JoinHousehold";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
>>>>>>> parent of 40b324e (Merge pull request #16 from jeremysu99/jeremy)
  return (
    <Router>
      <div>
        <section>                              
          <Routes>                     
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>                    
        </section>
      </div> 
    </Router>
  );
}
export default App;