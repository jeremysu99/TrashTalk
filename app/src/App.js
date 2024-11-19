
import React, { useState, useEffect } from "react";
import Signup from "./pages/Signup";
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import HouseholdStatus from "./pages/HouseholdStatus";
import CreateHousehold from "./pages/CreateHousehold";
import JoinHousehold from "./pages/JoinHousehold";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
                  

        <section>
          <Routes>
            {/* <Route path="*" element={<Signup />} /> */}

            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

          </Routes>                    
            <Route path="/household" element={<HouseholdStatus />} />
            <Route path="/create" element={<CreateHousehold />} />
            <Route path="/join" element={<JoinHousehold />} />
          </Routes>

        </section>
      </div>
    </Router>
  );
}

export default App;
