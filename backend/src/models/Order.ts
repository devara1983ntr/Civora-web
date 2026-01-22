import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  user: mongoose.Types.ObjectId;
  restaurant: mongoose.Types.ObjectId;
  items: IOrderItem[];
  deliveryAddress: mongoose.Types.ObjectId;
  orderAmount: number;
  deliveryCharges: number;
  taxAmount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  orderDate: Date;
  expectedTime: Date;
  rider?: mongoose.Types.ObjectId;
  review?: mongoose.Types.ObjectId;
  tipping: number;
}

export interface IOrderItem {
  food: mongoose.Types.ObjectId;
  variation: mongoose.Types.ObjectId;
  addons: IOrderAddon[];
  quantity: number;
  specialInstructions?: string;
}

export interface IOrderAddon {
  _id: mongoose.Types.ObjectId;
  title: string;
  options: IOrderAddonOption[];
}

export interface IOrderAddonOption {
  _id: mongoose.Types.ObjectId;
  title: string;
  price: number;
}

const OrderAddonOptionSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true }
});

const OrderAddonSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  options: [OrderAddonOptionSchema]
});

const OrderItemSchema = new Schema({
  food: { type: Schema.Types.ObjectId, ref: 'Food', required: true },
  variation: { type: Schema.Types.ObjectId, required: true },
  addons: [OrderAddonSchema],
  quantity: { type: Number, required: true },
  specialInstructions: { type: String }
});

const OrderSchema = new Schema({
  orderId: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [OrderItemSchema],
  deliveryAddress: { type: Schema.Types.ObjectId, required: true },
  orderAmount: { type: Number, required: true },
  deliveryCharges: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: 'pending' },
  orderStatus: { type: String, default: 'pending' },
  orderDate: { type: Date, default: Date.now },
  expectedTime: { type: Date, required: true },
  rider: { type: Schema.Types.ObjectId, ref: 'Rider' },
  review: { type: Schema.Types.ObjectId, ref: 'Review' },
  tipping: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default mongoose.model<IOrder>('Order', OrderSchema);