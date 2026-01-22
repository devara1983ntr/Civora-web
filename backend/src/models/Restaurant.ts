import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  image: string;
  logo: string;
  description: string;
  address: string;
  location: {
    coordinates: [number, number];
  };
  phone: string;
  email: string;
  minimumOrder: number;
  tax: number;
  deliveryTime: number;
  reviewData: {
    total: number;
    ratings: number;
  };
  categories: mongoose.Types.ObjectId[];
  isActive: boolean;
  openingTimes: IOpeningTime[];
  deliveryCharges: number;
}

export interface IOpeningTime {
  day: string;
  times: ITimeSlot[];
}

export interface ITimeSlot {
  startTime: string;
  endTime: string;
}

const TimeSlotSchema = new Schema({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true }
});

const OpeningTimeSchema = new Schema({
  day: { type: String, required: true },
  times: [TimeSlotSchema]
});

const RestaurantSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  logo: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    coordinates: { type: [Number], required: true }
  },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  minimumOrder: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  deliveryTime: { type: Number, default: 30 },
  reviewData: {
    total: { type: Number, default: 0 },
    ratings: { type: Number, default: 0 }
  },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  isActive: { type: Boolean, default: true },
  openingTimes: [OpeningTimeSchema],
  deliveryCharges: { type: Number, default: 40 }
}, {
  timestamps: true
});

export default mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);