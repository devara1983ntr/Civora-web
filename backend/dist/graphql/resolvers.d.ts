import { PubSub } from 'graphql-subscriptions';
export declare const pubsub: PubSub;
export declare const resolvers: {
    Query: {
        configuration: () => Promise<(import("mongoose").Document<unknown, {}, import("../models/Configuration").IConfiguration, {}, {}> & import("../models/Configuration").IConfiguration & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        }) | {
            _id: string;
            currency: string;
            currencySymbol: string;
            deliveryRate: number;
            twilioEnabled: false;
            webClientID: string;
            googleApiKey: string;
            webAmplitudeApiKey: string;
            googleMapLibraries: string;
            googleColor: string;
            webSentryUrl: string;
            publishableKey: string;
            clientId: string;
            skipEmailVerification: true;
            skipMobileVerification: true;
            costType: string;
            firebaseKey: string;
            authDomain: string;
            projectId: string;
            storageBucket: string;
            msgSenderId: string;
            appId: string;
        }>;
        getCountries: () => Promise<(import("mongoose").Document<unknown, {}, import("../models/Country").ICountry, {}, {}> & import("../models/Country").ICountry & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[]>;
        getCitiesByCountry: (_: any, { id }: {
            id: string;
        }) => Promise<{
            id: import("mongoose").Types.ObjectId;
            name: string;
            cities: (import("mongoose").Document<unknown, {}, import("../models/City").ICity, {}, {}> & import("../models/City").ICity & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            })[];
        }>;
        getRestaurants: (_: any, { latitude, longitude, offset, limit }: {
            latitude: number;
            longitude: number;
            offset: number;
            limit: number;
        }) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Restaurant").IRestaurant, {}, {}> & import("../models/Restaurant").IRestaurant & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[]>;
        getRestaurant: (_: any, { id }: {
            id: string;
        }) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Restaurant").IRestaurant, {}, {}> & import("../models/Restaurant").IRestaurant & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        }) | null>;
        getFoods: (_: any, { restaurant, category, offset, limit }: {
            restaurant: string;
            category?: string;
            offset: number;
            limit: number;
        }) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Food").IFood, {}, {}> & import("../models/Food").IFood & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[]>;
        getCategories: () => Promise<(import("mongoose").Document<unknown, {}, import("../models/Category").ICategory, {}, {}> & import("../models/Category").ICategory & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[]>;
        getOrders: (_: any, { user, offset, limit }: {
            user?: string;
            offset: number;
            limit: number;
        }, context: any) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Order").IOrder, {}, {}> & import("../models/Order").IOrder & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[]>;
        getOrder: (_: any, { id }: {
            id: string;
        }) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Order").IOrder, {}, {}> & import("../models/Order").IOrder & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        }) | null>;
        getProfile: (_: any, __: any, context: any) => Promise<(import("mongoose").Document<unknown, {}, import("../models/User").IUser, {}, {}> & import("../models/User").IUser & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        }) | null>;
        getRiders: () => Promise<(import("mongoose").Document<unknown, {}, import("../models/Rider").IRider, {}, {}> & import("../models/Rider").IRider & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[]>;
        getZones: () => Promise<(import("mongoose").Document<unknown, {}, import("../models/Zone").IZone, {}, {}> & import("../models/Zone").IZone & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[]>;
        getCoupons: () => Promise<(import("mongoose").Document<unknown, {}, import("../models/Coupon").ICoupon, {}, {}> & import("../models/Coupon").ICoupon & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[]>;
        getBanners: () => Promise<(import("mongoose").Document<unknown, {}, import("../models/Banner").IBanner, {}, {}> & import("../models/Banner").IBanner & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[]>;
        getReviews: (_: any, { restaurant, offset, limit }: {
            restaurant: string;
            offset: number;
            limit: number;
        }) => Promise<(import("mongoose").Document<unknown, {}, import("../models/Review").IReview, {}, {}> & import("../models/Review").IReview & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[]>;
    };
    Mutation: {
        register: (_: any, { user }: {
            user: any;
        }) => Promise<{
            token: string;
            user: import("mongoose").Document<unknown, {}, import("../models/User").IUser, {}, {}> & import("../models/User").IUser & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            };
        }>;
        login: (_: any, { user }: {
            user: any;
        }) => Promise<{
            token: string;
            user: import("mongoose").Document<unknown, {}, import("../models/User").IUser, {}, {}> & import("../models/User").IUser & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            };
        }>;
        updateProfile: (_: any, { name, phone }: {
            name?: string;
            phone?: string;
        }, context: any) => Promise<(import("mongoose").Document<unknown, {}, import("../models/User").IUser, {}, {}> & import("../models/User").IUser & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        }) | null>;
        addAddress: (_: any, { address }: {
            address: any;
        }, context: any) => Promise<import("../models/User").IAddress>;
        placeOrder: (_: any, { order }: {
            order: any;
        }, context: any) => Promise<Omit<import("mongoose").Document<unknown, {}, import("../models/Order").IOrder, {}, {}> & import("../models/Order").IOrder & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        }, never>>;
        updateOrderStatus: (_: any, { orderId, status }: {
            orderId: string;
            status: string;
        }) => Promise<import("mongoose").Document<unknown, {}, import("../models/Order").IOrder, {}, {}> & import("../models/Order").IOrder & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        }>;
        addReview: (_: any, { review }: {
            review: any;
        }, context: any) => Promise<import("mongoose").Document<unknown, {}, import("../models/Review").IReview, {}, {}> & import("../models/Review").IReview & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        }>;
    };
    Subscription: {
        orderStatusUpdated: {
            subscribe: (_: any, { orderId }: {
                orderId: string;
            }) => AsyncIterator<unknown, any, any>;
        };
        riderLocationUpdated: {
            subscribe: (_: any, { riderId }: {
                riderId: string;
            }) => AsyncIterator<unknown, any, any>;
        };
    };
};
//# sourceMappingURL=resolvers.d.ts.map