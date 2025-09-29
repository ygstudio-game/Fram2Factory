import mongoose from 'mongoose';

const RequirementSchema = new mongoose.Schema({
  cropType: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },    
  location: { type: String, required: true },
  factoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Requirement', RequirementSchema);
