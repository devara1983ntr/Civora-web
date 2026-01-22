import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IFood, {}, {}, {}, mongoose.Document<unknown, {}, IFood, {}, {}> & IFood & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Food.d.ts.map