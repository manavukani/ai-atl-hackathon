// import React, { useState } from "react";

// const ConsultationPage = () => {
//   const [userInput, setUserInput] = useState("");
//   const [aiQuestions, setAiQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [error, setError] = useState("");
//   const [isAnswersSubmitted, setIsAnswersSubmitted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleInputChange = (event) => {
//     setUserInput(event.target.value);
//   };

//   const handleAnswerChange = (questionIndex, answer) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [questionIndex]: answer,
//     }));
//   };

//   const handleSubmit = async () => {
//     if (!userInput.trim()) {
//       alert("Please enter your description");
//       return;
//     }

//     setIsSubmitted(true);
//     setError("");
//     setAnswers({});
//     setIsAnswersSubmitted(false);
//     setIsLoading(true);

//     const finalInput = `This is how the patient is feeling right now, help me ask 3 questions to them. GIVE ME JUST 3 QUESTIONS NOTHING: ${userInput}`;

//     try {
//       console.log(localStorage.getItem("token"))
//       const response = await fetch("http://localhost:5001/api/genai/poem", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({ prompt: finalInput }),
//       });

//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }

//       const data = await response.json();

//       let questions = [];
//       if (Array.isArray(data.poem)) {
//         questions = data.poem;
//       } else if (typeof data.poem === "string") {
//         try {
//           questions = JSON.parse(data.poem);
//         } catch {
//           questions = data.poem.split("\n").filter((q) => q.trim());
//         }
//       } else if (data.poem && typeof data.poem === "object") {
//         questions = Object.values(data.poem);
//       }

//       setAiQuestions(questions);
//     } catch (error) {
//       console.error("Error fetching AI questions:", error);
//       setError("Failed to generate questions. Please try again.");
//       setIsSubmitted(false);
//       alert("Failed to generate questions");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAnswersSubmit = async () => {
//     // Check if all questions are answered
//     const unansweredQuestions = aiQuestions.some(
//       (_, index) => !answers[index]?.trim()
//     );
//     if (unansweredQuestions) {
//       alert("Please answer all questions before submitting");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const questionsAndAnswers = aiQuestions.map((question, index) => ({
//         question,
//         answer: answers[index] || "",
//       }));

//       const jsonOutput = {
//         patientQuery: userInput,
//         responses: questionsAndAnswers,
//         timestamp: new Date(),
//       };






//       // Log the data being sent
//       console.log(
//         "Sending consultation data:",
//         JSON.stringify(jsonOutput, null, 2)
//       );
      


//       // Make API call to save the consultation data'

//       const response = await fetch('http://localhost:5001/api/consultation', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: JSON.stringify(jsonOutput),
//       });
      
//       console.log(response);
      

//       if (!response.ok) {
//         throw new Error("Failed to save consultation data");
//       }
//       const savedData = await response.json();
//       console.log("Consultation saved successfully:", savedData);
//       alert("Consultation saved successfully");
//       setIsAnswersSubmitted(true);
//     } catch (error) {
//       console.error("Error saving consultation:", error);
//       setError("Failed to save consultation. Please try again.");
//       alert("Failed to save consultation");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const startOver = () => {
//     setIsSubmitted(false);
//     setUserInput("");
//     setAiQuestions([]);
//     setAnswers({});
//     setIsAnswersSubmitted(false);
//     setError("");
//     setIsLoading(false);
//   };

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Consultation Chat</h1>

//       {error && (
//         <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-md">
//           {error}
//         </div>
//       )}

//       {!isSubmitted ? (
//         <div className="space-y-4">
//           <p className="text-gray-700">
//             Please describe the problem you are facing:
//           </p>
//           <textarea
//             value={userInput}
//             onChange={handleInputChange}
//             rows="4"
//             className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             placeholder="Enter your description here..."
//             disabled={isLoading}
//           />
//           <button
//             onClick={handleSubmit}
//             className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed ${
//               isLoading ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//             disabled={isLoading}
//           >
//             {isLoading ? "Processing..." : "Submit"}
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           <p className="font-medium text-gray-700">
//             Here are some questions based on your description:
//           </p>
//           {aiQuestions.length > 0 ? (
//             <div className="space-y-4">
//               {aiQuestions.map((question, index) => (
//                 <div key={index} className="space-y-2">
//                   <p className="text-gray-700">{question}</p>
//                   <textarea
//                     value={answers[index] || ""}
//                     onChange={(e) => handleAnswerChange(index, e.target.value)}
//                     rows="2"
//                     className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Enter your answer here..."
//                     disabled={isAnswersSubmitted || isLoading}
//                   />
//                 </div>
//               ))}

