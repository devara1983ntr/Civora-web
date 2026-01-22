import mongoose, { Document, Schema } from 'mongoose';

export interface ICity extends Document {
  name: string;
  latitude: number;
  longitude: number;
  country: mongoose.Types.ObjectId;
  isActive: boolean;
}

const CitySchema = new Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  country: { type: Schema.Types.ObjectId, ref: 'Country', required: true },
  isActive: { type: Boolean, default: true }
});

export default mongoose.model<ICity>('City', CitySchema);