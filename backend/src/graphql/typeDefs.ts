import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  scalar Date
  scalar Upload

  type Configuration {
    _id: ID!
    currency: String!
    currencySymbol: String!
    deliveryRate: Float!
    twilioEnabled: Boolean!
    webClientID: String!
    googleApiKey: String!
    webAmplitudeApiKey: String!
    googleMapLibraries: String!
    googleColor: String!
    webSentryUrl: String!
    publishableKey: String!
    clientId: String!
    skipEmailVerification: Boolean!
    skipMobileVerification: Boolean!
    costType: String!
    firebaseKey: String!
    authDomain: String!
    projectId: String!
    storageBucket: String!
    msgSenderId: String!
    appId: String!
  }

  type Country {
    _id: ID!
    name: String!
    flag: String!
  }

  type City {
    _id: ID!
    name: String!
    latitude: Float!
    longitude: Float!
  }

  type CitiesByCountry {
    id: ID!
    name: String!
    cities: [City!]!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    phone: String!
    addresses: [Address!]!
    isActive: Boolean!
    createdAt: Date!
    updatedAt: Date!
  }

  type Address {
    _id: ID!
    label: String!
    deliveryAddress: String!
    location: Location!
    details: String
  }

  type Location {
    coordinates: [Float!]!
  }

  type Restaurant {
    _id: ID!
    name: String!
    image: String!
    logo: String!
    description: String!
    address: String!
    location: Location!
    phone: String!
    email: String!
    minimumOrder: Float!
    tax: Float!
    deliveryTime: Int!
    reviewData: ReviewData!
    categories: [Category!]!
    isActive: Boolean!
    openingTimes: [OpeningTime!]!
    deliveryCharges: Float!
  }

  type Category {
    _id: ID!
    title: String!
    image: String!
  }

  type OpeningTime {
    day: String!
    times: [TimeSlot!]!
  }

  type TimeSlot {
    startTime: String!
    endTime: String!
  }

  type ReviewData {
    total: Int!
    ratings: Float!
  }

  type Food {
    _id: ID!
    title: String!
    description: String!
    image: String!
    category: Category!
    variations: [Variation!]!
    addons: [Addon!]!
    restaurant: Restaurant!
    isActive: Boolean!
  }

  type Variation {
    _id: ID!
    title: String!
    price: Float!
    discounted: Float
    addons: [Addon!]!
  }

  type Addon {
    _id: ID!
    title: String!
    description: String!
    quantityMinimum: Int!
    quantityMaximum: Int!
    options: [AddonOption!]!
  }

  type AddonOption {
    _id: ID!
    title: String!
    description: String!
    price: Float!
  }

  type Order {
    _id: ID!
    orderId: String!
    user: User!
    restaurant: Restaurant!
    items: [OrderItem!]!
    deliveryAddress: Address!
    orderAmount: Float!
    deliveryCharges: Float!
    taxAmount: Float!
    total: Float!
    paymentMethod: String!
    paymentStatus: String!
    orderStatus: String!
    orderDate: Date!
    expectedTime: Date!
    rider: Rider
    review: Review
    tipping: Float
  }

  type OrderItem {
    _id: ID!
    food: Food!
    variation: Variation!
    addons: [OrderAddon!]!
    quantity: Int!
    specialInstructions: String
  }

  type OrderAddon {
    _id: ID!
    title: String!
    options: [OrderAddonOption!]!
  }

  type OrderAddonOption {
    _id: ID!
    title: String!
    price: Float!
  }

  type Rider {
    _id: ID!
    name: String!
    email: String!
    phone: String!
    location: Location
    isActive: Boolean!
    isAvailable: Boolean!
    vehicleType: String!
    licenseNumber: String!
    currentOrders: [Order!]!
  }

  type Review {
    _id: ID!
    order: Order!
    user: User!
    rating: Float!
    description: String!
    createdAt: Date!
  }

  type Zone {
    _id: ID!
    title: String!
    description: String!
    location: Location!
    isActive: Boolean!
  }

  type Coupon {
    _id: ID!
    title: String!
    discount: Float!
    discountType: String!
    minimumOrder: Float!
    enabled: Boolean!
    expiryDate: Date!
  }

  type Banner {
    _id: ID!
    title: String!
    description: String!
    image: String!
    isActive: Boolean!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type OrderStatusUpdate {
    orderId: String!
    status: String!
    timestamp: Date!
  }

  # Inputs
  input UserInput {
    name: String!
    email: String!
    phone: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input AddressInput {
    label: String!
    deliveryAddress: String!
    location: LocationInput!
    details: String
  }

  input LocationInput {
    coordinates: [Float!]!
  }

  input OrderInput {
    restaurant: ID!
    items: [OrderItemInput!]!
    deliveryAddress: ID!
    paymentMethod: String!
    tipping: Float
  }

  input OrderItemInput {
    food: ID!
    variation: ID!
    addons: [OrderAddonInput!]
    quantity: Int!
    specialInstructions: String
  }

  input OrderAddonInput {
    _id: ID!
    options: [ID!]!
  }

  input ReviewInput {
    orderId: ID!
    rating: Float!
    description: String!
  }

  # Queries
  type Query {
    configuration: Configuration!
    getCountries: [Country!]!
    getCitiesByCountry(id: ID!): CitiesByCountry!
    getRestaurants(latitude: Float!, longitude: Float!, offset: Int, limit: Int): [Restaurant!]!
    getRestaurant(id: ID!): Restaurant!
    getFoods(restaurant: ID!, category: ID, offset: Int, limit: Int): [Food!]!
    getCategories: [Category!]!
    getOrders(user: ID, offset: Int, limit: Int): [Order!]!
    getOrder(id: ID!): Order!
    getProfile: User!
    getRiders: [Rider!]!
    getZones: [Zone!]!
    getCoupons: [Coupon!]!
    getBanners: [Banner!]!
    getReviews(restaurant: ID!, offset: Int, limit: Int): [Review!]!
  }

  # Mutations
  type Mutation {
    register(user: UserInput!): AuthPayload!
    login(user: LoginInput!): AuthPayload!
    updateProfile(name: String, phone: String): User!
    addAddress(address: AddressInput!): Address!
    updateAddress(id: ID!, address: AddressInput!): Address!
    deleteAddress(id: ID!): Boolean!
    placeOrder(order: OrderInput!): Order!
    updateOrderStatus(orderId: ID!, status: String!): Order!
    cancelOrder(orderId: ID!): Order!
    addReview(review: ReviewInput!): Review!
    updateRiderLocation(riderId: ID!, latitude: Float!, longitude: Float!): Rider!
    assignRider(orderId: ID!, riderId: ID!): Order!
  }

  # Subscriptions
  type Subscription {
    orderStatusUpdated(orderId: ID!): OrderStatusUpdate!
    riderLocationUpdated(riderId: ID!): Rider!
  }
`;