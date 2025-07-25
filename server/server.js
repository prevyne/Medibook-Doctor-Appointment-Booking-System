const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = ['http://localhost:5173'];

// Dynamically add the production frontend URL from environment variables
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: (origin, callback) => {
    // We need to see the output of these two lines
    console.log('Incoming Origin:', origin);
    console.log('Allowed Origins:', allowedOrigins);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      callback(new Error(msg), false);
    }
  },
};

app.use(express.json());

// --- Connect to MongoDB ---
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connection established successfully"))
.catch(err => console.error("MongoDB connection error:", err));

// --- Define Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/admin', require('./routes/admin'));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});