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
const OrderAddonOptionSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true }
});
const OrderAddonSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    options: [OrderAddonOptionSchema]
});
const OrderItemSchema = new mongoose_1.Schema({
    food: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Food', required: true },
    variation: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    addons: [OrderAddonSchema],
    quantity: { type: Number, required: true },
    specialInstructions: { type: String }
});
const OrderSchema = new mongoose_1.Schema({
    orderId: { type: String, required: true, unique: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [OrderItemSchema],
    deliveryAddress: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    orderAmount: { type: Number, required: true },
    deliveryCharges: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, default: 'pending' },
    orderStatus: { type: String, default: 'pending' },
    orderDate: { type: Date, default: Date.now },
    expectedTime: { type: Date, required: true },
    rider: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Rider' },
    review: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Review' },
    tipping: { type: Number, default: 0 }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Order', OrderSchema);
//# sourceMappingURL=Order.js.map