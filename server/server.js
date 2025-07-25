const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());


// --- Body Parser Middleware ---
app.use(express.json());


// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connection established successfully"))
  .catch(err => console.error("MongoDB connection error:", err));


// --- API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/admin', require('./routes/admin'));


// --- Server Listener ---
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});