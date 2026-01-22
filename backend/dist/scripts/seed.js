"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Country_1 = __importDefault(require("../models/Country"));
const City_1 = __importDefault(require("../models/City"));
const Category_1 = __importDefault(require("../models/Category"));
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
const Food_1 = __importDefault(require("../models/Food"));
const Configuration_1 = __importDefault(require("../models/Configuration"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/civora');
        console.log('MongoDB Connected for seeding');
    }
    catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};
const seedData = async () => {
    try {
        // Clear existing data
        await Country_1.default.deleteMany({});
        await City_1.default.deleteMany({});
        await Category_1.default.deleteMany({});
        await Restaurant_1.default.deleteMany({});
        await Food_1.default.deleteMany({});
        await Configuration_1.default.deleteMany({});
        // Create India
        const india = new Country_1.default({
            name: 'India',
            flag: '🇮🇳'
        });
        await india.save();
        // Create Indian cities
        const cities = [
            { name: 'Mumbai', latitude: 19.0760, longitude: 72.8777 },
            { name: 'Delhi', latitude: 28.7041, longitude: 77.1025 },
            { name: 'Bangalore', latitude: 12.9716, longitude: 77.5946 },
            { name: 'Chennai', latitude: 13.0827, longitude: 80.2707 },
            { name: 'Kolkata', latitude: 22.5726, longitude: 88.3639 },
            { name: 'Hyderabad', latitude: 17.3850, longitude: 78.4867 },
            { name: 'Pune', latitude: 18.5204, longitude: 73.8567 },
            { name: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714 }
        ];
        for (const cityData of cities) {
            const city = new City_1.default({
                name: cityData.name,
                latitude: cityData.latitude,
                longitude: cityData.longitude,
                country: india._id
            });
            await city.save();
        }
        // Create categories
        const categories = [
            { title: 'Pizza', image: '/images/categories/pizza.jpg' },
            { title: 'Burger', image: '/images/categories/burger.jpg' },
            { title: 'Indian', image: '/images/categories/indian.jpg' },
            { title: 'Chinese', image: '/images/categories/chinese.jpg' },
            { title: 'Italian', image: '/images/categories/italian.jpg' },
            { title: 'Desserts', image: '/images/categories/desserts.jpg' },
            { title: 'Beverages', image: '/images/categories/beverages.jpg' }
        ];
        const categoryDocs = [];
        for (const cat of categories) {
            const category = new Category_1.default(cat);
            await category.save();
            categoryDocs.push(category);
        }
        // Create sample restaurants
        const restaurants = [
            {
                name: 'Pizza Palace',
                image: '/images/restaurants/pizza-palace.jpg',
                logo: '/images/restaurants/pizza-palace-logo.jpg',
                description: 'Authentic Italian pizzas made with fresh ingredients',
                address: '123 MG Road, Bangalore',
                location: { coordinates: [77.5946, 12.9716] },
                phone: '+91-9876543210',
                email: 'info@pizzapalace.com',
                minimumOrder: 200,
                tax: 5,
                deliveryTime: 30,
                categories: [categoryDocs[0]._id, categoryDocs[4]._id],
                deliveryCharges: 40,
                openingTimes: [
                    {
                        day: 'Monday',
                        times: [{ startTime: '11:00', endTime: '23:00' }]
                    },
                    {
                        day: 'Tuesday',
                        times: [{ startTime: '11:00', endTime: '23:00' }]
                    },
                    {
                        day: 'Wednesday',
                        times: [{ startTime: '11:00', endTime: '23:00' }]
                    },
                    {
                        day: 'Thursday',
                        times: [{ startTime: '11:00', endTime: '23:00' }]
                    },
                    {
                        day: 'Friday',
                        times: [{ startTime: '11:00', endTime: '23:00' }]
                    },
                    {
                        day: 'Saturday',
                        times: [{ startTime: '11:00', endTime: '23:00' }]
                    },
                    {
                        day: 'Sunday',
                        times: [{ startTime: '11:00', endTime: '23:00' }]
                    }
                ]
            },
            {
                name: 'Burger Junction',
                image: '/images/restaurants/burger-junction.jpg',
                logo: '/images/restaurants/burger-junction-logo.jpg',
                description: 'Juicy burgers with fresh patties and crispy fries',
                address: '456 Brigade Road, Bangalore',
                location: { coordinates: [77.5946, 12.9716] },
                phone: '+91-9876543211',
                email: 'info@burgerjunction.com',
                minimumOrder: 150,
                tax: 5,
                deliveryTime: 25,
                categories: [categoryDocs[1]._id],
                deliveryCharges: 35,
                openingTimes: [
                    {
                        day: 'Monday',
                        times: [{ startTime: '12:00', endTime: '22:00' }]
                    },
                    {
                        day: 'Tuesday',
                        times: [{ startTime: '12:00', endTime: '22:00' }]
                    },
                    {
                        day: 'Wednesday',
                        times: [{ startTime: '12:00', endTime: '22:00' }]
                    },
                    {
                        day: 'Thursday',
                        times: [{ startTime: '12:00', endTime: '22:00' }]
                    },
                    {
                        day: 'Friday',
                        times: [{ startTime: '12:00', endTime: '22:00' }]
                    },
                    {
                        day: 'Saturday',
                        times: [{ startTime: '12:00', endTime: '22:00' }]
                    },
                    {
                        day: 'Sunday',
                        times: [{ startTime: '12:00', endTime: '22:00' }]
                    }
                ]
            }
        ];
        const restaurantDocs = [];
        for (const rest of restaurants) {
            const restaurant = new Restaurant_1.default(rest);
            await restaurant.save();
            restaurantDocs.push(restaurant);
        }
        // Create sample foods
        const foods = [
            {
                title: 'Margherita Pizza',
                description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
                image: '/images/foods/margherita.jpg',
                category: categoryDocs[0]._id,
                restaurant: restaurantDocs[0]._id,
                variations: [
                    {
                        title: 'Regular',
                        price: 250,
                        discounted: 220
                    },
                    {
                        title: 'Medium',
                        price: 350,
                        discounted: 320
                    },
                    {
                        title: 'Large',
                        price: 450,
                        discounted: 400
                    }
                ],
                addons: [
                    {
                        title: 'Extra Cheese',
                        description: 'Add extra mozzarella cheese',
                        quantityMinimum: 0,
                        quantityMaximum: 1,
                        options: [
                            {
                                title: 'Extra Cheese',
                                description: '50g extra cheese',
                                price: 50
                            }
                        ]
                    }
                ]
            },
            {
                title: 'Classic Burger',
                description: 'Juicy beef patty with lettuce, tomato, and special sauce',
                image: '/images/foods/classic-burger.jpg',
                category: categoryDocs[1]._id,
                restaurant: restaurantDocs[1]._id,
                variations: [
                    {
                        title: 'Single',
                        price: 180,
                        discounted: 160
                    },
                    {
                        title: 'Double',
                        price: 280,
                        discounted: 250
                    }
                ],
                addons: [
                    {
                        title: 'Add Ons',
                        description: 'Extra items for your burger',
                        quantityMinimum: 0,
                        quantityMaximum: 3,
                        options: [
                            {
                                title: 'Extra Patty',
                                description: 'Add an extra beef patty',
                                price: 80
                            },
                            {
                                title: 'Cheese Slice',
                                description: 'Add cheese slice',
                                price: 30
                            },
                            {
                                title: 'Bacon',
                                description: 'Add crispy bacon',
                                price: 60
                            }
                        ]
                    }
                ]
            }
        ];
        for (const foodData of foods) {
            const food = new Food_1.default(foodData);
            await food.save();
        }
        // Create configuration
        const config = new Configuration_1.default({
            currency: 'INR',
            currencySymbol: '₹',
            deliveryRate: 40,
            twilioEnabled: false,
            skipEmailVerification: true,
            skipMobileVerification: true,
            costType: 'fixed'
        });
        await config.save();
        console.log('Database seeded successfully!');
        console.log(`Created ${cities.length} cities in India`);
        console.log(`Created ${categoryDocs.length} categories`);
        console.log(`Created ${restaurantDocs.length} restaurants`);
        console.log(`Created ${foods.length} food items`);
    }
    catch (error) {
        console.error('Seeding error:', error);
    }
    finally {
        mongoose_1.default.connection.close();
    }
};
connectDB().then(() => {
    seedData();
});
//# sourceMappingURL=seed.js.map