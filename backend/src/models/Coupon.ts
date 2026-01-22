import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
  title: string;
  discount: number;
  discountType: string; // 'percentage' or 'fixed'
  minimumOrder: number;
  enabled: boolean;
  expiryDate: Date;
}

const CouponSchema = new Schema({
  title: { type: String, required: true },
  discount: { type: Number, required: true },
  discountType: { type: String, required: true, enum: ['percentage', 'fixed'] },
  minimumOrder: { type: Number, default: 0 },
  enabled: { type: Boolean, default: true },
  expiryDate: { type: Date, required: true }
}, {
  timestamps: true
});

export default mongoose.model<ICoupon>('Coupon', CouponSchema);