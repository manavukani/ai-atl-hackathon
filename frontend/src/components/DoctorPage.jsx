import React, { useState, useEffect } from 'react';

// Global variables
let currentPatientDetails = ''; // Holds the details of the patient the doctor is viewing
let lastDoctorQuestion = ''; // Holds the last question or note posted by the doctor

function DoctorPage() {
  const [patientsData, setPatientsData] = useState([]);
  const [expandedPatientIndex, setExpandedPatientIndex] = useState(null);
  const [notes, setNotes] = useState({});
  const [genAiResponse, setGenAiResponse] = useState(''); // Holds the AI response

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

  const handleToggle = (index) => {
    setExpandedPatientIndex(expandedPatientIndex === index ? null : index);
    if (expandedPatientIndex !== index) {
      currentPatientDetails = getPatientDetailsString(patientsData[index]);
      console.log('Current Patient Details:', currentPatientDetails);
    }
  };

  const handleNoteChange = (index, text) => {
    setNotes((prevNotes) => ({ ...prevNotes, [index]: text }));
  };

  const handleNoteSubmit = async (index) => {
    console.log('Button clicked!');
    lastDoctorQuestion = notes[index] || '';
    console.log('Last Doctor Question:', lastDoctorQuestion);

    // Concatenate details and question to form the prompt
    const prompt = `${currentPatientDetails} ${lastDoctorQuestion}`;
    console.log('Generated Prompt:', prompt); // Debugging log

    // Call the backend API with the prompt and set the response in state
    try {
      const response = await fetch('http://localhost:5001/api/genai/poem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      console.log('AI Response:', data.poem); // Log for debugging
      setGenAiResponse(data.poem); // Store AI response
    } catch (error) {
      console.error('Error fetching AI response:', error); // Error handling log
    }
  };

  const getPatientDetailsString = (patient) => {
    // Extract patient details based on your MongoDB schema
    const fullName = patient.fullName || 'N/A';
    const age = calculateAge(new Date(patient.dateOfBirth)) || 'N/A';
    const gender = patient.gender || 'N/A';
    const address = patient.address || 'N/A';
    const contactNumber = patient.contactNumber || 'N/A';
    const email = patient.email || 'N/A';

    // Extract emergency contact details
    const emergencyContactName = patient.emergencyContact?.name || 'N/A';
    const emergencyContactNumber = patient.emergencyContact?.number || 'N/A';

    // Extract basic health data
    const height = patient.basicHealthData?.height || 'N/A';
    const weight = patient.basicHealthData?.weight || 'N/A';
    const bloodGroup = patient.basicHealthData?.bloodGroup || 'N/A';
    const systolicBP = patient.basicHealthData?.bloodPressure?.systolic || 'N/A';
    const diastolicBP = patient.basicHealthData?.bloodPressure?.diastolic || 'N/A';
    const heartRate = patient.basicHealthData?.heartRate || 'N/A';

    // Build the details string
    let details = `Name: ${fullName}, Age: ${age}, Gender: ${gender}, Address: ${address}, Contact: ${contactNumber}, Email: ${email}, Emergency Contact: ${emergencyContactName} (${emergencyContactNumber}), Height: ${height} cm, Weight: ${weight} kg, Blood Group: ${bloodGroup}, Blood Pressure: ${systolicBP}/${diastolicBP} mmHg, Heart Rate: ${heartRate} bpm`;

    return details;
  };

  // Helper function to calculate age from date of birth
  const calculateAge = (dob) => {
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div>
      <h1 className='ml-5 mt-5 mb-5 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-black'>Doctor's Dashboard</h1>
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

                {/* Display Medical History */}
                <h1 className='text-white rounded-md heading-1mb-4 text-4xl font-extrabold leading-none'>Medical History:</h1>
                <ul>
                  <li>
                    Chronic Conditions: {patient.medicalHistory?.chronicConditions?.join(', ') || 'N/A'}
                  </li>
                  <li>
                    Previous Surgeries: {patient.medicalHistory?.previousSurgeries?.join(', ') || 'N/A'}
                  </li>
                  <li>
                    Known Allergies: {patient.medicalHistory?.knownAllergies?.join(', ') || 'N/A'}
                  </li>
                  <li>
                    Medications Currently Taking: {patient.medicalHistory?.medicationsCurrentlyTaking?.join(', ') || 'N/A'}
                  </li>
                  <li>
                    Family History: {patient.medicalHistory?.familyHistory?.join(', ') || 'N/A'}
                  </li>
                </ul>

                {/* Display Recent Health Symptoms */}
                <h4>Recent Health Symptoms:</h4>
                <ul>
                  <li>Chronic Pain: {patient.recentHealthSymptoms?.chronicPain || 'N/A'}</li>
                  <li>
                    Symptoms: {patient.recentHealthSymptoms?.symptoms?.join(', ') || 'N/A'}
                  </li>
                  <li>
                    Weight Change: {patient.recentHealthSymptoms?.weightChange || 'N/A'}
                  </li>
                  <li>
                    Appetite Level: {patient.recentHealthSymptoms?.appetiteLevel || 'N/A'}
                  </li>
                </ul>

                {/* Display Lab Reports */}
                {patient.labReports && patient.labReports.length > 0 ? (
                  <div>
                    <h4>Lab Reports:</h4>
                    <ul style={{ paddingLeft: '15px' }}>
                      {patient.labReports.map((report, idx) => (
                        <li key={idx}>
                          {`${new Date(report.date).toLocaleDateString()} - ${report.paramType}: ${report.value}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No lab reports available.</p>
                )}

                {/* Doctor's note section */}
                <div style={{ marginTop: '15px' }}>
                  <h4>Ask your question:</h4>
                  <textarea
                    value={notes[index] || ''}
                    onChange={(e) => handleNoteChange(index, e.target.value)}
                    rows="3"
                    placeholder="Type your questions here..."
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      resize: 'none',
                    }}
                  />
                  <button
                    onClick={() => handleNoteSubmit(index)}
                    style={{
                      marginTop: '10px',
                      padding: '8px 12px',
                      backgroundColor: '#5cb85c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Send
                  </button>

                  {/* Display AI Response below the note */}
                  {genAiResponse && (
                    <div style={{ marginTop: '15px', fontStyle: 'italic', color: 'gray' }}>
                      <strong>AI Response:</strong> {genAiResponse}
                    </div>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DoctorPage;




// // src/components/DoctorPage.js
// import React, { useState, useEffect } from 'react';

// function DoctorPage() {
//   const [patientsData, setPatientsData] = useState([]);

//   useEffect(() => {
//     // Fetch all health data for all users
//     const fetchData = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const response = await fetch('http://localhost:5001/api/health-data/all', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setPatientsData(data);
//         } else {
//           console.error('Failed to fetch patients data');
//         }
//       } catch (error) {
//         console.error('Error fetching patients data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       <h1>Doctor's Dashboard</h1>
//       {patientsData.map((patient, index) => (
//         <div key={index}>
//           <h3>{patient.username}</h3>
//           <p>Age: {patient.age}</p>
//           <p>Blood Pressure: {patient.bloodPressure}</p>
//           <p>Diabetes: {patient.diabetes}</p>
//           {patient.diabetes === 'yes' && <p>Diabetes Type: {patient.diabetesType}</p>}
//           <h4>Lab Reports:</h4>
//           <ul>
//             {patient.labReports.map((report, idx) => (
//               <li key={idx}>
//                 {report.date.split('T')[0]} - {report.paramType}: {report.value}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default DoctorPage;
// ------------------------------------------------------------------------------------------------------------------------------
// import React, { useState, useEffect } from 'react';

// function DoctorPage() {
//   const [patientsData, setPatientsData] = useState([]);
//   const [expandedPatientIndex, setExpandedPatientIndex] = useState(null); // State to track expanded entry

//   useEffect(() => {
//     // Fetch all health data for all users
//     const fetchData = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const response = await fetch('http://localhost:5001/api/health-data/all', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setPatientsData(data);
//         } else {
//           console.error('Failed to fetch patients data');
//         }
//       } catch (error) {
//         console.error('Error fetching patients data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   // Toggle visibility of patient data
//   const handleToggle = (index) => {
//     setExpandedPatientIndex(expandedPatientIndex === index ? null : index);
//   };

//   return (
//     <div>
//       <h1>Doctor's Dashboard</h1>
//       <ul style={{ listStyleType: 'none', padding: 0 }}>
//         {patientsData.map((patient, index) => (
//           <li key={index} style={{ marginBottom: '1em' }}>
//             <div 
//               onClick={() => handleToggle(index)} 
//               style={{
//                 cursor: 'pointer', 
//                 backgroundColor: '#f0f0f0', 
//                 padding: '10px', 
//                 borderRadius: '5px',
//                 fontWeight: 'bold'
//               }}
//             >
//               {patient.username}
//             </div>

//             {expandedPatientIndex === index && (
//               <div style={{ marginTop: '10px', paddingLeft: '20px' }}>
//                 <p><strong>Age:</strong> {patient.age}</p>
//                 <p><strong>Blood Pressure:</strong> {patient.bloodPressure}</p>
//                 <p><strong>Diabetes:</strong> {patient.diabetes}</p>
//                 {patient.diabetes === 'yes' && (
//                   <p><strong>Diabetes Type:</strong> {patient.diabetesType}</p>
//                 )}
                
//                 <h4>Lab Reports:</h4>
//                 <ul style={{ paddingLeft: '15px' }}>
//                   {patient.labReports.map((report, idx) => (
//                     <li key={idx}>
//                       <strong>{report.date.split('T')[0]}</strong> - {report.paramType}: {report.value}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default DoctorPage;


// import React, { useState, useEffect } from 'react';

// // Global variables
// let currentPatientDetails = "";  // Holds the details of the patient the doctor is viewing
// let lastDoctorQuestion = "";     // Holds the last question or note posted by the doctor

// function DoctorPage() {
//   const [patientsData, setPatientsData] = useState([]);
//   const [expandedPatientIndex, setExpandedPatientIndex] = useState(null);
//   const [notes, setNotes] = useState({});
//   const [genAiResponse, setGenAiResponse] = useState(""); // Holds the AI response

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const response = await fetch('http://localhost:5001/api/health-data/all', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setPatientsData(data);
//         } else {
//           console.error('Failed to fetch patients data');
//         }
//       } catch (error) {
//         console.error('Error fetching patients data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleToggle = (index) => {
//     setExpandedPatientIndex(expandedPatientIndex === index ? null : index);
//     if (expandedPatientIndex !== index) {
//       currentPatientDetails = getPatientDetailsString(patientsData[index]);
//       console.log("Current Patient Details:", currentPatientDetails);
//     }
//   };

//   const handleNoteChange = (index, text) => {
//     setNotes((prevNotes) => ({ ...prevNotes, [index]: text }));
//   };

//   const handleNoteSubmit = async (index) => {
//     console.log("Button clicked!")
//     lastDoctorQuestion = notes[index] || ""; 
//     console.log("Last Doctor Question:", lastDoctorQuestion); 

//     // Concatenate details and question to form the prompt
//     const prompt = `${currentPatientDetails} ${lastDoctorQuestion}`;
//     console.log("Generated Prompt:", prompt); // Debugging log


    
//     // Call the backend API with the prompt and set the response in state
//     try {
//       const response = await fetch('http://localhost:5001/api/genai/poem', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ prompt }),
//       });

//       const data = await response.json();
//       console.log("AI Response:", data.poem); // Log for debugging
//       setGenAiResponse(data.poem); // Store AI response
//     } catch (error) {
//       console.error("Error fetching AI response:", error); // Error handling log
//     }
//   };

//   const getPatientDetailsString = (patient) => {
//     let details = `Age: ${patient.age}, Blood Pressure: ${patient.bloodPressure}, Diabetes: ${patient.diabetes}`;
//     if (patient.diabetes === 'yes' && patient.diabetesType) {
//       details += `, Diabetes Type: ${patient.diabetesType}`;
//     }
//     return details;
//   };

//   return (
//     <div>
//       <h1>Doctor's Dashboard</h1>
//       <ul style={{ listStyleType: 'none', padding: 0 }}>
//         {patientsData.map((patient, index) => (
//           <li key={index} style={{ marginBottom: '1em' }}>
//             <div
//               onClick={() => handleToggle(index)}
//               style={{
//                 cursor: 'pointer',
//                 backgroundColor: '#f0f0f0',
//                 padding: '10px',
//                 borderRadius: '5px',
//                 fontWeight: 'bold',
//               }}
//             >
//               {patient.username}
//             </div>

//             {expandedPatientIndex === index && (
//               <div style={{ marginTop: '10px', paddingLeft: '20px' }}>
//                 <p>{getPatientDetailsString(patient)}</p>

//                 <h4>Lab Reports:</h4>
//                 <ul style={{ paddingLeft: '15px' }}>
//                   {patient.labReports.map((report, idx) => (
//                     <li key={idx}>
//                       {`${report.date.split('T')[0]} - ${report.paramType}: ${report.value}`}
//                     </li>
//                   ))}
//                 </ul>

//                 {/* Doctor's note section */}
//                 <div style={{ marginTop: '15px' }}>
//                   <h4>Add Notes:</h4>
//                   <textarea
//                     value={notes[index] || ''}
//                     onChange={(e) => handleNoteChange(index, e.target.value)}
//                     rows="3"
//                     placeholder="Type your observations or notes here..."
//                     style={{
//                       width: '100%',
//                       padding: '10px',
//                       borderRadius: '5px',
//                       border: '1px solid #ddd',
//                       resize: 'none',
//                     }}
//                   />
//                   <button
//                     onClick={() => handleNoteSubmit(index)}
//                     style={{
//                       marginTop: '10px',
//                       padding: '8px 12px',
//                       backgroundColor: '#5cb85c',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '5px',
//                       cursor: 'pointer',
//                     }}
//                   >
//                     Save Note
//                   </button>

//                   {/* Display AI Response below the note */}
//                   {genAiResponse && (
//                     <div style={{ marginTop: '15px', fontStyle: 'italic', color: 'gray' }}>
//                       <strong>AI Response:</strong> {genAiResponse}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default DoctorPage;