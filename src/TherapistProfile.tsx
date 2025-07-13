import React from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Award,
  Clock,
  Calendar,
  MapPin,
  Video,
  Phone,
  LogOut,
} from "lucide-react";
import { useAuth } from "./contexts/AuthContext";
import { logout } from "./services/authService";
import coverPhoto from "./components/images/coverphoto.jpg";
import kiranImg from "./components/images/Kiran.jpg";

const TherapistProfile: React.FC = () => {
  const { state: authState, logout: authLogout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      authLogout();
    } catch (error) {
      console.error("Logout error:", error);
      // Still logout locally even if server request fails
      authLogout();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-64 bg-gradient-to-r from-blue-400 to-blue-600">
        <img
          //  src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg"
          src={coverPhoto}
          alt="Mr. Kiran S. Sawekar"
          className="absolute inset-0 w-full h-full object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 flex items-end">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden mr-6">
            <img
              // src="https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg"
              src={kiranImg}
              // <img src={pic1} alt="pic" />

              alt="Mr. Kiran S. Sawekar portrait"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Mr. Kiran S. Sawekar
            </h1>
            <p className="text-white/80 text-lg">Health Psychologist</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2/3 p-6">
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
            </div>
            <span className="ml-2 text-gray-600">5.0 (127 reviews)</span>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">About</h2>
            <p className="text-gray-600 leading-relaxed">
              Mr. Kiran Sawekar is a Health psychologist with over 15 years of
              experience helping clients overcome anxiety, depression, and
              relationship challenges. Mr. Sawekar specializes in cognitive
              behavioral therapy (CBT) and mindfulness-based approaches,
              creating a safe and supportive environment for personal growth and
              healing.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Specialties
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                Anxiety
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                Depression
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                Relationship Issues
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                Stress Management
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                Trauma
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                Grief & Loss
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Credentials
            </h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Award className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                <span className="text-gray-600">Msc., in Psychology</span>
              </li>
              <li className="flex items-start">
                <Award className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                <span className="text-gray-600">M.Phil</span>
              </li>
              {/* <li className="flex items-start">
                <Award className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                <span className="text-gray-600">Certified CBT Practitioner</span>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="w-full md:w-1/3 p-6 bg-gray-50">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Session Information
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Clock className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-gray-600">60 minute sessions</span>
              </li>
              <li className="flex items-center">
                <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-gray-600">Available Mon-Fri</span>
              </li>
              <li className="flex items-center">
                <MapPin className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-gray-600">
                  In-person sessions available
                </span>
              </li>
              <li className="flex items-center">
                <Video className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-gray-600">Video sessions available</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-gray-600">Phone sessions available</span>
              </li>
            </ul>
          </div>

          <Link
            to="/book"
            className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-md font-medium transition duration-150 ease-in-out transform hover:scale-105 mb-3"
          >
            Book an Appointment
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TherapistProfile;
