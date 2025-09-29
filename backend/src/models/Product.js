import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, default: '' },
  quantity: { type: Number, default: 0 },
  unit: { type: String, default: 'tons' },
  harvestDate: { type: String, default: '' },
  expiryDate: { type: String, default: '' },
  quality: { type: String, enum: ['Premium', 'Standard', 'Basic'], default: 'Standard' },
  location: { type: String, default: '' },
  organic: { type: Boolean, default: false },
  images: { type: [String], default: [] },
  status: { type: String, enum: ['available', 'reserved', 'sold'], default: 'available' }
});

export default mongoose.model('Product', productSchema);
