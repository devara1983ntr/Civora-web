import mongoose, { Document, Schema } from 'mongoose';

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

const ConfigurationSchema = new Schema({
  currency: { type: String, default: 'INR' },
  currencySymbol: { type: String, default: '₹' },
  deliveryRate: { type: Number, default: 40 },
  twilioEnabled: { type: Boolean, default: false },
  webClientID: { type: String, default: '' },
  googleApiKey: { type: String, default: '' },
  webAmplitudeApiKey: { type: String, default: '' },
  googleMapLibraries: { type: String, default: '' },
  googleColor: { type: String, default: '' },
  webSentryUrl: { type: String, default: '' },
  publishableKey: { type: String, default: '' },
  clientId: { type: String, default: '' },
  skipEmailVerification: { type: Boolean, default: true },
  skipMobileVerification: { type: Boolean, default: true },
  costType: { type: String, default: 'fixed' },
  firebaseKey: { type: String, default: '' },
  authDomain: { type: String, default: '' },
  projectId: { type: String, default: '' },
  storageBucket: { type: String, default: '' },
  msgSenderId: { type: String, default: '' },
  appId: { type: String, default: '' }
}, {
  timestamps: true
});

export default mongoose.model<IConfiguration>('Configuration', ConfigurationSchema);