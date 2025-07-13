import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import TherapistProfile from "./TherapistProfile";
import AppointmentBooking from "./AppointmentBooking";
import Confirmation from "./Confirmation";
import Login from "./Login";
import Register from "./Register";
import VerifyOTP from "./VerifyOTP";
import Profile from "./Profile";
import ForgotPassword from "./ForgotPassword";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <div className="py-8 px-4">
            <div className="max-w-4xl mx-auto">
              <Routes>
                <Route path="/" element={<TherapistProfile />} />
                <Route path="/book" element={<AppointmentBooking />} />
                <Route path="/confirmation" element={<Confirmation />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

//Comment added
