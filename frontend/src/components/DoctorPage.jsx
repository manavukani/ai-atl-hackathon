// import React, { useState, useEffect } from 'react';

// // Global variables
// let currentPatientDetails = ''; // Holds the details of the patient the doctor is viewing
// let lastDoctorQuestion = ''; // Holds the last question or note posted by the doctor

// function DoctorPage() {
//   const [patientsData, setPatientsData] = useState([]);
//   const [expandedPatientIndex, setExpandedPatientIndex] = useState(null);
//   const [notes, setNotes] = useState({});
//   const [genAiResponse, setGenAiResponse] = useState(''); // Holds the AI response
//   const [consultations, setConsultations] = useState({}); // Holds consultation data for each patient

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
//   const fetchConsultationData = async (userId) => {
//     const token = localStorage.getItem('token'); // Add token retrieval here
//     try {
//       const response = await fetch(`http://localhost:5001/api/consultations/${userId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`, // Add Authorization header
//         },
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setConsultations((prev) => ({ ...prev, [userId]: data }));
//       } else {
//         console.error('Failed to fetch consultation data');
//       }
//     } catch (error) {
//       console.error('Error fetching consultation data:', error);
//     }
//   };
  

//   // const fetchConsultationData = async (userId) => {
//   //   console.log("In here!")
//   //   try {
//   //     const response = await fetch(`http://localhost:5001/api/consultations/${userId}`);
//   //     if (response.ok) {
//   //       const data = await response.json();
//   //       setConsultations((prev) => ({ ...prev, [userId]: data }));
//   //     } else {
//   //       console.error('Failed to fetch consultation data');
//   //     }
//   //   } catch (error) {
//   //     console.error('Error fetching consultation data:', error);
//   //   }
//   // };

//   const handleToggle = (index) => {
//     setExpandedPatientIndex(expandedPatientIndex === index ? null : index);
//     const patient = patientsData[index];
//     if (expandedPatientIndex !== index && patient) {
//       currentPatientDetails = getPatientDetailsString(patient);
//       fetchConsultationData(patient.userId); // Fetch consultations when expanding
//       console.log('Current Patient Details:', currentPatientDetails);
//     }
//   };

//   const handleNoteChange = (index, text) => {
//     setNotes((prevNotes) => ({ ...prevNotes, [index]: text }));
//   };

//   const handleNoteSubmit = async (index) => {
//     lastDoctorQuestion = notes[index] || '';
//     const prompt = `${currentPatientDetails} ${lastDoctorQuestion}`;
//     try {
//       const response = await fetch('http://localhost:5001/api/genai/poem', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ prompt }),
//       });
//       const data = await response.json();
//       setGenAiResponse(data.poem);
//     } catch (error) {
//       console.error('Error fetching AI response:', error);
//     }
//   };

//   const getPatientDetailsString = (patient) => {
//     // Extract patient details based on your MongoDB schema
//     const fullName = patient.fullName || 'N/A';
//     const age = calculateAge(new Date(patient.dateOfBirth)) || 'N/A';
//     const gender = patient.gender || 'N/A';
//     const address = patient.address || 'N/A';
//     const contactNumber = patient.contactNumber || 'N/A';
//     const email = patient.email || 'N/A';
//     const emergencyContactName = patient.emergencyContact?.name || 'N/A';
//     const emergencyContactNumber = patient.emergencyContact?.number || 'N/A';
//     const height = patient.basicHealthData?.height || 'N/A';
//     const weight = patient.basicHealthData?.weight || 'N/A';
//     const bloodGroup = patient.basicHealthData?.bloodGroup || 'N/A';
//     const systolicBP = patient.basicHealthData?.bloodPressure?.systolic || 'N/A';
//     const diastolicBP = patient.basicHealthData?.bloodPressure?.diastolic || 'N/A';
//     const heartRate = patient.basicHealthData?.heartRate || 'N/A';

//     return `Name: ${fullName}, Age: ${age}, Gender: ${gender}, Address: ${address}, Contact: ${contactNumber}, Email: ${email}, Emergency Contact: ${emergencyContactName} (${emergencyContactNumber}), Height: ${height} cm, Weight: ${weight} kg, Blood Group: ${bloodGroup}, Blood Pressure: ${systolicBP}/${diastolicBP} mmHg, Heart Rate: ${heartRate} bpm`;
//   };

//   const calculateAge = (dob) => {
//     const diffMs = Date.now() - dob.getTime();
//     const ageDate = new Date(diffMs);
//     return Math.abs(ageDate.getUTCFullYear() - 1970);
//   };

