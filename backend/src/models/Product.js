// backend/src/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      default: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: [true, 'Please add an image URL'],
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['bedding', 'bath', 'decor'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    sizes: [String],
    colors: [String],
    inStock: {
      type: Boolean,
      default: true,
    },
    badge: {
      type: String,
      enum: ['Best Seller', 'New', 'Eco-Friendly', 'Sale', 'Luxury', ''],
      default: '',
    },
    features: [String],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;