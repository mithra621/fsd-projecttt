const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config({ path: __dirname + '/.env' });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const email = 'admin@admin.com';
    let adminUser = await User.findOne({ email });

    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      adminUser = await User.create({
        name: 'Super Admin',
        email,
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Created new Admin user:', adminUser.email);
    } else {
      adminUser.role = 'admin';
      await adminUser.save();
      console.log('Updated existing user to Admin:', adminUser.email);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
