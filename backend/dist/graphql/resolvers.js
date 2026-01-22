"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.pubsub = void 0;
const graphql_subscriptions_1 = require("graphql-subscriptions");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apollo_server_express_1 = require("apollo-server-express");
const User_1 = __importDefault(require("../models/User"));
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
const Order_1 = __importDefault(require("../models/Order"));
const Rider_1 = __importDefault(require("../models/Rider"));
const Country_1 = __importDefault(require("../models/Country"));
const City_1 = __importDefault(require("../models/City"));
const Category_1 = __importDefault(require("../models/Category"));
const Food_1 = __importDefault(require("../models/Food"));
const Review_1 = __importDefault(require("../models/Review"));
const Zone_1 = __importDefault(require("../models/Zone"));
const Coupon_1 = __importDefault(require("../models/Coupon"));
const Banner_1 = __importDefault(require("../models/Banner"));
const Configuration_1 = __importDefault(require("../models/Configuration"));
exports.pubsub = new graphql_subscriptions_1.PubSub();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
exports.resolvers = {
    Query: {
        configuration: async () => {
            return await Configuration_1.default.findOne() || {
                _id: 'default',
                currency: 'INR',
                currencySymbol: '₹',
                deliveryRate: 40,
                twilioEnabled: false,
                webClientID: '',
                googleApiKey: '',
                webAmplitudeApiKey: '',
                googleMapLibraries: '',
                googleColor: '',
                webSentryUrl: '',
                publishableKey: '',
                clientId: '',
                skipEmailVerification: true,
                skipMobileVerification: true,
                costType: 'fixed',
                firebaseKey: '',
                authDomain: '',
                projectId: '',
                storageBucket: '',
                msgSenderId: '',
                appId: ''
            };
        },
        getCountries: async () => {
            return await Country_1.default.find({ isActive: true });
        },
        getCitiesByCountry: async (_, { id }) => {
            const country = await Country_1.default.findById(id);
            if (!country) {
                throw new apollo_server_express_1.UserInputError('Country not found');
            }
            const cities = await City_1.default.find({ country: id, isActive: true });
            return {
                id: country._id,
                name: country.name,
                cities
            };
        },
        getRestaurants: async (_, { latitude, longitude, offset = 0, limit = 10 }) => {
            // Find restaurants within a certain radius (simplified)
            return await Restaurant_1.default.find({ isActive: true })
                .skip(offset)
                .limit(limit);
        },
        getRestaurant: async (_, { id }) => {
            return await Restaurant_1.default.findById(id);
        },
        getFoods: async (_, { restaurant, category, offset = 0, limit = 10 }) => {
            const query = { restaurant, isActive: true };
            if (category)
                query.category = category;
            return await Food_1.default.find(query)
                .populate('category')
                .populate('restaurant')
                .skip(offset)
                .limit(limit);
        },
        getCategories: async () => {
            return await Category_1.default.find({ isActive: true });
        },
        getOrders: async (_, { user, offset = 0, limit = 10 }, context) => {
            const query = {};
            if (user)
                query.user = user;
            else if (context.user)
                query.user = context.user._id;
            return await Order_1.default.find(query)
                .populate('user')
                .populate('restaurant')
                .populate('rider')
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit);
        },
        getOrder: async (_, { id }) => {
            return await Order_1.default.findById(id)
                .populate('user')
                .populate('restaurant')
                .populate('rider')
                .populate('items.food')
                .populate('items.variation')
                .populate('items.addons');
        },
        getProfile: async (_, __, context) => {
            if (!context.user)
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            return await User_1.default.findById(context.user._id).populate('addresses');
        },
        getRiders: async () => {
            return await Rider_1.default.find({ isActive: true });
        },
        getZones: async () => {
            return await Zone_1.default.find({ isActive: true });
        },
        getCoupons: async () => {
            return await Coupon_1.default.find({ enabled: true, expiryDate: { $gt: new Date() } });
        },
        getBanners: async () => {
            return await Banner_1.default.find({ isActive: true });
        },
        getReviews: async (_, { restaurant, offset = 0, limit = 10 }) => {
            return await Review_1.default.find({ 'order.restaurant': restaurant })
                .populate('order')
                .populate('user')
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit);
        }
    },
    Mutation: {
        register: async (_, { user }) => {
            const { name, email, phone, password } = user;
            // Check if user already exists
            const existingUser = await User_1.default.findOne({ $or: [{ email }, { phone }] });
            if (existingUser) {
                throw new apollo_server_express_1.UserInputError('User already exists');
            }
            // Hash password
            const hashedPassword = await bcryptjs_1.default.hash(password, 12);
            // Create user
            const newUser = new User_1.default({
                name,
                email,
                phone,
                password: hashedPassword,
                isActive: true
            });
            await newUser.save();
            // Generate token
            const token = jsonwebtoken_1.default.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });
            return {
                token,
                user: newUser
            };
        },
        login: async (_, { user }) => {
            const { email, password } = user;
            const existingUser = await User_1.default.findOne({ email });
            if (!existingUser) {
                throw new apollo_server_express_1.UserInputError('Invalid credentials');
            }
            const isValidPassword = await bcryptjs_1.default.compare(password, existingUser.password);
            if (!isValidPassword) {
                throw new apollo_server_express_1.UserInputError('Invalid credentials');
            }
            const token = jsonwebtoken_1.default.sign({ userId: existingUser._id }, JWT_SECRET, { expiresIn: '7d' });
            return {
                token,
                user: existingUser
            };
        },
        updateProfile: async (_, { name, phone }, context) => {
            if (!context.user)
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            const updateData = {};
            if (name)
                updateData.name = name;
            if (phone)
                updateData.phone = phone;
            return await User_1.default.findByIdAndUpdate(context.user._id, updateData, { new: true });
        },
        addAddress: async (_, { address }, context) => {
            if (!context.user)
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            const user = await User_1.default.findById(context.user._id);
            if (!user)
                throw new apollo_server_express_1.AuthenticationError('User not found');
            user.addresses.push(address);
            await user.save();
            return user.addresses[user.addresses.length - 1];
        },
        placeOrder: async (_, { order }, context) => {
            if (!context.user)
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            const { restaurant, items, deliveryAddress, paymentMethod, tipping } = order;
            // Calculate order amount
            let orderAmount = 0;
            for (const item of items) {
                const food = await Food_1.default.findById(item.food);
                if (!food)
                    continue;
                const variation = food.variations.find((v) => v._id.toString() === item.variation.toString());
                if (!variation)
                    continue;
                orderAmount += variation.price * item.quantity;
                // Add addon prices
                if (item.addons) {
                    for (const addon of item.addons) {
                        const addonData = food.addons.find((a) => a._id.toString() === addon._id.toString());
                        if (!addonData)
                            continue;
                        for (const optionId of addon.options) {
                            const option = addonData.options.find((o) => o._id.toString() === optionId.toString());
                            if (option) {
                                orderAmount += option.price * item.quantity;
                            }
                        }
                    }
                }
            }
            // Get restaurant for delivery charges and tax
            const restaurantData = await Restaurant_1.default.findById(restaurant);
            if (!restaurantData) {
                throw new apollo_server_express_1.UserInputError('Restaurant not found');
            }
            const deliveryCharges = restaurantData.deliveryCharges;
            const taxAmount = (orderAmount * restaurantData.tax) / 100;
            const total = orderAmount + deliveryCharges + taxAmount + (tipping || 0);
            // Create order
            const newOrder = new Order_1.default({
                orderId: `ORD-${Date.now()}`,
                user: context.user._id,
                restaurant,
                items,
                deliveryAddress,
                orderAmount,
                deliveryCharges,
                taxAmount,
                total,
                paymentMethod,
                paymentStatus: 'pending',
                orderStatus: 'pending',
                tipping: tipping || 0
            });
            await newOrder.save();
            // Publish order status update
            exports.pubsub.publish('ORDER_STATUS_UPDATED', {
                orderStatusUpdated: {
                    orderId: newOrder.orderId,
                    status: 'pending',
                    timestamp: new Date()
                }
            });
            return await newOrder.populate(['user', 'restaurant']);
        },
        updateOrderStatus: async (_, { orderId, status }) => {
            const order = await Order_1.default.findByIdAndUpdate(orderId, { orderStatus: status }, { new: true }).populate(['user', 'restaurant', 'rider']);
            if (!order) {
                throw new apollo_server_express_1.UserInputError('Order not found');
            }
            // Publish order status update
            exports.pubsub.publish('ORDER_STATUS_UPDATED', {
                orderStatusUpdated: {
                    orderId: order.orderId,
                    status,
                    timestamp: new Date()
                }
            });
            return order;
        },
        addReview: async (_, { review }, context) => {
            if (!context.user)
                throw new apollo_server_express_1.AuthenticationError('Not authenticated');
            const { orderId, rating, description } = review;
            const order = await Order_1.default.findById(orderId);
            if (!order) {
                throw new apollo_server_express_1.UserInputError('Order not found');
            }
            const newReview = new Review_1.default({
                order: orderId,
                user: context.user._id,
                rating,
                description
            });
            await newReview.save();
            // Update restaurant rating
            const restaurant = await Restaurant_1.default.findById(order.restaurant);
            // Update rating calculation logic here
            return newReview;
        }
    },
    Subscription: {
        orderStatusUpdated: {
            subscribe: (_, { orderId }) => {
                return exports.pubsub.asyncIterator(['ORDER_STATUS_UPDATED']);
            }
        },
        riderLocationUpdated: {
            subscribe: (_, { riderId }) => {
                return exports.pubsub.asyncIterator(['RIDER_LOCATION_UPDATED']);
            }
        }
    }
};
//# sourceMappingURL=resolvers.js.map