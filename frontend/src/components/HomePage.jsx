import React from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h2 className="text-2xl font-semibold mb-6">What do you prefer?</h2>
      <div className="space-y-4">
        <button
          onClick={() => navigate("/telemedicine")} // Replace with actual telemedicine route
          className="px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-green-600 mr-5"
        >
          Opt for Telemedicine
        </button>
        <button
          onClick={() => navigate("/consult-doc")} // Replace with actual doctor page route
          className="px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-green-600 ml-5"
        >
          Consult a Doctor
        </button>
      </div>
    </div>
  );
}

export default HomePage;