//   return (
//     <div>
//       <h1 className='ml-5 mt-5 mb-5 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-black'>Doctor's Dashboard</h1>
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
//               {patient.fullName}
//             </div>

//             {expandedPatientIndex === index && (
//               <div style={{ marginTop: '10px', paddingLeft: '20px' }}>
//                 <p>{getPatientDetailsString(patient)}</p>

//                 {/* Medical History */}
//                 <h4>Medical History:</h4>
//                 <ul>
//                   <li>Chronic Conditions: {patient.medicalHistory?.chronicConditions?.join(', ') || 'N/A'}</li>
//                   <li>Previous Surgeries: {patient.medicalHistory?.previousSurgeries?.join(', ') || 'N/A'}</li>
//                   <li>Known Allergies: {patient.medicalHistory?.knownAllergies?.join(', ') || 'N/A'}</li>
//                   <li>Medications Currently Taking: {patient.medicalHistory?.medicationsCurrentlyTaking?.join(', ') || 'N/A'}</li>
//                   <li>Family History: {patient.medicalHistory?.familyHistory?.join(', ') || 'N/A'}</li>
//                 </ul>

//                 {/* Display Lab Reports */}
//                 <h4>Lab Reports:</h4>
//                 <ul>
//                   {patient.labReports && patient.labReports.length > 0 ? (
//                     patient.labReports.map((report, idx) => (
//                       <li key={idx}>
//                         {`${new Date(report.date).toLocaleDateString()} - ${report.paramType}: ${report.value}`}
//                       </li>
//                     ))
//                   ) : (
//                     <p>No lab reports available.</p>
//                   )}
//                 </ul>

//                 {/* Consultations */}
//                 {consultations[patient.userId] && (
//                   <div style={{ marginTop: '15px' }}>
//                     <h4>Consultations:</h4>
//                     {consultations[patient.userId].map((consultation, idx) => (
//                       <div key={idx} style={{ marginBottom: '10px' }}>
//                         <strong>Patient Query:</strong> {consultation.patientQuery}
//                         <ul>
//                           {consultation.responses.map((response, resIdx) => (
//                             <li key={resIdx}>
//                               <strong>{response.question}</strong>: {response.answer}
//                             </li>
//                           ))}
//                         </ul>
//                         <p><strong>Timestamp:</strong> {new Date(consultation.timestamp).toLocaleString()}</p>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* Doctor's Note */}
//                 <div style={{ marginTop: '15px' }}>
//                   <h4>Ask your question:</h4>
//                   <textarea
//                     value={notes[index] || ''}
//                     onChange={(e) => handleNoteChange(index, e.target.value)}
//                     rows="3"
//                     placeholder="Type your questions here..."
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
//                     Send
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
// import React, { useState, useEffect } from 'react';

// function DoctorPage() {
//   const [patientsData, setPatientsData] = useState([]);
//   const [expandedPatientIndex, setExpandedPatientIndex] = useState(null);
//   const [genAiResponse, setGenAiResponse] = useState('');
//   const [consultations, setConsultations] = useState({});
//   const [summaries, setSummaries] = useState({});
//   const [isLoadingSummary, setIsLoadingSummary] = useState(false);

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

//   const fetchConsultationData = async (userId) => {
//     const token = localStorage.getItem('token');
//     try {
//       const response = await fetch(`http://localhost:5001/api/consultations/${userId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setConsultations((prev) => ({ ...prev, [userId]: data }));
//       } else {
//         console.error('Failed to fetch consultation data');
//       }
//     } catch (error) {
//       console.error('Error fetching consultation data:', error);
//     }
//   };

//   const handleToggle = (index) => {
//     setExpandedPatientIndex(expandedPatientIndex === index ? null : index);
//     const patient = patientsData[index];
//     if (expandedPatientIndex !== index && patient) {
//       fetchConsultationData(patient.userId); // Fetch consultations when expanding
//     }
//   };

//   const handleGenerateSummary = async (userId, patient) => {
//     setIsLoadingSummary(true);
//     const consultationData = consultations[userId] || [];
//     const prompt = createSummaryPrompt(patient, consultationData);

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error("Authentication token not found");
//       }

//       const response = await fetch("http://localhost:5001/api/genai/poem", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ prompt: prompt }),
//       });

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const data = await response.json();

//       // The response may be in data.poem
//       let summary = data.poem;

//       // Save the summary
//       setSummaries((prev) => ({ ...prev, [userId]: summary }));

//     } catch (error) {
//       console.error("Error generating summary:", error);
//       alert("Failed to generate summary");
//     } finally {
//       setIsLoadingSummary(false);
//     }
//   };

//   const createSummaryPrompt = (patient, consultationData) => {
//     const latestConsultation = consultationData[0] || {};

