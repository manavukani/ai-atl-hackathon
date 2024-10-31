import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth.jsx';
import NewUserPage from './components/NewUserPage.jsx';
import DoctorPage from './components/DoctorPage.jsx';
import HomePage from './components/HomePage.jsx';
import ConsultationPage from './components/ConsultationPage.jsx';
import Telemedicine from './components/Telemedicine.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/new-user" element={<NewUserPage />} />
        <Route path="/home-page" element={<HomePage />} />
        {/* <Route path="/telemedicine" element={<Telemedicine />} /> */}
        <Route path="/doctor" element={<DoctorPage />} />
        <Route path='/consult-doc' element={<ConsultationPage/>}/>
        <Route path='/telemedicine' element={<Telemedicine/>}/>
      </Routes>
    </Router>
  );
}

export default App;
