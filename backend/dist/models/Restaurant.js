"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const TimeSlotSchema = new mongoose_1.Schema({
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
});
const OpeningTimeSchema = new mongoose_1.Schema({
    day: { type: String, required: true },
    times: [TimeSlotSchema]
});
const RestaurantSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    logo: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    location: {
        coordinates: { type: [Number], required: true }
    },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    minimumOrder: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    deliveryTime: { type: Number, default: 30 },
    reviewData: {
        total: { type: Number, default: 0 },
        ratings: { type: Number, default: 0 }
    },
    categories: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Category' }],
    isActive: { type: Boolean, default: true },
    openingTimes: [OpeningTimeSchema],
    deliveryCharges: { type: Number, default: 40 }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Restaurant', RestaurantSchema);
//# sourceMappingURL=Restaurant.js.map