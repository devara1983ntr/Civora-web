import { PubSub } from 'graphql-subscriptions';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import User from '../models/User';
import Restaurant from '../models/Restaurant';
import Order from '../models/Order';
import Rider from '../models/Rider';
import Country from '../models/Country';
import City from '../models/City';
import Category from '../models/Category';
import Food from '../models/Food';
import Review from '../models/Review';
import Zone from '../models/Zone';
import Coupon from '../models/Coupon';
import Banner from '../models/Banner';
import Configuration from '../models/Configuration';

export const pubsub = new PubSub();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const resolvers = {
  Query: {
    configuration: async () => {
      return await Configuration.findOne() || {
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
      return await Country.find({ isActive: true });
    },

    getCitiesByCountry: async (_: any, { id }: { id: string }) => {
      const country = await Country.findById(id);
      if (!country) {
        throw new UserInputError('Country not found');
      }
      const cities = await City.find({ country: id, isActive: true });

      return {
        id: country._id,
        name: country.name,
        cities
      };
    },

    getRestaurants: async (_: any, { latitude, longitude, offset = 0, limit = 10 }: {
      latitude: number;
      longitude: number;
      offset: number;
      limit: number;
    }) => {
      // Find restaurants within a certain radius (simplified)
      return await Restaurant.find({ isActive: true })
        .skip(offset)
        .limit(limit);
    },

    getRestaurant: async (_: any, { id }: { id: string }) => {
      return await Restaurant.findById(id);
    },

    getFoods: async (_: any, { restaurant, category, offset = 0, limit = 10 }: {
      restaurant: string;
      category?: string;
      offset: number;
      limit: number;
    }) => {
      const query: any = { restaurant, isActive: true };
      if (category) query.category = category;

      return await Food.find(query)
        .populate('category')
        .populate('restaurant')
        .skip(offset)
        .limit(limit);
    },

    getCategories: async () => {
      return await Category.find({ isActive: true });
    },

    getOrders: async (_: any, { user, offset = 0, limit = 10 }: {
      user?: string;
      offset: number;
      limit: number;
    }, context: any) => {
      const query: any = {};
      if (user) query.user = user;
      else if (context.user) query.user = context.user._id;

      return await Order.find(query)
        .populate('user')
        .populate('restaurant')
        .populate('rider')
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
    },

    getOrder: async (_: any, { id }: { id: string }) => {
      return await Order.findById(id)
        .populate('user')
        .populate('restaurant')
        .populate('rider')
        .populate('items.food')
        .populate('items.variation')
        .populate('items.addons');
    },

    getProfile: async (_: any, __: any, context: any) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');
      return await User.findById(context.user._id).populate('addresses');
    },

    getRiders: async () => {
      return await Rider.find({ isActive: true });
    },

    getZones: async () => {
      return await Zone.find({ isActive: true });
    },

    getCoupons: async () => {
      return await Coupon.find({ enabled: true, expiryDate: { $gt: new Date() } });
    },

    getBanners: async () => {
      return await Banner.find({ isActive: true });
    },

    getReviews: async (_: any, { restaurant, offset = 0, limit = 10 }: {
      restaurant: string;
      offset: number;
      limit: number;
    }) => {
      return await Review.find({ 'order.restaurant': restaurant })
        .populate('order')
        .populate('user')
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
    }
  },

  Mutation: {
    register: async (_: any, { user }: { user: any }) => {
      const { name, email, phone, password } = user;

      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        throw new UserInputError('User already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const newUser = new User({
        name,
        email,
        phone,
        password: hashedPassword,
        isActive: true
      });

      await newUser.save();

      // Generate token
      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

      return {
        token,
        user: newUser
      };
    },

    login: async (_: any, { user }: { user: any }) => {
      const { email, password } = user;

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        throw new UserInputError('Invalid credentials');
      }

      const isValidPassword = await bcrypt.compare(password, existingUser.password);
      if (!isValidPassword) {
        throw new UserInputError('Invalid credentials');
      }

      const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET, { expiresIn: '7d' });

      return {
        token,
        user: existingUser
      };
    },

    updateProfile: async (_: any, { name, phone }: { name?: string; phone?: string }, context: any) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');

      const updateData: any = {};
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;

      return await User.findByIdAndUpdate(context.user._id, updateData, { new: true });
    },

    addAddress: async (_: any, { address }: { address: any }, context: any) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');

      const user = await User.findById(context.user._id);
      if (!user) throw new AuthenticationError('User not found');

      user.addresses.push(address);
      await user.save();

      return user.addresses[user.addresses.length - 1];
    },

    placeOrder: async (_: any, { order }: { order: any }, context: any) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');

      const { restaurant, items, deliveryAddress, paymentMethod, tipping } = order;

      // Calculate order amount
      let orderAmount = 0;
      for (const item of items) {
        const food = await Food.findById(item.food);
        if (!food) continue;

        const variation = food.variations.find((v: any) => v._id.toString() === item.variation.toString());
        if (!variation) continue;

        orderAmount += variation.price * item.quantity;

        // Add addon prices
        if (item.addons) {
          for (const addon of item.addons) {
            const addonData = food.addons.find((a: any) => a._id.toString() === addon._id.toString());
            if (!addonData) continue;

            for (const optionId of addon.options) {
              const option = addonData.options.find((o: any) => o._id.toString() === optionId.toString());
              if (option) {
                orderAmount += option.price * item.quantity;
              }
            }
          }
        }
      }

      // Get restaurant for delivery charges and tax
      const restaurantData = await Restaurant.findById(restaurant);
      if (!restaurantData) {
        throw new UserInputError('Restaurant not found');
      }

      const deliveryCharges = restaurantData.deliveryCharges;
      const taxAmount = (orderAmount * restaurantData.tax) / 100;
      const total = orderAmount + deliveryCharges + taxAmount + (tipping || 0);

      // Create order
      const newOrder = new Order({
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
      pubsub.publish('ORDER_STATUS_UPDATED', {
        orderStatusUpdated: {
          orderId: newOrder.orderId,
          status: 'pending',
          timestamp: new Date()
        }
      });

      return await newOrder.populate(['user', 'restaurant']);
    },

    updateOrderStatus: async (_: any, { orderId, status }: { orderId: string; status: string }) => {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus: status },
        { new: true }
      ).populate(['user', 'restaurant', 'rider']);

      if (!order) {
        throw new UserInputError('Order not found');
      }

      // Publish order status update
      pubsub.publish('ORDER_STATUS_UPDATED', {
        orderStatusUpdated: {
          orderId: order.orderId,
          status,
          timestamp: new Date()
        }
      });

      return order;
    },

    addReview: async (_: any, { review }: { review: any }, context: any) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');

      const { orderId, rating, description } = review;

      const order = await Order.findById(orderId);
      if (!order) {
        throw new UserInputError('Order not found');
      }

      const newReview = new Review({
        order: orderId,
        user: context.user._id,
        rating,
        description
      });

      await newReview.save();

      // Update restaurant rating
      const restaurant = await Restaurant.findById(order.restaurant);
      // Update rating calculation logic here

      return newReview;
    }
  },

  Subscription: {
    orderStatusUpdated: {
      subscribe: (_: any, { orderId }: { orderId: string }) => {
        return pubsub.asyncIterator(['ORDER_STATUS_UPDATED']);
      }
    },

    riderLocationUpdated: {
      subscribe: (_: any, { riderId }: { riderId: string }) => {
        return pubsub.asyncIterator(['RIDER_LOCATION_UPDATED']);
      }
    }
  }
};