const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Hospital = require('./models/Hospital');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Hospital.deleteMany({});

    // Create Admin
    const admin = await User.create({
      name: 'Admin User', email: 'admin@mediai.com', password: 'admin123', role: 'admin',
      phone: '9876543210', gender: 'male', isVerified: true
    });

    // Create Doctors
    const doctors = await User.insertMany([
      { name: 'Dr. Priya Sharma', email: 'priya@mediai.com', password: '$2a$12$LQv3c1yqBo9SkvXS7QTJp.FzJ6aGCQzPG/LyoB0jEEgaHaWj2JQGW', role: 'doctor', specialization: 'Cardiologist', experience: 12, consultationFee: 800, qualifications: ['MBBS', 'MD Cardiology'], phone: '9876543211', gender: 'female', isVerified: true, rating: 4.8, totalReviews: 156, availableSlots: [{ day: 'Monday', startTime: '09:00', endTime: '17:00' }, { day: 'Wednesday', startTime: '09:00', endTime: '17:00' }, { day: 'Friday', startTime: '09:00', endTime: '14:00' }] },
      { name: 'Dr. Rajesh Kumar', email: 'rajesh@mediai.com', password: '$2a$12$LQv3c1yqBo9SkvXS7QTJp.FzJ6aGCQzPG/LyoB0jEEgaHaWj2JQGW', role: 'doctor', specialization: 'Neurologist', experience: 15, consultationFee: 1000, qualifications: ['MBBS', 'DM Neurology'], phone: '9876543212', gender: 'male', isVerified: true, rating: 4.9, totalReviews: 203, availableSlots: [{ day: 'Tuesday', startTime: '10:00', endTime: '18:00' }, { day: 'Thursday', startTime: '10:00', endTime: '18:00' }] },
      { name: 'Dr. Anita Desai', email: 'anita@mediai.com', password: '$2a$12$LQv3c1yqBo9SkvXS7QTJp.FzJ6aGCQzPG/LyoB0jEEgaHaWj2JQGW', role: 'doctor', specialization: 'Dermatologist', experience: 8, consultationFee: 600, qualifications: ['MBBS', 'MD Dermatology'], phone: '9876543213', gender: 'female', isVerified: true, rating: 4.6, totalReviews: 98, availableSlots: [{ day: 'Monday', startTime: '11:00', endTime: '19:00' }, { day: 'Wednesday', startTime: '11:00', endTime: '19:00' }, { day: 'Saturday', startTime: '09:00', endTime: '13:00' }] },
      { name: 'Dr. Vikram Patel', email: 'vikram@mediai.com', password: '$2a$12$LQv3c1yqBo9SkvXS7QTJp.FzJ6aGCQzPG/LyoB0jEEgaHaWj2JQGW', role: 'doctor', specialization: 'General Physician', experience: 10, consultationFee: 500, qualifications: ['MBBS', 'MD'], phone: '9876543214', gender: 'male', isVerified: true, rating: 4.7, totalReviews: 310, availableSlots: [{ day: 'Monday', startTime: '08:00', endTime: '16:00' }, { day: 'Tuesday', startTime: '08:00', endTime: '16:00' }, { day: 'Wednesday', startTime: '08:00', endTime: '16:00' }, { day: 'Thursday', startTime: '08:00', endTime: '16:00' }, { day: 'Friday', startTime: '08:00', endTime: '16:00' }] },
      { name: 'Dr. Sneha Reddy', email: 'sneha@mediai.com', password: '$2a$12$LQv3c1yqBo9SkvXS7QTJp.FzJ6aGCQzPG/LyoB0jEEgaHaWj2JQGW', role: 'doctor', specialization: 'Pediatrician', experience: 9, consultationFee: 700, qualifications: ['MBBS', 'MD Pediatrics'], phone: '9876543215', gender: 'female', isVerified: true, rating: 4.8, totalReviews: 175 }
    ]);

    // Create Patient
    await User.create({
      name: 'Rahul Singh', email: 'patient@mediai.com', password: 'patient123', role: 'patient',
      phone: '9876543220', gender: 'male', bloodGroup: 'O+', weight: 72, height: 175,
      allergies: ['Penicillin', 'Peanuts'], dateOfBirth: new Date('1998-05-15'),
      emergencyContacts: [{ name: 'Amit Singh', phone: '9876543221', relation: 'Brother' }],
      healthScore: 78, address: { city: 'Delhi', state: 'Delhi', country: 'India' }
    });

    // Create Hospitals
    await Hospital.insertMany([
      { name: 'Apollo Hospital', address: { street: 'Sarita Vihar', city: 'Delhi', state: 'Delhi', zipCode: '110076', country: 'India' }, location: { type: 'Point', coordinates: [77.2855, 28.5312] }, phone: '011-26925858', departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'Emergency'], facilities: ['ICU', 'OT', 'Pharmacy', 'Lab', 'Ambulance', 'Blood Bank'], rating: 4.5, totalReviews: 1250, isEmergencyAvailable: true, isOpen24Hours: true, bedCapacity: 710, availableBeds: 45, ambulanceAvailable: true, description: 'Multi-specialty hospital with world-class healthcare facilities', specialties: ['Heart Surgery', 'Brain Surgery', 'Joint Replacement'], doctors: [doctors[0]._id, doctors[1]._id], isVerified: true },
      { name: 'AIIMS Hospital', address: { street: 'Ansari Nagar', city: 'Delhi', state: 'Delhi', zipCode: '110029', country: 'India' }, location: { type: 'Point', coordinates: [77.2100, 28.5672] }, phone: '011-26588500', departments: ['All Departments'], facilities: ['ICU', 'OT', 'Pharmacy', 'Lab', 'Ambulance', 'Blood Bank', 'Research Center'], rating: 4.8, totalReviews: 5200, isEmergencyAvailable: true, isOpen24Hours: true, bedCapacity: 2500, availableBeds: 120, ambulanceAvailable: true, description: 'Premier government medical institute of India', specialties: ['Research', 'Trauma Care', 'Oncology'], doctors: [doctors[3]._id], isVerified: true },
      { name: 'Fortis Hospital', address: { street: 'Shalimar Bagh', city: 'Delhi', state: 'Delhi', zipCode: '110088', country: 'India' }, location: { type: 'Point', coordinates: [77.1855, 28.7186] }, phone: '011-45300000', departments: ['Cardiology', 'Oncology', 'Nephrology', 'Gastroenterology'], facilities: ['ICU', 'OT', 'Pharmacy', 'Lab', 'Ambulance'], rating: 4.3, totalReviews: 890, isEmergencyAvailable: true, isOpen24Hours: true, bedCapacity: 300, availableBeds: 28, ambulanceAvailable: true, description: 'Leading private healthcare provider', doctors: [doctors[2]._id, doctors[4]._id], isVerified: true },
      { name: 'Max Super Speciality', address: { street: 'Saket', city: 'Delhi', state: 'Delhi', zipCode: '110017', country: 'India' }, location: { type: 'Point', coordinates: [77.2167, 28.5245] }, phone: '011-26515050', departments: ['Cardiology', 'Neurology', 'Urology', 'ENT'], facilities: ['ICU', 'OT', 'Pharmacy', 'Lab'], rating: 4.4, totalReviews: 780, isEmergencyAvailable: true, isOpen24Hours: true, bedCapacity: 500, availableBeds: 35, description: 'Super speciality hospital with advanced technology', isVerified: true },
      { name: 'Medanta Hospital', address: { street: 'Sector 38', city: 'Gurugram', state: 'Haryana', zipCode: '122001', country: 'India' }, location: { type: 'Point', coordinates: [77.0440, 28.4395] }, phone: '0124-4141414', departments: ['Heart Institute', 'Neurosciences', 'Bone & Joint', 'Kidney & Urology'], facilities: ['ICU', 'OT', 'Pharmacy', 'Lab', 'Ambulance', 'Helipad'], rating: 4.7, totalReviews: 2100, isEmergencyAvailable: true, isOpen24Hours: true, bedCapacity: 1250, availableBeds: 80, ambulanceAvailable: true, description: 'The Medicity - a world-class healthcare destination', isVerified: true }
    ]);

    console.log('✅ Seed data created successfully!');
    console.log('📧 Admin: admin@mediai.com / admin123');
    console.log('📧 Patient: patient@mediai.com / patient123');
    console.log('📧 Doctor: priya@mediai.com (pre-hashed password)');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
