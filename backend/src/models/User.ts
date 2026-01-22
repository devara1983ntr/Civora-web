import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  addresses: IAddress[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddress {
  label: string;
  deliveryAddress: string;
  location: {
    coordinates: [number, number];
  };
  details?: string;
}

const AddressSchema = new Schema({
  label: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  location: {
    coordinates: { type: [Number], required: true }
  },
  details: { type: String }
});

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  addresses: [AddressSchema],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);