const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); // We store doctors in the User collection
const doctors = require('./data/doctors');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

const importData = async () => {
  try {
    await User.deleteMany({ role: 'doctor' }); // Clear old doctors

    // We need to add a dummy password for the seeder to work with our model
    const doctorsWithPassword = doctors.map(d => ({...d, password: 'password123'}));

    await User.insertMany(doctorsWithPassword);

    console.log('Data Imported!');
    process.exit();
  } catch (err) {
    console.error(`${err}`);
    process.exit(1);
  }
};

const destroyData = async () => {
    try {
      await User.deleteMany({ role: 'doctor' });
      console.log('Data Destroyed!');
      process.exit();
    } catch (err) {
      console.error(`${err}`);
      process.exit(1);
    }
  };

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}