//               {!isAnswersSubmitted ? (
//                 <div className="flex space-x-4">
//                   <button
//                     onClick={handleAnswersSubmit}
//                     className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed ${
//                       isLoading ? "opacity-50 cursor-not-allowed" : ""
//                     }`}
//                     disabled={isLoading}
//                   >
//                     {isLoading ? "Saving..." : "Submit Answers"}
//                   </button>
//                   <button
//                     onClick={startOver}
//                     className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
//                     disabled={isLoading}
//                   >
//                     Start Over
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   <p className="text-green-600 font-medium">
//                     Thank you for your responses! Your consultation has been
//                     saved.
//                   </p>
//                   <button
//                     onClick={startOver}
//                     className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                   >
//                     Start New Consultation
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="flex items-center justify-center p-4">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//               <span className="ml-2">Loading questions...</span>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ConsultationPage;
import React, { useState } from "react";

const ConsultationPage = () => {
  const [userInput, setUserInput] = useState("");
  const [aiQuestions, setAiQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isAnswersSubmitted, setIsAnswersSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      alert("Please enter your description");
      return;
    }

    setIsSubmitted(true);
    setError("");
    setAnswers({});
    setIsAnswersSubmitted(false);
    setIsLoading(true);

    const finalInput = `This is how the patient is feeling right now, help me ask 3 questions to them. GIVE ME JUST 3 QUESTIONS NOTHING: ${userInput}`;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch("http://localhost:5001/api/genai/poem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: finalInput }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      let questions = [];
      if (Array.isArray(data.poem)) {
        questions = data.poem;
      } else if (typeof data.poem === "string") {
        try {
          questions = JSON.parse(data.poem);
        } catch {
          questions = data.poem.split("\n").filter((q) => q.trim());
        }
      } else if (data.poem && typeof data.poem === "object") {
        questions = Object.values(data.poem);
      }

      setAiQuestions(questions);
    } catch (error) {
      console.error("Error fetching AI questions:", error);
      setError("Failed to generate questions. Please try again.");
      setIsSubmitted(false);
      alert("Failed to generate questions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswersSubmit = async () => {
    // Check if all questions are answered
    const unansweredQuestions = aiQuestions.some(
      (_, index) => !answers[index]?.trim()
    );
    if (unansweredQuestions) {
      alert("Please answer all questions before submitting");
      return;
    }

    setIsLoading(true);
    try {
      // Format the data according to the MongoDB schema
      const formattedResponses = aiQuestions.map((question, index) => ({
        question: question,
        answer: answers[index] || "",
      }));

      const consultationData = {
        patientQuery: userInput,
        responses: formattedResponses,
      };

      // Log the formatted data
      console.log("Sending consultation data:", JSON.stringify(consultationData, null, 2));

      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Make API call to save the consultation data
      const response = await fetch('http://localhost:5001/api/consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(consultationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save consultation data");
      }

      const savedData = await response.json();
      console.log("Consultation saved successfully:", savedData);
      
      // Show success message and update state
      setIsAnswersSubmitted(true);
      alert("Consultation saved successfully!");
      
    } catch (error) {
      console.error("Error saving consultation:", error);
      setError(error.message || "Failed to save consultation. Please try again.");
      alert(error.message || "Failed to save consultation");
    } finally {
      setIsLoading(false);
    }
  };

  const startOver = () => {
    setIsSubmitted(false);
    setUserInput("");
    setAiQuestions([]);
    setAnswers({});
    setIsAnswersSubmitted(false);
    setError("");
    setIsLoading(false);
  };

  // Rest of your JSX remains the same
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Consultation Chat</h1>

      {error && (
        <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      {!isSubmitted ? (
        <div className="space-y-4">
          <p className="text-gray-700">
            Please describe the problem you are facing:
          </p>
          <textarea
            value={userInput}
            onChange={handleInputChange}
            rows="4"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your description here..."
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Submit"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="font-medium text-gray-700">
            Here are some questions based on your description:
          </p>
          {aiQuestions.length > 0 ? (
            <div className="space-y-4">
              {aiQuestions.map((question, index) => (
                <div key={index} className="space-y-2">
                  <p className="text-gray-700">{question}</p>
                  <textarea
                    value={answers[index] || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    rows="2"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your answer here..."
                    disabled={isAnswersSubmitted || isLoading}
                  />
                </div>
              ))}

              {!isAnswersSubmitted ? (
                <div className="flex space-x-4">
                  <button
                    onClick={handleAnswersSubmit}
                    className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Submit Answers"}
                  </button>
                  <button
                    onClick={startOver}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    Start Over
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-green-600 font-medium">
                    Thank you for your responses! Your consultation has been saved.
                  </p>
                  <button
                    onClick={startOver}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Start New Consultation
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2">Loading questions...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsultationPage;