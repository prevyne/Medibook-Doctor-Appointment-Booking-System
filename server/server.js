const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Connect to MongoDB ---
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connection established successfully"))
.catch(err => console.error("MongoDB connection error:", err));
// -------------------------

// --- Define Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointments'));

// A simple test route
app.get('/', (req, res) => {
  res.send('MediBook API is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});