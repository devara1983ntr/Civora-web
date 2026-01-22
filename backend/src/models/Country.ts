import mongoose, { Document, Schema } from 'mongoose';

export interface ICountry extends Document {
  name: string;
  flag: string;
  isActive: boolean;
}

const CountrySchema = new Schema({
  name: { type: String, required: true },
  flag: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

export default mongoose.model<ICountry>('Country', CountrySchema);