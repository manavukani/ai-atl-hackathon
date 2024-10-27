// // server.js
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// // Import routes
// const authRoutes = require('./routes/authRoutes');
// const healthDataRoutes = require('./routes/healthDataRoutes');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log("Connected to MongoDB"))
//     .catch(err => console.error("Could not connect to MongoDB:", err));

// // Use routes
// app.use('/api/auth', authRoutes);
// app.use('/api/health-data', healthDataRoutes);

// // Start the server
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

// Import routes
const authRoutes = require("./routes/authRoutes");
const healthDataRoutes = require("./routes/healthDataRoutes");
const genaiRoute = require("./routes/genaiRoutes"); // Import the new genai route
const myconsultation = require("./routes/saveConsultation.js");

const app = express();
app.use(express.json());

const cors = require('cors');

const corsOptions = {
  origin: ['https://developers.nlx.ai', 'http://localhost:5173'], // Add other origins as needed
  credentials: true
};

app.use(cors(corsOptions));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err: unknown) => console.error("Could not connect to MongoDB:", err)); // Specify type for `err`

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/health-data", healthDataRoutes);
app.use("/api/genai", genaiRoute); // Add the genai route for the AI response
app.use("/api/consultation", myconsultation);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
