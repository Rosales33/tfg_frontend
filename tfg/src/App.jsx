import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import SymptomChecker from './components/SymptomChecker';
import SearchInfo from './components/SearchInfo';
import LoginSignup from './components/LoginSignup';
import PreviousDiagnosis from './components/PreviousDiagnosis';

import AdminDiseases from './components/AdminDiseases';
import AdminSymptoms from './components/AdminSymptoms';
import AdminPrecautions from './components/AdminPrecautions';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />

        <div style={{ marginLeft: 250, padding: '20px', width: '100%' }}>
          <Routes>
            {/* User-facing Routes */}
            <Route path="/" element={<SymptomChecker />} />
            <Route path="/symptom-checker" element={<SymptomChecker isLoggedIn={isLoggedIn} />}/>            
            <Route path="/search-info" element={<SearchInfo />} />
            <Route
              path="/login-signup"
              element={<LoginSignup setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="/previous-diagnoses" element={<PreviousDiagnosis />} />

            {/* Admin Routes */}
            <Route path="/admin/diseases" element={<AdminDiseases />} />
            <Route path="/admin/symptoms" element={<AdminSymptoms />} />
            <Route path="/admin/precautions" element={<AdminPrecautions />} />
            
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;