//     // Format the health data
//     const healthData = `
//       Name: ${patient.fullName || "N/A"}
//       Age: ${calculateAge(new Date(patient.dateOfBirth)) || "N/A"}
//       Gender: ${patient.gender || "N/A"}
//       Blood Group: ${patient.basicHealthData?.bloodGroup || "N/A"}
//       Chronic Conditions: ${patient.medicalHistory?.chronicConditions?.join(", ") || "N/A"}
//       Known Allergies: ${patient.medicalHistory?.knownAllergies?.join(", ") || "N/A"}
//       Medications Currently Taking: ${patient.medicalHistory?.medicationsCurrentlyTaking?.join(", ") || "N/A"}
//     `;

//     // Format the consultation data (questions and answers)
//     const consultationDetails = latestConsultation ? `
//       Patient Query: ${latestConsultation.patientQuery || "N/A"}
//       Responses:
//       ${latestConsultation.responses?.map((resp, index) => `${index + 1}. ${resp.question} Answer: ${resp.answer}`).join('\n') || "No responses available."}
//       Timestamp: ${latestConsultation.timestamp ? new Date(latestConsultation.timestamp).toLocaleString() : "N/A"}
//     ` : "No consultation data available.";

//     // Combine health data and consultation details
//     return `Summarize the following patient's health information and recent consultation:\n\nHealth Data:\n${healthData}\n\nConsultation Details:\n${consultationDetails}`;
//   };

//   const calculateAge = (dob) => {
//     const diffMs = Date.now() - dob.getTime();
//     const ageDate = new Date(diffMs);
//     return Math.abs(ageDate.getUTCFullYear() - 1970);
//   };

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Doctor's Dashboard</h1>

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
//               {patient.fullName}
//             </div>

//             {expandedPatientIndex === index && (
//               <div style={{ marginTop: '10px', paddingLeft: '20px' }}>
//                 <p>{`Name: ${patient.fullName || 'N/A'}, Age: ${calculateAge(new Date(patient.dateOfBirth)) || 'N/A'}, Gender: ${patient.gender || 'N/A'}`}</p>
//                 <h4>Medical History:</h4>
//                 <ul>
//                   <li>Chronic Conditions: {patient.medicalHistory?.chronicConditions?.join(', ') || 'N/A'}</li>
//                   <li>Previous Surgeries: {patient.medicalHistory?.previousSurgeries?.join(', ') || 'N/A'}</li>
//                   <li>Known Allergies: {patient.medicalHistory?.knownAllergies?.join(', ') || 'N/A'}</li>
//                   <li>Medications Currently Taking: {patient.medicalHistory?.medicationsCurrentlyTaking?.join(', ') || 'N/A'}</li>
//                 </ul>

//                 {/* Display Lab Reports */}
//                 <h4>Lab Reports:</h4>
//                 <ul>
//                   {patient.labReports && patient.labReports.length > 0 ? (
//                     patient.labReports.map((report, idx) => (
//                       <li key={idx}>
//                         {`${new Date(report.date).toLocaleDateString()} - ${report.paramType}: ${report.value}`}
//                       </li>
//                     ))
//                   ) : (
//                     <p>No lab reports available.</p>
//                   )}
//                 </ul>

//                 {/* Consultations */}
//                 {consultations[patient.userId] && (
//                   <div style={{ marginTop: '15px' }}>
//                     <h4>Consultations:</h4>
//                     {consultations[patient.userId].map((consultation, idx) => (
//                       <div key={idx} style={{ marginBottom: '10px' }}>
//                         <strong>Patient Query:</strong> {consultation.patientQuery}
//                         <ul>
//                           {consultation.responses.map((response, resIdx) => (
//                             <li key={resIdx}>
//                               <strong>{response.question}</strong>: {response.answer}
//                             </li>
//                           ))}
//                         </ul>
//                         <p><strong>Timestamp:</strong> {new Date(consultation.timestamp).toLocaleString()}</p>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* Summary Button */}
//                 <button
//                   onClick={() => handleGenerateSummary(patient.userId, patient)}
//                   style={{
//                     marginTop: '10px',
//                     padding: '8px 12px',
//                     backgroundColor: '#007bff',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '5px',
//                     cursor: 'pointer',
//                   }}
//                   disabled={isLoadingSummary}
//                 >
//                   {isLoadingSummary ? "Generating Summary..." : "Generate Summary"}
//                 </button>

//                 {/* Display Summary */}
//                 {summaries[patient.userId] && (
//                   <div style={{ marginTop: '10px', fontStyle: 'italic', color: 'gray' }}>
//                     <strong>Summary:</strong> {summaries[patient.userId]}
//                   </div>
//                 )}
//               </div>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default DoctorPage;


