import mongoose, { Document } from 'mongoose';
export interface IRider extends Document {
    name: string;
    email: string;
    phone: string;
    password: string;
    location?: {
        coordinates: [number, number];
    };
    isActive: boolean;
    isAvailable: boolean;
    vehicleType: string;
    licenseNumber: string;
    currentOrders: mongoose.Types.ObjectId[];
}
declare const _default: mongoose.Model<IRider, {}, {}, {}, mongoose.Document<unknown, {}, IRider, {}, {}> & IRider & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Rider.d.ts.map