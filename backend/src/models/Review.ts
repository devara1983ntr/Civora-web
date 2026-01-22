import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  order: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  description: string;
  createdAt: Date;
}

const ReviewSchema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  description: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IReview>('Review', ReviewSchema);