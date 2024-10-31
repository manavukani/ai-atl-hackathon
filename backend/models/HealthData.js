// models/HealthData.js
const mongoose = require('mongoose');

// const labReportSchema = new mongoose.Schema({
//     date: { type: Date, required: false },
//     paramType: { type: String, required: false },
//     value: { type: String, required: false },
// });
// const consultationQASchema = new mongoose.Schema({
//     question: { type: String, required: true },
//     answer: { type: String, required: true }
// });
// const healthDataSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     username: { type: String, required: true },
//     diabetes: { type: String, enum: ['yes', 'no'], required: true },
//     diabetesType: { type: String },
//     bloodPressure: { type: String, required: true },
//     age: { type: Number, required: true },
//     labReports: [labReportSchema],
// });

// const QuestionAnswerSchema = new mongoose.Schema({
//     question: { type: String, required: true },
//     answer: { type: String, required: true },
//   });
// new data colletion from patient

const healthDataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    // consultationQA: [QuestionAnswerSchema],
    // consultationQA: { type: [String],default:[]}, // Array of question-answer pairs
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    maritalStatus: { type: String, enum: ['Single', 'Married', 'Divorced', 'Widowed', 'Other',null], required: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    emergencyContact: {
        name: { type: String, required: true },
        number: { type: String, required: true }
    },
    occupation: { type: String, required: false },
    physicalActivityLevel: { type: String, enum: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active',null], required: false ,default:null},
    dietaryPreferences: { type: String, enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Other',null], required: false ,default:null},
    alcoholConsumption: { type: String, enum: ['Yes', 'No',null], required: false,default:null },
    smokingHabits: { type: String, enum: ['Yes', 'No',null], required: false ,default:null},
    sleepPatterns: { type: Number, required: false }, // in hours
    medicalHistory: {
        chronicConditions: {type:[String],default:[]},
        previousSurgeries: {type:[String],default:[]},
        knownAllergies: {type:[String],default:[]},
        medicationsCurrentlyTaking: {type:[String],default:[]},
        familyHistory: {type:[String],default:[]}
    },
    basicHealthData: {
        height: { type: Number, required: false },
        weight: { type: Number, required: false },
        bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-',null], required: false,default:null },
        bloodPressure: {
            systolic: { type: Number, required: false },
            diastolic: { type: Number, required: false }
        },
        heartRate: { type: Number, required: false }
    },
    recentHealthSymptoms: {
        chronicPain: { type: String, enum: ['Yes', 'No',null], required: false,default:null },
        symptoms: {type:[String],default:[]},
        weightChange: { type: String, enum: ['Loss', 'Gain', 'No Change',null], required: false,default:null },
        appetiteLevel: { type: String, enum: ['Increased', 'Decreased', 'Normal',null], required: false ,default:null}
    },
    healthGoals: {
        goals: {type:[String],default:[]},
        preferredCommunicationChannel: { type: String, enum: ['Email', 'Phone', 'SMS', 'App Notification',null], required: false ,default:null}
    }
});

module.exports = mongoose.model('HealthData', healthDataSchema);

// module.exports = mongoose.model('HealthData', healthDataSchema);
