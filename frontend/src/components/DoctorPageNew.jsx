import React, { useState, useEffect } from 'react';
import { getShortPoemResponse } from './path/to/genai'; // Import the summary function

// Global variables
let currentPatientDetails = ''; // Holds the details of the patient the doctor is viewing
let lastDoctorQuestion = ''; // Holds the last question or note posted by the doctor

function DoctorPage() {
  const [patientsData, setPatientsData] = useState([]);
  const [expandedPatientIndex, setExpandedPatientIndex] = useState(null);
  const [notes, setNotes] = useState({});
  const [genAiResponse, setGenAiResponse] = useState(''); // Holds the AI response
  const [consultations, setConsultations] = useState({}); // Holds consultation data for each patient
  const [summaries, setSummaries] = useState({}); // Holds summary data for each patient
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5001/api/health-data/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPatientsData(data);
        } else {
          console.error('Failed to fetch patients data');
        }
      } catch (error) {
        console.error('Error fetching patients data:', error);
      }
    };

    fetchData();
  }, []);

  const fetchConsultationData = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5001/api/consultations/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setConsultations((prev) => ({ ...prev, [userId]: data }));
      } else {
        console.error('Failed to fetch consultation data');
      }
    } catch (error) {
      console.error('Error fetching consultation data:', error);
    }
  };

  const handleToggle = (index) => {
    setExpandedPatientIndex(expandedPatientIndex === index ? null : index);
    const patient = patientsData[index];
    if (expandedPatientIndex !== index && patient) {
      currentPatientDetails = getPatientDetailsString(patient);
      fetchConsultationData(patient.userId); // Fetch consultations when expanding
      console.log('Current Patient Details:', currentPatientDetails);
    }
  };

  const handleNoteChange = (index, text) => {
    setNotes((prevNotes) => ({ ...prevNotes, [index]: text }));
  };

  const handleNoteSubmit = async (index) => {
    lastDoctorQuestion = notes[index] || '';
    const prompt = `${currentPatientDetails} ${lastDoctorQuestion}`;
    try {
      const response = await fetch('http://localhost:5001/api/genai/poem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setGenAiResponse(data.poem);
    } catch (error) {
      console.error('Error fetching AI response:', error);
    }
  };

  const handleGenerateSummary = async (userId, patient) => {
    setIsLoadingSummary(true);
    const consultationData = consultations[userId] || [];
    const prompt = createSummaryPrompt(patient, consultationData);

    try {
      const summary = await getShortPoemResponse(prompt);
      setSummaries((prev) => ({ ...prev, [userId]: summary }));
    } catch (error) {
      console.error("Error generating summary:", error);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const createSummaryPrompt = (patient, consultationData) => {
    const latestConsultation = consultationData[0];

    // Format the health data
    const healthData = `
      Name: ${patient.fullName || "N/A"}
      Age: ${calculateAge(new Date(patient.dateOfBirth)) || "N/A"}
      Gender: ${patient.gender || "N/A"}
      Blood Group: ${patient.basicHealthData?.bloodGroup || "N/A"}
      Chronic Conditions: ${patient.medicalHistory?.chronicConditions?.join(", ") || "N/A"}
      Known Allergies: ${patient.medicalHistory?.knownAllergies?.join(", ") || "N/A"}
      Medications Currently Taking: ${patient.medicalHistory?.medicationsCurrentlyTaking?.join(", ") || "N/A"}
    `;

    // Format the consultation data (questions and answers)
    const consultationDetails = `
      Patient Query: ${latestConsultation?.patientQuery || "N/A"}
      Responses:
      ${latestConsultation?.responses.map((resp, index) => `${index + 1}. ${resp.question} Answer: ${resp.answer}`).join('\n') || "No responses available."}
      Timestamp: ${latestConsultation ? new Date(latestConsultation.timestamp).toLocaleString() : "N/A"}
    `;

    // Combine health data and consultation details
    return `Summarize the following patient's health information and recent consultation:\n\nHealth Data:\n${healthData}\n\nConsultation Details:\n${consultationDetails}`;
  };

  const getPatientDetailsString = (patient) => {
    // Extract patient details based on your MongoDB schema
    const fullName = patient.fullName || 'N/A';
    const age = calculateAge(new Date(patient.dateOfBirth)) || 'N/A';
    const gender = patient.gender || 'N/A';
    const address = patient.address || 'N/A';
    const contactNumber = patient.contactNumber || 'N/A';
    const email = patient.email || 'N/A';
    const emergencyContactName = patient.emergencyContact?.name || 'N/A';
    const emergencyContactNumber = patient.emergencyContact?.number || 'N/A';
    const height = patient.basicHealthData?.height || 'N/A';
    const weight = patient.basicHealthData?.weight || 'N/A';
    const bloodGroup = patient.basicHealthData?.bloodGroup || 'N/A';
    const systolicBP = patient.basicHealthData?.bloodPressure?.systolic || 'N/A';
    const diastolicBP = patient.basicHealthData?.bloodPressure?.diastolic || 'N/A';
    const heartRate = patient.basicHealthData?.heartRate || 'N/A';

    return `Name: ${fullName}, Age: ${age}, Gender: ${gender}, Address: ${address}, Contact: ${contactNumber}, Email: ${email}, Emergency Contact: ${emergencyContactName} (${emergencyContactNumber}), Height: ${height} cm, Weight: ${weight} kg, Blood Group: ${bloodGroup}, Blood Pressure: ${systolicBP}/${diastolicBP} mmHg, Heart Rate: ${heartRate} bpm`;
  };

  const calculateAge = (dob) => {
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div>
      <h1 className='ml-5 mt-5 mb-5 text-4xl font-extrabold'>Doctor's Dashboard</h1>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {patientsData.map((patient, index) => (
          <li key={index} style={{ marginBottom: '1em' }}>
            <div
              onClick={() => handleToggle(index)}
              style={{
                cursor: 'pointer',
                backgroundColor: '#f0f0f0',
                padding: '10px',
                borderRadius: '5px',
                fontWeight: 'bold',
              }}
            >
              {patient.fullName}
            </div>

            {expandedPatientIndex === index && (
              <div style={{ marginTop: '10px', paddingLeft: '20px' }}>
                <p>{getPatientDetailsString(patient)}</p>

                {/* Medical History */}
                <h4>Medical History:</h4>
                <ul>
                  <li>Chronic Conditions: {patient.medicalHistory?.chronicConditions?.join(', ') || 'N/A'}</li>
                  <li>Previous Surgeries: {patient.medicalHistory?.previousSurgeries?.join(', ') || 'N/A'}</li>
                  <li>Known Allergies: {patient.medicalHistory?.knownAllergies?.join(', ') || 'N/A'}</li>
                  <li>Medications Currently Taking: {patient.medicalHistory?.medicationsCurrentlyTaking?.join(', ') || 'N/A'}</li>
                  <li>Family History: {patient.medicalHistory?.familyHistory?.join(', ') || 'N/A'}</li>
                </ul>

                {/* Display Lab Reports */}
                <h4>Lab Reports:</h4>
                <ul>
                  {patient.labReports && patient.labReports.length > 0 ? (
                    patient.labReports.map((report, idx) => (
                      <li key={idx}>
                        {`${new Date(report.date).toLocaleDateString()} - ${report.paramType}: ${report.value}`}
                      </li>
                    ))
                  ) : (
                    <p>No lab reports available.</p>
                  )}
                </ul>

                {/* Consultations */}
                {consultations[patient.userId] && (
                  <div style={{ marginTop: '15px' }}>
                    <h4>Consultations:</h4>
                    {consultations[patient.userId].map((consultation, idx) => (
                      <div key={idx} style={{ marginBottom: '10px' }}>
                        <strong>Patient Query:</strong> {consultation.patientQuery}
                        <ul>
                          {consultation.responses.map((response, resIdx) => (
                            <li key={resIdx}>
                              <strong>{response.question}</strong>: {response.answer}
                            </li>
                          ))}
                        </ul>
                        <p><strong>Timestamp:</strong> {new Date(consultation.timestamp).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Summary Button */}
                <button
                  onClick={() => handleGenerateSummary(patient.userId, patient)}
                  style={{
                    marginTop: '10px',
                    padding: '8px 12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                  disabled={isLoadingSummary}
                >
                  {isLoadingSummary ? "Generating Summary..." : "Generate Summary"}
                </button>

                {/* Display Summary */}
                {summaries[patient.userId] && (
                  <div style={{ marginTop: '10px', fontStyle: 'italic', color: 'gray' }}>
                    <strong>Summary:</strong> {summaries[patient.userId]}
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DoctorPage;
