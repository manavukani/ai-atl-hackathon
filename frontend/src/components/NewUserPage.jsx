import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NewUserPage() {
  const navigate=useNavigate();
  const [currentTab, setCurrentTab] = useState("demographics");
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    maritalStatus: "",
    address: "",
    contactNumber: "",
    email: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    occupation: "",
    physicalActivityLevel: "",
    dietaryPreferences: "",
    alcoholConsumption: "",
    smokingHabits: "",
    sleepPatterns: "",
    chronicConditions: "",
    previousSurgeries: "",
    knownAllergies: "",
    medicationsCurrentlyTaking: "",
    familyHistory: "",
    height: "",
    weight: "",
    bloodGroup: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    heartRate: "",
    chronicPain: "",
    recentSymptoms: "",
    recentWeightChange: "",
    appetiteLevel: "",
    healthGoals: "",
    preferredCommunicationChannel: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      console.log(token)
      await axios.post("http://localhost:5001/api/health-data", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Health data saved successfully!");
      setTimeout(() => {
        navigate("/home-page"); // Replace with your new page path
      }, 2000);
    } catch (error) {
      alert("Failed to save health data: " + error.message);
    }
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case "demographics":
        return renderDemographics();
      case "lifestyle":
        return renderLifestyle();
      case "medical":
        return renderMedical();
      case "health":
        return renderHealthData();
      case "symptoms":
        return renderSymptoms();
      case "goals":
        return renderGoals();
      default:
        return <div>Please select a category above.</div>;
    }
  };

  function renderDemographics() {
    return (
      <div className="space-y-4">
        {renderInputField("fullName", "Full Name")}
        {renderInputField("dateOfBirth", "Date of Birth", "date")}
        {renderSelectField("gender", "Gender", ["Male", "Female", "Other"])}
        {renderSelectField("maritalStatus", "Marital Status", ["Single", "Married", "Divorced", "Widowed", "Other"])}
        {renderInputField("address", "Address")}
        {renderInputField("contactNumber", "Contact Number", "tel")}
        {renderInputField("email", "Email", "email")}
        {renderInputField("emergencyContactName", "Emergency Contact Name")}
        {renderInputField("emergencyContactNumber", "Emergency Contact Number", "tel")}
      </div>
    );
  }

  function renderLifestyle() {
    return (
      <div className="space-y-4">
        {renderInputField("occupation", "Occupation")}
        {renderSelectField("physicalActivityLevel", "Physical Activity Level", ["Sedentary", "Lightly Active", "Moderately Active", "Very Active"])}
        {renderSelectField("dietaryPreferences", "Dietary Preferences", ["Vegetarian", "Non-Vegetarian", "Vegan", "Other"])}
        {renderInputField("sleepPatterns", "Sleep Patterns (hours per night)", "number")}
        {renderSelectField("smokingHabits", "Smoking Habits", ["Yes", "No", "Occasionally"])}
        {renderSelectField("alcoholConsumption", "Alcohol Consumption", ["Yes", "No", "Occasionally"])}
      </div>
    );
  }

  function renderMedical() {
    return (
      <div className="space-y-4">
        {renderTextArea("chronicConditions", "Chronic Conditions")}
        {renderTextArea("previousSurgeries", "Previous Surgeries")}
        {renderTextArea("knownAllergies", "Known Allergies")}
        {renderTextArea("medicationsCurrentlyTaking", "Current Medications")}
        {renderTextArea("familyHistory", "Family Medical History")}
      </div>
    );
  }

  function renderHealthData() {
    return (
      <div className="space-y-4">
        {renderInputField("height", "Height (cm)", "number")}
        {renderInputField("weight", "Weight (kg)", "number")}
        {renderSelectField("bloodGroup", "Blood Group", ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])}
        {renderInputField("bloodPressureSystolic", "Blood Pressure Systolic (mmHg)", "number")}
        {renderInputField("bloodPressureDiastolic", "Blood Pressure Diastolic (mmHg)", "number")}
        {renderInputField("heartRate", "Heart Rate (bpm)", "number")}
      </div>
    );
  }

  function renderSymptoms() {
    return (
      <div className="space-y-4">
        {renderSelectField("chronicPain", "Do you experience chronic pain?", ["Yes", "No"])}
        {renderTextArea("recentSymptoms", "Recent Symptoms")}
        {renderSelectField("recentWeightChange", "Recent Weight Change", ["Gain", "Loss", "No Change"])}
        {renderSelectField("appetiteLevel", "Appetite Level", ["Increased", "Decreased", "Normal"])}
      </div>
    );
  }

  function renderGoals() {
    return (
      <div className="space-y-4">
        {renderTextArea("healthGoals", "Health Goals")}
        {renderSelectField("preferredCommunicationChannel", "Preferred Communication Channel", ["Email", "Phone", "SMS", "App Notification"])}
      </div>
    );
  }

  function renderInputField(name, label, type = "text") {
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          type={type}
          name={name}
          id={name}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData[name]}
          onChange={handleChange}
          required
        />
      </div>
    );
  }

  function renderSelectField(name, label, options) {
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <select
          name={name}
          id={name}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData[name]}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    );
  }

  function renderTextArea(name, label) {
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <textarea
          name={name}
          id={name}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData[name]}
          onChange={handleChange}
          required
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900 text-center">Patient Health Information</h2>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="border-b border-gray-200">
              <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                {["demographics", "lifestyle", "medical", "health", "symptoms", "goals"].map(tab => (
                  <li className="mr-2" key={tab}>
                    <button
                      type="button"
                      className={`inline-block p-4 rounded-t-lg border-b-2 ${currentTab === tab ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300"}`}
                      onClick={() => setCurrentTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div id="myTabContent">
              {renderTabContent()}
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Health Data
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewUserPage;