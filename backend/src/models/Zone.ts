import mongoose, { Document, Schema } from 'mongoose';

export interface IZone extends Document {
  title: string;
  description: string;
  location: {
    coordinates: [number, number];
  };
  isActive: boolean;
}

const ZoneSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    coordinates: { type: [Number], required: true }
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model<IZone>('Zone', ZoneSchema);