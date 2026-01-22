import mongoose, { Document } from 'mongoose';
export interface IZone extends Document {
    title: string;
    description: string;
    location: {
        coordinates: [number, number];
    };
    isActive: boolean;
}
declare const _default: mongoose.Model<IZone, {}, {}, {}, mongoose.Document<unknown, {}, IZone, {}, {}> & IZone & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Zone.d.ts.map