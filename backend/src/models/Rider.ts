import mongoose, { Document, Schema } from 'mongoose';

export interface IRider extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  location?: {
    coordinates: [number, number];
  };
  isActive: boolean;
  isAvailable: boolean;
  vehicleType: string;
  licenseNumber: string;
  currentOrders: mongoose.Types.ObjectId[];
}

const RiderSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: {
    coordinates: { type: [Number] }
  },
  isActive: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  vehicleType: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  currentOrders: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
}, {
  timestamps: true
});

export default mongoose.model<IRider>('Rider', RiderSchema);