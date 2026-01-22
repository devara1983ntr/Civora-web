import mongoose, { Document } from 'mongoose';
export interface IConfiguration extends Document {
    currency: string;
    currencySymbol: string;
    deliveryRate: number;
    twilioEnabled: boolean;
    webClientID: string;
    googleApiKey: string;
    webAmplitudeApiKey: string;
    googleMapLibraries: string;
    googleColor: string;
    webSentryUrl: string;
    publishableKey: string;
    clientId: string;
    skipEmailVerification: boolean;
    skipMobileVerification: boolean;
    costType: string;
    firebaseKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    msgSenderId: string;
    appId: string;
}
declare const _default: mongoose.Model<IConfiguration, {}, {}, {}, mongoose.Document<unknown, {}, IConfiguration, {}, {}> & IConfiguration & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Configuration.d.ts.map