import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IRestaurant, {}, {}, {}, mongoose.Document<unknown, {}, IRestaurant, {}, {}> & IRestaurant & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Restaurant.d.ts.map