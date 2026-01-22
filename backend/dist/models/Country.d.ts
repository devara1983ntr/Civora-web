import mongoose, { Document } from 'mongoose';
export interface ICountry extends Document {
    name: string;
    flag: string;
    isActive: boolean;
}
declare const _default: mongoose.Model<ICountry, {}, {}, {}, mongoose.Document<unknown, {}, ICountry, {}, {}> & ICountry & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Country.d.ts.map