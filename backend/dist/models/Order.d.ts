import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Order.d.ts.map