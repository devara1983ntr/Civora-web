import mongoose, { Document, Schema } from 'mongoose';

export interface IFood extends Document {
  title: string;
  description: string;
  image: string;
  category: mongoose.Types.ObjectId;
  variations: IVariation[];
  addons: IAddon[];
  restaurant: mongoose.Types.ObjectId;
  isActive: boolean;
}

export interface IVariation {
  title: string;
  price: number;
  discounted?: number;
  addons: mongoose.Types.ObjectId[];
}

export interface IAddon {
  title: string;
  description: string;
  quantityMinimum: number;
  quantityMaximum: number;
  options: IAddonOption[];
}

export interface IAddonOption {
  title: string;
  description: string;
  price: number;
}

const AddonOptionSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true }
});

const AddonSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  quantityMinimum: { type: Number, default: 0 },
  quantityMaximum: { type: Number, default: 10 },
  options: [AddonOptionSchema]
});

const VariationSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  discounted: { type: Number },
  addons: [{ type: Schema.Types.ObjectId, ref: 'Addon' }]
});

const FoodSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  variations: [VariationSchema],
  addons: [AddonSchema],
  restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model<IFood>('Food', FoodSchema);