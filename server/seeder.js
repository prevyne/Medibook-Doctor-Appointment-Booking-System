const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // Import bcryptjs
const User = require('./models/User');
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

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});

    // --- Create a default Admin User ---
    const adminEmail = 'admin@medibook.com';
    let adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('adminpassword', salt);

        adminUser = new User({
            name: 'Admin User',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });
        await adminUser.save();
        console.log('Admin User Created');
    }

    // --- Import sample doctors ---
    const doctorsWithHashedPasswords = await Promise.all(
        doctors.map(async (doctor) => {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            return { ...doctor, password: hashedPassword };
        })
    );
    await User.insertMany(doctorsWithHashedPasswords);
    console.log('Sample Doctors Imported!');

    console.log('Data Imported!');
    process.exit();
  } catch (err) {
    console.error(`${err}`);
    process.exit(1);
  }
};

const destroyData = async () => {
    try {
      await User.deleteMany({});
      console.log('Data Destroyed!');
      process.exit();
    } catch (err) {
      console.error(`${err}`);
      process.exit(1);
    }
  };

// Reconnect to DB before running
connectDB().then(() => {
    if (process.argv[2] === '-d') {
      destroyData();
    } else {
      importData();
    }
});