import React, { useState, useEffect } from 'react';

function DoctorPage() {
  const [patientsData, setPatientsData] = useState([]);
  const [expandedPatientIndex, setExpandedPatientIndex] = useState(null);
  const [consultations, setConsultations] = useState({});
  const [summaries, setSummaries] = useState({});
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [notes, setNotes] = useState({});
  const [genAiResponse, setGenAiResponse] = useState({});
  const [isLoadingAIResponse, setIsLoadingAIResponse] = useState({});

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
      fetchConsultationData(patient.userId); // Fetch consultations when expanding
    }
  };

  const handleGenerateSummary = async (userId, patient) => {
    setIsLoadingSummary(true);
    const consultationData = consultations[userId] || [];
    const prompt = createSummaryPrompt(patient, consultationData);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch("http://localhost:5001/api/genai/poem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // The response may be in data.poem
      let summary = data.poem;

      // Save the summary
      setSummaries((prev) => ({ ...prev, [userId]: summary }));

    } catch (error) {
      console.error("Error generating summary:", error);
      alert("Failed to generate summary");
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const createSummaryPrompt = (patient, consultationData) => {
    const latestConsultation = consultationData[0] || {};

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
    const consultationDetails = latestConsultation ? `
      Patient Query: ${latestConsultation.patientQuery || "N/A"}
      Responses:
      ${latestConsultation.responses?.map((resp, index) => `${index + 1}. ${resp.question} Answer: ${resp.answer}`).join('\n') || "No responses available."}
      Timestamp: ${latestConsultation.timestamp ? new Date(latestConsultation.timestamp).toLocaleString() : "N/A"}
    ` : "No consultation data available.";

    // Combine health data and consultation details
    return `Summarize the following patient's health information and recent consultation:\n\nHealth Data:\n${healthData}\n\nConsultation Details:\n${consultationDetails}`;
  };

  const handleNoteChange = (userId, value) => {
    setNotes((prev) => ({ ...prev, [userId]: value }));
  };

  const handleSubmitNote = async (userId) => {
    const note = notes[userId];
    if (!note) {
      alert("Please enter a note before submitting.");
      return;
    }

    // Set loading state for this userId
    setIsLoadingAIResponse((prev) => ({ ...prev, [userId]: true }));

    const prompt = `As a doctor, here's my note: ${note}\nProvide a brief AI-generated response.`;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch("http://localhost:5001/api/genai/poem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      let aiResponse = data.poem;

      setGenAiResponse((prev) => ({ ...prev, [userId]: aiResponse }));

    } catch (error) {
      console.error("Error generating AI response:", error);
      alert("Failed to generate AI response");
    } finally {
      // Clear loading state for this userId
      setIsLoadingAIResponse((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const calculateAge = (dob) => {
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Doctor's Dashboard</h1>

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
                <p>{`Name: ${patient.fullName || 'N/A'}, Age: ${calculateAge(new Date(patient.dateOfBirth)) || 'N/A'}, Gender: ${patient.gender || 'N/A'}`}</p>
                <h4>Medical History:</h4>
                <ul>
                  <li>Chronic Conditions: {patient.medicalHistory?.chronicConditions?.join(', ') || 'N/A'}</li>
                  <li>Previous Surgeries: {patient.medicalHistory?.previousSurgeries?.join(', ') || 'N/A'}</li>
                  <li>Known Allergies: {patient.medicalHistory?.knownAllergies?.join(', ') || 'N/A'}</li>
                  <li>Medications Currently Taking: {patient.medicalHistory?.medicationsCurrentlyTaking?.join(', ') || 'N/A'}</li>
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

                {/* Doctor's Note */}
                <div style={{ marginTop: '15px' }}>
                  <h4>Doctor's Note:</h4>
                  <textarea
                    value={notes[patient.userId] || ''}
                    onChange={(e) => handleNoteChange(patient.userId, e.target.value)}
                    placeholder="Enter your note here..."
                    rows="4"
                    style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                  />

                  <button
                    onClick={() => handleSubmitNote(patient.userId)}
                    style={{
                      marginTop: '10px',
                      padding: '8px 12px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                    disabled={isLoadingAIResponse[patient.userId]}
                  >
                    {isLoadingAIResponse[patient.userId] ? "Submitting Note..." : "Submit Note"}
                  </button>

                  {/* Display AI Response below the note */}
                  {genAiResponse[patient.userId] && (
                    <div style={{ marginTop: '15px', fontStyle: 'italic', color: 'gray' }}>
                      <strong>AI Response:</strong> {genAiResponse[patient.userId]}
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
