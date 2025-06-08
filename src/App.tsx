import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TherapistProfile from './TherapistProfile';
import AppointmentBooking from './AppointmentBooking';
import Confirmation from './Confirmation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Routes>
            <Route path="/" element={<TherapistProfile />} />
            <Route path="/book" element={<AppointmentBooking />} />
            <Route path="/confirmation" element={<Confirmation />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;