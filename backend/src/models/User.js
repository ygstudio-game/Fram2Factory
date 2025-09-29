import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'factory'], required: true },
  location: { type: String, required: true },
  verified: { type: Boolean, default: false },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  company: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  totalContracts: { type: Number, default: 0 },
  joinedDate: { type: String, default: '' },
  certifications: { type: [String], default: [] },
  bio: { type: String, default: '' }
});

export default mongoose.model('User', userSchema);
