import mongoose, { Document } from 'mongoose';
export interface ICoupon extends Document {
    title: string;
    discount: number;
    discountType: string;
    minimumOrder: number;
    enabled: boolean;
    expiryDate: Date;
}
declare const _default: mongoose.Model<ICoupon, {}, {}, {}, mongoose.Document<unknown, {}, ICoupon, {}, {}> & ICoupon & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Coupon.d.ts.map