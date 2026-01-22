import mongoose, { Document } from 'mongoose';
export interface ICity extends Document {
    name: string;
    latitude: number;
    longitude: number;
    country: mongoose.Types.ObjectId;
    isActive: boolean;
}
declare const _default: mongoose.Model<ICity, {}, {}, {}, mongoose.Document<unknown, {}, ICity, {}, {}> & ICity & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=City.d.ts.map