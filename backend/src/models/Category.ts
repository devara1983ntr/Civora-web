import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  title: string;
  image: string;
  isActive: boolean;
}

const CategorySchema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

export default mongoose.model<ICategory>('Category', CategorySchema);