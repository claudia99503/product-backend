const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  tags: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  favoriteCount: { type: Number, default: 0 }  // 좋아요 수 추가, 기본값은 0
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

